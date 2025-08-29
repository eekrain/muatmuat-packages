import { usePathname } from "next/navigation";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import TimelineField from "@/components/Timeline/timeline-field";

import { JenisArmadaField } from "@/container/Shipper/SewaArmada/Responsive/Home/Form/JenisArmadaField";
import { JumlahArmada } from "@/container/Shipper/SewaArmada/Responsive/Home/Form/JumlahArmada";
import WaktuMuatBottomsheet from "@/container/Shipper/SewaArmada/Responsive/Home/Form/WaktuMuat";

import { useTranslation } from "@/hooks/use-translation";

import {
  OrderStatusEnum,
  OrderTypeEnum,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { useInformasiMuatanStore } from "@/store/Shipper/forms/informasiMuatanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const SewaArmadaForm = ({
  orderStatus,
  settingsTime,
  carriers,
  trucks,
  additionalServicesOptions,
  handleCheckLoggedIn,
  calculatedPrice,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const navigation = useResponsiveNavigation();
  const orderType = useSewaArmadaStore((state) => state.orderType);
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

  const hasNotDepartedToPickupStatuses = [
    OrderStatusEnum.PREPARE_FLEET,
    OrderStatusEnum.WAITING_PAYMENT_1,
    OrderStatusEnum.WAITING_PAYMENT_2,
    OrderStatusEnum.SCHEDULED_FLEET,
    OrderStatusEnum.CONFIRMED,
  ];
  const hasNotDepartedToPickup =
    hasNotDepartedToPickupStatuses.includes(orderStatus);
  const hasNotDepartedToDropoff = [
    ...hasNotDepartedToPickupStatuses,
    OrderStatusEnum.LOADING,
  ].includes(orderStatus);
  const needValidateLocationChange =
    isEditPage && orderType === "SCHEDULED" && hasNotDepartedToPickup;

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
      needValidateLocationChange,
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
              toast.error(
                t("SewaArmadaForm.messageErrorValidasiLokasi", {}, error)
              );
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
        <FormLabel required>
          {t("SewaArmadaForm.labelWaktuMuat", {}, "Waktu Muat")}
        </FormLabel>
        <WaktuMuatBottomsheet
          handleCheckLoggedIn={handleCheckLoggedIn}
          hasNotDepartedToPickup={hasNotDepartedToPickup}
        />
      </FormContainer>

      {/* Lokasi Muat Field */}
      <FormContainer>
        <FormLabel required>
          {t("SewaArmadaForm.labelLokasiMuat", {}, "Lokasi Muat")}
        </FormLabel>
        <TimelineField.Root
          disabled={
            isEditPage && !(orderType === "SCHEDULED" && hasNotDepartedToPickup)
          }
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
            if (
              !isEditPage ||
              (orderType === "SCHEDULED" && hasNotDepartedToPickup)
            ) {
              handleEditLokasi({ formMode: "muat", index });
            }
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
              className="text-sm leading-[1.1]"
              index={index}
              key={index}
              buttonRemove={
                !isEditPage &&
                showRemoveButton.muat && (
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiMuat", index)}
                  />
                )
              }
            />
          ))}
          {isEditPage ? null : <TimelineField.AddButton />}
        </TimelineField.Root>
      </FormContainer>

      {/* Lokasi Bongkar Field */}
      <FormContainer>
        <FormLabel required>
          {t("SewaArmadaForm.labelLokasiBongkar", {}, "Lokasi Bongkar")}
        </FormLabel>
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
              className="text-sm leading-[1.1]"
              index={index}
              key={index}
              buttonRemove={
                !(isEditPage && !hasNotDepartedToDropoff) &&
                showRemoveButton.bongkar && (
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiBongkar", index)}
                  />
                )
              }
            />
          ))}
          {isEditPage &&
          !(
            orderType === OrderTypeEnum.INSTANT &&
            formValues.lokasiBongkar?.length < settingsTime?.location.maxDropoff
          ) ? null : (
            <TimelineField.AddButton />
          )}
        </TimelineField.Root>
      </FormContainer>

      {/* Informasi Muatan Field */}
      <FormContainer>
        <FormLabel required>
          {t("SewaArmadaForm.labelInformasiMuatan", {}, "Informasi Muatan")}
        </FormLabel>
        <button
          className={cn(
            "flex h-8 w-full items-center justify-between gap-x-2 rounded-md border border-neutral-600 px-3",
            isEditPage
              ? "cursor-not-allowed bg-neutral-200"
              : "cursor-pointer bg-neutral-50"
          )}
          disabled={isEditPage}
          onClick={() => {
            if (!handleCheckLoggedIn()) return;
            handleEditInformasiMuatan();
          }}
        >
          <div className="flex items-center gap-x-2">
            <IconComponent src="/icons/muatan16.svg" />
            <span className="max-w-[256px] truncate text-sm font-semibold leading-[15.4px]">
              {formValues.informasiMuatan.length === 0 ? (
                <span className="text-neutral-600">
                  {t(
                    "SewaArmadaForm.placeholderMasukkanMuatan",
                    {},
                    "Masukkan Muatan"
                  )}
                </span>
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
            formValues.additionalServices.length === 0 || isEditPage ? null : (
              <button
                className="text-xs font-semibold leading-[1.1] text-primary-700"
                onClick={() => {
                  if (!handleCheckLoggedIn()) return;
                  handleEditLayananTambahan();
                }}
              >
                {t("SewaArmadaForm.buttonUbahLayanan", {}, "Ubah Layanan")}
              </button>
            )
          }
        >
          {t("SewaArmadaForm.labelLayananTambahan", {}, "Layanan Tambahan")}
        </FormLabel>
        {formValues.additionalServices.length === 0 ? (
          <button
            className={cn(
              "flex h-8 items-center justify-between rounded-md border border-neutral-600 px-3",
              isEditPage
                ? "cursor-not-allowed bg-neutral-200"
                : "cursor-pointer bg-neutral-50"
            )}
            disabled={isEditPage}
            onClick={() => {
              if (!handleCheckLoggedIn()) return;
              handleEditLayananTambahan();
            }}
          >
            <div className="flex items-center gap-x-2">
              <IconComponent src="/icons/layanan-tambahan.svg" />
              <span className="text-sm font-semibold leading-[15.4px] text-neutral-600">
                {t(
                  "SewaArmadaForm.buttonPilihLayananTambahan",
                  {},
                  "Pilih Layanan Tambahan"
                )}
              </span>
            </div>
            <IconComponent src="/icons/chevron-right.svg" />
          </button>
        ) : (
          <div
            className={cn(
              "flex flex-col gap-y-3 rounded-md border border-neutral-600 px-3 py-2",
              isEditPage ? "bg-neutral-200" : "bg-neutral-50"
            )}
          >
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
                    <div
                      className={cn(
                        "flex size-[16px] items-center justify-center rounded-[90px] border",
                        isEditPage ? "border-neutral-600" : "border-primary-700"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xxs font-bold leading-none",
                          isEditPage ? "text-neutral-600" : "text-primary-700"
                        )}
                      >
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
