import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@laundry.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);         // ⬅️ useAuth().login -> saves localStorage.auth
      navigate("/admin");                   // or "/admin/dashboard"
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f7fb" }}>
      <form onSubmit={handleSubmit} style={{ width: 380, background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
        <h3 style={{ marginBottom: 12 }}>Sign in</h3>
        {error && <div style={{ color: "#b91c1c", marginBottom: 8 }}>{error}</div>}

        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required style={{ width: "100%", padding: 8, marginBottom: 10 }} />

        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required style={{ width: "100%", padding: 8, marginBottom: 16 }} />

        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, border: 0, color: "#fff", background: loading ? "#6fa8ff" : "#2f7ef7", borderRadius: 8 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
