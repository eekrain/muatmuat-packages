import { useMemo } from "react";

import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { idrFormat } from "@/lib/utils/formatters";

export const ModalDetailPengirimanDokumen = ({ dataRingkasanPembayaran }) => {
  const documentShippingFields = useMemo(() => {
    const data = dataRingkasanPembayaran?.documentShippingDetail;
    if (!data) return [];

    return [
      {
        id: "nama-penerima",
        label: "Nama Penerima",
        value: data.recipientName,
        width: "w-[89px]",
      },
      {
        id: "nomor-handphone",
        label: "Nomor Handphone Penerima",
        value: data.recipientPhone,
        width: "w-[164px]",
      },
      {
        id: "alamat-tujuan",
        label: "Alamat Tujuan",
        value: data.fullAddress,
        width: "w-full",
      },
      {
        id: "detail-alamat",
        label: "Detail Alamat Tujuan",
        value: data.detailAddress,
        width: "w-full",
      },
      {
        id: "kecamatan",
        label: "Kecamatan",
        value: data.district,
        width: "w-full",
      },
      {
        id: "kabupaten",
        label: "Kabupaten/Kota",
        value: data.city,
        width: "w-full",
      },
      {
        id: "provinsi",
        label: "Provinsi",
        value: data.province,
        width: "w-full",
      },
      {
        id: "kode-pos",
        label: "Kode Pos",
        value: data.postalCode,
        width: "w-full",
      },
    ];
  }, [dataRingkasanPembayaran]);

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[14.4px] text-primary-700">
          Lihat Detail Pengiriman Dokumen
        </button>
      </ModalTrigger>
      <ModalContent>
        <div className="flex flex-col gap-y-4 px-6 py-9">
          {/* Header */}
          <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
            Detail Pengiriman Dokumen
          </h2>

          {/* Content */}
          <div className="flex flex-col items-start gap-4 p-0">
            {/* Information Fields */}
            {documentShippingFields.map((field, index) => (
              <div
                key={field.id}
                className="flex w-[424px] flex-col items-start gap-3 p-0"
              >
                <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                  {field.label}
                </span>
                <span
                  className={`text-xs font-medium leading-[14.4px] text-neutral-600 ${field.width}`}
                >
                  {field.value}
                </span>
              </div>
            ))}

            {/* Ekspedisi Section */}
            <div className="flex h-12 w-[424px] flex-col items-start gap-3 p-0">
              <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                Ekspedisi Pengiriman
              </span>

              {/* Ekspedisi Details */}
              <div className="flex w-full flex-col gap-2">
                {/* JNE Service */}
                <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                    {dataRingkasanPembayaran?.documentShippingDetail?.courier}
                  </span>
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {idrFormat(
                      dataRingkasanPembayaran?.documentShippingDetail
                        ?.courierPrice
                    )}
                  </span>
                </div>

                {/* Insurance */}
                <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                    Asuransi Pengiriman
                  </span>
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-900">
                    {idrFormat(
                      dataRingkasanPembayaran?.documentShippingDetail
                        ?.insurancePrice
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
