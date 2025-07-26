import { useMemo } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

export const JenisArmadaField = ({ carriers, trucks }) => {
  const navigation = useResponsiveNavigation();

  const carrierId = useSewaArmadaStore((s) => s.formValues?.carrierId);
  const selectedCarrier = useMemo(() => {
    if (!carriers) return null;
    const mergedCarriers = [
      ...carriers?.recommendedCarriers,
      ...carriers?.nonRecommendedCarriers,
    ];

    return mergedCarriers?.find((carrier) => carrier.carrierId === carrierId);
  }, [carriers, carrierId]);

  const truckTypeId = useSewaArmadaStore((s) => s.formValues?.truckTypeId);
  const selectedTruck = useMemo(() => {
    if (!trucks) return null;
    const mergedTrucks = [
      ...trucks.recommendedTrucks,
      ...trucks.nonRecommendedTrucks,
    ];
    return mergedTrucks.find((truck) => truck.truckTypeId === truckTypeId);
  }, [trucks, truckTypeId]);

  return (
    <FormContainer>
      <FormLabel required>Jenis Armada</FormLabel>
      <div className="space-y-2">
        {/* Pilih Jenis Carrier */}
        <div
          className={cn(
            "flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2"
          )}
          onClick={() => navigation.push("/JenisCarrier")}
        >
          <IconComponent
            src="/icons/truck-carrier.svg"
            className="h-4 w-4 text-neutral-600"
          />
          <span
            className={cn(
              "line-clamp-1 flex-1 text-sm font-semibold text-neutral-600",
              selectedCarrier && "text-neutral-900"
            )}
          >
            {selectedCarrier?.name || "Pilih Jenis Carrier"}
          </span>
          <svg
            className="h-4 w-4 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Pilih Jenis Truk */}
        <div
          onClick={() => navigation.push("/JenisTruck")}
          className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2"
        >
          <IconComponent
            src="/icons/truck-jenis.svg"
            className="h-4 w-4 text-neutral-600"
          />
          <span
            className={cn(
              "line-clamp-1 flex-1 text-sm font-semibold text-neutral-600",
              selectedTruck && "text-neutral-900"
            )}
          >
            {selectedTruck?.name || "Pilih Jenis Truk"}
          </span>
          <svg
            className="h-4 w-4 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </FormContainer>
  );
};
