// src/components/admin/pages/AddCustomerModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createCustomer } from "../../../api/laundryApi";

const normalizeEmail = (v) => (v || "").trim().toLowerCase();
const normalizePhone = (v) => (v || "").replace(/\D/g, "");

export default function AddCustomerModal({ onClose, onSaved, existingCustomers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState({ email: "", phone: "", form: "" });

  // Already available customers (fast lookups)
  const { emailSet, phoneSet } = useMemo(() => {
    const eSet = new Set(
      (existingCustomers || [])
        .map((c) => normalizeEmail(c.email))
        .filter(Boolean)
    );
    const pSet = new Set(
      (existingCustomers || [])
        .map((c) => normalizePhone(c.phone))
        .filter(Boolean)
    );
    return { emailSet: eSet, phoneSet: pSet };
  }, [existingCustomers]);

  const nEmail = normalizeEmail(email);
  const nPhone = normalizePhone(phone);

  const emailDup = !!nEmail && emailSet.has(nEmail);
  const phoneDup = !!nPhone && phoneSet.has(nPhone);

  const canSave =
    !!name.trim() &&
    (!!nEmail || !!nPhone) &&
    !emailDup &&
    !phoneDup &&
    !busy;

  useEffect(() => {
    setErr((prev) => ({
      ...prev,
      email: emailDup ? "Email already exists." : "",
      phone: phoneDup ? "Phone already exists." : "",
    }));
  }, [emailDup, phoneDup]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErr({ email: "", phone: "", form: "" });

    // final guard (race-condition safe)
    if (emailDup || phoneDup) return;

    try {
      setBusy(true);
      const payload = {
        name: name.trim(),
        email: nEmail || null,
        phone: nPhone || null,
      };
      await createCustomer(payload);
      onSaved?.();
      onClose?.();
    } catch (ex) {
      setErr((p) => ({ ...p, form: ex.message || "Save failed" }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-wrap" style={styles.wrap}>
      <div className="modal-card" style={styles.card}>
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Add Customer</h3>
        </div>

        <form onSubmit={handleSave} style={styles.body}>
          {err.form && <div style={styles.formErr}>{err.form}</div>}

          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />

          <label style={styles.label}>Email</label>
          <input
            style={{
              ...styles.input,
              borderColor: err.email ? "#ef4444" : "#e5e7eb",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
          />
          {err.email && <small style={styles.err}>{err.email}</small>}

          <label style={styles.label}>Phone</label>
          <input
            style={{
              ...styles.input,
              borderColor: err.phone ? "#ef4444" : "#e5e7eb",
            }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0771234567"
          />
          {err.phone && <small style={styles.err}>{err.phone}</small>}

          <div style={styles.footer}>
            <button type="button" onClick={onClose} style={styles.ghost}>
              Cancel
            </button>
            <button type="submit" disabled={!canSave} style={styles.primary}>
              {busy ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.35)",
    display: "grid",
    placeItems: "center",
    zIndex: 50,
  },
  card: {
    width: "min(680px, 92vw)",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 25px 80px rgba(0,0,0,.15)",
    overflow: "hidden",
  },
  header: { padding: "18px 22px", borderBottom: "1px solid #e5e7eb" },
  body: { padding: 22, display: "grid", gap: 10 },
  label: { fontSize: 14, color: "#111827" },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
  },
  err: { color: "#ef4444", marginTop: -4, marginBottom: 6 },
  formErr: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "8px 10px",
    borderRadius: 8,
    marginBottom: 6,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  ghost: {
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "8px 14px",
  },
  primary: {
    background: "#3b82f6",
    color: "white",
    border: 0,
    borderRadius: 10,
    padding: "8px 14px",
    opacity: 1,
  },
};
