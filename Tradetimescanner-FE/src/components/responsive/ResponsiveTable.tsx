import React, { useState } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  priority?: 'high' | 'medium' | 'low'; // For responsive column hiding
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

export interface ResponsiveTableProps {
  columns: TableColumn[];
  data: any[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  mobileCardRender?: (row: any, index: number) => React.ReactNode;
}

type SortDirection = 'asc' | 'desc' | null;

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  onSort,
  onFilter,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  mobileCardRender,
}) => {
  const { isMobile, isTablet } = useResponsive();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (key: string) => {
    if (!onSort) return;

    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (sortKey === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortKey(key);
    setSortDirection(newDirection);
    onSort(key, newDirection);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-blue-500" />
      : <FaSortDown className="text-blue-500" />;
  };

  // Filter columns based on device type and priority
  const getVisibleColumns = () => {
    if (isMobile) {
      return columns.filter(col => col.priority === 'high');
    }
    if (isTablet) {
      return columns.filter(col => col.priority !== 'low');
    }
    return columns;
  };

  const visibleColumns = getVisibleColumns();

  // Mobile Card View
  if (isMobile && mobileCardRender) {
    return (
      <div className={`space-y-3 ${className}`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, index) => mobileCardRender(row, index))
        )}
      </div>
    );
  }

  // Mobile Default Card View (when no custom render provided)
  if (isMobile) {
    return (
      <div className={`space-y-3 ${className}`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              {visibleColumns.map((column) => (
                <div key={column.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-600">{column.label}:</span>
                  <span className="text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  }

  // Tablet and Desktop Table View
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Filter Toggle for Tablet/Desktop */}
      {onFilter && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <FaFilter />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      )}

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="px-6 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {visibleColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;