import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { TagBubble } from "@/components/Badge/TagBubble";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

const DaftarPesananResponsive = ({ orders }) => {
  console.log("orders", orders);
  const router = useRouter();
  // State buat bottomsheet lokasi muat bongkar
  const [isLocationBottomsheetOpen, setLocationBottomsheetOpen] =
    useState(false);
  const [locationType, setLocationType] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const locationLabel = {
    muat: "Lokasi Muat",
    bongkar: "Lokasi Bongkar",
  };

  return (
    <SearchBarResponsiveLayout placeholder="Cari Pesanan">
      <div className="flex min-h-[calc(100vh_-_62px)] flex-col gap-y-2 bg-neutral-200 text-neutral-900">
        {/* Filter */}
        <div className="scrollbar-hide flex items-center gap-x-1 overflow-x-auto border-b border-b-neutral-400 bg-neutral-50 py-5 pl-4">
          <button
            className={cn(
              "flex h-[30px] items-center gap-x-2 rounded-3xl border border-neutral-200 bg-neutral-200 px-3"
            )}
          >
            <span className="text-sm font-medium leading-[1.1]">Filter</span>
            <IconComponent src="/icons/filter14.svg" width={14} height={14} />
          </button>
          <div className="flex items-center gap-x-1 pr-4">
            <TagBubble>Semua</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
          </div>
        </div>
        {/* List Pesanan */}
        {orders.map((order, key) => {
          const armadaData = [
            {
              title: "Armada",
              value: `${order.vehicle.carrierName} - ${order.vehicle.truckTypeName}`,
            },
            {
              title: "Jumlah Armada",
              value: `${order.vehicle.truckCount} Unit`,
            },
          ];
          const firstPickupDropoff = [
            order.locations.pickup[0],
            order.locations.dropoff[0],
          ];
          // Convert OrderStatusEnum to an array of keys to determine the order
          const statusOrder = Object.keys(OrderStatusEnum);

          // Sort the array based on the index in statusOrder
          const sortedArray = [...order.statusInfo].sort((a, b) => {
            const indexA = statusOrder.indexOf(a.statusCode);
            const indexB = statusOrder.indexOf(b.statusCode);
            return indexA - indexB;
          });

          // Get the first item (earliest in the enum)
          const latestStatus = sortedArray[0];
          return (
            <div className="flex flex-col gap-y-4 bg-neutral-50 p-4" key={key}>
              <div className="flex flex-col gap-y-2 border-b border-b-neutral-400 pb-4 text-xs leading-[1.1]">
                <h4 className="font-bold">{order.invoice}</h4>
                <span className="font-medium">{`Muat: ${formatDate(order.loadTimeStart)}${order.loadTimeEnd ? ` s/d ${formatDate(order.loadTimeEnd)}` : ""}`}</span>
              </div>
              <div className="flex flex-col gap-y-3">
                <TimelineContainer>
                  {firstPickupDropoff.map((item, key) => (
                    <Fragment key={key}>
                      <TimelineItem
                        variant="bullet"
                        totalLength={firstPickupDropoff.length}
                        index={key}
                        activeIndex={0}
                      >
                        <TimelineContentWithButtonDate
                          className={`whitespace-normal text-xs font-semibold leading-[1.1] ${
                            key === firstPickupDropoff?.length - 1 ? "pb-0" : ""
                          }`}
                          title={item.fullAddress}
                          withButton={
                            key === 0 && order.locations.pickup.length > 1
                              ? {
                                  label: "Lihat Lokasi Muat Lainnya",
                                  onClick: () => {
                                    setSelectedLocations(
                                      order.locations.pickup
                                    );
                                    setLocationType("muat");
                                    setLocationBottomsheetOpen(true);
                                  },
                                }
                              : key === 1 && order.locations.dropoff.length > 1
                                ? {
                                    label: "Lihat Lokasi Bongkar Lainnya",
                                    onClick: () => {
                                      setSelectedLocations(
                                        order.locations.dropoff
                                      );
                                      setLocationType("bongkar");
                                      setLocationBottomsheetOpen(true);
                                    },
                                  }
                                : null
                          }
                        />
                      </TimelineItem>
                    </Fragment>
                  ))}
                </TimelineContainer>
                <div className="pl-7">
                  <BadgeStatusPesanan
                    variant={
                      latestStatus?.statusLabel ===
                        OrderStatusEnum.WAITING_PAYMENT_1 ||
                      latestStatus?.statusLabel ===
                        OrderStatusEnum.WAITING_PAYMENT_2 ||
                      latestStatus?.statusLabel ===
                        OrderStatusEnum.WAITING_REPAYMENT_1 ||
                      latestStatus?.statusLabel ===
                        OrderStatusEnum.WAITING_REPAYMENT_2
                        ? "warning"
                        : latestStatus?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_SHIPPER ||
                            latestStatus?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_SYSTEM ||
                            latestStatus?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_TRANSPORTER
                          ? "error"
                          : latestStatus?.statusLabel ===
                              OrderStatusEnum.COMPLETED
                            ? "success"
                            : "primary"
                    }
                    className="w-full"
                  >
                    {latestStatus?.statusLabel}
                  </BadgeStatusPesanan>
                </div>
              </div>
              <div className="flex gap-x-4">
                {armadaData.map((item, key) => (
                  <div
                    className="flex flex-1 flex-col gap-y-3 text-xs leading-[1.1]"
                    key={key}
                  >
                    <span className="font-medium text-neutral-600">
                      {item.title}
                    </span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <Button
                className="w-full"
                variant="muatparts-primary-secondary"
                onClick={() =>
                  router.push(`/daftarpesanan/detailpesanan/${order.orderId}`)
                }
              >
                Detail
              </Button>
            </div>
          );
        })}
      </div>
      <BottomSheet
        open={isLocationBottomsheetOpen}
        onOpenChange={setLocationBottomsheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            {locationLabel[locationType] || ""}
          </BottomSheetHeader>
          <div className="w-full px-4 py-6">
            <TimelineContainer>
              {selectedLocations?.map((item, key) => (
                <Fragment key={key}>
                  <TimelineItem
                    variant={
                      locationType === "muat" ? "number-muat" : "number-bongkar"
                    }
                    totalLength={selectedLocations.length}
                    index={key}
                    activeIndex={0}
                  >
                    <TimelineContentAddress
                      title={item.fullAddress}
                      className={`whitespace-normal leading-[1.1] ${
                        key === selectedLocations?.length - 1 ? "pb-0" : ""
                      }`}
                    />
                  </TimelineItem>
                </Fragment>
              ))}
            </TimelineContainer>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </SearchBarResponsiveLayout>
  );
};

export default DaftarPesananResponsive;
