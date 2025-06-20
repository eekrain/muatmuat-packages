import { useEffect } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import RadioButton from "@/components/Radio/RadioButton";
import { useSWRHook } from "@/hooks/use-swr";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const TipeMuatan = () => {
  const tipeMuatan = useSewaArmadaStore((state) => state.formValues.tipeMuatan);
  const { setField } = useSewaArmadaActions();

  // Fetch cargo types using SWR
  const { data: cargoTypesResponse, error } = useSWRHook(
    "v1/orders/cargos/types"
  );

  // Extract cargo types from response
  const cargoTypes = cargoTypesResponse?.Data?.types || [];
  const isLoading = !cargoTypesResponse && !error;

  // Set default value if cargoTypes is loaded and tipeMuatan is not set
  useEffect(() => {
    if (cargoTypes.length > 0 && !tipeMuatan && !isLoading) {
      setField("tipeMuatan", cargoTypes[0].id);
    }
  }, [cargoTypes, tipeMuatan, isLoading, setField]);

  // Generate tooltip content from cargo types descriptions
  const generateTooltipContent = () => {
    if (cargoTypes.length === 0) {
      return <p>Memuat informasi tipe muatan...</p>;
    }

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
  };

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
        Tipe Muatan
      </FormLabel>
      <div className="flex flex-1 flex-wrap gap-3">
        {cargoTypes.map((type) => (
          <div className="w-[250px]" key={type.id}>
            <RadioButton
              name="tipeMuatan"
              label={type.name}
              checked={tipeMuatan === type.id}
              onClick={() =>
                handleFirstTime(() => setField("tipeMuatan", type.id))
              }
              value={type.id}
            />
          </div>
        ))}
      </div>
    </FormContainer>
  );
};
