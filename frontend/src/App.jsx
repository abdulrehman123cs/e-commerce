import { useEffect, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useCart } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const { count } = useCart();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="logo">RT</span>
          <span>
            <strong>Riaz Toye Center</strong>
            <small>Toys · Perfume · More</small>
          </span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/shop?category=toys">Toys</NavLink>
          <NavLink to="/shop?category=perfume">Perfume</NavLink>
          <NavLink to="/shop?category=other">Other</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart <span className={bump ? "badge pop" : "badge"}>{count}</span>
          </NavLink>
          <NavLink to="/admin" className="admin-link">
            Admin
          </NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Riaz Toye Center · All rights reserved</p>
        <p>Shop toys, perfume and daily gifts — fully mobile friendly.</p>
      </footer>
    </div>
  );
}
