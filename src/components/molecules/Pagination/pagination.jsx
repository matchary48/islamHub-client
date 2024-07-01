import React from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2  text-black rounded  cursor-pointer disabled:cursor-not-allowed"
      >
        <BsChevronLeft size={30} />
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2  text-black rounded disabled:cursor-not-allowed cursor-pointer"
      >
        <BsChevronRight size={30} />
      </button>
    </div>
  );
};

export default Pagination;
