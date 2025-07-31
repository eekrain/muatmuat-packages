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

export const LokasiBongkar = ({ orderStatus, maxLocation }) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiBongkar = useSewaArmadaStore(
    (state) => state.formValues.lokasiBongkar
  );
  const errorLokasiBongkar = useSewaArmadaStore(
    (state) => state.formErrors?.lokasiBongkar
  );
  const { addLokasi, removeLokasi } = useSewaArmadaActions();

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
        <FormLabel required>Lokasi Bongkar</FormLabel>
        <TimelineField.Root
          maxLocation={maxLocation}
          variant="bongkar"
          className="flex-1"
          values={
            lokasiBongkar?.map((item) => item?.dataLokasi?.location || null) ||
            []
          }
          labelAddLocation="Tambah Lokasi Bongkar"
          onAddLocation={() =>
            handleFirstTime(() => addLokasi("lokasiBongkar", null))
          }
          onEditLocation={(index) => {
            if (
              !isEditPage ||
              !(isEditPage && orderType === "INSTANT" && index === 0)
            ) {
              handleFirstTime(() => {
                handleOpenModalLocation({
                  formMode: "bongkar",
                  allSelectedLocations: lokasiBongkar,
                  defaultValues: lokasiBongkar[index],
                  index,
                });
              });
            }
          }}
          errorMessage={errorLokasiBongkar}
        >
          {lokasiBongkar && lokasiBongkar.length > 0
            ? lokasiBongkar.map((item, index) => (
                <TimelineField.Item index={index} key={index}>
                  {!(isEditPage && index === 0) && lokasiBongkar.length > 1 && (
                    <TimelineField.RemoveButton
                      onClick={() => removeLokasi("lokasiBongkar", index)}
                    />
                  )}
                </TimelineField.Item>
              ))
            : null}
          {isEditPage &&
          !(
            orderType === "INSTANT" && lokasiBongkar?.length < maxLocation
          ) ? null : (
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
