// src/components/admin/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getMyOrders /* or adminListOrders */ } from "../../api/laundryApi";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // read session (saved in Login.jsx)
  const session = useMemo(() => {
    try {
      const token = localStorage.getItem("token") || "";
      const email = token ? atob(token).split(":")[0] : localStorage.getItem("email") || "";
      const password = token ? atob(token).split(":")[1] : "";
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const role = user?.role || localStorage.getItem("role") || "CUSTOMER";
      return { email, password, role };
    } catch {
      return { email: "", password: "", role: "CUSTOMER" };
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // If you have an admin endpoint, you can switch like:
        // const data = session.role === "ADMIN"
        //   ? await adminListOrders(session.email, session.password)
        //   : await getMyOrders(session.email, session.password);

        const data = await getMyOrders(session.email, session.password); // customer-specific
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session.email, session.password, session.role]);

  // derive metrics from orders
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const visitors = 2834; // demo metric; replace with analytics if available
    return { totalOrders, totalSales, visitors };
  }, [orders]);

  // choose recent 5 orders (newest first by id)
  const recent = useMemo(() => {
    const sorted = [...orders].sort((a, b) => (b.id || 0) - (a.id || 0));
    return sorted.slice(0, 5);
  }, [orders]);

  return (
    <>
      <div className="head-title">
        <div className="left">
          <h1>Dashboard</h1>
          <ul className="breadcrumb">
            <li><a href="#">Dashboard</a></li>
            <li><i className="bx bx-chevron-right"></i></li>
            <li><a className="active" href="#">Home</a></li>
          </ul>
        </div>

        <a href="#" className="btn-download" onClick={(e)=>e.preventDefault()}>
          <i className="bx bxs-cloud-download bx-fade-down-hover"></i>
          <span className="text">V2.5 Released</span>
        </a>
      </div>

      <ul className="box-info">
        <li>
          <i className="bx bxs-calendar-check"></i>
          <span className="text">
            <h3>{metrics.totalOrders}</h3>
            <p>New Order(s)</p>
          </span>
        </li>
        <li>
          <i className="bx bxs-group"></i>
          <span className="text">
            <h3>{metrics.visitors}</h3>
            <p>Visitors</p>
          </span>
        </li>
        <li>
          <i className="bx bxs-dollar-circle"></i>
          <span className="text">
            <h3>
              LKR {metrics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p>Total Sales</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head">
            <h3>Recent Orders</h3>
            <i className="bx bx-search"></i>
            <i className="bx bx-filter"></i>
          </div>

          {err && <div style={{ color:"#DB504A", marginBottom:8 }}>{err}</div>}
          {loading ? (
            <div style={{ padding: 16, opacity: .7 }}>Loadingâ€¦</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Order # / Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.length > 0 ? recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <img src="https://placehold.co/36x36/png" alt="" />
                      <p>{o.customer?.name || o.customer?.email || "Customer"}</p>
                    </td>
                    <td>#{o.id}</td>
                    <td>
                      <span className={`status ${String(o.status||"").toLowerCase()}`}>
                        {o.status || "PLACED"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} style={{ opacity:.6 }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="todo">
          <div className="head">
            <h3>Todos</h3>
            <i className="bx bx-plus icon"></i>
            <i className="bx bx-filter"></i>
          </div>
          <ul className="todo-list">
            <li className="completed"><p>Check Inventory</p><i className="bx bx-dots-vertical-rounded"></i></li>
            <li className="completed"><p>Manage Delivery Team</p><i className="bx bx-dots-vertical-rounded"></i></li>
            <li className="not-completed"><p>Contact Selma: Confirm Delivery</p><i className="bx bx-dots-vertical-rounded"></i></li>
            <li className="completed"><p>Update Shop Catalogue</p><i className="bx bx-dots-vertical-rounded"></i></li>
            <li className="not-completed"><p>Count Profit Analytics</p><i className="bx bx-dots-vertical-rounded"></i></li>
          </ul>
        </div>
      </div>
    </>
  );
}

