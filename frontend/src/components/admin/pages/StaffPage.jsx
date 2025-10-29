import React, { useMemo } from "react";
import CrudPageShell from "./_CrudPageShell";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "../../../api/laundryApi";

export default function StaffPage() {
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

  const columns = [
    { key: "empId", label: "Emp ID", required: true },
    { key: "name", label: "Name", required: true },
    { key: "role", label: "Role", required: true },
    { key: "phone", label: "Phone", required: true },
  ];

  return (
    <CrudPageShell
      title="Staff"
      columns={columns}
      idKey="empId"
      load={() => getAllStaff(session.email, session.password)}
      onAdd={(form) => createStaff(session.email, session.password, form)}
      onUpdate={(id, form) => updateStaff(session.email, session.password, id, form)}
      onDelete={(id) => deleteStaff(session.email, session.password, id)}
    />
  );
}
