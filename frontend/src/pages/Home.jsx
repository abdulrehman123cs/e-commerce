import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.products().then((list) => setProducts(list.slice(0, 6))).catch(() => setProducts([]));
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Welcome to your neighborhood mart</p>
          <h1>Riaz Toye Center</h1>
          <p className="lead">
            Find toys kids love, perfume gifts, and everyday extras. Browse by category,
            add to cart, and place your order in a few taps.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/shop">
              Shop now
            </Link>
            <Link className="btn ghost" to="/shop?category=toys">
              See toys
            </Link>
          </div>
        </div>
        <div className="hero-panel">
          <div className="sparkles">
            <span>🎁</span>
            <span>🧸</span>
            <span>✨</span>
          </div>
          <strong>Open for families</strong>
          <p>Toys · Perfume · Other daily items</p>
        </div>
      </section>

      <section className="section">
        <h2>Shop by category</h2>
        <div className="category-grid">
          <Link className="cat toys" to="/shop?category=toys">
            <span className="emoji">🧸</span>
            <h3>Toys</h3>
            <p>Cars, blocks, dolls and fun</p>
          </Link>
          <Link className="cat perfume" to="/shop?category=perfume">
            <span className="emoji">🌸</span>
            <h3>Perfume</h3>
            <p>Fresh and long-lasting scents</p>
          </Link>
          <Link className="cat other" to="/shop?category=other">
            <span className="emoji">🎒</span>
            <h3>Other</h3>
            <p>Bags, gifts and extra items</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Popular products</h2>
          <Link to="/shop">View all</Link>
        </div>
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
