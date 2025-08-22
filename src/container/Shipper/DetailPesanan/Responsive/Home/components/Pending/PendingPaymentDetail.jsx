import Image from "next/image";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

export const PendingPaymentDetail = ({ dataRingkasanPembayaran }) => {
  const { t } = useTranslation();
  const { countdown } = useCountdown({
    endingDate: dataRingkasanPembayaran?.paymentDueDateTime,
    isNeedCountdown: true,
    withHours: true,
  });
  const navigation = useResponsiveNavigation();
  // console.log("dataRingkasanPembayaran", dataRingkasanPembayaran);
  const paymentMethodInformations = [
    {
      title: t(
        "PendingPaymentDetail.titlePaymentOption",
        {},
        "Opsi Pembayaran"
      ),
      content: (
        <div className="flex h-6 items-center gap-x-3">
          {dataRingkasanPembayaran?.paymentLogo ? (
            <Image
              src={dataRingkasanPembayaran?.paymentLogo}
              width={24}
              height={24}
              alt="Payment Method Logo"
            />
          ) : null}
          <span className="text-sm font-medium leading-[1.1] text-neutral-900">
            {dataRingkasanPembayaran?.paymentMethod}
          </span>
        </div>
      ),
    },
    {
      title: t(
        "PendingPaymentDetail.titleVirtualAccount",
        {},
        "Nomor Virtual Account"
      ),
      content: (
        <div className="flex items-center gap-x-2">
          <div className="text-sm font-medium leading-[1.1] text-primary-700">
            {dataRingkasanPembayaran?.vaNumber}
          </div>
          <IconComponent
            className="text-primary-700"
            onClick={() => {}}
            src={"/icons/salin.svg"}
            width={16}
            height={16}
          />
        </div>
      ),
    },
    {
      title: t("PendingPaymentDetail.titleTotalBill", {}, "Total Tagihan"),
      content: (
        <span className="text-sm font-medium leading-[1.1] text-neutral-900">
          {idrFormat(dataRingkasanPembayaran?.totalPrice)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-y-6 bg-neutral-50 px-4 py-5">
      {/* <RingkasanPembayaranPendingPayment
        dataRingkasanPembayaran={dataRingkasanPembayaran}
        isShowWaitFleetAlert
      /> */}
      <div className="flex justify-between rounded-md bg-secondary-100 p-3">
        <div className="flex flex-col gap-y-2.5">
          <h3 className="text-sm font-bold leading-[1.1] text-warning-900">
            {t("PendingPaymentDetail.payBefore", {}, "Bayar Sebelum")}
          </h3>
          <span className="text-xs font-medium leading-[1.1] text-neutral-900">
            {formatDate(dataRingkasanPembayaran?.paymentDueDateTime)}
          </span>
        </div>
        <BadgeStatusPesanan
          variant="error"
          icon={{ iconLeft: "/icons/clock.svg" }}
          className={"w-fit"}
        >
          {countdown}
        </BadgeStatusPesanan>
      </div>
      {paymentMethodInformations.map((item, key) => (
        <div className="flex flex-col gap-y-4" key={key}>
          <div className="text-xs font-medium leading-[1.1] text-neutral-600">
            {item.title}
          </div>
          {item.content}
        </div>
      ))}
      <Button
        variant="muatparts-primary"
        className="h-7 w-full text-xs leading-[1.1]"
        onClick={() => navigation.push("/cara-pembayaran")}
        type="button"
      >
        {t("PendingPaymentDetail.buttonViewHowToPay", {}, "Lihat Cara Bayar")}
      </Button>
    </div>
  );
};
