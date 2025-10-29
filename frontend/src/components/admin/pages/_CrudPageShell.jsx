import React, { useEffect, useMemo, useState } from "react";

/* ---------- Modal ---------- */
function Modal({ title, children, onClose, onSubmit, submitLabel = "Save" }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50
    }}>
      <div style={{
        width: "min(680px, 92vw)", background: "#fff", borderRadius: 16,
        boxShadow: "0 20px 50px rgba(0,0,0,.25)", overflow: "hidden"
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #eef2f7", fontSize: 18, fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ padding: 20, maxHeight: "70vh", overflow: "auto" }}>{children}</div>
        <div style={{ padding: 16, display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid #eef2f7" }}>
          <button style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff" }} onClick={onClose}>Cancel</button>
          <button style={{ padding: "8px 14px", borderRadius: 10, background: "#3b82f6", color: "#fff", border: "none" }} onClick={onSubmit}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */
export default function CrudPageShell({
  title,
  columns,
  idKey = "id",
  load,
  onAdd,
  onUpdate,
  onDelete,
  hideOnAddKeys = [],     // hide from Add (e.g. ["id"])
  addOnlyCols = [],       // NEW: columns rendered only in Add modal (e.g. [{key:"customerId", ...}])
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});

  const addCols = useMemo(
    () => columns.filter((c) => !hideOnAddKeys.includes(c.key)),
    [columns, hideOnAddKeys]
  );

  async function reload() {
    try {
      setLoading(true);
      setError("");
      const data = await load();
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (e) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, []);

  const renderInput = (col, value, onChange, readOnly = false) => {
    const common = {
      value: value ?? "",
      onChange: (e) => onChange(e.target.value),
      disabled: !!readOnly,
      style: {
        width: "100%", padding: "10px 12px", borderRadius: 10,
        border: "1px solid #e5e7eb", background: readOnly ? "#f3f4f6" : "#fff"
      },
    };
    if (col.type === "number") return <input type="number" {...common} />;
    if (col.type === "select") {
      return (
        <select {...common}>
          {(col.options || []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    }
    return <input type="text" {...common} />;
  };

  async function handleSaveAdd() {
    try {
      setError("");
      const payload = { ...form };
      hideOnAddKeys.forEach((k) => delete payload[k]);
      delete payload[idKey];
      await onAdd(payload);
      setShowAdd(false);
      setForm({});
      await reload();
    } catch (e) {
      setError(e?.message || "Create failed");
    }
  }

  async function handleSaveEdit() {
    try {
      setError("");
      const id = editRow?.[idKey];
      const payload = { ...form };
      await onUpdate(id, payload);
      setEditRow(null);
      setForm({});
      await reload();
    } catch (e) {
      setError(e?.message || "Update failed");
    }
  }

  async function handleDelete(row) {
    if (!onDelete) return;
    if (!window.confirm("Delete this item?")) return;
    try {
      await onDelete(row[idKey]);
      await reload();
    } catch (e) {
      setError(e?.message || "Delete failed");
    }
  }

  return (
    <>
      <div className="head-title">
        <div className="left">
          <h1>{title}</h1>
          <ul className="breadcrumb">
            <li><a href="#">Admin</a></li>
            <li><i className="bx bx-chevron-right"></i></li>
            <li><a className="active" href="#">{title}</a></li>
          </ul>
        </div>
        {onAdd && (
          <button className="btn-download" onClick={() => { setShowAdd(true); setForm({}); }}>
            <i className="bx bx-plus"></i><span className="text">Add {title.slice(0,-1)}</span>
          </button>
        )}
      </div>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>{title} List</h3>
            <i className="bx bx-search"></i>
            <i className="bx bx-filter"></i>
          </div>

          {error && <div style={{ color:"#DB504A", marginBottom:8 }}>{error}</div>}
          {loading ? (
            <div style={{ padding: 16, opacity:.7 }}>Loading...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((c) => (<th key={c.key}>{c.label}</th>))}
                  {(onUpdate || onDelete) && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.length ? rows.map((r) => (
                  <tr key={r[idKey]}>
                    {columns.map((c) => (<td key={c.key}>{String(r[c.key] ?? "")}</td>))}
                    {(onUpdate || onDelete) && (
                      <td>
                        {onUpdate && (
                          <button className="btn btn-xs" style={{ marginRight: 6 }}
                            onClick={() => { setEditRow(r); setForm(r); }} title="Edit">
                            <i className="bx bx-edit-alt"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button className="btn btn-xs danger" title="Delete"
                            onClick={() => handleDelete(r)}>
                            <i className="bx bx-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                )) : (
                  <tr><td colSpan={columns.length + 1} style={{opacity:.6}}>No data</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal
          title={`Add ${title.slice(0,-1)}`}
          onClose={() => { setShowAdd(false); setForm({}); }}
          onSubmit={handleSaveAdd}
          submitLabel="Save"
        >
          {/* Add-only customer fields */}
          {addOnlyCols.map((c) => (
            <div key={`addonly-${c.key}`} style={{ marginBottom: 12 }}>
              <label style={{ display:"block", fontSize:12, marginBottom:6 }}>{c.label}</label>
              {renderInput(c, form[c.key], (v) => setForm((s)=>({ ...s, [c.key]: v })))}
            </div>
          ))}

          {/* Regular fields (minus hidden) */}
          {addCols.map((c) => (
            <div key={`add-${c.key}`} style={{ marginBottom: 12 }}>
              <label style={{ display:"block", fontSize:12, marginBottom:6 }}>{c.label}</label>
              {renderInput(c, form[c.key], (v) => setForm((s)=>({ ...s, [c.key]: v })))}
            </div>
          ))}
        </Modal>
      )}

      {editRow && (
        <Modal
          title={`Edit ${title.slice(0,-1)}`}
          onClose={() => { setEditRow(null); setForm({}); }}
          onSubmit={handleSaveEdit}
          submitLabel="Save"
        >
          {columns.map((c) => (
            <div key={`edit-${c.key}`} style={{ marginBottom: 12 }}>
              <label style={{ display:"block", fontSize:12, marginBottom:6 }}>{c.label}</label>
              {c.key === idKey
                ? renderInput(c, form[c.key], () => {}, true)
                : renderInput(c, form[c.key], (v) => setForm((s)=>({ ...s, [c.key]: v })))
              }
            </div>
          ))}
        </Modal>
      )}
    </>
  );
}

