import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

// Dummy components and data for completion
const ModalDetailPengirimanDokumen = ({ dataRingkasanPembayaran }) => <div />;
const ModalDetailWaktuTunggu = ({ driver }) => <div />;
const ModalDetailOverloadMuatan = ({ dataRingkasanPembayaran }) => <div />;

// Dummy data for demonstration
const dataRingkasanPembayaran = {
  insuranceFee: 50000,
  documentShippingFee: 25000,
  otherAdditionalService: { totalPrice: 15000 },
  voucherDiscount: 20000,
  adminFee: 10000,
  tax: 5000,
  totalPrice: 1200000,
};

export const TransactionSummary = ({ documentShippingDetail }) => {
  const isRingkasanTransaksi = true;
  const { t } = useTranslation();

  const expiredAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
  const transportFee = 950000;

  const [isDocumentShippingDetailOpen, setDocumentShippingDetailOpen] =
    useState(false);

  // Use the data from props or fallback to example data
  const shippingData = documentShippingDetail || {
    recipientName: "Cakra",
    recipientPhone: "081249088083",
    fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
    detailAddress: "Gedung ABC Lantai 5",
    district: "Tanah Abang",
    city: "Jakarta Pusat",
    province: "DKI Jakarta",
    postalCode: "10270",
    courier: "JNE",
    courierPrice: 200000,
    insurancePrice: 10000,
    totalPrice: 210000,
  };
  return (
    <>
      <div className="bg-white px-4 py-5">
        <CardPayment.Root>
          <CardPayment.Header className={"mb-6"}>
            {isRingkasanTransaksi
              ? "Ringkasan Transaksi"
              : "Ringkasan Pembayaran"}
          </CardPayment.Header>

          <CardPayment.Content noScroll>
            <CardPayment.ContainerItem title="Biaya Pesan Jasa Angkut">
              <CardPayment.Item
                label={
                  <span>
                    Nominal Pesan Jasa Angkut <br />
                    (1 Unit)
                  </span>
                }
                value={idrFormat(transportFee)}
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
              <CardPayment.Item
                label={
                  <div>
                    <>Nominal Kirim Bukti Fisik Penerimaan Barang</>
                    <button
                      onClick={() => setDocumentShippingDetailOpen(true)}
                      className="h-2 w-fit text-xs font-medium leading-[1.2] text-primary-700"
                    >
                      Lihat Detail Pengiriman Dokumen
                    </button>
                  </div>
                }
                value={idrFormat(dataRingkasanPembayaran?.documentShippingFee)}
              />
              {/* <ModalDetailPengirimanDokumen
              dataRingkasanPembayaran={dataRingkasanPembayaran}
            /> */}
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

            <hr />

            <CardPayment.ContainerItem title="Biaya Lainnya">
              <div className="flex flex-col gap-3">
                <CardPayment.Item
                  label="Admin Layanan"
                  value={idrFormat(dataRingkasanPembayaran?.adminFee)}
                />

                <CardPayment.Item
                  label="Pajak"
                  appearance={{
                    valueClassName: "text-error-400",
                  }}
                  value={`-${idrFormat(dataRingkasanPembayaran?.tax)}`}
                />
              </div>
            </CardPayment.ContainerItem>

            {/* <CardPayment.ContainerCollapsible title="Detail Tambahan Biaya">
            <div className="flex flex-col gap-3">
              <CardPayment.Item
                label="Waktu Pembayaran"
                value={formatDate(expiredAt)}
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
              <CardPayment.Item
                label="Nominal Waktu Tunggu (1 Driver)"
                value={idrFormat(200000)}
              />
              <ModalDetailWaktuTunggu
              />
            </CardPayment.ContainerItem>

            <CardPayment.ContainerItem title="Biaya Overload Muatan">
              <CardPayment.Item
                label="Nominal Overload Muatan (2.000 kg)"
                value={idrFormat(100000)}
                className="h-auto"
              />
              <ModalDetailOverloadMuatan
                dataRingkasanPembayaran={dataRingkasanPembayaran}
              />
            </CardPayment.ContainerItem>

            <CardPayment.ContainerItem title="Biaya Lainnya">
              <CardPayment.Item
                label="Admin Layanan"
                value={idrFormat(10000)}
              />
            </CardPayment.ContainerItem>
          </CardPayment.ContainerCollapsible> */}

            {/* <CardPayment.Subtotal
            label="Subtotal"
            value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
          /> */}
          </CardPayment.Content>

          {/* <CardPayment.FooterTotal
          label="Total"
          value={idrFormat(dataRingkasanPembayaran?.totalPrice)}
        /> */}
        </CardPayment.Root>
      </div>

      {/* Bottomsheet Detail Pengiriman Dokumen */}
      <BottomSheet
        open={isDocumentShippingDetailOpen}
        onOpenChange={setDocumentShippingDetailOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            {t("Detail Pengiriman Dokumen")}
          </BottomSheetHeader>

          <div className="my-6 mr-1 h-[68vh] overflow-y-auto px-4 text-xs text-neutral-900">
            <div className="divide-y divide-neutral-200">
              {/* Recipient Info Section */}
              <div className="py-4 first:pt-0">
                <h3 className="mb-2 font-semibold">{t("Nama Penerima")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.recipientName}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">
                  {t("Nomor Handphone Penerima")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.recipientPhone}
                </p>
              </div>

              {/* Address Info Section */}
              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Alamat Tujuan")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.fullAddress}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">
                  {t("Detail Alamat Tujuan")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.detailAddress}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kecamatan")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.district}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kabupaten/Kota")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.city}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Provinsi")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.province}
                </p>
              </div>

              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Kode Pos")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.postalCode}
                </p>
              </div>

              {/* Shipping Info Section */}
              <div className="py-4">
                <h3 className="mb-2 font-semibold">{t("Nama Ekspedisi")}</h3>
                <p className="font-medium text-neutral-600">
                  {shippingData.courier}
                </p>
              </div>

              {/* Pricing Info Section */}
              {/* <div className="py-4">
              <h3 className="mb-2 font-semibold">{t("Biaya Pengiriman")}</h3>
              <p className="font-medium text-neutral-600">
                {idrFormat(shippingData.courierPrice)}
              </p>
            </div> */}

              <div className="py-4 last:pb-0">
                <h3 className="mb-2 font-semibold">
                  {t("Asuransi Pengiriman")}
                </h3>
                <p className="font-medium text-neutral-600">
                  {idrFormat(shippingData.insurancePrice)}
                </p>
              </div>

              {/* <div className="py-4 last:pb-0">
              <h3 className="mb-2 font-semibold">{t("Total Biaya")}</h3>
              <p className="font-semibold text-neutral-900">
                {idrFormat(shippingData.totalPrice)}
              </p>
            </div> */}
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </>
  );
};
