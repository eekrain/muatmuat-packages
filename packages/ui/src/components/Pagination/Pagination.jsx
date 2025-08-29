import { Fragment } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const buttonVariants = {
  muatparts: "bg-muat-parts-non-800 text-neutral-50",
  muatrans: "bg-muat-trans-primary-400 text-muat-trans-secondary-900",
};

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onPerPageChange,
  perPage = 10,
  variants,
  className,
  paginationCounter,
  showPerPageLabel = "Tampilkan Jumlah Data",
}) => {
  const perPageOptions = [10, 20, 40];
  const buttonClassname = buttonVariants[variants] || buttonVariants.muatrans;

  const { t } = useTranslation();
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    // If paginationCounter is true, show exactly 5 consecutive pages starting from current page
    if (paginationCounter) {
      const result = [];
      const maxVisible = 5;

      // Calculate start page to show 5 consecutive pages
      let startPage = currentPage;

      // Ensure we don't exceed total pages when showing 5 consecutive pages
      if (startPage + maxVisible - 1 > totalPages) {
        startPage = Math.max(1, totalPages - maxVisible + 1);
      }

      // Add the 5 consecutive pages
      for (
        let i = startPage;
        i < startPage + maxVisible && i <= totalPages;
        i++
      ) {
        result.push(i);
      }

      // Add dots and last page if there are more pages beyond our 5
      if (startPage + maxVisible - 1 < totalPages) {
        result.push("...");
        result.push(totalPages);
      }

      return result;
    }

    // Original logic for when paginationCounter is false
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        (currentPage - i >= 1 && currentPage - i <= delta) ||
        (i - currentPage >= 1 && i - currentPage <= delta)
      ) {
        range.push(i);
      } else if (i < currentPage && currentPage - i === delta + 1) {
        rangeWithDots.push("...");
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div
      className={cn("flex w-full items-center justify-between py-4", className)}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={cn(
            "rounded p-1",
            currentPage === 1 || totalPages === 1
              ? paginationCounter && totalPages > 1
                ? "cursor-not-allowed text-neutral-400"
                : "hidden cursor-not-allowed text-neutral-400"
              : "text-neutral-700"
          )}
          aria-label={t("Pagination.previousPage", {}, "Previous page")}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          {getPageNumbers().map((pageNumber, key) => (
            <Fragment key={key}>
              {pageNumber === "..." ? (
                <span className="px-2">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNumber)}
                  className={cn(
                    "flex size-[32px] items-center justify-center rounded-md text-sm font-bold leading-[14px]",
                    currentPage === pageNumber
                      ? buttonClassname
                      : "bg-none font-medium text-neutral-600"
                  )}
                  aria-label={t(
                    "Pagination.goToPage",
                    { pageNumber },
                    `Go to page ${pageNumber}`
                  )}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              )}
            </Fragment>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`rounded p-1 ${
            currentPage === totalPages || totalPages === 1
              ? paginationCounter && totalPages > 1
                ? "cursor-not-allowed text-neutral-400"
                : "hidden cursor-not-allowed text-neutral-400"
              : "text-neutral-700"
          }`}
          aria-label={t("Pagination.nextPage", {}, "Next page")}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-600">
          {t("Pagination.showPerPageLabel", {}, showPerPageLabel)}
        </span>
        <div className="flex gap-2">
          {perPageOptions.map((option) => (
            <button
              key={option}
              onClick={() => onPerPageChange(option)}
              className={cn(
                "flex size-[32px] items-center justify-center rounded-md text-sm font-bold leading-[14px]",
                perPage === option
                  ? buttonClassname
                  : "bg-none font-medium text-neutral-600"
              )}
              aria-label={t(
                "Pagination.showItemsPerPage",
                { count: option },
                `Show ${option} items per page`
              )}
              aria-pressed={perPage === option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
