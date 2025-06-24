import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import RadioButton from "@/components/Radio/RadioButton";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const JenisMuatan = ({ cargoCategories }) => {
  const cargoCategoryId = useSewaArmadaStore(
    (state) => state.formValues.cargoCategoryId
  );
  const { setField } = useSewaArmadaActions();

  // Generate tooltip content from cargo categories descriptions
  const generateTooltipContent = useShallowMemo(
    () => (
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
    ),
    [cargoTypes]
  );

  return (
    <FormContainer className="flex gap-8">
      <FormLabel
        required
        tooltip={
          <InfoTooltip className="w-[336px]" side="right">
            {generateTooltipContent()}
          </InfoTooltip>
        }
      >
        Jenis Muatan
      </FormLabel>
      <div className="flex flex-1 flex-wrap gap-3">
        {cargoCategories.map((category) => (
          <div className="w-[250px]" key={category.id}>
            <RadioButton
              name="cargoCategoryId"
              label={category.name}
              checked={cargoCategoryId === category.id}
              onClick={({ value }) =>
                handleFirstTime(() => setField("cargoCategoryId", value))
              }
              value={category.id}
            />
          </div>
        ))}
      </div>
    </FormContainer>
  );
};
