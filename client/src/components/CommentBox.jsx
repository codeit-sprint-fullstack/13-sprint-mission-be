import { useEffect, useState } from "react";

export default function CommentBox({ loadComments, addComment }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  async function fetchComments() {
    const data = await loadComments();
    setComments(data.data || []);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    await addComment(content);
    setContent("");
    fetchComments();
  }

  return (
    <section className="comment-section">
      <h2>댓글</h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력해주세요"
        />
        <button type="submit">등록</button>
      </form>

      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment-card" key={comment.id}>
              <p>{comment.content}</p>
              <span>{new Date(comment.createdAt).toLocaleString("ko-KR")}</span>
            </div>
          ))
        ) : (
          <p className="empty-comment">아직 댓글이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
