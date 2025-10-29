import React from "react";
import { Outlet } from "react-router-dom";
import RequireAuth from "./RequireAuth";

/**
 * Wrapper to use inside routes:
 * <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
 *   <Route path="/admin/*" element={<AdminLayout />} />
 * </Route>
 */
export default function ProtectedRoute({ roles }) {
  return (
    <RequireAuth roles={roles}>
      <Outlet />
    </RequireAuth>
  );
}
