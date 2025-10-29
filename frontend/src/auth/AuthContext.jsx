import React, { createContext, useContext, useMemo, useState } from "react";
import { getSavedAuth, setSavedAuth, clearSavedAuth, testLogin } from "../api/laundryApi";

const AuthCtx = createContext({
  user: null,
  isAuthed: false,
  login: async () => {},
  logout: async () => {},
  canAccess: () => true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSavedAuth() || null);

  async function login(email, password) {
    // backend should return {id, email, role, ...}
    const me = await testLogin(email, password);
    const auth = {
      id: me?.id,
      email: me?.email || email,
      password,
      role: me?.role || "CUSTOMER",
      name: me?.name,
    };
    setSavedAuth(auth);
    setUser(auth);
    return auth;
  }

  async function logout() {
    clearSavedAuth();
    setUser(null);
  }

  function canAccess(roles) {
    if (!roles || roles.length === 0) return true;
    const r = user?.role || "CUSTOMER";
    return roles.includes(r);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      login,
      logout,
      canAccess,
    }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}

export default AuthCtx;
