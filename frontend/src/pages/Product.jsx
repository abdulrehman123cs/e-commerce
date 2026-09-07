import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, categoryLabel, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function Product() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .product(id)
      .then(setProduct)
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="page muted">{error}</p>;
  if (!product) return (
    <div className="page">
      <div className="loader" aria-label="Loading product" />
    </div>
  );

  return (
    <div className="page product-page">
      <Link to="/shop" className="back">
        ← Back to shop
      </Link>
      <div className="product-layout">
        <div className="product-photo">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div className="placeholder tall">No photo</div>
          )}
        </div>
        <div>
          <span className="chip inline">{categoryLabel[product.category]}</span>
          <h1>{product.name}</h1>
          <p className="price big">{money(product.price)}</p>
          <p>{product.description}</p>
          <p className="stock">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
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
              className={added ? "btn added" : "btn"}
              disabled={product.stock < 1}
              onClick={() => {
                add(product, qty);
                setAdded(true);
                setTimeout(() => setAdded(false), 1200);
              }}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
