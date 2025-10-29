import React, { useEffect, useState } from "react";
import { getReportSummary, getTopCustomers } from "../../../api/laundryApi";

export default function ReportsPage() {
  const [summary, setSummary] = useState({
    revenue30d: 0,
    orders30d: 0,
    deliveries30d: 0,
  });
  const [topCustomers, setTopCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        const password = token ? atob(token).split(":")[1] : "";

        const summaryData = await getReportSummary(email, password);
        const customers = await getTopCustomers(email, password);

        setSummary(summaryData);
        setTopCustomers(customers);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports!");
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading reports...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <>
      <div className="head-title">
        <div className="left">
          <h1>Reports</h1>
          <ul className="breadcrumb">
            <li><a href="#">Admin</a></li>
            <li><i className="bx bx-chevron-right"></i></li>
            <li><a href="#" className="active">Reports</a></li>
          </ul>
        </div>
      </div>

      <ul className="box-info">
        <li>
          <i className="bx bxs-coin"></i>
          <span className="text">
            <h3>â‚¨ {summary.revenue30d?.toLocaleString()}</h3>
            <p>Revenue (30d)</p>
          </span>
        </li>
        <li>
          <i className="bx bxs-shopping-bags"></i>
          <span className="text">
            <h3>{summary.orders30d}</h3>
            <p>Orders (30d)</p>
          </span>
        </li>
        <li>
          <i className="bx bxs-truck"></i>
          <span className="text">
            <h3>{summary.deliveries30d}</h3>
            <p>Deliveries (30d)</p>
          </span>
        </li>
      </ul>

      <div className="table-data">
        <div className="order">
          <div className="head"><h3>Top Customers</h3></div>
          <table>
            <thead>
              <tr><th>Name</th><th>Orders</th><th>Spend (â‚¨)</th></tr>
            </thead>
            <tbody>
              {topCustomers.map((c, i) => (
                <tr key={i}>
                  <td>{c.name}</td>
                  <td>{c.totalOrders}</td>
                  <td>â‚¨ {c.totalSpend.toLocaleString()}</td>
                </tr>
              ))}
              {topCustomers.length === 0 && (
                <tr><td colSpan="3" style={{ opacity: 0.6 }}>No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

