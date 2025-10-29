// src/components/admin/AdminLayout.jsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "boxicons/css/boxicons.min.css";
import "./AdminDashboard.scss";

export default function AdminLayout() {
  const [sidebarHide, setSidebarHide] = useState(false);
  const [dark, setDark] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // nav items (single source of truth)
  const navItems = useMemo(
    () => [
      { to: "/admin/dashboard", icon: "bxs-dashboard", label: "Dashboard" },
      { to: "/admin/orders", icon: "bxs-shopping-bag-alt", label: "Orders" },
      { to: "/admin/deliveries", icon: "bxs-truck", label: "Deliveries" },
      { to: "/admin/invoices", icon: "bxs-receipt", label: "Invoices" },
      { to: "/admin/tasks", icon: "bxs-briefcase", label: "Tasks" },
      { to: "/admin/customers", icon: "bxs-user-detail", label: "Customers" },
      { to: "/admin/staff", icon: "bxs-group", label: "Staff" },
      { to: "/admin/finance", icon: "bxs-coin", label: "Finance" },
      { to: "/admin/reports", icon: "bxs-report", label: "Reports" },
      { to: "/admin/settings", icon: "bxs-cog", label: "Settings" },
      { to: "/admin/users", icon: "bxs-user", label: "Users" },
    ],
    []
  );

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => setSidebarHide(window.innerWidth <= 576);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);

  // Apply dark class to body
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const handleLogout = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        await logout();
      } catch {}
      navigate("/login");
    },
    [logout, navigate]
  );

  // On small screens, clicking a nav item should close sidebar
  const handleNavClick = useCallback(() => {
    if (window.innerWidth <= 576) setSidebarHide(true);
  }, []);

  return (
    <div className={dark ? "admin-shell dark" : "admin-shell"}>
      {/* ======= SIDEBAR ======= */}
      <section id="sidebar" className={sidebarHide ? "hide" : "show"}>
        <a href="#" className="brand" onClick={(e) => e.preventDefault()}>
          <i className="bx bxs-smile bx-lg" />
          <span className="text">LaundryFi</span>
        </a>

        <ul className="side-menu top">
          {navItems.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.to === "/admin/dashboard"}
                onClick={handleNavClick}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              >
                <i className={`bx ${n.icon} bx-sm`} />
                <span className="text">{n.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="side-menu bottom">
          <li>
            <a href="#" className="logout" onClick={handleLogout}>
              <i className="bx bx-power-off bx-sm bx-burst-hover" />
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </section>

      {/* ======= MAIN ======= */}
      <section id="content">
        {/* ======= NAVBAR ======= */}
        <nav>
          <i
            className="bx bx-menu bx-sm"
            onClick={() => setSidebarHide((s) => !s)}
            role="button"
            aria-label="Toggle sidebar"
          />

          <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
            Categories
          </a>

          <form action="#" onSubmit={(e) => e.preventDefault()}>
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button type="submit" className="search-btn" aria-label="Search">
                <i className="bx bx-search" />
              </button>
            </div>
          </form>

          <input
            type="checkbox"
            id="switch-mode"
            hidden
            checked={dark}
            onChange={(e) => setDark(e.target.checked)}
          />
          <label className="swith-lm" htmlFor="switch-mode" title="Toggle dark mode">
            <i className="bx bxs-moon" />
            <i className="bx bx-sun" />
            <div className="ball" />
          </label>

          {/* Notifications */}
          <div className="notification-wrap" ref={notifRef}>
            <a
              href="#"
              className="notification"
              onClick={(e) => {
                e.preventDefault();
                setShowNotif((s) => !s);
                setShowProfile(false);
              }}
            >
              <i className="bx bxs-bell bx-tada-hover" />
              <span className="num">8</span>
            </a>
            <div className={`notification-menu ${showNotif ? "show" : ""}`}>
              <ul>
                <li>New message from John</li>
                <li>Your order has been shipped</li>
                <li>New comment on your post</li>
                <li>Update available for your app</li>
                <li>Reminder: Meeting at 3PM</li>
              </ul>
            </div>
          </div>

          {/* Profile */}
          <div className="profile-wrap" ref={profileRef}>
            <a
              href="#"
              className="profile"
              onClick={(e) => {
                e.preventDefault();
                setShowProfile((s) => !s);
                setShowNotif(false);
              }}
              title={user?.email || "Profile"}
            >
              <img src="https://placehold.co/80x80/png" alt="Profile" />
            </a>
            <div className={`profile-menu ${showProfile ? "show" : ""}`}>
              <ul>
                <li>
                  <a href="#">My Profile</a>
                </li>
                <li>
                  <a href="#">Settings</a>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
