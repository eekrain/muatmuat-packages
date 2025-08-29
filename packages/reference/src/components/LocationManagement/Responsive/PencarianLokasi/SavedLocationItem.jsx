import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

export const SavedLocationItem = ({ location, onClick, withEdit = null }) => {
  return (
    <button
      onClick={() => onClick(location)}
      className="flex flex-col gap-2 text-left"
    >
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-6 w-6">
            <IconComponent
              className=""
              src="/icons/map-with-marker-outline.svg"
              width={24}
              height={24}
            />
          </div>
          <span className="mt-1 flex-1 text-sm font-semibold text-black">
            {location.Name}
          </span>
        </div>
        {withEdit && (
          <div
            onClick={withEdit?.onClick}
            className="h-6 w-6 cursor-pointer hover:text-[#176CF7]"
          >
            <IconComponent
              src="/icons/pencil-outline.svg"
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
      <div className={cn("pl-8", withEdit && "pr-8")}>
        <p className="line-clamp-2 text-xs font-semibold leading-tight text-neutral-700">
          {location.Address}
        </p>
      </div>
    </button>
  );
};
