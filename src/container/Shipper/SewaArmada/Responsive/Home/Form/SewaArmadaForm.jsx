import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import TimelineField from "@/components/Timeline/timeline-field";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useInformasiMuatanStore } from "@/store/Shipper/forms/informasiMuatanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { JenisArmadaField } from "./JenisArmadaField";
import { JumlahArmada } from "./JumlahArmada";
import WaktuMuatBottomsheet from "./WaktuMuat";

export const SewaArmadaForm = ({
  settingsTime,
  carriers,
  trucks,
  additionalServicesOptions,
  handleCheckLoggedIn,
  calculatedPrice,
}) => {
  const navigation = useResponsiveNavigation();
  const formValues = useSewaArmadaStore((state) => state.formValues);
  const { addLokasi, removeLokasi } = useSewaArmadaActions();

  console.log("💼 SewaArmadaForm - calculatedPrice:", calculatedPrice);
  console.log(
    "💼 SewaArmadaForm - additionalServices:",
    formValues.additionalServices
  );
  const { setField: setInformasiMuatanField } = useInformasiMuatanStore();
  const validateLokasiOnSelect = useLocationFormStore(
    (s) => s.validateLokasiOnSelect
  );

  const handleEditInformasiMuatan = () => {
    setInformasiMuatanField("cargoTypeId", formValues.cargoTypeId);
    setInformasiMuatanField("cargoCategoryId", formValues.cargoCategoryId);
    setInformasiMuatanField("isHalalLogistics", formValues.isHalalLogistics);
    if (formValues.informasiMuatan.length > 0) {
      setInformasiMuatanField("informasiMuatan", formValues.informasiMuatan);
    }
    navigation.push("/InformasiMuatan");
  };

  const handleEditLayananTambahan = () => {
    navigation.push("/LayananTambahan");
  };

  const handleEditLokasi = ({ formMode, index }) => {
    const field = {
      muat: "lokasiMuat",
      bongkar: "lokasiBongkar",
    };
    const defaultValues = formValues[field[formMode]][index];
    const params = {
      formMode,
      allSelectedLocations: formValues[field[formMode]],
      index,
    };

    const navigateToForm = async (defaultValues) => {
      navigation.push("/FormLokasiBongkarMuat", {
        config: {
          ...params,
          defaultValues,
        },
        layout: {
          title: formMode === "bongkar" ? "Lokasi Bongkar" : "Lokasi Muat",
        },
      });
    };

    if (defaultValues) {
      navigateToForm(defaultValues);
    } else {
      navigation.push("/PencarianLokasi", {
        config: {
          ...params,
          afterLocationSelected: async () => {
            // delay 500ms untuk menunggu data lokasi terisi
            await new Promise((resolve) => setTimeout(resolve, 500));
            const defaultValues = useLocationFormStore.getState().formValues;
            navigateToForm(defaultValues);
          },
          validateLokasiOnSelect: (selectedAddress) => {
            const error = validateLokasiOnSelect(
              formMode,
              index,
              selectedAddress
            );

            if (error) {
              toast.error(error);
              throw new Error(error);
            }
          },
        },
        layout: {
          title:
            formMode === "bongkar" ? "Cari Lokasi Bongkar" : "Cari Lokasi Muat",
        },
      });
    }
  };

  const showRemoveButton = {
    muat: formValues.lokasiMuat && formValues.lokasiMuat.length > 1,
    bongkar: formValues.lokasiBongkar && formValues.lokasiBongkar.length > 1,
  };

  return (
    <div className="flex flex-col gap-y-6 bg-white px-4 py-5">
      {/* Waktu Muat Field */}
      <FormContainer>
        <FormLabel required>Waktu Muat</FormLabel>
        <WaktuMuatBottomsheet handleCheckLoggedIn={handleCheckLoggedIn} />
      </FormContainer>

      {/* Lokasi Muat Field */}
      <FormContainer>
        <FormLabel required>Lokasi Muat</FormLabel>
        <TimelineField.Root
          maxLocation={settingsTime?.location.maxPickup}
          variant="muat"
          className="flex-1"
          values={
            formValues.lokasiMuat?.map(
              (item) => item?.dataLokasi?.location || null
            ) || []
          }
          onAddLocation={() => {
            if (!handleCheckLoggedIn()) return;
            addLokasi("lokasiMuat", null);
          }}
          onEditLocation={(index) => {
            if (!handleCheckLoggedIn()) return;
            handleEditLokasi({ formMode: "muat", index });
          }}
        >
          {(formValues.lokasiMuat || []).map((item, index) => (
            // <TimelineField.Item index={index} key={index}>
            //   {showRemoveButton.muat && (
            //     <TimelineField.RemoveButton
            //       onClick={() => removeLokasi("lokasiMuat", index)}
            //     />
            //   )}
            // </TimelineField.Item>

            <TimelineField.Item
              index={index}
              key={index}
              buttonRemove={
                showRemoveButton.muat && (
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiMuat", index)}
                  />
                )
              }
            />
          ))}
          <TimelineField.AddButton />
        </TimelineField.Root>
      </FormContainer>

      {/* Lokasi Bongkar Field */}
      <FormContainer>
        <FormLabel required>Lokasi Bongkar</FormLabel>
        <TimelineField.Root
          maxLocation={settingsTime?.location.maxDropoff}
          variant="bongkar"
          className="flex-1"
          values={
            formValues.lokasiBongkar?.map(
              (item) => item?.dataLokasi?.location || null
            ) || []
          }
          onAddLocation={() => {
            if (!handleCheckLoggedIn()) return;
            addLokasi("lokasiBongkar", null);
          }}
          onEditLocation={(index) => {
            if (!handleCheckLoggedIn()) return;
            handleEditLokasi({ formMode: "bongkar", index });
          }}
        >
          {(formValues.lokasiBongkar || []).map((item, index) => (
            <TimelineField.Item
              index={index}
              key={index}
              buttonRemove={
                showRemoveButton.bongkar && (
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiBongkar", index)}
                  />
                )
              }
            />
          ))}
          <TimelineField.AddButton />
        </TimelineField.Root>
      </FormContainer>

      {/* Informasi Muatan Field */}
      <FormContainer>
        <FormLabel required>Informasi Muatan</FormLabel>
        <button
          className={
            "flex h-8 w-full items-center justify-between gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
          }
          onClick={() => {
            if (!handleCheckLoggedIn()) return;
            handleEditInformasiMuatan();
          }}
        >
          <div className="flex items-center gap-x-2">
            <IconComponent src="/icons/muatan16.svg" />
            <span className="max-w-[256px] truncate text-sm font-semibold leading-[15.4px]">
              {formValues.informasiMuatan.length === 0 ? (
                <span className="text-neutral-600">Masukkan Muatan</span>
              ) : (
                <span className="text-neutral-900">
                  {formValues.informasiMuatan
                    .map((item) => item.namaMuatan.label)
                    .join(", ")}
                </span>
              )}
            </span>
          </div>
          <div className="size-[16px]">
            <IconComponent src="/icons/chevron-right.svg" />
          </div>
        </button>
      </FormContainer>

      {/* Jenis Armada Field */}
      <JenisArmadaField carriers={carriers} trucks={trucks} />
      <JumlahArmada />

      {/* Layanan Tambahan Field */}
      <FormContainer>
        <FormLabel
          className="justify-between"
          optional
          tooltip={
            formValues.additionalServices.length === 0 ? null : (
              <button
                className="text-xs font-semibold leading-[1.1] text-primary-700"
                onClick={() => {
                  if (!handleCheckLoggedIn()) return;
                  handleEditLayananTambahan();
                }}
              >
                Ubah Layanan
              </button>
            )
          }
        >
          Layanan Tambahan
        </FormLabel>
        {formValues.additionalServices.length === 0 ? (
          <button
            className={
              "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
            }
            onClick={() => {
              if (!handleCheckLoggedIn()) return;
              handleEditLayananTambahan();
            }}
          >
            <div className="flex items-center gap-x-2">
              <IconComponent src="/icons/layanan-tambahan.svg" />
              <span className="text-sm font-semibold leading-[15.4px] text-neutral-600">
                Pilih Layanan Tambahan
              </span>
            </div>
            <IconComponent src="/icons/chevron-right.svg" />
          </button>
        ) : (
          <div className="flex flex-col gap-y-3 rounded-md border border-neutral-600 px-3 py-2">
            {formValues.additionalServices.map((service, key) => {
              const currentService = additionalServicesOptions.find(
                (item) => item.additionalServiceId === service.serviceId
              );

              // Use calculatedPrice if available (like CreateOrderSummaryPanel.jsx)
              let cost = 0;
              let serviceName = currentService?.name || "Unknown Service";

              if (calculatedPrice?.additionalServiceFee?.length > 0) {
                // Find matching service from calculatedPrice by serviceId
                const calculatedService =
                  calculatedPrice.additionalServiceFee.find((item) => {
                    // Match by service name since API might not return serviceId
                    return item.name === currentService?.name;
                  });

                if (calculatedService) {
                  cost = calculatedService.totalCost;
                  serviceName = calculatedService.name;
                } else {
                  // Fallback to old logic
                  cost = service.withShipping
                    ? (service.shippingCost || 0) +
                      (service.shippingDetails?.withInsurance
                        ? service.shippingDetails?.insuranceCost || 0
                        : 0)
                    : currentService?.price;
                }
              } else {
                // Fallback to old logic when calculatedPrice not available
                cost = service.withShipping
                  ? (service.shippingCost || 0) +
                    (service.shippingDetails?.withInsurance
                      ? service.shippingDetails?.insuranceCost || 0
                      : 0)
                  : currentService?.price;
              }

              return (
                <div
                  className="flex items-center justify-between gap-x-2"
                  key={key}
                >
                  <div className="flex flex-1 items-center gap-x-2">
                    <div className="flex size-[16px] items-center justify-center rounded-[90px] border border-primary-700">
                      <span className="text-xxs font-bold leading-none text-primary-700">
                        {key + 1}
                      </span>
                    </div>
                    <div className="max-w-[176px] flex-1 truncate text-sm font-semibold leading-[1.1] text-neutral-900">
                      {serviceName}
                    </div>
                  </div>
                  <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                    {`Rp${cost ? cost.toLocaleString("id-ID") : 0}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </FormContainer>
    </div>
  );
};
