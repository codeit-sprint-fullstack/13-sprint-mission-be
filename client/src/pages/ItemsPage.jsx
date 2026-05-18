import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../api/productApi";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";

export default function ItemsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchText);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        const result = await getProducts({ offset, limit, keyword });

        setProducts(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, keyword]);

  return (
    <main className="market-wrap">
      <section>
        <div className="sale-header">
          <h2 className="section-title">판매 중인 상품</h2>

          <div className="sale-controls">
            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="검색할 상품을 입력해주세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button
              className="btn-register"
              type="button"
              onClick={() => navigate("/registration")}
            >
              상품 등록하기
            </button>

            <select className="sort-select" value="recent" onChange={() => {}}>
              <option value="recent">최신 순</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">상품을 불러오는 중입니다...</div>
        ) : (
          <div className="sale-grid">
            {products.length > 0 ? (
              products.map((product) => <ProductCard key={product.id} product={product} />)
            ) : (
              <div className="empty-state">등록된 상품이 없습니다.</div>
            )}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </main>
  );
}
