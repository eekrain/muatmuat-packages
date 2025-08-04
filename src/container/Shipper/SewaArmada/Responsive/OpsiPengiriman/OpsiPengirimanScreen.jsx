import { Fragment } from "react";

import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { idrFormat } from "@/lib/utils/formatters";
import { useLayananTambahanStore } from "@/store/Shipper/forms/layananTambahanStore";

const OpsiPengiriman = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { setField } = useLayananTambahanStore();
  const { t } = useTranslation();

  const handleSelectOpsiPengiriman = (opsiPengiriman) => {
    setField("opsiPegiriman", opsiPengiriman);
    navigation.pop();
  };

  return (
    <FormResponsiveLayout
      title={{
        label: t("titleOpsiPengiriman") /* Opsi Pengiriman */,
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        {params.shippingOptions.map((category, key) => (
          <div
            key={key}
            className="flex w-full flex-col gap-y-6 bg-neutral-50 p-4"
          >
            {/* Header Section - Category Title */}
            <h3 className="text-sm font-bold capitalize leading-[15.4px] text-neutral-900">
              {
                t(
                  `category${category.groupName.replace(/ /g, "")}`
                ) /* Category Title */
              }
            </h3>

            {/* Options Section */}
            <div className="flex flex-col gap-y-4">
              {category.expeditions.map((option, key) => (
                <Fragment key={key}>
                  {/* Option Row */}
                  <button
                    className={`flex w-full flex-col items-start gap-y-4 ${key < category.expeditions.length - 1 ? "border-b border-b-neutral-400 pb-4" : ""}`}
                    onClick={() => handleSelectOpsiPengiriman(option)}
                  >
                    <div className="flex w-full flex-row items-center justify-between">
                      {/* Courier Info */}
                      <span className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                        {option.courierName}
                      </span>

                      {/* Price Info */}
                      <span className="text-right text-sm font-semibold leading-[15.4px] text-neutral-900">
                        {idrFormat(option.originalCost)}
                      </span>
                    </div>
                    {/* 25. 18 - Web - LB - 0117 */}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FormResponsiveLayout>
  );
};

export default OpsiPengiriman;
