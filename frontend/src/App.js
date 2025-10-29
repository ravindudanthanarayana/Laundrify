import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./auth/RequireAuth";
import ProtectedRoute from "./auth/ProtectedRoute";

import HomeSections from "./components/pages/HomeSections"; // 👈 MAIN HOME PAGE
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./components/admin/pages/Login";
import DashboardPage from "./components/admin/pages/DashboardPage";
import OrdersPage from "./components/admin/pages/OrdersPage";
import DeliveriesPage from "./components/admin/pages/DeliveriesPage";
import InvoicesPage from "./components/admin/pages/InvoicesPage";
import StaffPage from "./components/admin/pages/StaffPage";
import CustomersPage from "./components/admin/pages/CustomersPage";
import TasksPage from "./components/admin/pages/TasksPage";
import FinancePage from "./components/admin/pages/FinancePage";
import UsersPage from "./components/admin/pages/UsersPage";
import ReportsPage from "./components/admin/pages/ReportsPage";
import SettingsPage from "./components/admin/pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<HomeSections />} />  {/* 👈 open URL -> loads this */}
      <Route path="/login" element={<Login />} />

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="staff" element={<StaffPage />} />

        <Route
          path="finance"
          element={
            <ProtectedRoute feature="finance">
              <FinancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute feature="users">
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute feature="reports">
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
