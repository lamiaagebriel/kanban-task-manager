"use client";

import { Session, User } from "@/lib/auth";
import * as React from "react";

type AuthContextProps =
  | { user: User; session: Session }
  | { user: null; session: null };
type AuthProviderProps = React.PropsWithChildren<{
  value: AuthContextProps;
}>;

const AuthContext = React.createContext<AuthContextProps | null>(null);
export function AuthProvider({ value, ...props }: AuthProviderProps) {
  return <AuthContext.Provider value={value} {...props} />;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");

  return context;
}
