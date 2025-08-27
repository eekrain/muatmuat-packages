import Image from "next/image";
import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";

import InfoItem from "@/container/CS/DetailTambahanBiaya/components/InfoItem";

import { useTranslation } from "@/hooks/use-translation";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

// --- Helper Components ---

const ContactDetail = ({ icon, name, phone, address, fleet }) => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const { t } = useTranslation();
  const infoData = [
    ...(fleet ? [{ icon: "/icons/transporter16.svg", value: fleet }] : []),
    { icon: "/icons/phone16.svg", value: phone },
    { icon: "/icons/marker-outline.svg", value: address },
  ];
  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="flex size-[40px] items-center justify-center">
          <Image
            alt={name}
            className="rounded-[32px] border border-neutral-400"
            src="/img/avatar2.png"
            width={40}
            height={40}
          />
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <p className="text-sm font-bold">{name}</p>
          <div className="flex items-center gap-x-2 text-xs font-medium">
            {infoData.map((item, index) => (
              <Fragment key={index}>
                {index === 0 ? null : (
                  <div className="size-[2px] rounded-full bg-neutral-600" />
                )}
                <div className="flex items-center gap-x-1">
                  <IconComponent
                    src={item.icon}
                    className="text-muat-trans-secondary-900"
                  />
                  <span>{item.value}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        {fleet ? null : (
          <Button
            variant="muattrans-primary"
            onClick={() => setContactModalOpen(true)}
            className="mb-2"
          >
            {t("OrderInformation.contactButton", {}, "Hubungi")}
          </Button>
        )}
      </div>
      <HubungiModal
        isOpen={isContactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
};

const OrderInformation = ({ order, shipper }) => {
  const { t } = useTranslation();
  const getStatusText = (status) => {
    switch (status) {
      case "CANCELED_BY_SHIPPER":
        return t(
          "OrderInformation.statusCanceledByShipper",
          {},
          "Dibatalkan Shipper"
        );
      case "CANCELED_BY_SYSTEM":
        return t(
          "OrderInformation.statusCanceledBySystem",
          {},
          "Dibatalkan System"
        );
      default:
        return t(
          "OrderInformation.statusCanceledByTransporter",
          {},
          "Dibatalkan Transporter"
        );
    }
  };

  return (
    <Card className="rounded-xl border-none">
      <div className="flex flex-col gap-y-6 px-8 py-6">
        <div className="flex items-center gap-x-3">
          <InfoItem
            label={t("OrderInformation.orderNumber", {}, "No. Pesanan")}
            value={order.orderCode || "-"}
          />
          <div className="flex w-[300px] flex-col gap-y-2">
            <span className="text-xs font-medium text-neutral-600">
              {t("OrderInformation.orderStatus", {}, "Status Pesanan")}
            </span>
            <BadgeStatusPesanan variant="error" className="w-fit">
              {getStatusText(order.orderStatus)}
            </BadgeStatusPesanan>
          </div>
          <InfoItem
            label={t("OrderInformation.fleetCount", {}, "Jumlah Armada")}
            value={`${order.truckCount || 0} ${t("OrderInformation.unit", {}, "Unit")}`}
          />
        </div>
        <div className="flex h-[104px] flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-3.5">
          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-bold">
              {t("OrderInformation.shipperInfo", {}, "Informasi Shipper")}
            </h3>
            <ContactDetail
              icon="/icons/business-user.svg"
              name={shipper.companyName || "-"}
              phone={shipper.phoneNumber || "-"}
              address={shipper.district || "-"}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderInformation;
