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

export const LokasiBongkar = ({ orderStatus }) => {
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

  const showRemoveButton =
    (lokasiBongkar && lokasiBongkar.length > 1) ||
    Boolean(lokasiBongkar?.[0]?.dataLokasi?.location);

  return (
    <>
      <FormContainer>
        <FormLabel required>Lokasi Bongkar</FormLabel>
        <TimelineField.Root
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
          errorMessage={errorLokasiBongkar}
        >
          {lokasiBongkar && lokasiBongkar.length > 0
            ? lokasiBongkar.map((item, index) => (
                <TimelineField.Item index={index} key={index}>
                  {!isEditPage && showRemoveButton && (
                    <TimelineField.RemoveButton
                      onClick={() => removeLokasi("lokasiBongkar", index)}
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
      />
    </>
  );
};
