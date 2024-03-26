"use client";
import getUserSession from "@/lib/getUserSession";
import React, { createContext, useEffect, useState } from "react";

type AuthType = {
  name: string | null;
  id: number;
  categories?: {
    id: number;
    userId: number;
    categoryId: number;
  }[];
} | null;

type TAuthCtx = {
  user: AuthType;
  checkAuth: () => void;
};

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext<TAuthCtx | null>(null);

const AuthProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<AuthType | null>(null);

  const checkAuth = async () => {
    const data = await getUserSession();
    if (data?.user.name) {
      setAuth(data.user);
    } else setAuth(null);
  };

  useEffect(() => {
    void checkAuth();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <AuthContext.Provider value={{ user: auth, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
