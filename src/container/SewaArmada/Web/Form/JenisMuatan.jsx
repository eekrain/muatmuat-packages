import { useEffect } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import RadioButton from "@/components/Radio/RadioButton";
import { useSWRHook } from "@/hooks/use-swr";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const JenisMuatan = () => {
  const jenisMuatan = useSewaArmadaStore(
    (state) => state.formValues.jenisMuatan
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
    if (cargoCategories.length > 0 && !jenisMuatan && !isLoading) {
      setField("jenisMuatan", cargoCategories[0].id);
    }
  }, [cargoCategories, jenisMuatan, isLoading, setField]);

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
        {isLoading ? (
          <div className="flex w-full items-center justify-center">
            <span>Memuat data...</span>
          </div>
        ) : error ? (
          <div className="flex w-full items-center justify-center text-error-400">
            <span>Gagal memuat data. Silakan coba lagi.</span>
          </div>
        ) : (
          cargoCategories.map((category) => (
            <div className="w-[250px]" key={category.id}>
              <RadioButton
                name="jenisMuatan"
                label={category.name}
                checked={jenisMuatan === category.id}
                onClick={() => setField("jenisMuatan", category.id)}
                value={category.id}
              />
            </div>
          ))
        )}
      </div>
    </FormContainer>
  );
};
