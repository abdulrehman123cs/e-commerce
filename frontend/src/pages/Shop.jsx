import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const TABS = [
  { id: "", label: "All" },
  { id: "toys", label: "Toys" },
  { id: "perfume", label: "Perfume" },
  { id: "other", label: "Other" },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const [q, setQ] = useState(params.get("q") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = new URLSearchParams();
    if (category) search.set("category", category);
    if (q) search.set("q", q);
    setLoading(true);
    api
      .products(search.toString() ? `?${search}` : "")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, q]);

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set("category", id);
    else next.delete("category");
    setParams(next);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">User dashboard</p>
          <h1>Shop products</h1>
        </div>
        <input
          className="search"
          placeholder="Search toys, perfume..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id || "all"}
            className={category === tab.id ? "tab active" : "tab"}
            onClick={() => setCategory(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader" aria-label="Loading products" />
      ) : products.length === 0 ? (
        <p className="muted">No products in this category yet.</p>
      ) : (
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
