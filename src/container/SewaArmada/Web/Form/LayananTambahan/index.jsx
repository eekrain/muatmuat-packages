import { Fragment, useState } from "react";

import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import DeliveryEvidenceModal from "@/container/SewaArmada/Web/Form/LayananTambahan/DeliveryEvidenceModal";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const LayananTambahan = () => {
  const [isOpen, setIsOpen] = useState(false);

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
  const additionalServicesData = [
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

  return (
    <>
      <FormContainer>
        {/* Label Bagian */}
        <FormLabel variant="small">Layanan Tambahan</FormLabel>

        {/* Container Opsi Layanan */}
        <div className="flex-grow-1 flex flex-col gap-y-3">
          {additionalServicesData?.map((service, key) => {
            const isSendDeliveryEvidenceService =
              service.name === "Kirim Bukti Fisik Penerimaan Barang";
            // Check if this service is already in the additionalServices array
            const isSelected = additionalServices.some(
              (selectedService) => selectedService.id === service.id
            );
            return (
              <Fragment key={key}>
                <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
                  {/* Container Checkbox dan Label */}
                  <div className="flex h-[16px] flex-row items-center gap-[4px]">
                    <Checkbox
                      onChange={(e) => {
                        if (e.checked) {
                          // Add the service to the array if checked
                          setSewaArmadaField("additionalServices", [
                            ...additionalServices,
                            service,
                          ]);

                          // Open modal for specific service if needed
                          if (isSendDeliveryEvidenceService) {
                            setIsOpen(true);
                          }
                        } else {
                          // Remove the service from the array if unchecked
                          setSewaArmadaField(
                            "additionalServices",
                            additionalServices.filter(
                              (selectedService) =>
                                selectedService.id !== service.id
                            )
                          );
                        }
                      }}
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
                    {`Rp${service.price === 0 ? "-" : service.price.toLocaleString("id-ID")}`}
                  </span>
                </div>
                {isSendDeliveryEvidenceService && isSelected ? (
                  <div className="flex gap-x-2 rounded-md border border-primary-700 bg-primary-50 p-3">
                    <IconComponent
                      className="icon-fill-muat-trans-secondary-900"
                      src="/icons/lokasi16.svg"
                    />
                    <button
                      className="flex items-center gap-x-2"
                      onClick={() => setIsOpen(true)}
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
      <DeliveryEvidenceModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
