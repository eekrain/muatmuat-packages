import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import { TimelineField } from "@/components/Timeline/timeline-field";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiMuat = () => {
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiMuat = useSewaArmadaStore((state) => state.formValues.lokasiMuat);
  const errorLokasiMuat = useSewaArmadaStore(
    (state) => state.formErrors?.lokasiMuat
  );
  const { addLokasi, removeLokasi } = useSewaArmadaActions();

  return (
    <>
      <FormContainer>
        <FormLabel required>Lokasi Muat</FormLabel>

        <TimelineField
          variant="muat"
          className="flex-1"
          values={
            lokasiMuat?.map((item) => item?.dataLokasi?.location || null) || []
          }
          onAddLocation={() =>
            handleFirstTime(() => addLokasi("lokasiMuat", null))
          }
          onDeleteLocation={(index) => removeLokasi("lokasiMuat", index)}
          onEditLocation={(index) =>
            handleFirstTime(() => {
              handleOpenModalLocation({
                formMode: "muat",
                allSelectedLocations: lokasiMuat,
                defaultValues: lokasiMuat[index],
                index,
              });
            })
          }
          errorMessage={errorLokasiMuat}
        />
      </FormContainer>

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
      />
    </>
  );
};
