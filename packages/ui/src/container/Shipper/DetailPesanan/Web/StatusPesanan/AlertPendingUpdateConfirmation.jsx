import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

export const AlertPendingUpdateConfirmation = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-8 rounded-2xl bg-muat-trans-primary-50 px-8 py-4">
      <div className="relative size-[72px]">
        <IconComponent
          src={"/icons/loader-truck/desktop-circle-spinner.svg"}
          width={72}
          height={72}
          className="absolute left-0 top-0 animate-spin"
        />
        <IconComponent
          src={"/icons/loader-truck/desktop-truck-icon.svg"}
          width={32}
          height={32}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex flex-col gap-y-3">
        <h3 className="text-lg font-semibold leading-[21.6px] text-neutral-900">
          {t(
            "AlertPendingUpdateConfirmation.titleLocationChangeConfirmation",
            {},
            "Perubahan lokasi bongkar memerlukan waktu untuk konfirmasi."
          )}
        </h3>
        <p className="text-sm font-medium leading-[16.8px] text-neutral-900">
          {t(
            "AlertPendingUpdateConfirmation.messageThankYouPatience",
            {},
            "Terima kasih atas kesabaran kamu."
          )}
        </p>
      </div>
    </div>
  );
};
