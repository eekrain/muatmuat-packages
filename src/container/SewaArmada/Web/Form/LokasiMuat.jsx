import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import { TimelineField } from "@/components/Timeline/timeline-field";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiMuat = () => {
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiMuat = useSewaArmadaStore((state) => state.formValues.lokasiMuat);
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
          onAddLocation={() => addLokasi("lokasiMuat", null)}
          onDeleteLocation={(index) => removeLokasi("lokasiMuat", index)}
          onEditLocation={(index) => {
            handleOpenModalLocation({
              formMode: "muat",
              allSelectedLocations: lokasiMuat,
              defaultValues: lokasiMuat[index],
              index,
            });
          }}
        />
      </FormContainer>

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
      />
    </>
  );
};
