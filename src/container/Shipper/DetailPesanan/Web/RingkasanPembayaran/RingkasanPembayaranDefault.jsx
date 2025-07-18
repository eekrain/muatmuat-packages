import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { WaitFleetSearchButton } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/WaitFleetSearch";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { ModalBatalkanPesanan } from "./ModalBatalkanPesanan";
import { ModalDetailPengirimanDokumen } from "./ModalDetailPengirimanDokumen";

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
    <div className="flex max-h-[453px] w-full flex-col gap-4">
      <CardPayment.Root className="flex-1">
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
                <ModalDetailWaktuTunggu />
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
