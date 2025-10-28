import React from 'react';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {


    // Determine the active color and hover color based on college name
    const activeColor = 'bg-brand-500';

    const hoverTextColor = 'hover:text-brand-500 dark:hover:text-brand-500'


    // Ensure pagesAroundCurrent doesn't exceed totalPages
    const pagesAroundCurrent = Array.from(
        { length: Math.min(3, totalPages) },
        (_, i) => i + Math.max(currentPage - 1, 1),
    ).filter((page) => page <= totalPages); // Filter out pages beyond totalPages

    return (
        <div className="flex items-center">
            {/* First Button */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`shadow-theme-xs mr-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] ${'hover:text-brand-500 dark:hover:text-brand-500 text-gray-700 dark:text-gray-400'
                    }`}
            >
                First
            </button>

            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`shadow-theme-xs mr-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] ${'hover:text-brand-500 dark:hover:text-brand-500 text-gray-700 dark:text-gray-400'}`}
            >
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {currentPage > 3 && <span className="px-2">...</span>}
                {pagesAroundCurrent.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-500/[0.08] ${currentPage === page
                                ? `${activeColor} text-white ${hoverTextColor}`
                                : `text-gray-700 dark:text-gray-400 ${hoverTextColor}`
                            }`}
                    >
                        {page}
                    </button>
                ))}
                {currentPage < totalPages - 2 && <span className="px-2">...</span>}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`shadow-theme-xs ml-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] ${'hover:text-brand-500 dark:hover:text-brand-500 text-gray-700 dark:text-gray-400'
                    }`}
            >
                Next
            </button>

            {/* Last Button */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`shadow-theme-xs ml-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-white/[0.03] ${'hover:text-brand-500 dark:hover:text-brand-500 text-gray-700 dark:text-gray-400'
                    }`}
            >
                Last
            </button>
        </div>
    );
};

export default Pagination;
