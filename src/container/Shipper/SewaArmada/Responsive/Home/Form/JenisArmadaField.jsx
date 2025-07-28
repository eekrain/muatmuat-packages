// 1. Import the requested icon
import { useMemo } from "react";

import { ChevronRight } from "lucide-react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

const SelectionField = ({ iconSrc, value, placeholder, onClick }) => (
  <div
    className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2 transition-colors hover:bg-neutral-100"
    onClick={onClick}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    role="button"
    tabIndex={0}
  >
    <IconComponent
      src={iconSrc}
      className="h-4 w-4 shrink-0 text-neutral-600"
    />
    <span
      className={cn(
        "line-clamp-1 flex-1 text-sm font-semibold",
        value ? "text-neutral-900" : "text-neutral-600"
      )}
    >
      {value || placeholder}
    </span>
    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" />
  </div>
);

export const JenisArmadaField = ({ carriers, trucks }) => {
  const navigation = useResponsiveNavigation();

  const carrierId = useSewaArmadaStore((s) => s.formValues?.carrierId);
  const truckTypeId = useSewaArmadaStore((s) => s.formValues?.truckTypeId);

  const selectedCarrier = useMemo(() => {
    if (!carriers || !carrierId) return null;
    const allCarriers = [
      ...(carriers.recommendedCarriers || []),
      ...(carriers.nonRecommendedCarriers || []),
    ];
    return allCarriers.find((c) => c.carrierId === carrierId);
  }, [carriers, carrierId]);

  const selectedTruck = useMemo(() => {
    if (!trucks || !truckTypeId) return null;
    const allTrucks = [
      ...(trucks.recommendedTrucks || []),
      ...(trucks.nonRecommendedTrucks || []),
    ];
    return allTrucks.find((t) => t.truckTypeId === truckTypeId);
  }, [trucks, truckTypeId]);

  return (
    <FormContainer>
      <FormLabel required>Jenis Armada</FormLabel>
      <div className="space-y-2">
        <SelectionField
          iconSrc="/icons/truck-carrier.svg"
          value={selectedCarrier?.name}
          placeholder="Pilih Jenis Carrier"
          onClick={() => navigation.push("/JenisCarrier")}
        />
        <SelectionField
          iconSrc="/icons/truck-jenis.svg"
          value={selectedTruck?.name}
          placeholder="Pilih Jenis Truk"
          onClick={() => navigation.push("/JenisTruck")}
        />
      </div>
    </FormContainer>
  );
};
