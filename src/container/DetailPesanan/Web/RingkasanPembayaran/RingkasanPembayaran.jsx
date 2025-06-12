// RingkasanPembayaran.jsx
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

const RingkasanPembayaran = () => {
  return (
    <div className="flex w-[338px] flex-col items-center gap-4">
      {/* Card Ringkasan Pembayaran */}
      <div className="flex h-fit w-[338px] flex-col items-start">
        {/* Top Section */}
        <div className="flex w-full flex-col items-start gap-6 bg-white p-6 pb-0 pt-6">
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
                  06 Jun 2024 19:00 WIB
                </span>
              </div>

              {/* Opsi Pembayaran */}
              <div className="flex w-full items-center justify-between">
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Opsi Pembayaran
                </span>
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/img/bca-icon.svg"
                    width={16}
                    height={16}
                  />
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    BCA Virtual Account
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
                Rp950.000
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
                Rp0
              </span>
            </div>
          </div>

          {/* Biaya Layanan Tambahan Section */}
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              Biaya Layanan Tambahan
            </span>
          </div>
        </div>

        {/* Total Section */}
        <div className="flex w-full flex-col items-start bg-white p-6 shadow-md">
          <div className="flex w-full items-start justify-between">
            <span className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Total
            </span>
            <span className="text-right text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Rp1.077.490
            </span>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex w-[338px] flex-col gap-4">
        <Button
          variant="muatparts-primary-secondary"
          className="h-8 w-full"
          onClick={() => {}}
          type="button"
        >
          Ubah Pesanan
        </Button>
        <Button
          variant="muattrans-error-secondary"
          className="h-8 w-full"
          onClick={() => {}}
          type="button"
        >
          Batalkan Pesanan
        </Button>
      </div>
    </div>
  );
};

export default RingkasanPembayaran;
