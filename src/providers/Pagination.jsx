import React from 'react';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import { Button } from 'reactstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let end = Math.min(totalPages, start + maxPageButtons - 1);

    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          color={currentPage === i ? 'primary' : 'light'}
          className={`rounded-circle mx-1 ${
            currentPage === i ? 'fw-bold' : ''
          }`}
          style={{ width: '40px', height: '40px' }}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex align-items-center">
        <Button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          color="light"
          className="rounded-circle me-1"
          style={{ width: '40px', height: '40px' }}
        >
          <HiOutlineChevronDoubleLeft />
        </Button>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          color="light"
          className="rounded-circle me-1"
          style={{ width: '40px', height: '40px' }}
        >
          {/* <i className="bi bi-chevron-left"></i> */}
          <HiOutlineChevronLeft />
        </Button>
        {renderPageNumbers()}
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          color="light"
          className="rounded-circle ms-1"
          style={{ width: '40px', height: '40px' }}
        >
          <i className="bi bi-chevron-right"></i>
          <HiOutlineChevronRight />
        </Button>
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          color="light"
          className="rounded-circle ms-1"
          style={{ width: '40px', height: '40px' }}
        >
          <HiOutlineChevronDoubleRight />
        </Button>
      </div>
      <div className="text-muted mt-2">
        Página {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default Pagination;