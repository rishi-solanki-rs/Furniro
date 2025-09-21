import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="pagination">
        {/* Previous Button */}
        <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
        >
            Prev
        </button>

        {/* Page Number Buttons */}
        {[...Array(totalPages).keys()].map(n => (
            <button 
                key={n + 1} 
                onClick={() => onPageChange(n + 1)} 
                className={currentPage === n + 1 ? 'active' : ''}
            >
                {n + 1}
            </button>
        ))}

        {/* Next Button */}
        <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
        >
            Next
        </button>
    </div>
);

export default Pagination;