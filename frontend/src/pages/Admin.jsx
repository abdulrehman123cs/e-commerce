import { useEffect, useState } from "react";
import { api, categoryLabel, getToken, mediaUrl, money, setToken } from "../api.js";
import { useSeo } from "../hooks/useSeo.js";

const emptyForm = {
  name: "",
  category: "toys",
  price: "",
  stock: "",
  description: "",
  image: null,
};

export default function Admin() {
  const [token, setTok] = useState(getToken());
  const [login, setLogin] = useState({ username: "", password: "" });
  const [form, setForm] = useState(emptyForm);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  useSeo({
    title: "Admin",
    description: "Staff dashboard for Riaz Toye Center.",
    path: "/admin",
    noindex: true,
  });

  const load = async () => {
    const [plist, olist] = await Promise.all([api.products(), api.orders().catch(() => [])]);
    setProducts(plist);
    setOrders(olist);
  };

  useEffect(() => {
    if (token) load().catch((err) => setMessage(err.message));
  }, [token]);

  const onLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const data = await api.login(login);
      setToken(data.token);
      setTok(data.token);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const logout = () => {
    setToken("");
    setTok("");
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = new FormData();
    data.append("name", form.name);
    data.append("category", form.category);
    data.append("price", form.price);
    data.append("stock", form.stock);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    try {
      if (editing) await api.updateProduct(editing, data);
      else await api.addProduct(data);
      setForm(emptyForm);
      setEditing(null);
      await load();
      setMessage(editing ? "Product updated" : "Product added");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const edit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      description: p.description,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id);
    await load();
  };

  if (!token) {
    return (
      <div className="page login-page">
        <form className="login-card" onSubmit={onLogin}>
          <p className="eyebrow">Staff only</p>
          <h1>Admin login</h1>
          <p>Add product photos, amount, stock and category.</p>
          <input
            placeholder="Username"
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <button className="btn btn-buy">Login</button>
          <p className="hint">Default: admin / riaz123</p>
          {message && <p className="status">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Riaz Toye Center</p>
          <h1>Admin dashboard</h1>
        </div>
        <button className="btn btn-soft" onClick={logout}>
          Logout
        </button>
      </div>

      <form className="admin-form" onSubmit={submitProduct}>
        <h2>{editing ? "Edit product" : "Add product"}</h2>
        <div className="grid-2">
          <input
            required
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="toys">Toys</option>
            <option value="perfume">Perfume</option>
            <option value="other">Other</option>
          </select>
          <input
            required
            type="number"
            min="0"
            placeholder="Amount (Rs)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            min="0"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label className="file">
          Product picture
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </label>
        <div className="card-actions">
          <button className="btn btn-buy">{editing ? "Save changes" : "Add product"}</button>
          {editing && (
            <button
              type="button"
              className="btn btn-soft"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {message && <p className="status">{message}</p>}
      </form>

      <section className="section">
        <h2>Products</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.image ? (
                      <img className="thumb" src={mediaUrl(p.image)} alt="" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{categoryLabel[p.category]}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td className="row-actions">
                    <button className="link-btn" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button className="link-btn danger" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Recent orders</h2>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="orders">
            {orders.map((o) => (
              <article key={o.id} className="order-card">
                <strong>{o.customer.name}</strong>
                <p>
                  {o.customer.phone} · {money(o.total)}
                </p>
                <p>{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
