import { useEffect, useMemo, useState } from "react";
import { logout, subscribeToAuth } from "../services/authService";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
  });

  useEffect(
    () =>
      subscribeToAuth((user) => {
        setAuthState({ user, loading: false });
      }),
    [],
  );

  const value = useMemo(
    () => ({
      user: authState.user,
      isAdmin: Boolean(authState.user),
      loading: authState.loading,
      logout,
    }),
    [authState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
