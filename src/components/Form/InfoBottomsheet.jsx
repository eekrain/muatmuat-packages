import { cn } from "@/lib/utils";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "../Bottomsheet/Bottomsheet";
import IconComponent from "../IconComponent/IconComponent";

export const InfoBottomsheet = ({ className, title, children }) => {
  return (
    <BottomSheet>
      <BottomSheetTrigger className={cn("block size-4", className)}>
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>{title}</BottomSheetHeader>
        <div className="info-bottomsheet-content px-4 py-6 text-sm font-medium leading-[1.1]">
          {children}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
