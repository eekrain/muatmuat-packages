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

export const JenisMuatan = () => {
  const cargoCategoryId = useSewaArmadaStore(
    (state) => state.formValues.cargoCategoryId
  );
  const { setField } = useSewaArmadaActions();

  // Fetch cargo categories using SWR
  const { data: cargoCategoriesResponse, error } = useSWRHook(
    "v1/orders/cargos/categories"
  );

  // Extract cargo categories from response
  const cargoCategories = cargoCategoriesResponse?.Data?.categories || [];
  const isLoading = !cargoCategoriesResponse && !error;

  // Set default value if cargoCategories is loaded and jenisMuatan is not set
  useEffect(() => {
    if (cargoCategories.length > 0 && !cargoCategoryId && !isLoading) {
      setField("cargoCategoryId", cargoCategories[0].id);
    }
  }, [cargoCategories, cargoCategoryId, isLoading, setField]);

  // Generate tooltip content from cargo categories descriptions
  const generateTooltipContent = () => {
    if (cargoCategories.length === 0) {
      return <p>Memuat informasi jenis muatan...</p>;
    }

    return (
      <>
        <ul>
          {cargoCategories.map((category) => (
            <li key={category.id}>
              <b>{category.name} :</b> {category.description}
            </li>
          ))}
        </ul>
        <p>
          Pemilihan jenis muatan yang tepat akan membantu dalam pengelolaan dan
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
