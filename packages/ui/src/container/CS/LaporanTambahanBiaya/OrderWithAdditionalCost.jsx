import Link from "next/link";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

const OrderInfo = ({ className, title, value }) => {
  return (
    <div className={cn("flex items-center gap-x-2 text-xs", className)}>
      <span className="font-medium text-neutral-600">{title}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

const OrderWithAdditionalCost = ({
  activeTab,
  id,
  order_code,
  order_status,
  orderType,
  shipper,
  additional_cost_amount,
  bill_date,
  days_unpaid,
  pickup_locations,
  delivery_locations,
  last_contacted_by,
  last_contacted_at,
  total_contacts,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    })} WIB`;
  };

  const info = [
    {
      title: "Telah Dihubungi Oleh :",
      value: last_contacted_by || "-",
      className: "min-w-[250px] max-w-[250px]",
    },
    {
      title: "Jumlah Dihubungi :",
      value: total_contacts || 0,
      className: "min-w-[157px] max-w-[157px]",
    },
    {
      title: "Terakhir Dihubungi :",
      value: formatDate(last_contacted_at),
      className: "min-w-[253px] max-w-[253px]",
    },
  ];
  return (
    <>
      <div className="flex h-[52px] items-center gap-x-2 bg-neutral-100 px-4">
        {info.map((item, key) => (
          <OrderInfo key={key} {...item} />
        ))}
      </div>
      <div className="flex gap-x-6 p-4 pb-5">
        <div className="mt-1 flex gap-x-6">
          <div className="flex min-w-[92px] max-w-[92px] flex-col gap-y-3">
            <Button variant="link">{order_code}</Button>
            <BadgeStatusPesanan className="w-fit" variant="success">
              {orderType === "INSTANT" ? "Instan" : orderType}
            </BadgeStatusPesanan>
          </div>
          <div className="flex min-w-[280px] max-w-[280px] flex-col gap-y-2">
            <span className="text-xs font-bold">{shipper?.name}</span>
            <span className="text-xxs font-medium leading-[1.3]">
              {shipper?.phone}
            </span>
          </div>
          <div className="flex min-w-[230px] max-w-[230px] flex-col gap-y-3">
            <span className="text-xs font-bold">
              {idrFormat(additional_cost_amount)}
            </span>
            {activeTab === "active" ? (
              <div className="flex flex-col gap-y-2 text-xxs font-medium leading-[1.3]">
                <span>Tanggal Tagihan : {formatDate(bill_date)}</span>
                <span>Lama Belum Dibayarkan : {days_unpaid} Hari</span>
              </div>
            ) : null}
            {activeTab === "completed" ? (
              <div className="flex flex-col gap-y-2 text-xxs font-medium leading-[1.3]">
                <span>Tanggal Tagihan : {formatDate(bill_date)}</span>
                <span>Tanggal Pembayaran : {formatDate(bill_date)}</span>
                <span>Opsi Pembayaran : Kartu Kredit</span>
              </div>
            ) : null}
          </div>
          <div className="w-[415px]">
            <MuatBongkarStepperWithModal
              appearance={{
                titleClassName: "line-clamp-1",
              }}
              pickupLocations={
                pickup_locations?.map((location) => ({
                  fullAddress: location,
                })) || []
              }
              dropoffLocations={
                delivery_locations?.map((location) => ({
                  fullAddress: location,
                })) || []
              }
            />
          </div>
        </div>
        <Link href={`/laporan/tambahan-biaya/${id}/detail-tambahan-biaya`}>
          <Button className="px-6" variant="muattrans-primary">
            Detail
          </Button>
        </Link>
      </div>
    </>
  );
};
export default OrderWithAdditionalCost;
