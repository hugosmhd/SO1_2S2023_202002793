import React, { useState } from 'react';

const PaginatedTable = ({ data, itemsPerPage, headers }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const pagesToDisplay = 5; // Cantidad de páginas a mostrar a la vez
    const totalPagesToDisplay = Math.min(pagesToDisplay, totalPages);
    const startPage = Math.floor((currentPage - 1) / pagesToDisplay) * pagesToDisplay + 1;

    for (let i = startPage; i < startPage + totalPagesToDisplay; i++) {
      if (i > totalPages) {
        break;
      }
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          <button className="page-link">{i}</button>
        </li>
      );
    }

    return pages;
  };

  const goToFirstPage = () => {
    handlePageChange(1);
  };

  const goToLastPage = () => {
    handlePageChange(totalPages);
  };

  const renderTableHeader = () => {
    return headers.map((header, index) => (
      <th key={index}>{header}</th>
    ));
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            {renderTableHeader()}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.nota_id}</td>
              <td>{item.carnet_alumno}</td>
              <td>{item.nombre_alumno}</td>
              <td>{item.curso_nombre}</td>
              <td>{item.nota}</td>
              <td>{item.semestre}</td>
              <td>{item.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={goToFirstPage}>
            Primera
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
            &laquo;
          </button>
        </li>
        {renderPagination()}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
            &raquo;
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={goToLastPage}>
            Última
          </button>
        </li>
      </ul>
    </div>
  );
};

export default PaginatedTable;