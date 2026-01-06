import { cookies as nextCookies } from "next/headers";
import { NextRequest } from "next/server";
import { cache } from "react";

export type Session = {
  userId: string;
  expires: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export const SESSION_COOKIE_NAME = "session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

interface SessionData {
  userId: string;
  expires: number;
}

function encodeSession(session: SessionData): string {
  // Simple base64 encoding; in production, sign & encrypt!
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64");
}

function decodeSession(token: string): SessionData | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const data = JSON.parse(decoded);
    if (typeof data.userId === "string" && typeof data.expires === "number") {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

// --- Create/set cookies ---
export function createSessionCookie(session: SessionData) {
  return {
    name: SESSION_COOKIE_NAME,
    value: encodeSession(session),
    attributes: {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
      sameSite: "lax",
    } as const,
  };
}

export function createBlankSessionCookie() {
  return {
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
}

/**
 * Checks if a 'session' cookie exists and is non-empty.
 * (Does not validate the session, for simplicity/edge compatibility.)
 */
export function isSignedIn(request: NextRequest): boolean {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  return !!cookie && cookie.value !== "";
}

// --- Session lookup ---
export const uncachedGetAuth = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const cookies = await nextCookies();
  const sessionToken = cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
  if (!sessionToken) return { user: null, session: null };

  const session = decodeSession(sessionToken);
  if (
    !session
    // || typeof session.userId !== "string" ||
    // typeof session.expires !== "number" ||
    // session.expires < Date.now()
  ) {
    // // Session is invalid or expired
    // const blank = createBlankSessionCookie();
    // try {
    //   cookies.set(blank.name, blank.value, blank.attributes);
    // } catch (err) {
    //   // Ignore error (can be render-on-page)
    //   if (process.env.NODE_ENV !== "production") {
    //     // Avoid log spam in prod
    //     console.log("Failed to clear expired session cookie", err);
    //   }
    // }
    return { user: null, session: null };
  }

  // --- TODO: Replace with real user-lookup by ID from DB or source ---
  // The code below is hardcoded! In production, replace with user lookup.
  const user: User | null = {
    id: "1",
    name: "Lamiaa Gebriel",
    email: "lamiaadev@gmail.com",
  };

  if (!user) {
    // const blank = createBlankSessionCookie();
    // try {
    //   cookies.set(blank.name, blank.value, blank.attributes);
    // } catch (err) {
    //   if (process.env.NODE_ENV !== "production") {
    //     console.log("Failed to clear user-not-found session cookie", err);
    //   }
    // }
    return { user: null, session: null };
  }

  // // Optionally renew (refresh) session if within threshold (less than half-time left)
  // if (session.expires - Date.now() < SESSION_DURATION_MS / 2) {
  //   const freshSession: SessionData = {
  //     userId: user.id,
  //     expires: Date.now() + SESSION_DURATION_MS,
  //   };
  //   const freshCookie = createSessionCookie(freshSession);
  //   try {
  //     cookies.set(freshCookie.name, freshCookie.value, freshCookie.attributes);
  //   } catch (err) {
  //     if (process.env.NODE_ENV !== "production") {
  //       console.log("Failed to refresh session cookie", err);
  //     }
  //   }
  // }

  return {
    user,
    session: {
      userId: user.id,
      expires: session.expires, // keep the original expiry, unless renewed
    },
  };
};

export const getAuth = cache(uncachedGetAuth);
