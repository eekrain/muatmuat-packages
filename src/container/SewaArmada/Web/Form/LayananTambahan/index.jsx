import { Fragment, useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import DeliveryEvidenceModal from "@/container/SewaArmada/Web/Form/LayananTambahan/DeliveryEvidenceModal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook } from "@/hooks/use-swr";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const LayananTambahan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const additionalServices = useSewaArmadaStore(
    (s) => s.formValues.additionalServices
  );
  const { setField: setSewaArmadaField } = useSewaArmadaActions();
  // Fetch layanan tambahan dari API
  // Nanti dulu belum ada data
  // https://claude.ai/chat/ef9b6ad4-0d1c-46f3-b8f9-e63d29cc0db1
  // const { data: additionalServices, error } = useSWRHook(
  //   "v1/orders/additional-services"
  // );

  // Fetch shipping options when location data is complete
  const { data: shippingOptionsData } = useSWRHook(
    "v1/orders/shipping-options"
  );
  // const shippingOptions = shippingOptionsData?.Data;

  const additionalServicesOptions = [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Kirim Bukti Fisik Penerimaan Barang",
      description:
        "Layanan untuk mengirim bukti fisik penerimaan barang ke alamat yang ditentukan",
      price: 0,
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Troli",
      description: "Troli",
      price: 25000,
    },
  ];

  const shippingOptions = [
    {
      groupName: "Reguler",
      expeditions: [
        {
          id: "2e395ac7-9a91-4884-8ee2-e3a9a2d5cc78",
          courierName: "J&T Express",
          libraryID: 1,
          rateID: 57,
          minEstimatedDay: 2,
          maxEstimatedDay: 3,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 6000,
          originalInsurance: 25,
          mustUseInsurance: false,
        },
        {
          id: "a0fe91ff-2375-44d4-bd22-a52d5d290c17",
          courierName: "Ninja Xpress",
          libraryID: 1,
          rateID: 228,
          minEstimatedDay: 3,
          maxEstimatedDay: 5,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 6000,
          originalInsurance: 1000,
          mustUseInsurance: false,
        },
        {
          id: "f229affd-453b-4a6f-8151-7943322e76f9",
          courierName: "SAPX Express",
          libraryID: 1,
          rateID: 349,
          minEstimatedDay: 1,
          maxEstimatedDay: 2,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 9000,
          originalInsurance: 2030,
          mustUseInsurance: false,
        },
        {
          id: "3fdca0d2-1ec2-4b85-80a7-d0326a4ae759",
          courierName: "SiCepat",
          libraryID: 1,
          rateID: 58,
          minEstimatedDay: 1,
          maxEstimatedDay: 2,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 7000,
          originalInsurance: 25,
          mustUseInsurance: false,
        },
        {
          id: "f390c703-ce44-458a-8909-ce41a2369a42",
          courierName: "SiCepat (BEST)",
          libraryID: 1,
          rateID: 59,
          minEstimatedDay: 1,
          maxEstimatedDay: 1,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 11000,
          originalInsurance: 25,
          mustUseInsurance: false,
        },
      ],
    },
    {
      groupName: "Kargo",
      expeditions: [
        {
          id: "d2a44f7b-b4a8-44e8-ad0c-0900ff737ca7",
          courierName: "JNE Trucking (JTR)",
          libraryID: 1,
          rateID: 312,
          minEstimatedDay: 3,
          maxEstimatedDay: 4,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 40000,
          originalInsurance: 25,
          mustUseInsurance: false,
        },
      ],
    },
    {
      groupName: "Instan",
      expeditions: [
        {
          id: "b1900bbf-2127-407d-9971-914333f0c358",
          courierName: "Gosend",
          libraryID: 1,
          rateID: 329,
          minEstimatedDay: 0,
          maxEstimatedDay: 0,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 23500,
          originalInsurance: 0,
          mustUseInsurance: false,
        },
        {
          id: "1d302d7f-6ec5-46ba-a3c6-0740af86d773",
          courierName: "Grab Express",
          libraryID: 1,
          rateID: 340,
          minEstimatedDay: 0,
          maxEstimatedDay: 0,
          originAreaId: 30052,
          destinationAreaId: 30169,
          weight: 1,
          originalCost: 50000,
          originalInsurance: 0,
          mustUseInsurance: false,
        },
      ],
    },
  ];

  const shippingDetails = useShallowMemo(() => {
    if (additionalServices.length === 0) return null;

    const sendDeliveryEvidenceService = additionalServices.find(
      (item) => item.withShipping
    );

    return sendDeliveryEvidenceService?.shippingDetails ?? null;
  }, [additionalServices]);

  return (
    <>
      <FormContainer>
        {/* Label Bagian */}
        <FormLabel variant="small">Layanan Tambahan</FormLabel>

        {/* Container Opsi Layanan */}
        <div className="flex-grow-1 flex flex-col gap-y-3">
          {additionalServicesOptions?.map((service, key) => {
            const isSendDeliveryEvidenceService =
              service.name === "Kirim Bukti Fisik Penerimaan Barang";
            // Check if this service is already in the additionalServices array
            const isSelected = additionalServices.some(
              (selectedService) => selectedService.serviceId === service.id
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
                                  serviceId: service.id,
                                  withShipping: service.price === 0,
                                },
                              ]);
                            }
                          } else {
                            // Remove the service from the array if unchecked
                            setSewaArmadaField(
                              "additionalServices",
                              additionalServices.filter(
                                (selectedService) =>
                                  selectedService.serviceId !== service.id
                              )
                            );
                          }
                        })
                      }
                      label={service.name}
                      checked={isSelected}
                      value={service.id}
                    />
                    <InfoTooltip side="right">
                      <p>{service.description}</p>
                    </InfoTooltip>
                  </div>

                  {/* Biaya Layanan */}
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {`Rp${
                      service.price === 0
                        ? isSelected
                          ? shippingOptions
                              .flatMap((option) => option.expeditions)
                              .find(
                                (expedition) =>
                                  expedition.id ===
                                  shippingDetails?.shippingOptionId
                              )
                              ?.originalCost.toLocaleString("id-ID")
                          : "-"
                        : service.price.toLocaleString("id-ID")
                    }`}
                  </span>
                </div>
                {isSendDeliveryEvidenceService && isSelected ? (
                  <div className="ml-6 flex gap-x-2 rounded-md border border-primary-700 bg-primary-50 p-3">
                    <IconComponent
                      className="icon-fill-muat-trans-secondary-900"
                      src="/icons/lokasi16.svg"
                    />
                    <div className="flex w-[442px] flex-col gap-y-3 text-neutral-900">
                      <span className="text-[12px] font-bold leading-[14.4px]">
                        {shippingDetails.destinationAddress}
                      </span>
                      <p className="text-[12px] font-medium leading-[14.4px]">
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
                          value: shippingOptions
                            .flatMap((option) => option.expeditions)
                            .find(
                              (expedition) =>
                                expedition.id ===
                                shippingDetails.shippingOptionId
                            )?.courierName,
                        },
                      ].map((item, key) => (
                        <div className="flex items-center gap-x-2" key={key}>
                          <IconComponent
                            className="icon-fill-muat-trans-secondary-900"
                            src={item.iconSrc}
                          />
                          <div className="text-[12px] leading-[14.4px]">
                            <div className="font-medium">{item.label}</div>
                            <div className="font-semibold">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="flex items-center gap-x-2 self-start"
                      onClick={() => {
                        setModalType("edit");
                        setIsOpen(true);
                      }}
                    >
                      <span className="text-[12px] font-medium leading-[14.4px] text-primary-700">
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
        shippingOptions={shippingOptions}
      />
    </>
  );
};
