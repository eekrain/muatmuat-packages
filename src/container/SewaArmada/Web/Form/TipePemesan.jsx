import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const TipePemesan = () => {
  const isCompany = useSewaArmadaStore((state) => state.formValues.isCompany);
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <FormLabel variant="small">Tipe Pemesan</FormLabel>
      <div className="flex h-[16px] flex-row items-center gap-[4px]">
        <Checkbox
          onChange={(e) => setField("isCompany", e.checked)}
          label="Centang jika kamu adalah suatu perusahaan/badan usaha"
          checked={isCompany}
          value="is_company"
        />
        <IconComponent src="/icons/info16.svg" width={16} height={16} />
      </div>
    </FormContainer>
  );
};
