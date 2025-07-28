import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { ModalDetailPengirimanDokumen } from "../RingkasanPembayaran/ModalDetailPengirimanDokumen";

export const ModalDetailPembayaran = ({
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
}) => {
  const isRingkasanTransaksi =
    dataRingkasanPembayaran?.orderStatus === OrderStatusEnum.COMPLETED ||
    dataRingkasanPembayaran?.orderStatus ===
      OrderStatusEnum.WAITING_PAYMENT_1 ||
    dataRingkasanPembayaran?.orderStatus?.startsWith("CANCELED");

  return (
    <Modal>
      <ModalTrigger>
        <Button
          variant="muatparts-primary-secondary"
          className="h-8"
          type="button"
        >
          Detail Pembayaran
        </Button>
      </ModalTrigger>
      <ModalContent type="muatmuat" className="py-8 pl-6 pr-[11px]">
        <h2 className="mb-6 text-center text-base font-bold leading-[1.2] text-neutral-900">
          Detail Pembayaran
        </h2>
        <div className="flex max-h-[483px] w-[424px] flex-col">
          <CardPayment.Root className="flex-1 rounded-none shadow-none">
            <CardPayment.Header className="h-auto min-h-[43px] items-start px-0">
              {isRingkasanTransaksi
                ? "Ringkasan Transaksi"
                : "Ringkasan Pembayaran"}
            </CardPayment.Header>

            <CardPayment.Body className="pl-0 pr-2">
              <CardPayment.CollapsibleSection title="Detail Pesanan">
                <CardPayment.LineItem
                  label="Waktu Pembayaran"
                  value={formatDate(dataRingkasanPembayaran?.expiredAt)}
                />
                <CardPayment.LineItem
                  label="Opsi Pembayaran"
                  valueClassName="flex items-center gap-2"
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

                <CardPayment.Section title="Biaya Pesan Jasa Angkut">
                  <CardPayment.LineItem
                    label={
                      <span>
                        Nominal Pesan Jasa Angkut <br />
                        (1 Unit)
                      </span>
                    }
                    value={idrFormat(dataRingkasanPembayaran?.transportFee)}
                  />
                </CardPayment.Section>

                {dataRingkasanPembayaran?.insuranceFee > 0 && (
                  <CardPayment.Section title="Biaya Asuransi Barang">
                    <CardPayment.LineItem
                      label="Nominal Premi Asuransi (1 Unit)"
                      value={idrFormat(dataRingkasanPembayaran.insuranceFee)}
                    />
                  </CardPayment.Section>
                )}

                <CardPayment.Section title="Biaya Layanan Tambahan">
                  <div className="flex flex-col gap-1">
                    <CardPayment.LineItem
                      label="Nominal Kirim Bukti Fisik Penerimaan Barang"
                      value={idrFormat(
                        dataRingkasanPembayaran?.documentShippingFee
                      )}
                    />
                    <ModalDetailPengirimanDokumen
                      dataRingkasanPembayaran={dataRingkasanPembayaran}
                    />
                  </div>
                  <CardPayment.LineItem
                    label="Nominal Bantuan Tambahan"
                    value={idrFormat(
                      dataRingkasanPembayaran?.otherAdditionalService
                        ?.totalPrice
                    )}
                  />
                </CardPayment.Section>

                {dataRingkasanPembayaran?.voucherDiscount > 0 && (
                  <CardPayment.Section title="Diskon Voucher">
                    <CardPayment.LineItem
                      label="Voucher (DISKONPENGGUNABARU)"
                      variant="danger"
                      value={`-${idrFormat(
                        dataRingkasanPembayaran.voucherDiscount
                      )}`}
                    />
                  </CardPayment.Section>
                )}

                <CardPayment.Section title="Biaya Lainnya">
                  <CardPayment.LineItem
                    label="Admin Layanan"
                    value={idrFormat(dataRingkasanPembayaran?.adminFee)}
                  />
                  <CardPayment.LineItem
                    label="Pajak"
                    value={idrFormat(dataRingkasanPembayaran?.tax)}
                  />
                </CardPayment.Section>
              </CardPayment.CollapsibleSection>

              <CardPayment.CollapsibleSection title="Detail Tambahan Biaya">
                <CardPayment.LineItem
                  label="Waktu Pembayaran"
                  value={formatDate(dataRingkasanPembayaran?.expiredAt)}
                />

                <CardPayment.LineItem
                  label="Opsi Pembayaran"
                  valueClassName="flex items-center gap-2"
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
                <CardPayment.Section title="Biaya Waktu Tunggu">
                  <div className="flex flex-col gap-1">
                    <CardPayment.LineItem
                      label="Nominal Waktu Tunggu (1 Driver)"
                      value={idrFormat(200000)}
                    />
                    <ModalDetailWaktuTunggu />
                  </div>
                </CardPayment.Section>
                <CardPayment.Section title="Biaya Overload Muatan">
                  <div className="flex flex-col gap-1">
                    <CardPayment.LineItem
                      label="Nominal Overload Muatan (2.000 kg)"
                      value={idrFormat(100000)}
                    />
                    <ModalDetailOverloadMuatan
                      dataRingkasanPembayaran={dataRingkasanPembayaran}
                    />
                  </div>
                </CardPayment.Section>
                <CardPayment.Section title="Biaya Lainnya">
                  <CardPayment.LineItem
                    label="Admin Layanan"
                    value={idrFormat(10000)}
                  />
                </CardPayment.Section>
              </CardPayment.CollapsibleSection>
            </CardPayment.Body>
            <div className="pr-[13px]">
              <CardPayment.Footer className="border-t border-neutral-400 px-0 pt-4 shadow-none">
                <CardPayment.Total
                  label="Total"
                  value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
                />
              </CardPayment.Footer>
            </div>
          </CardPayment.Root>

          <div className="mt-6 w-full pr-[13px]">
            <Button
              appearance={{
                iconClassname: "text-primary-700",
              }}
              iconLeft="/icons/download16.svg"
              variant="muatparts-primary-secondary"
              className="h-8 w-full"
              type="button"
            >
              Unduh Bukti Pembayaran
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
