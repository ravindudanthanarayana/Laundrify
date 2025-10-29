import React, { useEffect, useMemo, useState } from "react";
import { getSettings, saveSettings } from "../../../api/laundryApi";

export default function SettingsPage() {
  // session (login à·€à·™à¶¯à·Šà¶¯à·’ Login.jsx set à¶šà¶»à¶´à·” à¶¯à·š)
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

  const [pricing, setPricing] = useState({ wash: "250", dry: "200", iron: "150" });
  const [hours, setHours] = useState({ open: "08:00", close: "19:00" });
  const [services, setServices] = useState(["Wash", "Dry", "Iron"]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  // Load from backend
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getSettings(session.email, session.password);

        // normalize to UI
        const p = data?.pricing || {};
        const h = data?.hours || {};
        const s = Array.isArray(data?.services) ? data.services : [];

        if (!cancelled) {
          setPricing({
            wash: String(p.wash ?? "250"),
            dry: String(p.dry ?? "200"),
            iron: String(p.iron ?? "150"),
          });
          setHours({
            open: h.open ?? "08:00",
            close: h.close ?? "19:00",
          });
          setServices(s.length ? s : ["Wash", "Dry", "Iron"]);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [session.email, session.password]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");
    try {
      const payload = {
        pricing: {
          wash: Number(pricing.wash || 0),
          dry: Number(pricing.dry || 0),
          iron: Number(pricing.iron || 0),
        },
        hours: {
          open: hours.open,
          close: hours.close,
        },
        services: services.filter(Boolean),
      };

      await saveSettings(session.email, session.password, payload);
      setOk("Settings saved successfully.");
    } catch (e2) {
      setError(e2?.message || "Save failed");
    } finally {
      setSaving(false);
      setTimeout(() => setOk(""), 2500);
    }
  };

  return (
    <>
      <div className="head-title">
        <div className="left">
          <h1>Settings</h1>
          <ul className="breadcrumb">
            <li><a href="#">Admin</a></li>
            <li><i className="bx bx-chevron-right"></i></li>
            <li><a href="#" className="active">Settings</a></li>
          </ul>
        </div>
      </div>

      <div className="table-data">
        <div className="order" style={{ maxWidth: 680 }}>
          <div className="head"><h3>System Configuration</h3></div>

          {loading ? (
            <div style={{ padding: 12, opacity: 0.7 }}>Loadingâ€¦</div>
          ) : (
            <form onSubmit={save} className="crud-form">
              {error && <div style={{ color: "#DB504A", marginBottom: 10 }}>{error}</div>}
              {ok && <div style={{ color: "#16a34a", marginBottom: 10 }}>{ok}</div>}

              <h4>Pricing (LKR)</h4>
              <label>
                <span>Wash</span>
                <input
                  type="number"
                  value={pricing.wash}
                  onChange={e => setPricing({ ...pricing, wash: e.target.value })}
                  min="0"
                  required
                />
              </label>
              <label>
                <span>Dry</span>
                <input
                  type="number"
                  value={pricing.dry}
                  onChange={e => setPricing({ ...pricing, dry: e.target.value })}
                  min="0"
                  required
                />
              </label>
              <label>
                <span>Iron</span>
                <input
                  type="number"
                  value={pricing.iron}
                  onChange={e => setPricing({ ...pricing, iron: e.target.value })}
                  min="0"
                  required
                />
              </label>

              <h4 style={{ marginTop: 10 }}>Business Hours</h4>
              <label>
                <span>Open</span>
                <input
                  type="time"
                  value={hours.open}
                  onChange={e => setHours({ ...hours, open: e.target.value })}
                  required
                />
              </label>
              <label>
                <span>Close</span>
                <input
                  type="time"
                  value={hours.close}
                  onChange={e => setHours({ ...hours, close: e.target.value })}
                  required
                />
              </label>

              <h4 style={{ marginTop: 10 }}>Service Options</h4>
              <label>
                <span>Enabled Services (comma separated)</span>
                <input
                  value={services.join(", ")}
                  onChange={e =>
                    setServices(
                      e.target.value
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="Wash, Dry, Iron"
                />
              </label>

              <div className="actions">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Savingâ€¦" : "Save Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

