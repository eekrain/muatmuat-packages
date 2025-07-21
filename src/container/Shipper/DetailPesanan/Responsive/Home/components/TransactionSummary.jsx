import CardPayment from "@/components/Card/CardPayment";
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

export const TransactionSummary = () => {
  const isRingkasanTransaksi = true;

  const expiredAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
  const transportFee = 950000;

  return (
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
                    onClick={() => {}}
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
  );
};
