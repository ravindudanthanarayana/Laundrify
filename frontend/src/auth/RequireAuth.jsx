import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * Usage:
 * <Route element={<RequireAuth roles={["ADMIN"]} />}>
 *   <Route path="/admin/*" element={<AdminLayout />} />
 * </Route>
 */
export default function RequireAuth({ roles, children }) {
  const auth = useAuth(); // safe: always an object now
  const location = useLocation();

  if (!auth?.isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (roles && !auth.canAccess(roles)) {
    return <Navigate to="/" replace />;
  }
  return children ?? <></>;
}
