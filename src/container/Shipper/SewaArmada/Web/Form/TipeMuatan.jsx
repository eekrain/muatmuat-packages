import { usePathname } from "next/navigation";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import RadioButton from "@/components/Radio/RadioButton";

import { useShallowMemo } from "@/hooks/use-shallow-memo";

import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const TipeMuatan = ({ cargoTypes }) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const cargoTypeId = useSewaArmadaStore(
    (state) => state.formValues.cargoTypeId
  );
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setField } = useSewaArmadaActions();

  // Generate tooltip content from cargo types descriptions
  const generateTooltipContent = useShallowMemo(() => {
    return (
      <>
        <ul>
          {cargoTypes.map((type) => (
            <li key={type.id}>
              <b>{type.name} :</b> {type.description}
            </li>
          ))}
        </ul>
        <p>
          Pemilihan tipe muatan yang tepat akan membantu dalam pengelolaan dan
          pengiriman.
        </p>
      </>
    );
  }, [cargoTypes]);

  return (
    <FormContainer className="flex gap-8">
      <FormLabel
        required
        tooltip={
          <InfoTooltip className="w-[336px]" side="right">
            {generateTooltipContent}
          </InfoTooltip>
        }
      >
        Tipe Muatan
      </FormLabel>
      <div className="flex flex-1 flex-col gap-y-3">
        <div className="flex flex-wrap gap-3">
          {cargoTypes.map((type) => (
            <div className="w-[250px]" key={type.id}>
              <RadioButton
                disabled={isEditPage}
                name="cargoTypeId"
                label={type.name}
                checked={cargoTypeId === type.id}
                onClick={({ value }) =>
                  handleFirstTime(() => setField("cargoTypeId", value))
                }
                value={type.id}
              />
            </div>
          ))}
        </div>
        {formErrors.cargoTypeId && (
          <span className="text-xs font-medium leading-[14.4px] text-error-400">
            Tipe Muatan wajib diisi
          </span>
        )}
      </div>
    </FormContainer>
  );
};
