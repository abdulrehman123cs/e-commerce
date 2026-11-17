import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useSeo } from "../hooks/useSeo.js";
import { storeJsonLd } from "../seo.js";
import { gsap, popOnScroll, prefersReducedMotion, revealOnScroll, ScrollTrigger } from "../lib/gsap.js";

const CATEGORY_TILES = [
  { to: "/shop?category=toys", title: "Building Sets", tone: "mint", icon: "🧱" },
  { to: "/shop?category=toys", title: "Stuffed Toys", tone: "peach", icon: "🧸" },
  { to: "/shop?category=perfume", title: "Perfume", tone: "lilac", icon: "🌸" },
  { to: "/shop?category=toys", title: "Cars & Play", tone: "sky", icon: "🚗" },
  { to: "/shop?category=other", title: "Other Gifts", tone: "butter", icon: "🎁" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const pageRef = useRef(null);

  useSeo({
    title: "Toys, Perfume & Gifts",
    description:
      "Buy toys, perfume, and everyday gifts online from Riaz Toye Center. Browse bestsellers, shop by category, and order for home delivery.",
    path: "/",
    image: "/uploads/hero-toys.jpg",
    jsonLd: storeJsonLd(),
  });

  useEffect(() => {
    api
      .products()
      .then((list) => setProducts(list.slice(0, 8)))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      revealOnScroll(".hero-visual", {
        y: 24,
        scale: 0.98,
        duration: 1,
        scrollTrigger: { trigger: ".hero-stage", start: "top 95%" },
      });

      gsap.from(".hero-overlay > *", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        delay: 0.15,
        clearProps: "opacity,transform",
      });

      revealOnScroll(".section-categories .section-head", {
        scrollTrigger: { trigger: ".section-categories", start: "top 85%" },
      });

      popOnScroll(".tile", {
        scrollTrigger: { trigger: ".tile-grid", start: "top 88%" },
      });

      revealOnScroll(".section-products .section-head", {
        scrollTrigger: { trigger: ".section-products", start: "top 85%" },
      });

      revealOnScroll(".promise-band", {
        scrollTrigger: { trigger: ".promise-band", start: "top 90%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!products.length) return;
    const root = pageRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      popOnScroll(".product-grid .card", {
        stagger: 0.15,
        scrollTrigger: { trigger: ".product-grid", start: "top 90%" },
      });
      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [products]);

  return (
    <div className="page home-page" ref={pageRef}>
      <section className="hero-stage">
        <div className="hero-visual">
          <img
            className="hero-photo"
            src="/uploads/hero-toys.jpg"
            alt="Riaz Toye Center colorful toys, building blocks and plush gifts"
            width="1600"
            height="900"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-overlay">
            <span className="hero-pill">
              <i /> Thoughtful play, happy days
            </span>
            <h1>Big joy for little minds.</h1>
            <p>
              Beautiful, safe, and curiosity-sparking toys—picked for real play
              and made to be loved for years.
            </p>
            <Link className="btn btn-buy" to="/shop">
              Find their new favorite <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="shell">
        <section className="section section-categories">
          <div className="section-head center">
            <p className="eyebrow">Shop by category</p>
            <h2>Play starts here</h2>
          </div>
          <div className="tile-grid">
            {CATEGORY_TILES.map((tile) => (
              <Link key={tile.title} className={`tile ${tile.tone}`} to={tile.to}>
                <span className="tile-icon">{tile.icon}</span>
                <h3>{tile.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="section section-products">
          <div className="section-head">
            <div>
              <p className="eyebrow">Bestsellers</p>
              <h2>Picked for playtime</h2>
            </div>
            <Link className="text-link" to="/shop">
              Shop all →
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>

        <section className="promise-band">
          <div>
            <h2>Riaz Toye Center</h2>
            <p>
              Your neighborhood mart for toys, perfume, and thoughtful gifts —
              soft on kids, simple for parents.
            </p>
          </div>
          <Link className="btn btn-buy" to="/shop">
            Start shopping
          </Link>
        </section>
      </div>
    </div>
  );
}
