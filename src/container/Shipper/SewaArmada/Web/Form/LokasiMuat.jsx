import { usePathname } from "next/navigation";

import { differenceInCalendarDays } from "date-fns";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import { LocationModalFormWeb } from "@/components/LocationManagement/Web/LocationModalFormWeb/LocationModalFormWeb";
import TimelineField from "@/components/Timeline/timeline-field";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { handleFirstTime } from "@/lib/utils/form";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { useModalLocation } from "./use-modal-location";

export const LokasiMuat = ({ orderStatus, maxLocation }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  // 25. 18 - Web - LB - 0228
  const loadTimeStart = useSewaArmadaStore(
    (state) => state.formValues.loadTimeStart
  );
  const { modalConfig, handleOpenModalLocation, handleCloseModalLocation } =
    useModalLocation();
  const lokasiMuat = useSewaArmadaStore((state) => state.formValues.lokasiMuat);
  const errorLokasiMuat = useSewaArmadaStore(
    (state) => state.formErrors?.lokasiMuat
  );
  const { addLokasi, removeLokasi, setField } = useSewaArmadaActions();

  // 25. 18 - Web - LB - 0228
  const daysToLoadTime = useShallowMemo(() => {
    const startDate = new Date(loadTimeStart);
    const now = new Date();
    return differenceInCalendarDays(startDate, now);
  }, [loadTimeStart]);

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
        <FormLabel required>
          {t("LokasiMuat.title", {}, "Lokasi Muat")}
        </FormLabel>

        <TimelineField.Root
          maxLocation={maxLocation}
          disabled={
            // 25. 18 - Web - LB - 0228
            isEditPage && !(orderType === "SCHEDULED" && daysToLoadTime > 1)
          }
          variant="muat"
          className="flex-1"
          values={
            lokasiMuat?.map((item) => item?.dataLokasi?.location || null) || []
          }
          labelAddLocation={t(
            "LokasiMuat.addLocation",
            {},
            "Tambah Lokasi Muat"
          )}
          onAddLocation={() =>
            handleFirstTime(() => addLokasi("lokasiMuat", null))
          }
          onEditLocation={(index) => {
            if (
              !isEditPage ||
              // 25. 18 - Web - LB - 0228
              (orderType === "SCHEDULED" && daysToLoadTime > 1)
            ) {
              handleFirstTime(() => {
                handleOpenModalLocation({
                  formMode: "muat",
                  allSelectedLocations: lokasiMuat,
                  defaultValues: lokasiMuat[index],
                  index,
                });
              });
            }
          }}
          errorMessage={errorLokasiMuat}
        >
          {lokasiMuat && lokasiMuat.length > 0
            ? lokasiMuat.map((item, index) => (
                <TimelineField.Item
                  index={index}
                  key={index}
                  buttonRemove={
                    !isEditPage &&
                    lokasiMuat.length > 1 && (
                      <TimelineField.RemoveButton
                        onClick={() => {
                          removeLokasi("lokasiMuat", index);
                          if (!isEditPage) {
                            setField("truckTypeId", null);
                          }
                        }}
                      />
                    )
                  }
                />
              ))
            : null}
          {isEditPage ? null : <TimelineField.AddButton />}
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
