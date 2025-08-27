import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { NumberInput } from "@/components/Form/NumberInput";

import { useTranslation } from "@/hooks/use-translation";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const JumlahArmada = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { t } = useTranslation();
  // Get truckCount from the store
  const { truckCount, minTruckCount, truckTypeId, lokasiMuat, lokasiBongkar } =
    useSewaArmadaStore((state) => state.formValues);
  // Get the setter
  const { setField } = useSewaArmadaActions();

  const lokasiMuatCount = lokasiMuat.filter(Boolean).length;
  const lokasiBongkarCount = lokasiBongkar.filter(Boolean).length;
  const lokasiMuatTerbanyak = Math.max(lokasiMuatCount, lokasiBongkarCount);

  useEffect(() => {
    if (lokasiMuatTerbanyak > 1) {
      setField("truckCount", 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lokasiMuatTerbanyak]);

  if (orderType !== "SCHEDULED") {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <label
        htmlFor="jumlah-armada"
        className="block text-sm font-semibold leading-[1.1] text-neutral-900"
      >
        {t("SewaArmadaForm.labelJumlahArmada", {}, "Jumlah Armada")}*
      </label>
      <NumberInput
        id="jumlah-armada"
        disabled={!truckTypeId || lokasiMuatTerbanyak > 1 || isEditPage}
        value={truckCount}
        stepper={1}
        min={minTruckCount || 1}
        max={lokasiMuatTerbanyak > 1 ? 1 : undefined}
        defaultValue={minTruckCount || 1}
        onValueChange={(val) => setField("truckCount", val)}
        className="w-[110px]"
        hideStepper={false}
      />
    </div>
  );
};
