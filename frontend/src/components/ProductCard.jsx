import { useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabel, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="card" style={{ "--i": index }}>
      <Link to={`/product/${product.id}`} className="card-media">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder">No photo</div>
        )}
        <span className="chip">{categoryLabel[product.category] || product.category}</span>
      </Link>
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="price">{money(product.price)}</p>
        <p className="stock">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
        <div className="card-actions">
          <Link className="btn ghost" to={`/product/${product.id}`}>
            View
          </Link>
          <button
            className={added ? "btn added" : "btn"}
            disabled={product.stock < 1}
            onClick={addToCart}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
