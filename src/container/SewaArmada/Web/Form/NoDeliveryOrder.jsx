import { FormContainer, FormLabel } from "@/components/Form/Form";
import { TagInput } from "@/components/Form/TagInput";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const NoDeliveryOrder = () => {
  const noDO = useSewaArmadaStore((state) => state.formValues.noDO);
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <FormLabel>No. Delivery Order (DO)</FormLabel>
      <div className="flex-1">
        <TagInput
          tags={noDO}
          onTagsChange={(value) => setField("noDO", value)}
          placeholder="Masukkan No. Delivery Order (DO)"
        />
      </div>
    </FormContainer>
  );
};
