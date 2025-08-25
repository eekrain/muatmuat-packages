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
}) => {
  const handleSort = (columnKey) => {
    if (!onSort) return;
    onSort(columnKey);
  };

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
    <div className="h-full overflow-y-auto border-t border-neutral-400">
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
          {loading
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
    </div>
  );
};

export default Table;
