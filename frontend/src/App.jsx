import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useCart } from "./context/CartContext.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";
import { gsap, prefersReducedMotion } from "./lib/gsap.js";

export default function App() {
  const { count } = useCart();
  const [bump, setBump] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (!count) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    if (badgeRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.4 },
        { scale: 1, duration: 0.35, ease: "back.out(2)" }
      );
    }
    return () => clearTimeout(t);
  }, [count]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="announce" role="status">
        Free shipping on orders over Rs 2,000
      </div>

      <header className="topbar">
        <div className="shell topbar-inner">
          <button
            className="menu-btn"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <NavLink to="/" className="brand" onClick={closeMenu} aria-label="Riaz Toye Center home">
            <span className="brand-riaz">riaz</span>
            <span className="brand-toye">toye</span>
            <span className="brand-dot">.</span>
          </NavLink>

          <nav className={menuOpen ? "nav open" : "nav"} aria-label="Primary">
            <NavLink to="/shop" onClick={closeMenu}>
              Shop all
            </NavLink>
            <NavLink to="/shop?category=toys" onClick={closeMenu}>
              Toys
            </NavLink>
            <NavLink to="/shop?category=perfume" onClick={closeMenu}>
              Perfume
            </NavLink>
            <NavLink to="/shop?category=other" onClick={closeMenu}>
              Other
            </NavLink>
            <NavLink to="/admin" onClick={closeMenu}>
              Admin
            </NavLink>
          </nav>

          <div className="top-actions">
            <NavLink to="/shop" className="icon-btn" aria-label="Search" onClick={closeMenu}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.2-3.2" />
              </svg>
            </NavLink>
            <NavLink to="/cart" className="icon-btn cart-link" aria-label="Bag" onClick={closeMenu}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 8h15l-1.4 9H7.2z" />
                <path d="M6 8L5 4H2" />
                <circle cx="9" cy="20" r="1.3" />
                <circle cx="17" cy="20" r="1.3" />
              </svg>
              {count > 0 && (
                <span ref={badgeRef} className={bump ? "badge pop" : "badge"}>
                  {count}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      <main id="main-content" className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="shell footer-inner">
          <div className="footer-brand" aria-label="Riaz Toye Center">
            <span className="brand-riaz">riaz</span>
            <span className="brand-toye">toye</span>
            <span className="brand-dot">.</span>
          </div>
          <p>Beautiful toys, perfume gifts, and everyday extras.</p>
          <nav className="footer-nav" aria-label="Footer">
            <NavLink to="/shop">Shop</NavLink>
            <NavLink to="/shop?category=toys">Toys</NavLink>
            <NavLink to="/shop?category=perfume">Perfume</NavLink>
            <NavLink to="/shop?category=other">Other</NavLink>
          </nav>
          <p className="footer-copy">© {new Date().getFullYear()} Riaz Toye Center. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
