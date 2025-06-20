import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import { TimelineField } from "@/components/Timeline/timeline-field";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiBongkar = () => {
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiBongkar = useSewaArmadaStore(
    (state) => state.formValues.lokasiBongkar
  );
  const { addLokasi, removeLokasi } = useSewaArmadaActions();

  return (
    <>
      <FormContainer>
        <FormLabel required>Lokasi Bongkar</FormLabel>
        <TimelineField
          variant="bongkar"
          className="flex-1"
          values={
            lokasiBongkar?.map((item) => item?.dataLokasi?.location || null) ||
            []
          }
          onAddLocation={() =>
            handleFirstTime(() => addLokasi("lokasiBongkar", null))
          }
          onDeleteLocation={(index) => removeLokasi("lokasiBongkar", index)}
          onEditLocation={(index) =>
            handleFirstTime(() => {
              handleOpenModalLocation({
                formMode: "bongkar",
                allSelectedLocations: lokasiBongkar,
                defaultValues: lokasiBongkar[index],
                index,
              });
            })
          }
        />
      </FormContainer>

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
      />
    </>
  );
};
