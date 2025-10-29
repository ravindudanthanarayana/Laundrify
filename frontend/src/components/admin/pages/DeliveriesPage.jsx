import React from "react";
import CrudPageShell from "./_CrudPageShell";
import {
  listDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from "../../../api/laundryApi";

export default function DeliveriesPage() {
  const columns = [
    { key: "trackingNo", label: "Tracking No", required: true },
    { key: "pickup",     label: "Pickup Time", required: true },
    { key: "dropoff",    label: "Dropoff Time", required: true },
    { key: "rider",      label: "Rider", required: true },
  ];

  const toPayload = (form) => ({
    trackingNo: form.trackingNo,
    pickup:     form.pickup,
    dropoff:    form.dropoff,
    rider:      form.rider,
  });

  return (
    <CrudPageShell
      title="Deliveries"
      columns={columns}
      idKey="id"
      // ✅ creds pass නොකරන්න -> saved login use වෙනවා
      load={() => listDeliveries()}
      onAdd={(form) => createDelivery(undefined, undefined, toPayload(form))}
      onUpdate={(id, form) => updateDelivery(undefined, undefined, id, toPayload(form))}
      onDelete={(id) => deleteDelivery(undefined, undefined, id)}
    />
  );
}
