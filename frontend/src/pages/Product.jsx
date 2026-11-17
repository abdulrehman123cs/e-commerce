import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, categoryLabel, mediaUrl, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { useSeo } from "../hooks/useSeo.js";
import { productJsonLd } from "../seo.js";
import { pulseBuy } from "../lib/gsap.js";

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const jsonLd = useMemo(() => productJsonLd(product), [product]);

  useSeo({
    title: product?.name || "Product",
    description:
      product?.description ||
      "View product details, price, and stock at Riaz Toye Center.",
    path: `/product/${id}`,
    image: product?.image || "/uploads/hero-toys.jpg",
    type: "product",
    keywords: product
      ? `${product.name}, ${categoryLabel[product.category] || product.category}, Riaz Toye Center`
      : "Riaz Toye Center product",
    jsonLd,
  });

  useEffect(() => {
    api
      .product(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="page muted">{error}</p>;
  if (!product) {
    return (
      <div className="page">
        <div className="loader" aria-label="Loading product" />
      </div>
    );
  }

  return (
    <div className="page product-page">
      <div className="shell">
        <Link to="/shop" className="back">
          ← Back to shop
        </Link>
        <div className="product-layout">
          <div className="product-photo">
            {product.image ? (
              <img
                src={mediaUrl(product.image)}
                alt={`${product.name} product photo from Riaz Toye Center`}
                width="800"
                height="800"
                fetchPriority="high"
              />
            ) : (
              <div className="placeholder tall" role="img" aria-label="No product photo">
                No photo
              </div>
            )}
          </div>
          <div className="product-info">
            <span className="chip inline">{categoryLabel[product.category]}</span>
            <h1>{product.name}</h1>
            <p className="price big">{money(product.price)}</p>
            <p className="lead">{product.description}</p>
            <p className="stock">
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </p>
            <div className="qty-row">
              <label>
                Qty
                <input
                  type="number"
                  min="1"
                  max={product.stock || 1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </label>
              <button
                ref={btnRef}
                className={added ? "btn btn-buy added" : "btn btn-buy"}
                disabled={product.stock < 1}
                onClick={() => {
                  add(product, qty);
                  setAdded(true);
                  pulseBuy(btnRef.current);
                  setTimeout(() => setAdded(false), 1200);
                }}
              >
                {added ? "Added ✓" : "Add to bag"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
