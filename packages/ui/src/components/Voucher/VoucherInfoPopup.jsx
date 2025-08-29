// components/Voucher/VoucherInfoPopup.jsx
import Image from "next/image";

import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";

export default function VoucherInfoPopup({
  open,
  onOpenChange,
  voucher = {
    code: "Diskon 50%",
    nominal: 100000,
    validFrom: "2024-10-19",
    validTo: "2024-10-28",
    usagePercentage: 20,
    minOrderAmount: 300000,
    termsAndConditions: [
      "Dapatkan diskon 50% sampai dengan Rp100.000",
      "Minimum belanja Rp200.000",
      "Pembayaran yang berlaku: BCA Virtual Account",
      "1 promo berlaku untuk 2 kali transaksi selama periode promo",
      "Promo tidak dapat digunakan untuk produk Muatparts",
      "Promo berlaku di aplikasi Muatparts berbasis iOS dan/atau Android versi terbaru",
    ],
    usageInstructions: [
      "Masuk ke halaman Voucher Saya dan pilih Voucher",
      // add more steps here if needed
    ],
  },
}) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onOpenChange={onOpenChange} withCloseButton={false}>
      <ModalContent className="max-w-md overflow-hidden rounded-xl bg-white p-0 shadow-xl">
        {/* Header */}

        <div className="relative bg-blue-500 text-white">
          {/* fake “scallop” stubs – replace with SVG or clip-path for perfect match */}
          <div className="absolute inset-y-0 left-0 w-3 bg-blue-600"></div>
          <div className="absolute inset-y-0 right-0 w-3 bg-blue-600"></div>

          {/* dashed separator */}
          <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white"></div>

          <div className="flex p-4">
            {/* Left side */}
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold">{voucher.code}</h2>
              <div className="mt-1 text-sm">
                {t("VoucherInfoPopup.until", {}, "hingga")}
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-lg font-medium">Rp</span>
                <span className="mx-1 text-5xl font-bold">
                  {Math.floor(voucher.nominal / 1000)}
                </span>
                <div className="relative">
                  <span className="inline-block flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold leading-none text-white">
                    rb
                  </span>
                  <span className="absolute -right-1 -top-1 inline-block flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold leading-none text-white">
                    *
                  </span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-center justify-center pl-4">
              <Image
                src="/icons/muatmuat.png"
                alt="muatrans logo"
                width={100}
                height={30}
              />
              <div className="mt-2 flex items-center text-xs">
                <Image
                  src="/icons/calendar-infovoucher.svg"
                  alt="Calendar"
                  width={16}
                  height={16}
                  className="mr-1"
                />
                <span>
                  {voucher.validFrom} - {voucher.validTo}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">
              Kuota Voucher Telah Terpakai{" "}
              <span className="font-medium">{voucher.usagePercentage}%</span>
            </span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${voucher.usagePercentage}%` }}
            />
          </div>
        </div>
        <div className="max-h-[325px] overflow-y-auto">
          {/* Usage bar */}

          {/* Validity & Min. Transaksi */}
          {[
            {
              icon: "/icons/clock-voucher.png",
              label: t("VoucherInfoPopup.validUntil", {}, "Berlaku hingga"),
              value: voucher.validTo,
            },
            {
              icon: "/icons/transaction-voucher.png",
              label: t(
                "VoucherInfoPopup.minTransaction",
                {},
                "Minimum transaksi"
              ),
              value: idrFormat(voucher.minOrderAmount),
            },
          ].map(({ icon, label, value }, i) => (
            <div
              key={i}
              className={`border-b border-gray-200 px-4 py-2 ${
                i === 1 ? "" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src={icon}
                    alt={label}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                  <span className="rounded px-2 py-1 text-xs text-gray-600">
                    {label}
                  </span>
                </div>
                <span className="text-xs font-medium">{value}</span>
              </div>
            </div>
          ))}

          {/* Terms & Conditions */}
          <div className="px-4 py-3">
            <h3 className="mb-2 text-sm font-semibold">
              {t("VoucherInfoPopup.termsTitle", {}, "Syarat Dan Ketentuan")}
            </h3>
            <ol className="ml-4 list-decimal text-sm text-gray-700">
              {voucher.termsAndConditions.map((t, idx) => (
                <li key={idx} className="mb-1">
                  {t}
                </li>
              ))}
            </ol>
          </div>

          {/* Usage Instructions */}
          <div className="px-4 py-3">
            <h3 className="mb-2 text-sm font-semibold">
              {t("VoucherInfoPopup.usageTitle", {}, "Cara Pemakaian")}
            </h3>
            <ol className="ml-4 list-decimal text-sm text-gray-700">
              {voucher.usageInstructions.map((u, idx) => (
                <li key={idx} className="mb-1">
                  {u}
                </li>
              ))}
            </ol>
          </div>
        </div>
        {/* Back Button */}
        <div className="flex justify-center px-4 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full bg-blue-500 py-2 text-sm font-medium text-white"
          >
            {t("VoucherInfoPopup.buttonBack", {}, "Kembali")}
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}
