/* ============== BASE ============== */
const envApi =
  process.env.REACT_APP_API ||
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API);

export const API = (envApi || "http://localhost:8080").replace(/\/$/, "");

/* ============== AUTH STORAGE ============== */
const AUTH_KEY = "auth";

export function getSavedAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function setSavedAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth || {}));
}
export function clearSavedAuth() {
  localStorage.removeItem(AUTH_KEY);
}

/* ============== INTERNAL HELPERS ============== */
function makeAuthHeader(email, password) {
  const saved = getSavedAuth() || {};
  const token = saved.token;
  const E = email ?? saved.email;
  const P = password ?? saved.password;

  if (token && String(token).trim()) {
    return { Authorization: `Bearer ${token}` };
  }
  if (E && P) {
    return { Authorization: "Basic " + btoa(`${E}:${P}`) };
  }
  return {};
}

function mergeHeaders(...parts) {
  const out = {};
  for (const p of parts) {
    if (!p) continue;
    for (const [k, v] of Object.entries(p)) {
      if (v !== undefined && v !== null) out[k] = v;
    }
  }
  return out;
}

function normalizeBodyAndHeaders(body, headers) {
  const hasCT =
    headers && Object.keys(headers).some((k) => k.toLowerCase() === "content-type");
  if (body instanceof FormData) return { bodyToSend: body, extraHeaders: {} };
  if (typeof body === "string") return { bodyToSend: body, extraHeaders: {} };
  if (body == null) return { bodyToSend: undefined, extraHeaders: {} };
  return {
    bodyToSend: JSON.stringify(body),
    extraHeaders: hasCT ? {} : { "Content-Type": "application/json" },
  };
}

/* ============== FETCH WRAPPER ============== */
export async function fetchJSON(
  path,
  { method = "GET", headers, body, email, password, autoLogout401 = true, credentials } = {}
) {
  const { bodyToSend, extraHeaders } = normalizeBodyAndHeaders(body, headers);

  const res = await fetch(`${API}${path}`, {
    method,
    headers: mergeHeaders(extraHeaders, makeAuthHeader(email, password), headers),
    body: bodyToSend,
    credentials: credentials ?? "omit",
    mode: "cors",
  });

  if (res.status === 204) return { ok: true };

  let data = null;
  let text = "";
  try {
    text = await res.text();
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    if (res.status === 401 && autoLogout401) {
      clearSavedAuth();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    const message =
      data?.message || data?.error || text || `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data ?? text;
    throw err;
  }
  return data ?? (text ? { ok: true, text } : { ok: true });
}

/* ============== COMMON HELPERS ============== */
function withAuth(opts = {}) {
  const saved = getSavedAuth() || {};
  return {
    ...opts,
    email: opts.email ?? saved.email,
    password: opts.password ?? saved.password,
  };
}

function genPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[(Math.random() * chars.length) | 0];
  return out;
}

const normalizeEmail = (v) => (v || "").trim().toLowerCase();
const normalizePhone = (v) => (v || "").replace(/\D/g, "");

/* ============== AUTH ============== */
export async function login(email, password) {
  const res = await fetchJSON(`/api/auth/login`, {
    method: "POST",
    body: { email, password },
    autoLogout401: false,
  });
  const token = res?.token || res?.accessToken || res?.jwt || (typeof res === "string" ? res : null);
  if (token) {
    setSavedAuth({ token, email, id: res?.user?.id, role: res?.user?.role });
  } else {
    setSavedAuth({ email, password, id: res?.id, role: res?.role });
  }
  return res;
}
export function testLogin(email, password) {
  return fetchJSON(`/api/users/me`, { email, password });
}
export const loginUser = testLogin;

/* ============== UNIVERSAL ENDPOINT RETRY HELPER ============== */
async function tryEndpoints(variants, opts) {
  let lastErr = null;
  for (const p of variants) {
    try {
      const data = await fetchJSON(p, { ...opts, autoLogout401: false });
      return data;
    } catch (e) {
      lastErr = e;
      if (e && (e.status === 404 || String(e.message || "").includes("Not Found"))) continue;
    }
  }
  if (lastErr && (lastErr.status === 404 || String(lastErr.message || "").includes("Not Found")))
    return [];
  throw lastErr || new Error("Failed to fetch");
}

/* ============== ORDERS ============== */
export function createOrder(email, password, customerId, totalAmount, status = "PLACED") {
  return fetchJSON(`/api/orders/create`, {
    method: "POST",
    email,
    password,
    body: { customerId, totalAmount, status },
  });
}
export function getMyOrders(email, password, opts = {}) {
  return fetchJSON(`/api/orders/my`, { email, password, ...opts });
}
export function adminListOrders(email, password, opts = {}) {
  return fetchJSON(`/api/orders`, { email, password, ...opts });
}
export function updateOrderStatus(email, password, orderId, status) {
  return fetchJSON(`/api/orders/${orderId}/status`, {
    method: "PUT",
    email,
    password,
    body: { status },
  });
}
export function deleteOrder(email, password, orderId) {
  return fetchJSON(`/api/orders/${orderId}`, {
    method: "DELETE",
    email,
    password,
  });
}
export function updateOrderAny(email, password, orderId, data) {
  return fetchJSON(`/api/orders/${orderId}`, {
    method: "PUT",
    email,
    password,
    body: data,
  });
}
export async function adminListOrdersFlexible() {
  const saved = getSavedAuth() || {};
  const variants = [`/api/orders`, `/orders`, `/api/order`, `/order`, `/api/orders/all`];
  const res = await tryEndpoints(variants, { email: saved.email, password: saved.password });
  return Array.isArray(res) ? res : res?.content || [];
}
export async function getMyOrdersFlexible() {
  const saved = getSavedAuth() || {};
  const variants = [`/api/orders/my`, `/orders/my`, `/api/orders/me`, `/orders/me`];
  let res = await tryEndpoints(variants, { email: saved.email, password: saved.password });
  const list = Array.isArray(res) ? res : res?.content || [];
  if (list.length) return list;
  try {
    const all = await adminListOrdersFlexible();
    const id = saved.id;
    if (id != null) return all.filter((o) => (o.customerId ?? o.customer?.id) === id);
    return all;
  } catch {
    return [];
  }
}

/* ============== DELIVERIES ============== */
export function createDelivery(email, password, trackingNo, pickupTime, dropoffTime, riderId, orderRefId, status = "PENDING") {
  return fetchJSON(`/api/deliveries`, {
    method: "POST",
    email,
    password,
    body: { trackingNo, pickupTime, dropoffTime, riderId, orderRefId, status },
  });
}
export function adminListDeliveries(email, password, opts = {}) {
  return fetchJSON(`/api/deliveries`, { email, password, ...opts });
}
export function getDeliveryById(email, password, id) {
  return fetchJSON(`/api/deliveries/${id}`, { email, password });
}
export function updateDeliveryStatus(email, password, id, status) {
  return fetchJSON(`/api/deliveries/${id}/status`, {
    method: "PUT",
    email,
    password,
    body: { status },
  });
}
export function updateDeliveryAny(email, password, id, data) {
  return fetchJSON(`/api/deliveries/${id}`, {
    method: "PUT",
    email,
    password,
    body: data,
  });
}
export function deleteDelivery(email, password, id) {
  return fetchJSON(`/api/deliveries/${id}`, { method: "DELETE", email, password });
}
export async function adminListDeliveriesFlexible() {
  const saved = getSavedAuth() || {};
  const variants = [
    `/api/deliveries`,
    `/deliveries`,
    `/api/delivery`,
    `/delivery`,
    `/api/deliveries/all`,
  ];
  const res = await tryEndpoints(variants, { email: saved.email, password: saved.password });
  return Array.isArray(res) ? res : res?.content || [];
}
export async function getMyDeliveriesFlexible() {
  const saved = getSavedAuth() || {};
  const variants = [
    `/api/deliveries/my`,
    `/deliveries/my`,
    `/api/deliveries/me`,
    `/deliveries/me`,
  ];
  let res = await tryEndpoints(variants, { email: saved.email, password: saved.password });
  const list = Array.isArray(res) ? res : res?.content || [];
  if (list.length) return list;
  try {
    const all = await adminListDeliveriesFlexible();
    const id = saved.id;
    if (id != null) return all.filter((d) => (d.riderId ?? d.rider?.id) === id);
    return all;
  } catch {
    return [];
  }
}

/* ============== INVOICES ============== */
function toInvoiceDTO(x = {}) {
  const orderIdNum =
    x.orderId != null && x.orderId !== "" ? Number(x.orderId)
  : x.orderRefId != null && x.orderRefId !== "" ? Number(x.orderRefId)
  : undefined;

  const dto = {
    invoiceNo:  x.invoiceNo ?? x.invoiceNumber ?? x.number ?? undefined,
    amount:     x.amount != null && x.amount !== "" ? Number(x.amount) : undefined,
    status:     (x.status ?? "UNPAID").toUpperCase(),
    issuedOn:   x.issued ?? x.issuedOn ?? x.issued_at ?? undefined,
  };

  if (orderIdNum != null) {
    dto.orderRefId = orderIdNum;
    dto.orderId    = orderIdNum;
    dto.order      = { id: orderIdNum };
  }
  return dto;
}
export function listInvoices(email, password, opts = {}) {
  return fetchJSON(`/api/invoices`, withAuth({ email, password, autoLogout401: false, ...opts }));
}
export function createInvoice(email, password, data) {
  return fetchJSON(`/api/invoices`, withAuth({ method: "POST", email, password, body: toInvoiceDTO(data), autoLogout401: false }));
}
export function updateInvoice(email, password, id, data) {
  return fetchJSON(`/api/invoices/${id}`, withAuth({ method: "PUT", email, password, body: toInvoiceDTO(data), autoLogout401: false }));
}
export function deleteInvoice(email, password, id) {
  return fetchJSON(`/api/invoices/${id}`, withAuth({ method: "DELETE", email, password, autoLogout401: false }));
}

/* ============== STAFF / TASKS / USERS / REPORTS ============== */
export function getAllStaff(email, password, opts = {}) {
  return fetchJSON(`/api/staff`, { email, password, ...opts });
}
export function createStaff(email, password, data) {
  return fetchJSON(`/api/staff`, { method: "POST", email, password, body: data });
}
export function updateStaff(email, password, id, data) {
  return fetchJSON(`/api/staff/${id}`, { method: "PUT", email, password, body: data });
}
export function deleteStaff(email, password, id) {
  return fetchJSON(`/api/staff/${id}`, { method: "DELETE", email, password });
}

/* TASKS */
export function listTasks(email, password, opts = {}) {
  return fetchJSON(`/api/tasks`, { email, password, ...opts });
}
export function createTask(email, password, data) {
  return fetchJSON(`/api/tasks`, { method: "POST", email, password, body: data });
}
export function updateTask(email, password, id, data) {
  return fetchJSON(`/api/tasks/${id}`, { method: "PUT", email, password, body: data });
}
export function deleteTask(email, password, id) {
  return fetchJSON(`/api/tasks/${id}`, { method: "DELETE", email, password });
}

/* USERS */
export function listUsers(email, password, opts = {}) {
  return fetchJSON(`/api/users`, { email, password, ...opts });
}
export function createUser(email, password, data) {
  return fetchJSON(`/api/users`, { method: "POST", email, password, body: data });
}
export function updateUser(email, password, id, data) {
  return fetchJSON(`/api/users/${id}`, { method: "PUT", email, password, body: data });
}
export function deleteUser(email, password, id) {
  return fetchJSON(`/api/users/${id}`, { method: "DELETE", email, password });
}

/* CUSTOMERS / REPORTS */
export async function listCustomersOnly(email, password, opts = {}) {
  const all = await listUsers(email, password, opts);
  return Array.isArray(all)
    ? all.filter((u) => String(u.role || "").toUpperCase() === "CUSTOMER")
    : [];
}
export async function listCustomers(opts = {}) {
  const saved = getSavedAuth();
  return listCustomersOnly(saved?.email, saved?.password, opts);
}
export async function checkCustomerDuplicate({ email, phone }) {
  const saved = getSavedAuth();
  const customers = await listCustomersOnly(saved?.email, saved?.password);
  const e = normalizeEmail(email);
  const p = normalizePhone(phone);

  let emailExists = false;
  let phoneExists = false;

  for (const c of customers) {
    if (!emailExists && e && normalizeEmail(c.email) === e) emailExists = true;
    if (!phoneExists && p && normalizePhone(c.phone) === p) phoneExists = true;
    if (emailExists && phoneExists) break;
  }
  return { emailExists, phoneExists };
}
export async function createCustomerSmart(data) {
  const saved = getSavedAuth();
  const pwd = data.password && String(data.password).trim() ? data.password : genPassword();
  const user = await createUser(saved?.email, saved?.password, {
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    role: "CUSTOMER",
    password: pwd,
  });
  return { user, generatedPassword: data.password ? undefined : pwd };
}
export async function createCustomerSmartGuarded(data) {
  const { emailExists, phoneExists } = await checkCustomerDuplicate({
    email: data.email,
    phone: data.phone,
  });
  if (emailExists || phoneExists) {
    const msgs = [];
    if (emailExists) msgs.push("Email already exists");
    if (phoneExists) msgs.push("Phone already exists");
    const err = new Error(msgs.join(" & "));
    err.code = "DUPLICATE";
    throw err;
  }
  return createCustomerSmart(data);
}

export function getReportSummary(email, password, opts = {}) {
  return fetchJSON(`/api/reports/summary`, { email, password, ...opts });
}
export function getTopCustomers(email, password, opts = {}) {
  return fetchJSON(`/api/reports/top-customers`, { email, password, ...opts });
}
export function getSettings(email, password, opts = {}) {
  return fetchJSON(`/api/settings`, { email, password, ...opts });
}
export function saveSettings(email, password, data) {
  return fetchJSON(`/api/settings`, { method: "PUT", email, password, body: data });
}

/* 🔧 Compatibility Aliases (Frontend expects these names) */
export const createCustomer = createCustomerSmartGuarded;
export const listDeliveries = adminListDeliveries;
export const updateDelivery = updateDeliveryAny;
