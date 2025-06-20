import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const SertifikasiHalal = () => {
  const isHalalLogistics = useSewaArmadaStore(
    (state) => state.formValues.isHalalLogistics
  );
  const { setField } = useSewaArmadaActions();
  return (
    <FormContainer className="flex gap-8">
      <FormLabel
        variant="small"
        tooltip={
          <InfoTooltip className="w-[336px]" side="right">
            <p>
              Centang opsi ini jika pengiriman memerlukan pengelolaan rantai
              pasok yang memastikan produk tetap sesuai prinsip halal, mulai
              dari transportasi hingga penyimpanan
            </p>
          </InfoTooltip>
        }
      >
        Sertifikasi Halal Logistik
      </FormLabel>
      {/* Checkbox */}
      <Checkbox
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
