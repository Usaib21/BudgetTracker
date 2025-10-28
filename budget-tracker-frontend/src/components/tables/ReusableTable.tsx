// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import Pagination from "@/components/tables/Pagination";

// interface Column<T> {
//   header: string;
//   accessor: keyof T | ((row: T) => React.ReactNode);
//   className?: string;
// }

// interface ReusableTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   itemsPerPage?: number;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// export default function ReusableTable<T>({
//   data,
//   columns,
//   currentPage,
//   totalPages,
//   onPageChange,
// }: ReusableTableProps<T>) {
//   return (

//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         <div className="min-w-[1102px]">
//           <Table>
//             {/* Table Header */}
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 {columns.map((column, index) => (
//                   <TableCell
//                     key={index}
//                     isHeader
//                     className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${column.className || ""}`}
//                   >
//                     {column.header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHeader>

//             {/* Table Body */}
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {data.map((row, rowIndex) => (
//                 <TableRow key={rowIndex}>
//                   {columns.map((column, colIndex) => (
//                     <TableCell
//                       key={colIndex}
//                       className={`px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 ${column.className || ""}`}
//                     >
//                       {typeof column.accessor === "function"
//                         ? column.accessor(row)
//                         : (row[column.accessor] as React.ReactNode)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {/* Pagination */}
//       <div className="p-4">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={onPageChange}
//         />
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table';
import Pagination from './Pagination';

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface ReusableTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    tableName?: string; // Table title
    filterSection?: React.ReactNode; // Filters / search area (kept as-is)
    emptyMessage?: string; // Simple customizable message
    emptyComponent?: React.ReactNode; // Full custom empty state component (overrides emptyMessage)
}

export default function ReusableTable<T>({
    data = [],
    columns,
    currentPage,
    totalPages,
    onPageChange,
    tableName,
    filterSection,
    emptyMessage = 'No Data Found',
    emptyComponent,
}: ReusableTableProps<T>) {
    const hasData = Array.isArray(data) && data.length > 0;
    return (
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Table Name */}
            {/* {tableName && (
        <div className="px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="text-base font-medium text-gray-800 dark:text-white/90">
            {tableName}
          </h2>
        </div>
      )} */}

            {filterSection && (
                <div className="sm:justify-left flex flex-col gap-2 bg-gray-200 p-2 sm:flex-row sm:items-center">
                    {filterSection}
                </div>
            )}

            <div className="max-w-full">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 bg-orange-500 font-extrabold text-white dark:border-white/[0.05]">
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell
                                    key={index}
                                    isHeader
                                    className={`text-theme-sm p-2 dark:text-gray-400 ${column.className || 'text-start'}`}
                                >
                                    {column.header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        // className={`px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 ${column.className || ""}`}
                                        className={`text-theme-sm p-2 text-gray-900 dark:text-gray-400 ${column.className || 'text-start'}`}
                                    >
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(row)
                                            : (row[column.accessor] as React.ReactNode)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {!hasData && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="p-4 text-left text-gray-500 dark:text-gray-400"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-200 p-2 dark:bg-white/5">
                {totalPages ? (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                ) : null}
            </div>
        </div>
    );
}
