import React from "react";
import CrudPageShell from "./_CrudPageShell";
import { listTasks, createTask, updateTask, deleteTask } from "../../../api/laundryApi";

// Roles: ADMIN / STAFF can manage tasks
export default function TasksPage() {
  const columns = [
    { key: "id",       label: "ID" },
    { key: "taskId",   label: "Task ID", required: true },
    { key: "orderId",  label: "Order ID", required: true, type: "number" },
    { key: "assignee", label: "Assigned To", required: true },
    {
      key: "status",
      label: "Status",
      required: true,
      type: "select",
      options: [
        { label: "QUEUED",      value: "QUEUED" },
        { label: "ASSIGNED",    value: "ASSIGNED" },
        { label: "IN_PROGRESS", value: "IN_PROGRESS" },
        { label: "DONE",        value: "DONE" },
      ],
    },
    { key: "due", label: "Due Date", required: true },
  ];

  // Map UI -> backend payload
  const toPayload = (form) => {
    const orderIdNum = form.orderId != null && form.orderId !== "" ? Number(form.orderId) : undefined;
    const payload = {
      taskId:   form.taskId,
      assignee: form.assignee,
      status:   form.status || "QUEUED",
      dueDate:  form.due || form.dueDate || undefined,
    };
    if (orderIdNum != null) {
      payload.order = { id: orderIdNum };
      payload.orderId = orderIdNum;
      payload.orderRefId = orderIdNum;
    }
    return payload;
  };

  // Map backend row -> UI
  const fromRow = (row) => ({
    id:       row.id,
    taskId:   row.taskId ?? row.code ?? row.reference ?? "",
    orderId:  row.order?.id ?? row.orderId ?? row.orderRefId ?? "",
    assignee: row.assignee,
    status:   row.status,
    due:      row.dueDate ?? row.due ?? row.deadline ?? "",
  });

  return (
    <CrudPageShell
      title="Tasks"
      columns={columns}
      idKey="id"
      hideOnAddKeys={["id"]}
      load={async () => {
        const arr = await listTasks();
        return (arr || []).map(fromRow);
      }}
      onAdd={async (form) => {
        const saved = await createTask(undefined, undefined, toPayload(form));
        return fromRow(saved);
      }}
      onUpdate={async (id, form) => {
        const updated = await updateTask(undefined, undefined, id, toPayload(form));
        return fromRow(updated);
      }}
      onDelete={(id) => deleteTask(undefined, undefined, id)}
    />
  );
}

