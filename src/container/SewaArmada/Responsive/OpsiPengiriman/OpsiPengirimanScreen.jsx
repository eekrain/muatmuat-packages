import { Fragment } from "react";

import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useLayananTambahanStore } from "@/store/forms/layananTambahanStore";

const OpsiPengiriman = () => {
  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  const { setField } = useLayananTambahanStore();

  const handleSelectOpsiPengiriman = (opsiPengiriman) => {
    setField("opsiPegiriman", opsiPengiriman);
    navigation.pop();
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Opsi Pengiriman",
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        {params.shippingData.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="flex w-full flex-col gap-y-4 bg-neutral-50 p-4"
          >
            {/* Header Section - Category Title */}
            <h3 className="text-[14px] font-bold capitalize leading-[15.4px] text-neutral-900">
              {category.category}
            </h3>

            {/* Options Section */}
            {category.options.map((option, optionIndex) => (
              <Fragment key={optionIndex}>
                {/* Option Row */}
                <button
                  className={`flex w-full flex-col items-start gap-y-4 ${optionIndex < category.options.length - 1 ? "border-b border-b-neutral-400 pb-4" : ""}`}
                  onClick={() => handleSelectOpsiPengiriman(option)}
                >
                  <div
                    className={
                      "flex w-full flex-row items-center justify-between"
                    }
                  >
                    {/* Courier Info */}
                    <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                      {option.courier}
                    </span>

                    {/* Price Info */}
                    <span className="text-right text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                      {option.price}
                    </span>
                  </div>

                  {/* Estimation */}
                  <span className="text-[12px] font-medium leading-[13.2px] text-neutral-600">
                    {option.estimation}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </FormResponsiveLayout>
  );
};

export default OpsiPengiriman;
