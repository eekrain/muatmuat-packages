// 1. Import the requested icon
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { ChevronRight } from "lucide-react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

const SelectionField = ({ iconSrc, value, placeholder, onClick, disabled }) => (
  <button
    className={cn(
      "flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 px-3 py-2 transition-colors hover:bg-neutral-100",
      disabled
        ? "cursor-not-allowed bg-neutral-200"
        : "cursor-pointer bg-neutral-50"
    )}
    disabled={disabled}
    onClick={onClick}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    role="button"
    tabIndex={0}
  >
    <IconComponent
      src={iconSrc}
      className={cn(
        "h-4 w-4 shrink-0",
        disabled ? "text-neutral-600" : "text-neutral-700"
      )}
    />
    <span
      className={cn(
        "line-clamp-1 flex-1 self-start text-left text-sm font-semibold leading-[1.1]",
        value ? "text-neutral-900" : "text-neutral-600"
      )}
    >
      {value || placeholder}
    </span>
    <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" />
  </button>
);

export const JenisArmadaField = ({ carriers, trucks }) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const navigation = useResponsiveNavigation();

  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    cargoCategoryId,
    informasiMuatan,
    carrierId,
    truckTypeId,
    truckType,
  } = useSewaArmadaStore((state) => state.formValues);

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

  const isTruckTypeIdDisabled =
    !loadTimeStart ||
    (showRangeOption && !loadTimeEnd) ||
    !lokasiMuat ||
    !lokasiBongkar ||
    !cargoCategoryId ||
    informasiMuatan.length === 0 ||
    !carrierId;

  return (
    <FormContainer>
      <FormLabel required>Jenis Armada</FormLabel>
      <div className="space-y-2">
        <SelectionField
          disabled={isEditPage || informasiMuatan?.length === 0}
          iconSrc="/icons/truck-carrier.svg"
          value={selectedCarrier?.name}
          placeholder="Pilih Jenis Carrier"
          onClick={() => navigation.push("/JenisCarrier")}
        />
        <SelectionField
          disabled={isEditPage || isTruckTypeIdDisabled}
          iconSrc="/icons/truck-jenis.svg"
          value={isEditPage ? truckType?.name : selectedTruck?.name}
          placeholder="Pilih Jenis Truk"
          onClick={() => navigation.push("/JenisTruck")}
        />
      </div>
    </FormContainer>
  );
};
