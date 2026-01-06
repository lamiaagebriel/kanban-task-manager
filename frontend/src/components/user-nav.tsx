"use client";

import * as React from "react";

import { useAuth } from "./auth-provider";

import { Button } from "./ui/button";

import { useLocale } from "@/components/locale-provider";
import { Paths } from "@/lib/const";
import { handleServerAction } from "@/lib/utils";
import { logout } from "@/servers/auth";
import { redirect } from "next/navigation";

export function UserNav() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const { cmn } = useLocale();

  return (
    <>
      {user && (
        <div className="mt-4">
          <p>
            <strong>User:</strong> {user.name || user.email || "Unknown"}
          </p>
          {user.email && (
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          )}
        </div>
      )}
      {!user && (
        <div className="text-muted-foreground mt-4">
          <p>No user detected.</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        onClick={async () => {
          await handleServerAction(logout, { setLoading })({});

          redirect(Paths.Login);
        }}>
        {cmn["Logout"]}
      </Button>
    </>
  );
}
