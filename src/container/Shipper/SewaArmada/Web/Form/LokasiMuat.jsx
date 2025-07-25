import { usePathname } from "next/navigation";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import TimelineField from "@/components/Timeline/timeline-field";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiMuat = ({ orderStatus }) => {
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

  const hasNotDepartedToPickupStatuses = [
    OrderStatusEnum.PREPARE_FLEET,
    OrderStatusEnum.WAITING_PAYMENT_1,
    OrderStatusEnum.WAITING_PAYMENT_2,
    OrderStatusEnum.SCHEDULED_FLEET,
    OrderStatusEnum.CONFIRMED,
  ];
  const hasNotDepartedToPickup =
    hasNotDepartedToPickupStatuses.includes(orderStatus);
  const needValidateLocationChange =
    isEditPage && orderType === "SCHEDULED" && hasNotDepartedToPickup;

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
          {isEditPage && orderType === "SCHEDULED" ? null : (
            <TimelineField.AddButton />
          )}
        </TimelineField.Root>
      </FormContainer>

      <LocationModalFormWeb
        {...modalConfig}
        onOpenChange={handleCloseModalLocation}
        needValidateLocationChange={needValidateLocationChange}
      />
    </>
  );
};
