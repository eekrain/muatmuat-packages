import { Bookmark, Clock } from "lucide-react";

export const RecentTransactionItem = ({
  location,
  onClick,
  withBookmark = null,
}) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-2 rounded p-1 text-left transition-colors hover:bg-neutral-200"
      onClick={onClick}
    >
      <div className="flex flex-1 items-center gap-2">
        <Clock className="h-6 w-6 text-neutral-700" />
        <span className="mt-1 flex-1 text-sm font-semibold text-neutral-700">
          {location.Title}
        </span>
      </div>

      {withBookmark && (
        <div
          onClick={withBookmark?.onClick}
          className="h-6 w-6 cursor-pointer hover:text-[#176CF7]"
        >
          <Bookmark className="h-6 w-6" />
        </div>
      )}
    </button>
  );
};
