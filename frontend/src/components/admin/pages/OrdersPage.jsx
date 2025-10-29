// src/components/admin/pages/OrdersPage.jsx
import React from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  createOrder,
  adminListOrders,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  getSavedAuth,
} from "../../../api/laundryApi";

const statusOptions = [
  { label: "PLACED", value: "PLACED" },
  { label: "PROCESSING", value: "PROCESSING" },
  { label: "READY", value: "READY" },
  { label: "OUT_FOR_DELIVERY", value: "OUT_FOR_DELIVERY" },
  { label: "COMPLETED", value: "COMPLETED" },
  { label: "CANCELED", value: "CANCELED" },
];

export default function OrdersPage() {
  const auth = getSavedAuth() || {};
  const role = auth.role || "CUSTOMER";
  const myCustomerId = auth.id;

  const columns = [
    { key: "id", label: "ID" },
    { key: "status", label: "Status", type: "select", options: statusOptions, required: true },
    { key: "totalAmount", label: "Total (LKR)", type: "number", required: true },
  ];

  const addOnlyCols =
    role === "ADMIN"
      ? [
          { key: "customerId", label: "Customer ID", type: "number" },
          { key: "customerName", label: "Customer Name", type: "text" },
          { key: "customerPhone", label: "Customer Phone", type: "text" },
        ]
      : [];

  const load =
    role === "ADMIN"
      ? () => adminListOrders(undefined, undefined, { autoLogout401: false })
      : () => getMyOrders(undefined, undefined, { autoLogout401: false });

  return (
    <CrudPageShell
      title="Orders"
      columns={columns}
      idKey="id"
      hideOnAddKeys={["id"]}
      addOnlyCols={addOnlyCols}
      load={load}
      onAdd={async (form) => {
        const amount = Number(form.totalAmount);
        if (!amount || Number.isNaN(amount) || amount <= 0) {
          throw new Error("Enter a valid total amount.");
        }

        let customerId = myCustomerId;
        if (role === "ADMIN") {
          if (!form.customerId) throw new Error("Customer ID is required for admin.");
          customerId = Number(form.customerId);
          if (!customerId || Number.isNaN(customerId)) throw new Error("Customer ID must be a number.");
        }

        // Backend create endpoint accepts {customerId, totalAmount}. Status will start as PLACED server-side.
        return createOrder(undefined, undefined, customerId, amount);
      }}
      onUpdate={(id, form) =>
        updateOrderStatus(undefined, undefined, id, String(form.status || "").toUpperCase())
      }
      onDelete={(id) => deleteOrder(undefined, undefined, id)}
    />
  );
}
