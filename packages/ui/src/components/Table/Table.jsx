import React, { useCallback, useEffect, useRef } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

/**
 * A reusable Table component with sorting, loading, and empty state support
 *
 * @component
 * @example
 * // Basic usage
 * <Table
 *   columns={[
 *     { key: 'name', header: 'Name', sortable: true },
 *     { key: 'email', header: 'Email', sortable: false }
 *   ]}
 *   data={[
 *     { name: 'John Doe', email: 'john@example.com' },
 *     { name: 'Jane Smith', email: 'jane@example.com' }
 *   ]}
 *   onSort={(columnKey) => handleSort(columnKey)}
 *   sortConfig={{ sort: 'name', order: 'asc' }}
 * />
 *
 * @param {Object} props - The component props
 * @param {Array<Column>} props.columns - Array of column configurations
 * @param {string} props.columns[].key - Unique identifier for the column, used for sorting and data access
 * @param {string} props.columns[].header - Display text for column header
 * @param {boolean} [props.columns[].sortable=true] - Whether this column can be sorted (default: true if key exists and onSort is provided)
 * @param {string} [props.columns[].width] - CSS width value for the column (e.g., "170px", "20%")
 * @param {string} [props.columns[].className] - Additional CSS classes for table cells in this column
 * @param {string} [props.columns[].headerClassName] - Additional CSS classes for the column header
 * @param {Function} [props.columns[].render] - Custom render function for cell content: (row, rowIndex) => ReactNode
 *
 * @param {Array<Object>} props.data - Array of data objects to display in the table
 *
 * @param {boolean} [props.loading=false] - Whether the table is in loading state
 *
 * @param {Function} [props.onRowClick] - Callback when a row is clicked: (row, rowIndex) => void
 *
 * @param {Function} [props.rowClassName] - Function to determine additional CSS classes for rows: (row, rowIndex) => string
 *
 * @param {Function} [props.onSort] - Callback when a sortable column header is clicked: (columnKey) => void
 *
 * @param {Object} [props.sortConfig] - Current sort configuration
 * @param {string|null} props.sortConfig.sort - Currently sorted column key
 * @param {'asc'|'desc'|null} props.sortConfig.order - Current sort direction
 *
 * @param {React.ReactNode} [props.loadingComponent] - Custom loading component to display during loading state
 *
 * @param {React.ReactNode} [props.emptyComponent] - Custom component to display when no data is available
 *
 * @param {Array<number>} [props.rowRecomendations=[]] - Array of row indices that should receive special styling (legacy prop)
 *
 * @param {boolean} [props.enableInfiniteScroll=false] - Enable infinite scroll functionality
 * @param {boolean} [props.isLoadingMore=false] - Whether more data is being loaded (for infinite scroll)
 * @param {boolean} [props.hasNextPage=false] - Whether there are more pages to load (for infinite scroll)
 * @param {Function} [props.loadMore] - Function to load more data when scrolling reaches threshold
 * @param {React.ReactNode} [props.loadingMoreComponent] - Custom component to display while loading more data
 * @param {React.ReactNode} [props.endOfResultsComponent] - Custom component to display when all data is loaded
 * @param {number} [props.scrollThreshold=0.8] - Scroll percentage threshold to trigger load more (0.8 = 80%)
 *
 * @returns {React.ReactElement} The rendered Table component
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
  rowClassName = null,
  onSort = null,
  sortConfig = { sort: null, order: null },
  loadingComponent = null,
  emptyComponent = null,
  rowRecomendations = [],
  // Infinite scroll props
  enableInfiniteScroll = false,
  isLoadingMore = false,
  hasNextPage = false,
  loadMore = null,
  loadingMoreComponent = null,
  endOfResultsComponent = null,
  scrollThreshold = 0.8,
}) => {
  const handleSort = (columnKey) => {
    if (!onSort) return;
    onSort(columnKey);
  };

  // Infinite scroll functionality
  const scrollContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (
      !enableInfiniteScroll ||
      !scrollContainerRef.current ||
      !hasNextPage ||
      isLoadingMore ||
      !loadMore
    )
      return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    // Load more when user scrolls past the threshold
    if (scrollPercentage > scrollThreshold) {
      loadMore();
    }
  }, [
    enableInfiniteScroll,
    hasNextPage,
    isLoadingMore,
    loadMore,
    scrollThreshold,
  ]);

  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, enableInfiniteScroll]);

  const renderLoading = () => {
    return (
      <tr>
        <td colSpan={columns.length} className="px-6 py-8 text-center">
          {loadingComponent ? (
            loadingComponent
          ) : (
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderEmpty = () => {
    // Check if emptyComponent is already a <tr> element
    if (React.isValidElement(emptyComponent) && emptyComponent.type === "tr") {
      return emptyComponent;
    }

    return (
      <tr>
        <td colSpan={columns.length} className="px-6 py-9">
          <div className="flex items-center justify-center">
            {emptyComponent ? (
              emptyComponent
            ) : (
              <div className="text-neutral-500">No data available</div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div
      ref={enableInfiniteScroll ? scrollContainerRef : null}
      className="h-full overflow-y-auto border-t border-neutral-400"
    >
      <table className="w-full table-auto bg-white">
        <thead className="sticky top-0 z-10 bg-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-300">
          <tr>
            {columns.map((column, index) => {
              const isSortable =
                column.sortable !== false && column.key && onSort;
              const isSorted = sortConfig.sort === column.key;

              return (
                <th
                  key={index}
                  className={cn(
                    "bg-white px-6 py-4 text-left text-xs font-bold text-neutral-600",
                    column.headerClassName
                  )}
                  style={column.width ? { width: column.width } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap">{column.header}</span>
                    {isSortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="cursor-pointer"
                      >
                        <IconComponent
                          src={
                            !isSorted
                              ? "/icons/default-sort.svg"
                              : sortConfig.order === "asc"
                                ? "/icons/asc-sort.svg"
                                : "/icons/desc-sort.svg"
                          }
                          height={13}
                          className={
                            !isSorted ? "text-neutral-400" : "text-primary-700"
                          }
                        />
                      </button>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading && data.length === 0
            ? renderLoading()
            : data.length === 0
              ? renderEmpty()
              : data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-neutral-200 hover:bg-neutral-50",
                      onRowClick && "cursor-pointer",
                      rowClassName?.(row, rowIndex)
                    )}
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn(
                          "text-xxs",
                          column.className,
                          !rowRecomendations.includes(rowIndex) && "px-6 py-4"
                        )}
                      >
                        {column.render
                          ? column.render(row, rowIndex)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
        </tbody>
      </table>

      {/* Infinite scroll indicators */}
      {enableInfiniteScroll && (
        <>
          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="flex items-center justify-center bg-white py-4">
              {loadingMoreComponent || (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary-700"></div>
                  <span className="text-sm text-gray-600">Loading more...</span>
                </div>
              )}
            </div>
          )}

          {/* End of results indicator */}
          {/* {!hasNextPage && data.length > 0 && !loading && (
            <div className="flex items-center justify-center bg-white py-4">
              {endOfResultsComponent || (
                <span className="text-sm text-gray-400">All data has been loaded</span>
              )}
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default Table;
