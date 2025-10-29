// src/components/admin/pages/CustomersPage.jsx
import React from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  listCustomers,
  createCustomer,
  updateUser,
  deleteUser,
  getSavedAuth,
} from "../../../api/laundryApi";

export default function CustomersPage() {
  const columns = [
    { key: "id", label: "ID", type: "text" },
    { key: "name", label: "Name", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
  ];

  const load = async () => {
    const data = await listCustomers();
    return Array.isArray(data) ? data : data?.content || [];
  };

  const onAdd = async (payload) => {
    const data = {
      name: String(payload.name || "").trim(),
      email: String(payload.email || "").trim() || null,
      phone: String(payload.phone || "").trim() || null,
    };
    await createCustomer(data);
  };

  const onUpdate = async (id, payload) => {
    const saved = getSavedAuth() || {};
    const data = {
      name: String(payload.name || "").trim(),
      email: String(payload.email || "").trim() || null,
      phone: String(payload.phone || "").trim() || null,
    };
    await updateUser(saved.email, saved.password, id, data);
  };

  const onDelete = async (id) => {
    const saved = getSavedAuth() || {};
    await deleteUser(saved.email, saved.password, id);
  };

  return (
    <CrudPageShell
      title="Customers"
      columns={columns}
      idKey="id"
      load={load}
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      hideOnAddKeys={["id"]}
    />
  );
}

