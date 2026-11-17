import { useState } from "react";
import { Link } from "react-router-dom";
import { api, mediaUrl, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useSeo } from "../hooks/useSeo.js";

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useSeo({
    title: "Your bag",
    description: "Review your Riaz Toye Center bag and place your order.",
    path: "/cart",
    noindex: true,
  });

  const checkout = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const order = await api.placeOrder({
        customer: form,
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      });
      clear();
      setStatus(`Order placed. Total ${money(order.total)}. We will contact you soon.`);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!items.length && !status) {
    return (
      <div className="page empty">
        <div className="shell">
          <h1>Your bag is empty</h1>
          <p>Add toys, perfume or other items from the shop.</p>
          <Link className="btn btn-buy" to="/shop">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="shell">
      <p className="eyebrow">Checkout</p>
      <h1>Your bag</h1>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              {item.image ? (
                <img src={mediaUrl(item.image)} alt="" />
              ) : (
                <div className="placeholder mini" />
              )}
              <div>
                <h3>{item.name}</h3>
                <p>{money(item.price)}</p>
                <label>
                  Qty
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => setQty(item.id, Number(e.target.value))}
                  />
                </label>
              </div>
              <button className="link-btn" onClick={() => remove(item.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        <form className="checkout" onSubmit={checkout}>
          <h2>Place order</h2>
          <p className="total">Total: {money(total)}</p>
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            placeholder="Delivery address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button className="btn btn-buy" disabled={busy || !items.length}>
            {busy ? "Placing..." : "Place order"}
          </button>
          {status && <p className="status">{status}</p>}
        </form>
      </div>
      </div>
    </div>
  );
}
