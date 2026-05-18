import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createArticle, getArticles } from "../api/articleApi";
import Pagination from "../components/Pagination";

export default function ArticlesPage() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [form, setForm] = useState({ title: "", content: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  async function loadArticles() {
    const offset = (page - 1) * limit;
    const result = await getArticles({ offset, limit, keyword });
    setArticles(result.data || []);
    setTotalPages(result.pagination?.totalPages || 1);
  }

  useEffect(() => {
    loadArticles();
  }, [page, keyword]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title || !form.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const created = await createArticle(form);
    navigate(`/articles/${created.id}`);
  }

  return (
    <main className="market-wrap">
      <div className="sale-header">
        <h1 className="section-title">자유게시판</h1>

        <div className="search-box">
          <span>🔍</span>
          <input
            placeholder="검색어를 입력해주세요"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <form className="article-form" onSubmit={handleSubmit}>
        <input
          placeholder="제목"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="내용"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button className="btn-register" type="submit">
          게시글 등록
        </button>
      </form>

      <div className="article-list">
        {articles.map((article) => (
          <div
            className="article-card"
            key={article.id}
            onClick={() => navigate(`/articles/${article.id}`)}
          >
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <span>{new Date(article.createdAt).toLocaleString("ko-KR")}</span>
          </div>
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
    </main>
  );
}
