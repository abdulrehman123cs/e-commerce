import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabel, mediaUrl, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";
import { pulseBuy } from "../lib/gsap.js";

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const btnRef = useRef(null);

  const addToCart = (e) => {
    e.preventDefault();
    add(product);
    setAdded(true);
    pulseBuy(btnRef.current);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card" style={{ "--i": index }}>
      <Link to={`/product/${product.id}`} className="card-media">
        {product.image ? (
          <img
            src={mediaUrl(product.image)}
            alt={`${product.name} - ${categoryLabel[product.category] || product.category} at Riaz Toye Center`}
            width="400"
            height="320"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="placeholder" role="img" aria-label="No product photo">
            No photo
          </div>
        )}
      </Link>
      <div className="card-body">
        <p className="card-cat">{categoryLabel[product.category]}</p>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="card-meta">
          <p className="price">{money(product.price)}</p>
          <p className="stock">
            {product.stock > 0 ? `${product.stock} left` : "Sold out"}
          </p>
        </div>
        <button
          ref={btnRef}
          className={added ? "btn btn-buy added" : "btn btn-buy"}
          disabled={product.stock < 1}
          onClick={addToCart}
        >
          {added ? "Added ✓" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}
