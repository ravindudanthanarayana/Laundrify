import React, { useMemo } from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../api/laundryApi";

// Admin-only page is recommended
export default function UsersPage() {
  // read session saved by Login.jsx
  const session = useMemo(() => {
    try {
      const token = localStorage.getItem("token") || "";
      const email = token ? atob(token).split(":")[0] : localStorage.getItem("email") || "";
      const password = token ? atob(token).split(":")[1] : "";
      return { email, password };
    } catch {
      return { email: "", password: "" };
    }
  }, []);

  // Table + Form columns
  const columns = [
    { key: "id",    label: "ID" }, // read-only id from backend
    { key: "name",  label: "Name", required: true },
    { key: "email", label: "Email", required: true, type: "email" },
    {
      key: "role",
      label: "Role",
      required: true,
      type: "select",
      options: [
        { label: "ADMIN",    value: "ADMIN" },
        { label: "STAFF",    value: "STAFF" },
        { label: "DELIVERY", value: "DELIVERY" },
        { label: "FINANCE",  value: "FINANCE" },
        { label: "CS",       value: "CS" },        // Customer Service
        { label: "CUSTOMER", value: "CUSTOMER" },
      ],
    },
    // Optional password setter (for create / reset). We don't show actual value.
    {
      key: "password",
      label: "Password (set/reset)",
      type: "password",
      render: () => "***", // hide in table
    },
  ];

  // Map UI form -> backend payload
  const toCreatePayload = (form) => {
    // Require password on create
    return {
      name: form.name,
      email: form.email,
      role: form.role || "CUSTOMER",
      passwordHash: form.password || "", // backend expects 'passwordHash'
    };
  };

  const toUpdatePayload = (form) => {
    const base = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    // Only send password if admin entered a new one
    if (form.password && form.password.trim().length > 0) {
      base.passwordHash = form.password;
    }
    return base;
  };

  // Map backend row -> UI row
  const fromRow = (row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    password: "", // never fill
  });

  const { email, password } = session;

  return (
    <CrudPageShell
      title="Users"
      columns={columns}
      idKey="id"
      load={async () => {
        const data = await listUsers(email, password);
        return (data || []).map(fromRow);
      }}
      onAdd={async (form) => {
        if (!form.password) {
          // simple guard; CrudPageShell doesn't validate this field by default
          throw new Error("Password is required for creating a user");
        }
        const saved = await createUser(email, password, toCreatePayload(form));
        return fromRow(saved);
      }}
      onUpdate={async (id, form) => {
        const updated = await updateUser(email, password, id, toUpdatePayload(form));
        return fromRow(updated);
      }}
      onDelete={(id) => deleteUser(email, password, id)}
    />
  );
}
