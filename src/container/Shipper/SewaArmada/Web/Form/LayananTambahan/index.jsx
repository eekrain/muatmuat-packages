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
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

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
          Layanan Tambahan
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
                  <span className="leading-[14.4px] text-xs font-medium text-neutral-900">
                    {`Rp${
                      Number(service.price) === 0
                        ? isSelected && shippingDetails
                          ? (
                              Number(shippingOption?.originalCost) +
                              Number(
                                shippingDetails.withInsurance
                                  ? shippingOption.originalInsurance
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
                  <div className="ml-6 flex gap-x-2 rounded-md border border-primary-700 bg-primary-50 p-3">
                    <IconComponent
                      className="icon-fill-muat-trans-secondary-900"
                      src="/icons/lokasi16.svg"
                    />
                    <div className="flex flex-1 flex-col gap-y-3 text-neutral-900">
                      <span className="leading-[14.4px] text-xs font-bold">
                        {shippingDetails.destinationAddress}
                      </span>
                      <p className="leading-[14.4px] text-xs font-medium">
                        {shippingDetails.detailAddress}
                      </p>
                      {[
                        {
                          iconSrc: "/icons/profile16.svg",
                          label: "Nama Penerima :",
                          value: shippingDetails.recipientName,
                        },
                        {
                          iconSrc: "/icons/call16.svg",
                          label: "Nomor Handphone Penerima : ",
                          value: shippingDetails.recipientPhone,
                        },
                        {
                          iconSrc: "/icons/transporter16.svg",
                          label: "Ekspedisi Pengiriman : ",
                          value: shippingOption?.courierName,
                        },
                      ].map((item, key) => (
                        <div className="flex items-center gap-x-2" key={key}>
                          <IconComponent
                            className="icon-fill-muat-trans-secondary-900"
                            src={item.iconSrc}
                          />
                          <div className="leading-[14.4px] text-xs">
                            <div className="font-medium">{item.label}</div>
                            <div className="font-semibold">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                      <span className="leading-[14.4px] text-xs font-medium text-primary-700">
                        Ubah
                      </span>
                      <IconComponent
                        className="icon-fill-primary-700"
                        src="/icons/edit16.svg"
                      />
                    </button>
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
