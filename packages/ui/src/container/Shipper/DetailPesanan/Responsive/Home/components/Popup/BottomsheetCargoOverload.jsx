import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";

import { useTranslation } from "@/hooks/use-translation";

const BottomsheetCargoOverload = () => {
  const { t } = useTranslation();

  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button
          type="button"
          className="rounded text-left text-xs font-semibold leading-[1.1] text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
        >
          {t(
            "BottomsheetCargoOverload.buttonViewOverloadDetail",
            {},
            "Lihat Detail Overload Muatan"
          )}
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t(
              "BottomsheetCargoOverload.titleOverloadCost",
              {},
              "Biaya Overload Muatan"
            )}
          </BottomSheetTitle>
        </BottomSheetHeader>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default BottomsheetCargoOverload;
