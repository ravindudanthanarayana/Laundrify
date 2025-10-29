// src/components/admin/pages/InvoicesPage.jsx
import React from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  listInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../../../api/laundryApi";

export default function InvoicesPage() {
  const columns = [
    { key: "invoiceNo", label: "Invoice #", required: false },
    { key: "orderId",   label: "Order ID",  required: true,  type: "number" },
    { key: "amount",    label: "Amount",    required: true,  type: "number" },
    {
      key: "status",
      label: "Status",
      required: true,
      type: "select",
      options: [
        { label: "Unpaid",  value: "UNPAID" },
        { label: "Paid",    value: "PAID" },
        { label: "Partial", value: "PARTIAL" },
        { label: "Overdue", value: "OVERDUE" },
      ],
    },
    { key: "issued",    label: "Issued On", required: false },
  ];

  const toPayload = (form) => {
    const orderIdNum =
      form.orderId != null && form.orderId !== ""
        ? Number(form.orderId)
        : form.orderRefId != null && form.orderRefId !== ""
        ? Number(form.orderRefId)
        : undefined;

    const payload = {
      invoiceNo: form.invoiceNo || undefined,
      amount: form.amount != null && form.amount !== "" ? Number(form.amount) : undefined,
      status: (form.status || "UNPAID").toUpperCase(),
      issuedOn: form.issued || form.issuedOn || undefined,
    };
    if (orderIdNum != null) {
      payload.orderId = orderIdNum;
      payload.order = { id: orderIdNum };
      payload.orderRefId = orderIdNum;
    }
    return payload;
  };

  const fromRow = (row) => ({
    id: row.id,
    invoiceNo: row.invoiceNo ?? row.invoiceNumber ?? row.number ?? "",
    orderId: row.order?.id ?? row.orderId ?? row.orderRefId ?? "",
    amount: row.amount ?? row.total ?? "",
    status: row.status ?? row.state ?? "",
    issued: row.issuedOn ?? row.issuedAt ?? row.createdAt ?? "",
  });

  return (
    <CrudPageShell
      title="Invoices"
      columns={columns}
      idKey="id"
      load={async () => {
        const data = await listInvoices();
        const list = Array.isArray(data) ? data : data?.content || [];
        return list.map(fromRow);
      }}
      onAdd={async (form) => {
        const created = await createInvoice(undefined, undefined, toPayload(form));
        return fromRow(created);
      }}
      onUpdate={async (id, form) => {
        const updated = await updateInvoice(undefined, undefined, id, toPayload(form));
        return fromRow(updated);
      }}
      onDelete={(id) => deleteInvoice(undefined, undefined, id)}
    />
  );
}
