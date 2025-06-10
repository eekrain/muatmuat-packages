import { FormContainer, FormLabel } from "@/components/Form/Form";
import TextArea from "@/components/TextArea/TextArea";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const DeskripsiMuatan = () => {
  const deskripsi = useSewaArmadaStore((state) => state.formValues.deskripsi);
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <FormLabel required>Deskripsi Muatan</FormLabel>
      <div className="flex flex-1 flex-col gap-2">
        <TextArea
          maxLength={500}
          hasCharCount
          supportiveText={{
            title: formErrors.deskripsi,
          }}
          resize="none"
          placeholder={
            "Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
          }
          value={deskripsi}
          onChange={(e) => setField("deskripsi", e.target.value)}
          status={formErrors.deskripsi ? "error" : ""}
        />
      </div>
    </FormContainer>
  );
};

export default DeskripsiMuatan;
