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
    <div className="flex w-full items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={cn(
            "rounded p-1",
            currentPage === 1
              ? "cursor-not-allowed text-neutral-400"
              : "text-neutral-700"
          )}
          aria-label="Previous page"
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
                  aria-label={`Go to page ${pageNumber}`}
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
            currentPage === totalPages
              ? "cursor-not-allowed text-neutral-400"
              : "text-neutral-700"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-neutral-600">
          {/* {t("labelTampilkanJumlahData")} */}
          Tampilkan Jumlah detail
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
              aria-label={`Show ${option} items per page`}
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
