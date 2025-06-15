import { useMemo } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { PaymentMethodTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranDefault = ({ dataRingkasanPembayaran }) => {
  const informationFields = useMemo(() => {
    const data = dataRingkasanPembayaran?.additionalServiceDetail;
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
        value: data.destinationAddress,
        width: "w-full",
      },
      {
        id: "detail-alamat",
        label: "Detail Alamat Tujuan",
        value: data.detailDestinationAddress,
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
        value: data.kodePos,
        width: "w-full",
      },
    ];
  }, [dataRingkasanPembayaran]);

  return (
    <div className="flex w-full flex-col items-start rounded-xl bg-white shadow-md">
      {/* Top Section */}
      <div className="flex h-[298px] w-full flex-col items-start gap-6 overflow-y-auto p-6 pb-0 pt-6">
        <span className="w-full text-[16px] font-bold leading-[19.2px] text-neutral-900">
          Ringkasan Pembayaran
        </span>

        {/* Detail Pesanan Section */}
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full flex-row items-center justify-between">
            <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              Detail Pesanan
            </span>
            <IconComponent
              src="/icons/chevron-right.svg"
              width={16}
              height={16}
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            {/* Waktu Pembayaran */}
            <div className="flex w-full items-start justify-between">
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Waktu Pembayaran
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {formatDate(dataRingkasanPembayaran?.paymentDueDateTime)}
              </span>
            </div>

            {/* Opsi Pembayaran */}
            <div className="flex w-full items-center justify-between">
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Opsi Pembayaran
              </span>
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/payment/va_bca.svg"
                  width={16}
                  height={16}
                  className="bg-white"
                />
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  {PaymentMethodTitle[dataRingkasanPembayaran?.paymentMethod]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Biaya Pesan Jasa Angkut Section */}
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            Biaya Pesan Jasa Angkut
          </span>
          <div className="flex w-full items-start justify-between">
            <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
              Nominal Pesan Jasa Angkut (1 Unit)
            </span>
            <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
              {idrFormat(dataRingkasanPembayaran?.transportFee)}
            </span>
          </div>
        </div>

        {/* Biaya Asuransi Barang Section */}
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            Biaya Asuransi Barang
          </span>
          <div className="flex w-full items-start justify-between">
            <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
              Nominal Premi Asuransi (1 Unit)
            </span>
            <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
              {idrFormat(dataRingkasanPembayaran?.insuranceFee)}
            </span>
          </div>
        </div>

        {/* Biaya Layanan Tambahan Section */}
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            Biaya Layanan Tambahan
          </span>
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full items-start justify-between">
              <span className="w-[180px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nominal Kirim Bukti Fisik Penerimaan Barang
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {idrFormat(dataRingkasanPembayaran?.additionalServiceFee)}
              </span>
            </div>

            <Modal closeOnOutsideClick={false}>
              <ModalTrigger>
                <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                  Lihat Detail Pengiriman Dokumen
                </button>
              </ModalTrigger>
              <ModalContent>
                <div className="flex flex-col gap-y-4 px-6 py-9">
                  {/* Header */}
                  <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                    Detail Pengiriman Dokumen
                  </h2>

                  {/* Content */}
                  <div className="flex flex-col items-start gap-4 p-0">
                    {/* Information Fields */}
                    {informationFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex w-[424px] flex-col items-start gap-3 p-0"
                      >
                        <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                          {field.label}
                        </span>
                        <span
                          className={`text-[12px] font-medium leading-[14.4px] text-neutral-600 ${field.width}`}
                        >
                          {field.value}
                        </span>
                      </div>
                    ))}

                    {/* Ekspedisi Section */}
                    <div className="flex h-12 w-[424px] flex-col items-start gap-3 p-0">
                      <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                        Ekspedisi Pengiriman
                      </span>

                      {/* Ekspedisi Details */}
                      <div className="flex w-full flex-col gap-2">
                        {/* JNE Service */}
                        <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                            {
                              dataRingkasanPembayaran?.additionalServiceDetail
                                ?.shippingOption
                            }
                          </span>
                          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                            {idrFormat(
                              dataRingkasanPembayaran?.additionalServiceDetail
                                ?.shippingCost
                            )}
                          </span>
                        </div>

                        {/* Insurance */}
                        <div className="flex h-2 w-[424px] flex-row items-center justify-between">
                          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                            Asuransi Pengiriman
                          </span>
                          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                            {idrFormat(
                              dataRingkasanPembayaran?.additionalServiceDetail
                                ?.insurance
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalContent>
            </Modal>

            <div className="flex w-full items-start justify-between">
              <span className="w-[180px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                {/* TODO: Data ini ga ada di API Kontrak */}
                Nominal Bantuan Tambahan
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {idrFormat(dataRingkasanPembayaran?.additionalServiceFee)}
              </span>
            </div>
          </div>
        </div>

        {/* Diskon Voucher Section */}
        {dataRingkasanPembayaran?.voucherDiscount &&
        dataRingkasanPembayaran?.voucherDiscount > 0 ? (
          <div className="flex w-full flex-col items-start gap-3">
            <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              Diskon Voucher
            </span>
            <div className="flex w-full items-start justify-between">
              <span className="w-[180px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Voucher (DISKONPENGGUNABARU)
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {idrFormat(dataRingkasanPembayaran?.voucherDiscount)}
              </span>
            </div>
          </div>
        ) : null}

        {/* Biaya Lainnya Section */}
        <div className="flex w-full flex-col items-start gap-4">
          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            Biaya Lainnya
          </span>
          <div className="flex w-full flex-col items-start gap-3">
            <div className="flex w-full items-start justify-between">
              <span className="w-[180px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Admin Layanan
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {idrFormat(dataRingkasanPembayaran?.adminFee)}
              </span>
            </div>

            <div className="flex w-full items-start justify-between">
              <span className="w-[180px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pajak
              </span>
              <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {idrFormat(dataRingkasanPembayaran?.taxAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Subtotal Section */}
        <div className="flex w-full items-center justify-between">
          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            Subtotal
          </span>

          <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            {idrFormat(dataRingkasanPembayaran?.totalPrice)}
          </span>
        </div>
      </div>

      {/* Total Section */}
      <div className="flex w-full flex-col items-start p-6">
        <div className="flex w-full items-start justify-between">
          <span className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Total
          </span>
          <span className="text-right text-[16px] font-bold leading-[19.2px] text-neutral-900">
            {idrFormat(dataRingkasanPembayaran?.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
