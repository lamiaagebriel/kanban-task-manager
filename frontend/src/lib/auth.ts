import { api } from "@/api";
import { getCookie, setCookie } from "@/servers/utils";
import { User } from "@/types";
import { cache } from "react";

export type Session = {
  userId: string;
  expires: number;
  token: string;
};

export type GetAuthResponse =
  | { user: User; session: Session }
  | { user: null; session: null };

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

function encodeSession(session: Session): string {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64");
}

function decodeSession(token: string): Session | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const data = JSON.parse(decoded);
    if (
      typeof data.userId === "string" &&
      typeof data.expires === "number" &&
      typeof data.token === "string"
    )
      return data;

    return null;
  } catch {
    return null;
  }
}

export async function createSessionCookie(
  session: Pick<Session, "userId" | "token">
) {
  const sessionObj: Session = {
    expires: Date.now() + SESSION_DURATION_MS,
    ...session,
  };

  const sessionCookie = {
    name: SESSION_COOKIE_NAME,
    value: encodeSession(sessionObj),
    attributes: {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
      sameSite: "lax",
    } as const,
  };

  try {
    await setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to set session cookie", err);
    }
  }
}

export async function clearSessionCookie() {
  const sessionCookie = {
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      sameSite: "lax",
    } as const,
  };
  try {
    await setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to clear expired session cookie", err);
    }
  }
}

export async function getSessionCookie() {
  const sessionToken = await getCookie(SESSION_COOKIE_NAME);
  if (!sessionToken) return null;

  const session = decodeSession(sessionToken);
  return session;
}

export const uncachedGetAuth = async (): Promise<GetAuthResponse> => {
  const sessionToken = await getCookie(SESSION_COOKIE_NAME);
  if (!sessionToken) return { user: null, session: null };

  const session = decodeSession(sessionToken);
  if (
    !session ||
    typeof session.userId !== "string" ||
    typeof session.expires !== "number" ||
    typeof session.token !== "string" ||
    session.expires < Date.now()
  ) {
    // Session is invalid or expired
    await clearSessionCookie();

    return { user: null, session: null };
  }

  let user = null;
  try {
    const {
      data: { user: fetchedUser },
    } = await api.users.findOne({ id: Number(session?.userId) });

    user = fetchedUser;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to fetch user in getAuth:", error);
    }
    user = null;
  }

  if (!user) {
    await clearSessionCookie();
    return { user: null, session: null };
  }

  // // Optionally renew (refresh) session if within threshold (less than half-time left)
  // if (session.expires - Date.now() < SESSION_DURATION_MS / 2) {
  //   await createSessionCookie({
  //     userId: user?.id?.toString(),
  //     token: session.token,
  //   });
  // }

  return {
    user,
    session: {
      userId: user?.id?.toString(),
      expires: session.expires, // keep the original expiry, unless renewed
      token: session.token,
    },
  };
};

export const getAuth = cache(uncachedGetAuth);
