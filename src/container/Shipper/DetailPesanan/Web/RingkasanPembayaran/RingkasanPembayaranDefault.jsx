import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { WaitFleetSearchButton } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/WaitFleetSearch";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import {
  PaymentMethodIconFromMethod,
  PaymentMethodTitle,
} from "@/lib/constants/detailpesanan/payment.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { ModalBatalkanPesanan } from "./ModalBatalkanPesanan";
import { ModalDetailPengirimanDokumen } from "./ModalDetailPengirimanDokumen";

export const RingkasanPembayaranDefault = ({
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
}) => {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
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
          {
            isRingkasanTransaksi
              ? t("titleRingkasanTransaksi") // Ringkasan Transaksi
              : t("titleRingkasanPembayaran") // Ringkasan Pembayaran
          }
        </CardPayment.Header>

        <CardPayment.Content>
          <CardPayment.ContainerCollapsible
            title={t("titleDetailPesanan") /* Detail Pesanan */}
          >
            <div className="flex flex-col gap-3">
              {dataRingkasanPembayaran?.expiredAt && (
                <CardPayment.Item
                  label={t("labelWaktuPembayaran")}
                  value={formatDate(dataRingkasanPembayaran?.expiredAt)}
                />
              )}

              <CardPayment.Item
                label={t("labelOpsiPembayaran")}
                appearance={{
                  valueClassName: "items-center",
                }}
                value={
                  <>
                    <img
                      src={dataRingkasanPembayaran?.paymentLogo}
                      alt={dataRingkasanPembayaran?.paymentMethod}
                      className="h-4 w-4 bg-white"
                    />
                    <span className="capsize">
                      {dataRingkasanPembayaran?.paymentMethod}
                    </span>
                  </>
                }
              />
            </div>

            <CardPayment.ContainerItem
              title={
                t("titleBiayaPesanJasaAngkut") /* Biaya Pesan Jasa Angkut */
              }
            >
              <CardPayment.Item
                label={t("labelNominalPesanJasaAngkut", {
                  unit: dataRingkasanPembayaran?.totalTruckUnit,
                })}
                value={idrFormat(dataRingkasanPembayaran?.transportFee)}
              />
            </CardPayment.ContainerItem>

            {dataRingkasanPembayaran?.insuranceFee &&
            dataRingkasanPembayaran?.insuranceFee > 0 ? (
              <CardPayment.ContainerItem
                title={
                  t("titleBiayaAsuransiBarang") /* Biaya Asuransi Barang */
                }
              >
                <CardPayment.Item
                  label={t("labelNominalPremiAsuransi")}
                  value={idrFormat(dataRingkasanPembayaran?.insuranceFee)}
                />
              </CardPayment.ContainerItem>
            ) : null}

            <CardPayment.ContainerItem
              title={
                t("titleBiayaLayananTambahan") /* Biaya Layanan Tambahan */
              }
            >
              <div className="flex flex-col gap-[2px]">
                <CardPayment.Item
                  label={t("labelNominalKirimBuktiFisik")}
                  value={idrFormat(
                    dataRingkasanPembayaran?.documentShippingFee
                  )}
                />
                <ModalDetailPengirimanDokumen
                  dataRingkasanPembayaran={dataRingkasanPembayaran}
                />
              </div>
              <CardPayment.Item
                label={t("labelNominalBantuanTambahan")}
                value={idrFormat(
                  dataRingkasanPembayaran?.otherAdditionalService?.totalPrice
                )}
              />
            </CardPayment.ContainerItem>

            {dataRingkasanPembayaran?.voucherDiscount &&
            dataRingkasanPembayaran?.voucherDiscount > 0 ? (
              <CardPayment.ContainerItem
                title={t("titleDiskonVoucher") /* Diskon Voucher */}
              >
                <CardPayment.Item
                  label={t("labelVoucherCode", {
                    code:
                      dataRingkasanPembayaran?.voucherCode ||
                      "DISKONPENGGUNABARU",
                  })}
                  appearance={{
                    valueClassName: "text-error-400",
                  }}
                  value={`-${idrFormat(dataRingkasanPembayaran?.voucherDiscount)}`}
                />
              </CardPayment.ContainerItem>
            ) : null}

            <CardPayment.ContainerItem
              title={t("titleBiayaLainnya") /* Biaya Lainnya */}
            >
              <div className="flex flex-col gap-1">
                <CardPayment.Item
                  label={t("labelAdminLayanan")}
                  value={idrFormat(dataRingkasanPembayaran?.adminFee)}
                />

                <CardPayment.Item
                  label={t("labelPajak")}
                  value={idrFormat(dataRingkasanPembayaran?.tax)}
                />
              </div>
            </CardPayment.ContainerItem>
          </CardPayment.ContainerCollapsible>
          {dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalAmount >
            0 && (
            <CardPayment.ContainerCollapsible
              title={t("titleDetailTambahanBiaya") /* Detail Tambahan Biaya */}
            >
              <div className="flex flex-col gap-3">
                <CardPayment.Item
                  label={t("labelWaktuPembayaran")}
                  value={formatDate(dataRingkasanPembayaran?.expiredAt)}
                />

                <CardPayment.Item
                  label={t("labelOpsiPembayaran")}
                  value={
                    <>
                      <IconComponent
                        src={
                          PaymentMethodIconFromMethod[
                            dataRingkasanPembayaran?.paymentMethod
                          ]
                        }
                        width={16}
                        height={16}
                        className="bg-white"
                      />
                      <span>
                        {
                          PaymentMethodTitle[
                            dataRingkasanPembayaran?.paymentMethod
                          ]
                        }
                      </span>
                    </>
                  }
                />
              </div>

              <CardPayment.ContainerItem
                title={t("titleBiayaWaktuTunggu") /* Biaya Waktu Tunggu */}
              >
                <div className="flex flex-col gap-[2px]">
                  <CardPayment.Item
                    label={t("labelNominalWaktuTunggu", {
                      driver:
                        dataRingkasanPembayaran?.priceCharge?.waitingFee
                          ?.totalDriver,
                    })}
                    value={idrFormat(
                      dataRingkasanPembayaran?.priceCharge?.waitingFee
                        ?.totalAmount
                    )}
                  />
                  <ModalDetailWaktuTunggu />
                </div>
              </CardPayment.ContainerItem>

              <CardPayment.ContainerItem
                title={
                  t("titleBiayaOverloadMuatan") /* Biaya Overload Muatan */
                }
              >
                <div className="flex flex-col gap-[2px]">
                  <CardPayment.Item
                    label={t("labelNominalOverloadMuatan", {
                      weight:
                        dataRingkasanPembayaran?.priceCharge?.overloadFee
                          ?.totalWeight,
                    })}
                    value={idrFormat(
                      dataRingkasanPembayaran?.priceCharge?.overloadFee
                        ?.totalAmount
                    )}
                    className="h-auto"
                  />
                  <ModalDetailOverloadMuatan
                    dataRingkasanPembayaran={dataRingkasanPembayaran}
                  />
                </div>
              </CardPayment.ContainerItem>

              <CardPayment.ContainerItem
                title={t("titleBiayaLainnya") /* Biaya Lainnya */}
              >
                <CardPayment.Item
                  label={t("labelAdminLayanan")}
                  value={idrFormat(
                    dataRingkasanPembayaran?.priceCharge?.adminFee
                  )}
                />
              </CardPayment.ContainerItem>
            </CardPayment.ContainerCollapsible>
          )}

          <CardPayment.Subtotal
            label={t("labelSubtotal")}
            value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
          />
        </CardPayment.Content>

        <CardPayment.FooterTotal
          label={t("labelTotal")}
          value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
        />
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
              {t("buttonLanjutPembayaran")}
            </Button>
          ) : dataRingkasanPembayaran?.orderStatus !==
            OrderStatusEnum.PREPARE_FLEET ? (
            <Button
              variant="muatparts-primary-secondary"
              className="h-8 w-full"
              onClick={() =>
                router.push(`/sewaarmada/ubahpesanan/${params.orderId}`)
              }
              type="button"
            >
              {t("buttonUbahPesanan")}
            </Button>
          ) : null}

          {isShowWaitFleetAlert && <WaitFleetSearchButton />}

          <ModalBatalkanPesanan
            dataRingkasanPembayaran={dataRingkasanPembayaran}
          >
            <Button
              variant="muattrans-error-secondary"
              className="h-8 w-full"
              type="button"
            >
              {t("buttonBatalkanPesanan")}
            </Button>
          </ModalBatalkanPesanan>
        </div>
      )}
    </div>
  );
};
