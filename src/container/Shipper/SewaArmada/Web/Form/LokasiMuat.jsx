import { usePathname } from "next/navigation";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import TimelineField from "@/components/Timeline/timeline-field";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiMuat = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiMuat = useSewaArmadaStore((state) => state.formValues.lokasiMuat);
  const errorLokasiMuat = useSewaArmadaStore(
    (state) => state.formErrors?.lokasiMuat
  );
  const { addLokasi, removeLokasi, setField } = useSewaArmadaActions();

  const showRemoveButton =
    (lokasiMuat && lokasiMuat.length > 1) ||
    Boolean(lokasiMuat?.[0]?.dataLokasi?.location);

  return (
    <>
      <FormContainer>
        <FormLabel required>Lokasi Muat</FormLabel>

        <TimelineField.Root
          disabled={isEditPage && orderType === "INSTANT"}
          variant="muat"
          className="flex-1"
          values={
            lokasiMuat?.map((item) => item?.dataLokasi?.location || null) || []
          }
          labelAddLocation="Tambah Lokasi Muat"
          onAddLocation={() =>
            handleFirstTime(() => addLokasi("lokasiMuat", null))
          }
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
        >
          {lokasiMuat && lokasiMuat.length > 0
            ? lokasiMuat.map((item, index) => (
                <TimelineField.Item index={index} key={index}>
                  {!isEditPage && showRemoveButton && (
                    <TimelineField.RemoveButton
                      onClick={() => {
                        removeLokasi("lokasiMuat", index);
                        setField("truckTypeId", null);
                      }}
                    />
                  )}
                </TimelineField.Item>
              ))
            : null}
          {isEditPage ? null : <TimelineField.AddButton />}
        </TimelineField.Root>
      </FormContainer>

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
      />
    </>
  );
};
