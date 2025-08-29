import { CheckCircle, ChevronDown, XCircle } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";

const CardCollapsibleBubble = ({
  title,
  description,
  isLoading,
  hasData,
  buttonText,
  onButtonClick,
  collapsibleTitle,
  items = [],
  displayedItemCount = 7,
  onOverflowClick,
}) => {
  const displayedItems = items.slice(0, displayedItemCount);
  const overflowCount = items.length - displayedItemCount;
  const hasOverflow = overflowCount > 0;

  return (
    <div className="border-b border-neutral-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
            {isLoading ? (
              <span className="text-sm text-neutral-500">Memuat...</span>
            ) : hasData ? (
              <BadgeStatus variant="success" className="w-auto">
                <CheckCircle size={16} className="mr-2" />
                Data Tersimpan
              </BadgeStatus>
            ) : (
              <BadgeStatus variant="error" className="w-auto">
                <XCircle size={16} className="mr-2" />
                Belum Ada Data
              </BadgeStatus>
            )}
          </div>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <Button variant="muattrans-primary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        </div>
      </div>
      {hasData && items.length > 0 && (
        <div className="mt-4">
          <Collapsible defaultOpen={false}>
            {/* The wrapper now has a permanent border */}
            <div className="overflow-hidden rounded-lg border border-neutral-400">
              {/* The trigger no longer has a bottom border */}
              <CollapsibleTrigger className="!flex !w-full cursor-pointer !items-center !justify-between bg-[#F8F8FB] !px-4 !py-3 !text-left hover:no-underline">
                <span className="text-sm font-medium text-[#7B7B7B]">
                  {collapsibleTitle}
                </span>
                <ChevronDown
                  size={16}
                  className="text-neutral-600 transition-transform duration-200 data-[state=open]:rotate-180"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* The separator border is now at the top of the content */}
                <div className="border-t border-neutral-400 bg-white px-3 pb-3 pt-3">
                  <div className="flex flex-wrap items-center gap-1">
                    {displayedItems.map((item) => (
                      <TagBubble key={item.id} className="me-1 px-2">
                        {item.name}
                      </TagBubble>
                    ))}
                    {hasOverflow && (
                      <div className="cursor-pointer" onClick={onOverflowClick}>
                        <TagBubble className="!bg-primary-700 !text-white hover:!bg-white hover:!text-primary-700">
                          +{overflowCount}
                        </TagBubble>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default CardCollapsibleBubble;
