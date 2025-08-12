import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

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
        <td colSpan={columns.length} className="px-6 py-8 text-center">
          {emptyComponent ? (
            emptyComponent
          ) : (
            <div className="text-neutral-500">No data available</div>
          )}
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
