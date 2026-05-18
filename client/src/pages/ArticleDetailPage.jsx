import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getArticle,
  getArticleComments,
  createArticleComment,
} from "../api/articleApi";
import CommentBox from "../components/CommentBox";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await getArticle(id);
        setArticle(data);
      } catch (err) {
        alert(err.message);
      }
    }

    loadArticle();
  }, [id]);

  if (!article) return <main className="detail-page">로딩중...</main>;

  return (
    <main className="detail-page">
      <article className="article-detail">
        <h1>{article.title}</h1>
        <p>{article.content}</p>
        <span>{new Date(article.createdAt).toLocaleString("ko-KR")}</span>
      </article>

      <CommentBox
        loadComments={(params) => getArticleComments(id, params)}
        addComment={(content) => createArticleComment(id, content)}
      />
    </main>
  );
}
