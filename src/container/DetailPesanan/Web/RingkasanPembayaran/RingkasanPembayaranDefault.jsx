import { useMemo } from "react";

import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

export const RingkasanPembayaranDefault = ({ dataRingkasanPembayaran }) => {
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
    <CardPayment.Root className="h-[300px] w-full">
      <CardPayment.Header>Ringkasan Pembayaran</CardPayment.Header>

      <CardPayment.Container>
        <CardPayment.Collapsible title="Detail Pesanan">
          <CardPayment.CollapsibleItem
            label="Waktu Pembayaran"
            value={formatDate(dataRingkasanPembayaran?.expiredAt)}
          />

          <CardPayment.CollapsibleItem
            label="Opsi Pembayaran"
            value={
              <>
                <IconComponent
                  src="/icons/payment/va_bca.svg"
                  width={16}
                  height={16}
                  className="bg-white"
                />
                <span>BCA Virtual Account</span>
              </>
            }
          />
        </CardPayment.Collapsible>

        <CardPayment.Collapsible title="Biaya Pesan Jasa Angkut">
          <CardPayment.CollapsibleItem
            label="Nominal Pesan Jasa Angkut (1 Unit)"
            value={idrFormat(dataRingkasanPembayaran?.transportFee)}
          />
        </CardPayment.Collapsible>

        <CardPayment.Collapsible title="Biaya Asuransi Barang">
          <CardPayment.CollapsibleItem
            label="Nominal Premi Asuransi (1 Unit)"
            value={idrFormat(dataRingkasanPembayaran?.insuranceFee)}
          />
        </CardPayment.Collapsible>

        <CardPayment.Collapsible title="Biaya Layanan Tambahan">
          <div className="flex flex-col gap-3">
            <CardPayment.CollapsibleItem
              label="Nominal Kirim Bukti Fisik Penerimaan Barang"
              value={idrFormat(dataRingkasanPembayaran?.documentShippingFee)}
            />

            <Modal closeOnOutsideClick>
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
                    {documentShippingFields.map((field, index) => (
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
                              dataRingkasanPembayaran?.documentShippingDetail
                                ?.courier
                            }
                          </span>
                          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                            {idrFormat(
                              dataRingkasanPembayaran?.documentShippingDetail
                                ?.courierPrice
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
          </div>

          <CardPayment.CollapsibleItem
            label="Nominal Bantuan Tambahan"
            value={idrFormat(
              dataRingkasanPembayaran?.otherAdditionalService?.totalPrice
            )}
          />
        </CardPayment.Collapsible>

        {dataRingkasanPembayaran?.voucherDiscount &&
        dataRingkasanPembayaran?.voucherDiscount > 0 ? (
          <CardPayment.Collapsible title="Diskon Voucher">
            <CardPayment.CollapsibleItem
              label="Voucher (DISKONPENGGUNABARU)"
              value={idrFormat(dataRingkasanPembayaran?.voucherDiscount)}
            />
          </CardPayment.Collapsible>
        ) : null}

        <CardPayment.Collapsible title="Biaya Lainnya">
          <div className="flex flex-col gap-3">
            <CardPayment.CollapsibleItem
              label="Admin Layanan"
              value={idrFormat(dataRingkasanPembayaran?.adminFee)}
            />

            <CardPayment.CollapsibleItem
              label="Pajak"
              value={idrFormat(dataRingkasanPembayaran?.tax)}
            />
          </div>
        </CardPayment.Collapsible>

        <CardPayment.Subtotal
          label="Subtotal"
          value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
        />
      </CardPayment.Container>

      <CardPayment.FooterTotal label="Total" value="Rp 100.000" />
    </CardPayment.Root>
  );
};
