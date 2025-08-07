import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import { ConditionalDiv } from "@/components/Card/ConditionalDiv";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { WaitFleetSearchButton } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/WaitFleetSearch";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import {
  PaymentMethodIconFromMethod,
  PaymentMethodTitle,
} from "@/lib/constants/detailpesanan/payment.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";
import { useGetOverloadData } from "@/services/Shipper/detailpesanan/getOverloadData";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

import { ModalBatalkanPesanan } from "./ModalBatalkanPesanan";
import { ModalDetailPengirimanDokumen } from "./ModalDetailPengirimanDokumen";

export const RingkasanPembayaranDefault = ({
  dataRingkasanPembayaran,
  dataStatusPesanan,
  isShowWaitFleetAlert,
}) => {
  const params = useParams();
  const { t } = useTranslation();

  const isRingkasanTransaksi =
    dataRingkasanPembayaran?.orderStatus === OrderStatusEnum.COMPLETED ||
    dataRingkasanPembayaran?.orderStatus ===
      OrderStatusEnum.WAITING_PAYMENT_1 ||
    dataRingkasanPembayaran?.orderStatus?.startsWith("CANCELED");

  const { data: waitingTimeData } = useGetWaitingTime(params.orderId);
  const priceChange = dataRingkasanPembayaran?.priceChange;
  const additionalCost = priceChange?.additionalCost;
  const penaltyFee = priceChange?.penaltyFee;
  const adminFee = priceChange?.adminFee;
  const taxAmount = priceChange?.taxAmount;
  const totalAdjustment = priceChange?.totalAdjustment;

  const { data: overloadData } = useGetOverloadData(params.orderId);

  return (
    <div className="flex max-h-[453px] w-full flex-col gap-4">
      <CardPayment.Root className="flex-1">
        <CardPayment.Header>
          {isRingkasanTransaksi
            ? t("titleRingkasanTransaksi")
            : t("titleRingkasanPembayaran")}
        </CardPayment.Header>

        <CardPayment.Body>
          {priceChange ? (
            <CardPayment.CollapsibleSection title={t("titleDetailPesanan")}>
              <CardPayment.LineItem
                className="-mt-1"
                label="Waktu Pembayaran"
                value="06 Jun 2024 19:00 WIB"
              />
              <CardPayment.LineItem
                className="mt-1"
                label="Opsi Pembayaran"
                value={
                  <>
                    <IconComponent src="/icons/bca16.svg" />
                    <span>BCA Virtual Account</span>
                  </>
                }
                valueClassName="flex items-center gap-x-2"
              />

              <CardPayment.Section title={t("titleBiayaWaktuTunggu")}>
                <div className="flex flex-col gap-1">
                  <CardPayment.LineItem
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
                  <ModalDetailWaktuTunggu drivers={waitingTimeData} />
                </div>
              </CardPayment.Section>

              <CardPayment.Section title={t("titleBiayaOverloadMuatan")}>
                <div className="flex flex-col gap-1">
                  <CardPayment.LineItem
                    label={t("labelNominalOverloadMuatan", {
                      weight:
                        dataRingkasanPembayaran?.priceCharge?.overloadFee
                          ?.totalWeight,
                    })}
                    value={idrFormat(
                      dataRingkasanPembayaran?.priceCharge?.overloadFee
                        ?.totalAmount
                    )}
                  />
                  <ModalDetailOverloadMuatan drivers={overloadData} />
                </div>
              </CardPayment.Section>

              <CardPayment.Section title={t("titleBiayaLainnya")}>
                <CardPayment.LineItem
                  label={t(
                    "RingkasanPembayaranPerubahanPesanan.labelSelisihJarakPerubahanLokasi",
                    {},
                    "Selisih Jarak Perubahan Lokasi Bongkar"
                  )}
                  value={idrFormat(additionalCost)}
                />
              </CardPayment.Section>

              <CardPayment.Section
                title={t(
                  "RingkasanPembayaranPerubahanPesanan.sectionBiayaAdministrasi",
                  {},
                  "Biaya Administrasi"
                )}
              >
                <CardPayment.LineItem
                  label="Biaya Penalti Ubah Pesanan"
                  value={idrFormat(penaltyFee)}
                />
              </CardPayment.Section>

              <CardPayment.Section
                title={t(
                  "RingkasanPembayaranPerubahanPesanan.sectionBiayaLainnya",
                  {},
                  "Biaya Lainnya"
                )}
              >
                <CardPayment.LineItem
                  label={t(
                    "RingkasanPembayaranPerubahanPesanan.labelAdminLayanan",
                    {},
                    "Admin Layanan"
                  )}
                  value={idrFormat(adminFee)}
                />
                <CardPayment.LineItem
                  label={t(
                    "RingkasanPembayaranPerubahanPesanan.labelPajak",
                    {},
                    "Pajak"
                  )}
                  value={idrFormat(taxAmount)}
                />
              </CardPayment.Section>
              <CardPayment.LineItem
                className="mt-3"
                labelClassName="text-sm font-semibold text-neutral-900"
                valueClassName="text-sm font-semibold text-neutral-900"
                label="Sub Total"
                value={idrFormat(totalAdjustment)}
              />
            </CardPayment.CollapsibleSection>
          ) : (
            <>
              <CardPayment.CollapsibleSection title={t("titleDetailPesanan")}>
                {dataRingkasanPembayaran?.paymentDueDateTime && (
                  <CardPayment.LineItem
                    label={t("labelWaktuPembayaran")}
                    value={formatDate(
                      dataRingkasanPembayaran.paymentDueDateTime
                    )}
                  />
                )}
                <CardPayment.LineItem
                  label={t("labelOpsiPembayaran")}
                  valueClassName="flex items-center gap-2"
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

                <CardPayment.Section title={t("titleBiayaPesanJasaAngkut")}>
                  <CardPayment.LineItem
                    label={t("labelNominalPesanJasaAngkut", {
                      unit: dataRingkasanPembayaran?.totalTruckUnit,
                    })}
                    labelClassName="max-w-[160px]"
                    value={idrFormat(dataRingkasanPembayaran?.transportFee)}
                  />
                </CardPayment.Section>

                {dataRingkasanPembayaran?.insuranceFee > 0 && (
                  <CardPayment.Section title={t("titleBiayaAsuransiBarang")}>
                    <CardPayment.LineItem
                      label={t("labelNominalPremiAsuransi")}
                      value={idrFormat(dataRingkasanPembayaran.insuranceFee)}
                    />
                  </CardPayment.Section>
                )}

                <CardPayment.Section title={t("titleBiayaLayananTambahan")}>
                  <div className="flex flex-col gap-1">
                    <CardPayment.LineItem
                      label={t("labelNominalKirimBuktiFisik")}
                      value={idrFormat(
                        dataRingkasanPembayaran?.documentShippingDetail
                          ?.totalPrice
                      )}
                    />
                    <ModalDetailPengirimanDokumen
                      dataRingkasanPembayaran={dataRingkasanPembayaran}
                    />
                  </div>
                  <CardPayment.LineItem
                    label={t("labelNominalBantuanTambahan")}
                    value={idrFormat(
                      dataRingkasanPembayaran?.otherAdditionalService
                        ?.totalPrice
                    )}
                  />
                </CardPayment.Section>

                {dataRingkasanPembayaran?.voucherDiscount > 0 && (
                  <CardPayment.Section title={t("titleDiskonVoucher")}>
                    <CardPayment.LineItem
                      label={t("labelVoucherCode", {
                        code:
                          dataRingkasanPembayaran?.voucherDiscount ||
                          "DISKONPENGGUNABARU",
                      })}
                      variant="danger"
                      value={`-${idrFormat(
                        dataRingkasanPembayaran.voucherDiscount
                      )}`}
                    />
                  </CardPayment.Section>
                )}

                <CardPayment.Section title={t("titleBiayaLainnya")}>
                  <CardPayment.LineItem
                    label={t("labelAdminLayanan")}
                    value={idrFormat(dataRingkasanPembayaran?.adminFee)}
                  />
                  <CardPayment.LineItem
                    label={t("labelPajak")}
                    value={idrFormat(dataRingkasanPembayaran?.tax)}
                  />
                </CardPayment.Section>
              </CardPayment.CollapsibleSection>

              {dataRingkasanPembayaran?.priceCharge?.waitingFee?.totalAmount >
                0 && (
                <CardPayment.CollapsibleSection
                  title={t("titleDetailTambahanBiaya")}
                >
                  <CardPayment.LineItem
                    label={t("labelWaktuPembayaran")}
                    value={formatDate(
                      dataRingkasanPembayaran?.paymentDueDateTime
                    )}
                  />
                  <CardPayment.LineItem
                    label={t("labelOpsiPembayaran")}
                    valueClassName="flex items-center gap-2"
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

                  <CardPayment.Section title={t("titleBiayaWaktuTunggu")}>
                    <div className="flex flex-col gap-1">
                      <CardPayment.LineItem
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
                      <ModalDetailWaktuTunggu drivers={waitingTimeRaw} />
                    </div>
                  </CardPayment.Section>

                  <CardPayment.Section title={t("titleBiayaOverloadMuatan")}>
                    <div className="flex flex-col gap-1">
                      <CardPayment.LineItem
                        label={t("labelNominalOverloadMuatan", {
                          weight:
                            dataRingkasanPembayaran?.priceCharge?.overloadFee
                              ?.totalWeight,
                        })}
                        value={idrFormat(
                          dataRingkasanPembayaran?.priceCharge?.overloadFee
                            ?.totalAmount
                        )}
                      />
                      <ModalDetailOverloadMuatan drivers={overloadData} />
                    </div>
                  </CardPayment.Section>

                  <CardPayment.Section title={t("titleBiayaLainnya")}>
                    <CardPayment.LineItem
                      label={t("labelAdminLayanan")}
                      value={idrFormat(
                        dataRingkasanPembayaran?.priceCharge?.adminFee
                      )}
                    />
                  </CardPayment.Section>
                </CardPayment.CollapsibleSection>
              )}
            </>
          )}
        </CardPayment.Body>

        <CardPayment.Footer>
          <CardPayment.Total
            label={t("labelTotal")}
            value={
              priceChange
                ? idrFormat(totalAdjustment)
                : idrFormat(dataRingkasanPembayaran?.totalPrice)
            }
          />
        </CardPayment.Footer>
      </CardPayment.Root>

      {/* Buttons Section */}
      <ButtonSection
        dataStatusPesanan={dataStatusPesanan}
        dataRingkasanPembayaran={dataRingkasanPembayaran}
        isShowWaitFleetAlert={isShowWaitFleetAlert}
        t={t}
      />
    </div>
  );
};

export const ButtonSection = ({
  dataStatusPesanan,
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
  t,
  onLanjutPembayaran,
}) => {
  const params = useParams();
  const router = useRouter();

  const orderId = params?.orderId;
  const { trigger: paymentProcess, isMutating: isLoading } = useSWRMutateHook(
    orderId ? `v1/orders/${orderId}/payment-process` : null,
    "POST"
  );

  const handleLanjutPembayaran = async () => {
    if (!paymentProcess) return;

    try {
      const result = await paymentProcess({
        paymentMethodId: dataRingkasanPembayaran.paymentMethodId,
      });
      console.log("Pembayaran berhasil:", result);

      // Contoh tambahan jika ingin redirect atau toast
      // router.push(`/sewaarmada/pembayaran/${orderId}`);
      // toast.success("Pembayaran berhasil!");
      router.refresh();
    } catch (err) {
      console.error("Gagal lanjut pembayaran:", err);
      // toast.error("Terjadi kesalahan saat memproses pembayaran");
    }
  };

  return (
    <ConditionalDiv className="flex w-full flex-col gap-4">
      {dataRingkasanPembayaran?.orderStatus ===
      OrderStatusEnum.WAITING_PAYMENT_1 ? (
        <Button
          variant="muatparts-primary"
          className="h-8 w-full"
          onClick={handleLanjutPembayaran}
          disabled={isLoading}
          type="button"
        >
          {t("buttonLanjutPembayaran")}
        </Button>
      ) : dataStatusPesanan?.isChangeable ? (
        // Tombol "Ubah Pesanan" hanya muncul jika status pesanan memenuhi syarat untuk melakukan perubahan (H-1, Hari H, Perjalanan Muat, Tiba di Lokasi Muat 1, Antri Muat 1)
        // Ini sudah di handle sama BE, via getDetailPesananData prop isChangeable
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

      {/* Sorry banget bro aku gatau kapan ini harus muncul anjir, ingetin aku aja ya nanti */}
      {/* Ini haruse muncul pas Shipper--Sewa-Armada-Terjadwal LD-J5** */}
      {false && (
        <Button
          variant="muatparts-primary"
          className="h-8 w-full"
          onClick={() => alert("Implement konfirmasi pesanan gagal")}
          type="button"
        >
          Ya, Mengerti
        </Button>
      )}

      {isShowWaitFleetAlert && <WaitFleetSearchButton />}

      {/* Tombol "Batalkan Pesanan" ditampilkan hanya pada pesanan dengan status: Mempersiapkan Armada, Menunggu Pembayaran, Pesanan Terkonfirmasi, Menuju Lokasi Muat, Tiba di Lokasi Muat, dan Antri di Lokasi Muat. */}
      {/* Ini sudah di handle sama BE, via getDetailPesananData prop isCancellable */}
      {dataStatusPesanan?.isCancellable && (
        <ModalBatalkanPesanan dataRingkasanPembayaran={dataRingkasanPembayaran}>
          <Button
            variant="muattrans-error-secondary"
            className="h-8 w-full"
            type="button"
          >
            {t("buttonBatalkanPesanan")}
          </Button>
        </ModalBatalkanPesanan>
      )}
    </ConditionalDiv>
  );
};
