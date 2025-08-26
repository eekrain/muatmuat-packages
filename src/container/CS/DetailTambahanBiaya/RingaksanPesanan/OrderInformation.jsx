import Image from "next/image";
import { Fragment, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import InfoItem from "@/container/CS/DetailTambahanBiaya/components/InfoItem";
import { ORDER_STATUS } from "@/utils/CS/orderStatus";

// --- Helper Components ---

const ContactDetail = ({ icon, name, phone, address, fleet }) => {
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const infoData = [
    ...(fleet ? [{ icon: "/icons/transporter16.svg", value: fleet }] : []),
    { icon: "/icons/phone16.svg", value: phone },
    { icon: "/icons/marker-outline.svg", value: address },
  ];

  const dummyContact = {
    pics: [
      {
        name: "Alexander", // [dbm_mt_transporter.picName] (PIC 1 - existing)
        position: "", // [dbm_mt_transporter.picPosition] (PIC 1 - existing)
        phoneNumber: "0821-2345-6869-90", // [dbm_mt_transporter.picPhone] (PIC 1 - existing),
        Level: 1,
      },
      {
        name: "Alexander krisna indra candra", // [dbm_mt_transporter.picName2]
        position: "", // [dbm_mt_transporter.picPosition2]
        phoneNumber: "0821-2345-8686", // [dbm_mt_transporter.picPhone2],
        Level: 2,
      },
      {
        name: "", // [dbm_mt_transporter.picName3]
        position: "", // [dbm_mt_transporter.picPosition3]
        phoneNumber: "", // [dbm_mt_transporter.picPhone3],
        Level: 3,
      },
    ],
    emergencyContact: {
      name: "Candra Ariansyah", // [dbm_mt_user.fullName]
      position: "", // Default value
      phoneNumber: "0821-2345-8686", // [dbm_mt_user.phoneNumber]
    },
    companyContact: "0821-2345-8686",
  };

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
        <div className="flex w-[621px] flex-col gap-y-3">
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
          >
            Hubungi
          </Button>
        )}
      </div>
      <HubungiModal
        isOpen={isContactModalOpen}
        onClose={() => setContactModalOpen(false)}
        contacts={dummyContact}
      />
    </>
  );
};

const OrderInformation = ({ order, shipper, transporters }) => {
  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return "Selesai";
      case "WAITING_REPAYMENT_3":
        return "Menunggu Pelunasan";
      default:
        return "Menunggu Pelunasan";
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return "success";
      case "WAITING_REPAYMENT_3":
        return "warning";
      default:
        return "warning";
    }
  };

  return (
    <Card className="rounded-xl border-none">
      <div className="flex flex-col gap-y-6 px-8 py-6">
        <div className="flex items-center gap-x-3">
          <InfoItem label="No. Pesanan" value={order.code || "-"} />
          <div className="flex w-[300px] flex-col gap-y-2">
            <span className="text-xs font-medium text-neutral-600">
              Status Pesanan
            </span>
            <BadgeStatusPesanan
              variant={getStatusBadgeVariant(order.status)}
              className="w-fit"
            >
              {getStatusText(order.status)}
            </BadgeStatusPesanan>
          </div>
          <InfoItem
            label="Jumlah Armada"
            value={`${order.fleet_count || 0} Unit`}
          />
        </div>
        <div className="flex flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
          <div className="flex flex-col gap-y-3 border-b border-b-neutral-400 pb-5">
            <h3 className="text-sm font-bold">Informasi Shipper</h3>
            <ContactDetail
              icon="/icons/business-user.svg"
              name={shipper.company_name || shipper.name || "-"}
              phone={shipper.phone || "-"}
              address={shipper.location || "-"}
            />
          </div>
          <div className="flex flex-col gap-y-3">
            <h3 className="text-sm font-bold">Informasi Transporter</h3>
            {transporters.length > 0 ? (
              transporters.map((transporter, index) => (
                <ContactDetail
                  key={index}
                  icon="/icons/truck-02.svg"
                  name={transporter.name || "-"}
                  phone={transporter.phone || "-"}
                  address={transporter.location || "-"}
                  fleet={`${transporter.fleet_count || 0} Unit`}
                />
              ))
            ) : (
              <p className="text-sm text-neutral-500">
                Tidak ada data transporter
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderInformation;
