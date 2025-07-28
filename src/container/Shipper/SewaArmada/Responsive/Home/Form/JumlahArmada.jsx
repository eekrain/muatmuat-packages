import { useEffect } from "react";

import { NumberInput } from "@/components/Form/NumberInput";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const JumlahArmada = () => {
  const orderType = useSewaArmadaStore((state) => state.orderType);
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
    <div>
      <label
        htmlFor="jumlah-armada"
        className="mb-2 block text-sm font-medium text-neutral-700"
      >
        Jumlah Armada
      </label>
      <NumberInput
        id="jumlah-armada"
        disabled={!truckTypeId || lokasiMuatTerbanyak > 1}
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
