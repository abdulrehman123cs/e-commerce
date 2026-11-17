import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, categoryLabel } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useSeo } from "../hooks/useSeo.js";
import { gsap, popOnScroll, prefersReducedMotion, revealOnScroll, ScrollTrigger } from "../lib/gsap.js";

const TABS = [
  { id: "", label: "Shop all" },
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
  const pageRef = useRef(null);

  const seoPath = category ? `/shop?category=${category}` : "/shop";
  const seoTitle = category
    ? `${categoryLabel[category] || category} products`
    : "Shop all products";
  const seoDescription = category
    ? `Browse ${categoryLabel[category] || category} at Riaz Toye Center. Compare prices, check stock, and add favorites to your bag.`
    : "Shop all toys, perfume, and gift products at Riaz Toye Center. Filter by category and order online.";

  useSeo({
    title: seoTitle,
    description: seoDescription,
    path: seoPath,
    keywords: `Riaz Toye Center, ${category || "shop"}, toys, perfume, gifts`,
  });

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

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;
      revealOnScroll(".page-head, .tabs", {
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 90%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || !products.length) return;
    const root = pageRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      popOnScroll(".product-grid .card", {
        stagger: 0.09,
        scrollTrigger: { trigger: ".product-grid", start: "top 92%" },
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [loading, products]);

  const setCategory = (id) => {
    const next = new URLSearchParams(params);
    if (id) next.set("category", id);
    else next.delete("category");
    setParams(next);
  };

  return (
    <div className="page" ref={pageRef}>
      <div className="shell">
        <div className="page-head">
          <div>
            <p className="eyebrow">Riaz Toye Center</p>
            <h1>Shop all favorites</h1>
          </div>
          <label className="search-wrap">
            <span className="sr-only">Search</span>
            <input
              className="search"
              placeholder="Search toys, perfume..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
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
    </div>
  );
}
