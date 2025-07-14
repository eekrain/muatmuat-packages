import { useMemo } from "react";

import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { WaitFleetSearchButton } from "@/container/DetailPesanan/Web/StatusPesanan/WaitFleetSearch";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { ModalBatalkanPesanan } from "./ModalBatalkanPesanan";

export const RingkasanPembayaranDefault = ({
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
}) => {
  const showButtons =
    !dataRingkasanPembayaran?.orderStatus.startsWith("CANCELED") &&
    dataRingkasanPembayaran?.orderStatus !==
      OrderStatusEnum.WAITING_PAYMENT_2 &&
    dataRingkasanPembayaran?.orderStatus !== OrderStatusEnum.COMPLETED &&
    !dataRingkasanPembayaran?.orderStatus?.includes("DOCUMENT");

  const isRingkasanTransaksi =
    dataRingkasanPembayaran?.orderStatus === OrderStatusEnum.COMPLETED ||
    dataRingkasanPembayaran?.orderStatus ===
      OrderStatusEnum.WAITING_PAYMENT_1 ||
    dataRingkasanPembayaran?.orderStatus?.startsWith("CANCELED");

  return (
    <div className="flex h-[453px] w-full flex-col gap-4">
      <CardPayment.Root>
        <CardPayment.Header>
          {isRingkasanTransaksi
            ? "Ringkasan Transaksi"
            : "Ringkasan Pembayaran"}
        </CardPayment.Header>

        <CardPayment.Content>
          <CardPayment.ContainerCollapsible title="Detail Pesanan">
            <div className="flex flex-col gap-3">
              <CardPayment.Item
                label="Waktu Pembayaran"
                value={formatDate(dataRingkasanPembayaran?.expiredAt)}
              />

              <CardPayment.Item
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
            </div>

            <CardPayment.ContainerItem title="Biaya Pesan Jasa Angkut">
              <CardPayment.Item
                label={
                  <span>
                    Nominal Pesan Jasa Angkut <br />
                    (1 Unit)
                  </span>
                }
                value={idrFormat(dataRingkasanPembayaran?.transportFee)}
              />
            </CardPayment.ContainerItem>

            {dataRingkasanPembayaran?.insuranceFee &&
            dataRingkasanPembayaran?.insuranceFee > 0 ? (
              <CardPayment.ContainerItem title="Biaya Asuransi Barang">
                <CardPayment.Item
                  label="Nominal Premi Asuransi (1 Unit)"
                  value={idrFormat(dataRingkasanPembayaran?.insuranceFee)}
                />
              </CardPayment.ContainerItem>
            ) : null}

            <CardPayment.ContainerItem title="Biaya Layanan Tambahan">
              <div className="flex flex-col gap-[2px]">
                <CardPayment.Item
                  label="Nominal Kirim Bukti Fisik Penerimaan Barang"
                  value={idrFormat(
                    dataRingkasanPembayaran?.documentShippingFee
                  )}
                />
                <ModalDetailPengirimanDokumen
                  dataRingkasanPembayaran={dataRingkasanPembayaran}
                />
              </div>
              <CardPayment.Item
                label="Nominal Bantuan Tambahan"
                value={idrFormat(
                  dataRingkasanPembayaran?.otherAdditionalService?.totalPrice
                )}
              />
            </CardPayment.ContainerItem>

            {dataRingkasanPembayaran?.voucherDiscount &&
            dataRingkasanPembayaran?.voucherDiscount > 0 ? (
              <CardPayment.ContainerItem title="Diskon Voucher">
                <CardPayment.Item
                  label="Voucher (DISKONPENGGUNABARU)"
                  appearance={{
                    valueClassName: "text-error-400",
                  }}
                  value={`-${idrFormat(dataRingkasanPembayaran?.voucherDiscount)}`}
                />
              </CardPayment.ContainerItem>
            ) : null}

            <CardPayment.ContainerItem title="Biaya Lainnya">
              <div className="flex flex-col gap-1">
                <CardPayment.Item
                  label="Admin Layanan"
                  value={idrFormat(dataRingkasanPembayaran?.adminFee)}
                />

                <CardPayment.Item
                  label="Pajak"
                  value={idrFormat(dataRingkasanPembayaran?.tax)}
                />
              </div>
            </CardPayment.ContainerItem>
          </CardPayment.ContainerCollapsible>

          <CardPayment.ContainerCollapsible title="Detail Tambahan Biaya">
            <div className="flex flex-col gap-3">
              <CardPayment.Item
                label="Waktu Pembayaran"
                value={formatDate(dataRingkasanPembayaran?.expiredAt)}
              />

              <CardPayment.Item
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
            </div>

            <CardPayment.ContainerItem title="Biaya Waktu Tunggu">
              <div className="flex flex-col gap-[2px]">
                <CardPayment.Item
                  label="Nominal Waktu Tunggu (1 Driver)"
                  value={idrFormat(200000)}
                />
                <ModalDetailWaktuTunggu
                  driver={{
                    name: "Daffa Toldo",
                    detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
                    startDate: "22 Nov 2024 15:00 WIB",
                    endDate: "22 Nov 2024 16:59 WIB",
                    totalPrice: "Rp100.000",
                  }}
                />
              </div>
            </CardPayment.ContainerItem>

            <CardPayment.ContainerItem title="Biaya Overload Muatan">
              <div className="flex flex-col gap-[2px]">
                <CardPayment.Item
                  label="Nominal Overload Muatan (2.000 kg)"
                  value={idrFormat(100000)}
                  className="h-auto"
                />
                <ModalDetailOverloadMuatan
                  dataRingkasanPembayaran={dataRingkasanPembayaran}
                />
              </div>
            </CardPayment.ContainerItem>

            <CardPayment.ContainerItem title="Biaya Lainnya">
              <CardPayment.Item
                label="Admin Layanan"
                value={idrFormat(10000)}
              />
            </CardPayment.ContainerItem>
          </CardPayment.ContainerCollapsible>

          <CardPayment.Subtotal
            label="Subtotal"
            value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
          />
        </CardPayment.Content>

        <CardPayment.FooterTotal label="Total" value="Rp 100.000" />
      </CardPayment.Root>

      {/* Buttons Section */}
      {showButtons && (
        <div className="flex w-full flex-col gap-4">
          {dataRingkasanPembayaran?.orderStatus ===
          OrderStatusEnum.WAITING_PAYMENT_1 ? (
            <Button
              variant="muatparts-primary"
              className="h-8 w-full"
              onClick={() => {}}
              type="button"
            >
              Lanjut Pembayaran
            </Button>
          ) : dataRingkasanPembayaran?.orderStatus !==
            OrderStatusEnum.PREPARE_FLEET ? (
            <Button
              variant="muatparts-primary-secondary"
              className="h-8 w-full"
              onClick={() => {}}
              type="button"
            >
              Ubah Pesanan
            </Button>
          ) : null}

          {isShowWaitFleetAlert ? <WaitFleetSearchButton /> : null}
          <ModalBatalkanPesanan
            dataRingkasanPembayaran={dataRingkasanPembayaran}
          >
            <Button
              variant="muattrans-error-secondary"
              className="h-8 w-full"
              type="button"
            >
              Batalkan Pesanan
            </Button>
          </ModalBatalkanPesanan>
        </div>
      )}
    </div>
  );
};

const ModalDetailPengirimanDokumen = ({ dataRingkasanPembayaran }) => {
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
                    {dataRingkasanPembayaran?.documentShippingDetail?.courier}
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
  );
};
