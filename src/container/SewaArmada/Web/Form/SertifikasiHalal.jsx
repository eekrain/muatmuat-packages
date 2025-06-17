import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const SertifikasiHalal = () => {
  const sertifikasiHalal = useSewaArmadaStore(
    (state) => state.formValues.sertifikasiHalal
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
        checked={sertifikasiHalal}
        onChange={({ checked }) => setField("sertifikasiHalal", checked)}
      />
    </FormContainer>
  );
};

export default SertifikasiHalal;
