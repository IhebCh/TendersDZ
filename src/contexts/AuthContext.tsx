import React, { createContext, useContext, useEffect, useState } from "react";
import { loginApi } from "../api/client";

interface AuthContextValue {
  token: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("tendersdz_token")
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem("tendersdz_userEmail")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("tendersdz_token", token);
    } else {
      localStorage.removeItem("tendersdz_token");
    }
  }, [token]);

  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("tendersdz_userEmail", userEmail);
    } else {
      localStorage.removeItem("tendersdz_userEmail");
    }
  }, [userEmail]);

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setToken(data.access_token);
    setUserEmail(email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
