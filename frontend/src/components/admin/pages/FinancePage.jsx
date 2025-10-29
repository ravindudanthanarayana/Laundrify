import React from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  listInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../../api/laundryApi";

// 🔐 Use a user with ADMIN or FINANCE role
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export default function FinancePage() {
  const columns = [
    { key: "invoiceNo", label: "Invoice #", required: true },
    { key: "orderId",   label: "Order ID",  required: true, type: "number" },
    { key: "amount",    label: "Amount (LKR)", required: true, type: "number" },
    { key: "status",    label: "Payment Status", required: true, type: "select",
      options: [
        { label: "Unpaid", value: "UNPAID" },
        { label: "Paid",   value: "PAID"   },
        { label: "Partial",value: "PARTIAL"},
        { label: "Overdue",value: "OVERDUE"},
      ]
    },
    { key: "issued",    label: "Issued On", type: "date", required: true },
  ];

  // Map UI form -> backend payload
  const toPayload = (form) => ({
    invoiceNo: form.invoiceNo,
    amount: Number(form.amount || 0),
    status: form.status || "UNPAID",
    issuedOn: form.issued,             // if backend uses 'issuedOn'
    order: { id: Number(form.orderId) } // relation
  });

  // Map backend row -> UI row (so table/form show correct fields)
  const fromRow = (row) => ({
    id: row.id,
    invoiceNo: row.invoiceNo,
    orderId: row.order?.id ?? row.orderId ?? "",
    amount: row.amount,
    status: row.status,
    issued: row.issuedOn ?? row.issued ?? "", // support either key
  });

  return (
    <CrudPageShell
      title="Invoices"
      columns={columns}
      idKey="id"
      // Load & normalize to UI shape
      load={async () => {
        const data = await listInvoices(ADMIN_EMAIL, ADMIN_PASSWORD);
        return (data || []).map(fromRow);
      }}
      // Create
      onAdd={async (form) => {
        const saved = await createInvoice(ADMIN_EMAIL, ADMIN_PASSWORD, toPayload(form));
        return fromRow(saved);
      }}
      // Update
      onUpdate={async (id, form) => {
        const updated = await updateInvoice(ADMIN_EMAIL, ADMIN_PASSWORD, id, toPayload(form));
        return fromRow(updated);
      }}
      // Delete
      onDelete={(id) => deleteInvoice(ADMIN_EMAIL, ADMIN_PASSWORD, id)}
    />
  );
}
