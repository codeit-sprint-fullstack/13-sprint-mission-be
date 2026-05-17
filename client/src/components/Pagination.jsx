export default function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="page-btn"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "page-btn active" : "page-btn"}
          type="button"
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </button>
    </div>
  );
}
