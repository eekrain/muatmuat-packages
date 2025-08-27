import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";

import DeliveryEvidenceModal from "@/container/Shipper/SewaArmada/Web/Form/LayananTambahan/DeliveryEvidenceModal";

import {
  LocationProvider,
  useLocationContext,
} from "@/hooks/use-location/use-location";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const LayananTambahan = ({
  additionalServicesOptions,
  shippingDetails,
  shippingOption,
}) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const { t } = useTranslation();

  const additionalServices = useSewaArmadaStore(
    (s) => s.formValues.additionalServices
  );
  const shippingDetailsLocation = useSewaArmadaStore(
    (s) => s.formValues?.shippingDetailsLocation
  );
  const { setField: setSewaArmadaField } = useSewaArmadaActions();
  const { reset } = useLocationFormStore();
  const { setAutoCompleteSearchPhrase, setLocationPostalCodeSearchPhrase } =
    useLocationContext();

  return (
    <>
      <FormContainer>
        {/* Label Bagian */}
        <FormLabel optional variant="small">
          {t("LayananTambahan.title", {}, "Layanan Tambahan")}
        </FormLabel>

        {/* Container Opsi Layanan */}
        <div className="flex-grow-1 flex flex-col gap-y-3">
          {additionalServicesOptions?.map((service, key) => {
            const isSendDeliveryEvidenceService = service.withShipping;
            // Check if this service is already in the additionalServices array
            const isSelected = additionalServices.some(
              (selectedService) =>
                selectedService.serviceId === service.additionalServiceId
            );
            return (
              <Fragment key={key}>
                <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
                  {/* Container Checkbox dan Label */}
                  <div className="flex h-[16px] flex-row items-center gap-[4px]">
                    <Checkbox
                      disabled={isEditPage}
                      onChange={(e) =>
                        handleFirstTime(() => {
                          if (e.checked) {
                            // Open modal for specific service if needed
                            if (isSendDeliveryEvidenceService) {
                              setModalType("create");
                              setIsOpen(true);
                            } else {
                              // Add the service to the array if checked
                              setSewaArmadaField("additionalServices", [
                                ...additionalServices,
                                {
                                  serviceId: service.additionalServiceId,
                                  withShipping: service.withShipping,
                                },
                              ]);
                            }
                          } else {
                            // Remove the service from the array if unchecked
                            setSewaArmadaField(
                              "additionalServices",
                              additionalServices.filter(
                                (selectedService) =>
                                  selectedService.serviceId !==
                                  service.additionalServiceId
                              )
                            );
                          }
                        })
                      }
                      label={service.name}
                      checked={
                        isSelected || (isSendDeliveryEvidenceService && isOpen)
                      }
                      value={service.id}
                    />
                    <InfoTooltip side="right">
                      <p>{service.description}</p>
                    </InfoTooltip>
                  </div>

                  {/* Biaya Layanan */}
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {`Rp${
                      Number(service.price) === 0
                        ? isSelected && shippingDetails
                          ? (
                              Number(shippingOption?.originalCost) +
                              Number(
                                shippingDetails.withInsurance
                                  ? shippingOption?.originalInsurance
                                  : 0
                              )
                            ).toLocaleString("id-ID")
                          : "-"
                        : Number(service.price).toLocaleString("id-ID")
                    }`}
                  </span>
                </div>
                {isSendDeliveryEvidenceService &&
                isSelected &&
                shippingDetails ? (
                  <div
                    className={cn(
                      "ml-6 flex gap-x-2 rounded-md border p-3",
                      isEditPage
                        ? "border-neutral-600 bg-neutral-200"
                        : "border-primary-700 bg-primary-50"
                    )}
                  >
                    <IconComponent
                      className="icon-fill-muat-trans-secondary-900"
                      src="/icons/lokasi16.svg"
                    />
                    <div className="flex flex-1 flex-col gap-y-3 text-neutral-900">
                      <span className="text-xs font-bold leading-[14.4px]">
                        {shippingDetails.destinationAddress}
                      </span>
                      <p className="text-xs font-medium leading-[14.4px]">
                        {shippingDetails.detailAddress}
                      </p>
                      {/* 25. 18 - Web - LB - 0081 */}
                      <div className="flex flex-col gap-y-2">
                        {[
                          {
                            iconSrc: "/icons/profile16.svg",
                            label: t(
                              "LayananTambahan.recipientName",
                              {},
                              "Nama Penerima :"
                            ),
                            value: shippingDetails.recipientName,
                          },
                          {
                            iconSrc: "/icons/call16.svg",
                            label: t(
                              "LayananTambahan.recipientPhone",
                              {},
                              "Nomor Handphone Penerima : "
                            ),
                            value: shippingDetails.recipientPhone,
                          },
                          {
                            iconSrc: "/icons/transporter16.svg",
                            label: t(
                              "LayananTambahan.courierName",
                              {},
                              "Ekspedisi Pengiriman : "
                            ),
                            value: shippingOption?.courierName,
                          },
                        ].map((item, key) => (
                          <div className="flex items-center gap-x-2" key={key}>
                            <IconComponent
                              className="icon-fill-muat-trans-secondary-900"
                              src={item.iconSrc}
                            />
                            <div className="text-xs leading-[14.4px]">
                              <div className="font-medium">{item.label}</div>
                              <div className="font-semibold">{item.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-[54px]">
                      {isEditPage ? null : (
                        <button
                          className="flex items-center gap-x-2 self-start"
                          onClick={() => {
                            setAutoCompleteSearchPhrase(
                              shippingDetails.destinationAddress
                            );
                            setLocationPostalCodeSearchPhrase(
                              shippingDetails.postalCode
                            );
                            reset(shippingDetailsLocation);
                            setModalType("edit");
                            setIsOpen(true);
                          }}
                        >
                          <span className="text-xs font-medium leading-[14.4px] text-primary-700">
                            {t("LayananTambahan.editButton", {}, "Ubah")}
                          </span>
                          <IconComponent
                            className="icon-fill-primary-700"
                            src="/icons/edit16.svg"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </FormContainer>
      <DeliveryEvidenceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalType={modalType}
        additionalServicesOptions={additionalServicesOptions}
        shippingDetails={shippingDetails}
      />
    </>
  );
};

const LayananTambahanLocation = ({
  additionalServicesOptions,
  shippingDetails,
  shippingOption,
}) => {
  return (
    <LocationProvider>
      <LayananTambahan
        additionalServicesOptions={additionalServicesOptions}
        shippingDetails={shippingDetails}
        shippingOption={shippingOption}
      />
    </LocationProvider>
  );
};

export default LayananTambahanLocation;
