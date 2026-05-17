import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getProduct,
  getProductComments,
  createProductComment,
} from "../api/productApi";
import CommentBox from "../components/CommentBox";

const DEFAULT_IMAGE = "https://placehold.co/500x500/f0f0f0/999?text=No+Image";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (err) {
        alert(err.message);
      }
    }

    loadProduct();
  }, [id]);

  if (!product) return <main className="detail-page">로딩중...</main>;

  return (
    <main className="detail-page">
      <div className="detail-card">
        <img src={product.imageUrl || DEFAULT_IMAGE} alt={product.name} />

        <div>
          <h1>{product.name}</h1>
          <strong>{(product.price || 0).toLocaleString("ko-KR")}원</strong>
          <p>{product.description}</p>

          <div className="tag-list">
            {(product.tags || []).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <CommentBox
        loadComments={(params) => getProductComments(id, params)}
        addComment={(content) => createProductComment(id, content)}
      />
    </main>
  );
}
