import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE = "https://placehold.co/300x300/f0f0f0/999?text=No+Image";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const price = (product.price || 0).toLocaleString("ko-KR") + "원";

  return (
    <div className="product-card" onClick={() => navigate(`/items/${product.id}`)}>
      <img
        className="product-card-img"
        src={product.imageUrl || DEFAULT_IMAGE}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_IMAGE;
        }}
      />
      <div className="product-card-body">
        <p className="product-card-name">{product.name}</p>
        <p className="product-card-price">{price}</p>
      </div>
    </div>
  );
}
