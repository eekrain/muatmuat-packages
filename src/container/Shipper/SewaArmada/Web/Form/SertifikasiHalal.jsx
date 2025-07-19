import { usePathname } from "next/navigation";

import Checkbox from "@/components/Form/Checkbox";
import { FormContainer } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const SertifikasiHalal = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const isHalalLogistics = useSewaArmadaStore(
    (state) => state.formValues.isHalalLogistics
  );
  const { setField } = useSewaArmadaActions();
  return (
    <FormContainer className="flex gap-8">
      <div className="flex gap-2 text-sm font-semibold leading-[1.1] text-neutral-900 md:h-4 md:w-[174px] md:text-xs md:font-medium md:leading-[1.2] md:text-neutral-600">
        <div className="">
          <span> Sertifikasi Halal Logistik</span>
          <span className="block text-xxs md:text-xs md:font-medium md:italic md:text-neutral-500">
            (Opsional)
          </span>
        </div>

        <InfoTooltip className="w-[336px]" side="right">
          <p>
            Centang opsi ini jika pengiriman memerlukan pengelolaan rantai pasok
            yang memastikan produk tetap sesuai prinsip halal, mulai dari
            transportasi hingga penyimpanan
          </p>
        </InfoTooltip>
      </div>
      {/* Checkbox */}
      <Checkbox
        disabled={isEditPage}
        label="Centang opsi jika pengiriman memerlukan armada dengan sertifikat halal logistik"
        checked={isHalalLogistics}
        onChange={({ checked }) =>
          handleFirstTime(() => setField("isHalalLogistics", checked))
        }
      />
    </FormContainer>
  );
};

export default SertifikasiHalal;
