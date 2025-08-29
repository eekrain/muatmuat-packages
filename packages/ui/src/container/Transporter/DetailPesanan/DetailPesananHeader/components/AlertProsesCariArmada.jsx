import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

function AlertProsesCariArmada({
  fleetFound,
  fleetsNeedingReplacement = 1,
  foundCount = 0,
}) {
  const { t } = useTranslation();
  return (
    <div
      className={
        "mt-4 flex items-center gap-8 rounded-2xl bg-muat-trans-primary-50 px-8 py-4"
      }
    >
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
          {t("AlertProsesCariArmada.titleFleetSearchProcess")}
        </h3>
        <div className="">
          {fleetFound && fleetsNeedingReplacement > 1 && (
            <p className="text-sm font-medium leading-[16.8px] text-neutral-900">
              {t("AlertProsesCariArmada.messageFleetFound")}{" "}
              <span className="font-bold">
                {foundCount}/{fleetsNeedingReplacement}{" "}
                {t("AlertProsesCariArmada.unitFleet")}
              </span>
            </p>
          )}
          <p className="text-sm font-medium leading-[16.8px] text-neutral-900">
            {t("AlertProsesCariArmada.messageThankYou")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlertProsesCariArmada;
