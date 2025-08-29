import IconComponent from "@/components/IconComponent/IconComponent";

export const SearchResultItem = ({
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
        <div className="mb-2 h-6 w-6">
          <IconComponent
            className=""
            src="/icons/marker-outline.svg"
            width={24}
            height={24}
          />
        </div>
        <span className="line-clamp-2 flex-1 text-sm font-semibold text-neutral-700">
          {location.Title}
        </span>
      </div>
      {withBookmark && (
        <div
          className="h-6 w-6 cursor-pointer hover:text-[#176CF7]"
          onClick={withBookmark?.onClick}
        >
          <IconComponent src="/icons/bookmark.svg" width={20} height={20} />
        </div>
      )}
    </button>
  );
};
