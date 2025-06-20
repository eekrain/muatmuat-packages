import { FormContainer, FormLabel } from "@/components/Form/Form";
import { TagInput } from "@/components/Form/TagInput";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const NoDeliveryOrder = () => {
  const deliveryOrderNumbers = useSewaArmadaStore(
    (state) => state.formValues.deliveryOrderNumbers
  );
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      <FormLabel>No. Delivery Order (DO)</FormLabel>
      <div className="flex-1">
        <TagInput
          tags={deliveryOrderNumbers}
          onTagsChange={(value) =>
            handleFirstTime(() => setField("deliveryOrderNumbers", value))
          }
          placeholder="Masukkan No. Delivery Order (DO)"
        />
      </div>
    </FormContainer>
  );
};
