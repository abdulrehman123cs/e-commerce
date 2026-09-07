const ADMIN_KEY = "riaz_admin_token";

export const money = (n) =>
  `Rs ${Number(n || 0).toLocaleString("en-PK")}`;

export const categoryLabel = {
  toys: "Toys",
  perfume: "Perfume",
  other: "Other",
};

export function getToken() {
  return localStorage.getItem(ADMIN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(ADMIN_KEY, token);
  else localStorage.removeItem(ADMIN_KEY);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!(options.body instanceof FormData) && options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  products: (params = "") => request(`/api/products${params}`),
  product: (id) => request(`/api/products/${id}`),
  categories: () => request("/api/categories"),
  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  addProduct: (form) => request("/api/products", { method: "POST", body: form }),
  updateProduct: (id, form) =>
    request(`/api/products/${id}`, { method: "PUT", body: form }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: "DELETE" }),
  placeOrder: (body) =>
    request("/api/orders", { method: "POST", body: JSON.stringify(body) }),
  orders: () => request("/api/orders"),
};
