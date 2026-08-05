function getPageNumbers(currentPage, totalPages, siblingCount = 1) {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 siblings, 2 dots
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const pages = [1];

  if (showLeftDots) pages.push("...");

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }

  if (showRightDots) pages.push("...");

  if (totalPages !== 1) pages.push(totalPages);

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages, siblingCount);

  return (
    <div className="flex items-center gap-1">
      <button
        className="btn btn-ghost btn-sm text-sky-500 dark:text-slate-400"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-2 text-sky-400 text-sm select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`btn btn-ghost btn-sm ${
              page === currentPage
                ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold"
                : "text-sky-500 dark:text-slate-400"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        className="btn btn-ghost btn-sm text-sky-500 dark:text-slate-400"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
}

export default Pagination;
