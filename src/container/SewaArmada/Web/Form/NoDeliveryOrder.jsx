import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
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
        <Input
          type="text"
          placeholder="Masukkan No. Delivery Order (DO)"
          onChange={(e) => setField("noDO", e.target.value)}
          value={noDO}
        />
      </div>
    </FormContainer>
  );
};
