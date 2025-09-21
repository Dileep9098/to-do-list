import React from "react";

function Pagination({ currentPage, setCurrentPage, totalPages, getPageNumbers }) {
  return (
    <div className="d-flex justify-content-center mt-4">
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
              Prev
            </button>
          </li>
          {getPageNumbers().map((num) => (
            <li key={num} className={`page-item ${currentPage === num ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(num)}>
                {num}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
