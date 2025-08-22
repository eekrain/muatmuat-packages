import { useEffect } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";

const PendingUpdateConfirmation = () => {
  const { t } = useTranslation();

  useEffect(() => {
    toast.error(
      t(
        "PendingUpdateConfirmation.toastFleetWillBeReprepared",
        {},
        "Armada akan disiapkan ulang sesuai dengan perubahan yang dilakukan."
      )
    );
  }, [t]);
  return (
    <div className="flex w-full flex-col items-center justify-center bg-warning-50 px-4 py-6">
      <div className="flex flex-col items-center justify-center gap-3 self-stretch">
        {/* Icon */}
        <div className="relative h-[72px] w-[72px]">
          <IconComponent
            src="/icons/loader-truck/responsive-circle-spinner.svg"
            alt={t(
              "PendingUpdateConfirmation.altFleetPreparing",
              {},
              "Armada ditemukan"
            )}
            width={72}
            height={72}
            className="absolute animate-spin"
          />
          <IconComponent
            src="/icons/loader-truck/responsive-truck-icon.svg"
            alt={t(
              "PendingUpdateConfirmation.altFleetPreparing",
              {},
              "Armada ditemukan"
            )}
            width={36}
            height={36}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col items-center justify-center gap-3 self-stretch">
          <p className="w-[250px] text-center text-sm font-semibold leading-[1.1] text-neutral-900">
            {t(
              "PendingUpdateConfirmation.messageConfirmation",
              {},
              "Perubahan lokasi bongkar memerlukan waktu untuk konfirmasi."
            )}
          </p>
          <p className="text-center text-xs font-medium leading-[1.1] text-neutral-600">
            {t(
              "PendingUpdateConfirmation.messageThanks",
              {},
              "Terimakasih atas kesabaran kamu."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingUpdateConfirmation;
