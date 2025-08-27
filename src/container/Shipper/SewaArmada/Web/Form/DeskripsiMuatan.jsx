import { usePathname } from "next/navigation";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import TextArea from "@/components/TextArea/TextArea";

import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const DeskripsiMuatan = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const cargoDescription = useSewaArmadaStore(
    (state) => state.formValues.cargoDescription
  );
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <FormLabel required>Deskripsi Muatan</FormLabel>
      <div className="flex flex-1 flex-col gap-2">
        <TextArea
          disabled={isEditPage}
          name="cargoDescription"
          maxLength={500}
          hasCharCount
          supportiveText={{
            title: formErrors.cargoDescription,
          }}
          resize="none"
          placeholder={
            "Lengkapi deskripsi informasi muatan Anda dengan rincian spesifik terkait barang yang dikirim, seperti bahan, penggunaan, atau karakteristik unik lainnya."
          }
          value={cargoDescription}
          onChange={({ target: { name, value } }) =>
            handleFirstTime(() => setField(name, value))
          }
          status={formErrors.cargoDescription ? "error" : ""}
        />
      </div>
    </FormContainer>
  );
};

export default DeskripsiMuatan;
