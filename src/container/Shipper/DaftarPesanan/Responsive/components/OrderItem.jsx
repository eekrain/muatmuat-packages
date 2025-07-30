import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import ConfirmationModalResponsive from "@/components/Modal/ConfirmationModalResponsive";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import DriverStatusBottomsheet from "@/container/Shipper/DaftarPesanan/Responsive/components/DriverStatusBottomsheet";
import LocationBottomsheet from "@/container/Shipper/DaftarPesanan/Responsive/components/LocationBottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";

const OrderItem = ({
  orderId,
  invoice,
  loadTimeStart,
  loadTimeEnd,
  vehicle,
  locations,
  statusInfo = [],
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  // State buat bottomsheet lokasi muat bongkar
  const [isLocationBottomsheetOpen, setLocationBottomsheetOpen] =
    useState(false);
  const [locationType, setLocationType] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  // State buat bottomsheet status driver
  const [isAllDriverStatusModalOpen, setIsAllDriverStatusModalOpen] =
    useState(false);
  const [selectedGroupedStatusInfo, setSelectedGroupedStatusInfo] = useState(
    []
  );
  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);

  const armadaData = [
    {
      title: "Armada",
      value: `${vehicle.carrierName} - ${vehicle.truckTypeName}`,
    },
    {
      title: "Jumlah Armada",
      value: `${vehicle.truckCount} Unit`,
    },
  ];
  const firstPickupDropoff = [locations.pickup[0], locations.dropoff[0]];
  // Convert OrderStatusEnum to an array of keys to determine the order
  const statusOrder = Object.keys(OrderStatusEnum);

  // Sort the array based on the index in statusOrder
  const sortedArray = [...statusInfo].sort((a, b) => {
    const indexA = statusOrder.indexOf(a.statusCode);
    const indexB = statusOrder.indexOf(b.statusCode);
    return indexA - indexB;
  });

  // Get the first item (earliest in the enum)
  const latestStatus = sortedArray[0];

  const beforeLoadingStatus = [
    OrderStatusEnum.PREPARE_FLEET,
    OrderStatusEnum.WAITING_PAYMENT_1,
    OrderStatusEnum.WAITING_PAYMENT_2,
    OrderStatusEnum.SCHEDULED_FLEET,
    OrderStatusEnum.CONFIRMED,
  ];

  const handleReceiveDocument = async () => {
    toast.success(t("messagePesananBerhasilDiselesaikan"));
    setIsDocumentReceivedModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 bg-neutral-50 p-4">
        <div className="flex flex-col gap-y-2 border-b border-b-neutral-400 pb-4 text-xs leading-[1.1]">
          <h4 className="font-bold">{invoice}</h4>
          <span className="font-medium">{`Muat: ${formatDate(loadTimeStart)}${loadTimeEnd ? ` s/d ${formatDate(loadTimeEnd)}` : ""}`}</span>
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
                    title={item?.fullAddress}
                    withButton={
                      key === 0 && locations.pickup.length > 1
                        ? {
                            label: "Lihat Lokasi Muat Lainnya",
                            onClick: () => {
                              setSelectedLocations(locations.pickup);
                              setLocationType("muat");
                              setLocationBottomsheetOpen(true);
                            },
                          }
                        : key === 1 && locations.dropoff.length > 1
                          ? {
                              label: "Lihat Lokasi Bongkar Lainnya",
                              onClick: () => {
                                setSelectedLocations(locations.dropoff);
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
            {vehicle?.truckCount > 1 || statusInfo.length > 1 ? (
              <button
                className="w-full"
                onClick={() => {
                  // Create an empty result object
                  const result = {};

                  // First pass: group by statusLabel and count
                  statusInfo.forEach((item) => {
                    const { statusLabel } = item;

                    if (!result[statusLabel]) {
                      result[statusLabel] = {
                        statusLabel,
                        statusCode: item.statusCode,
                        count:
                          vehicle?.truckCount > 1 ? vehicle?.truckCount : 1,
                      };
                    } else {
                      result[statusLabel].count++;
                    }
                  });

                  // Convert to array for sorting
                  const resultArray = Object.values(result);

                  // Create ordering map (status code -> index in OrderStatusTitle)
                  const orderIndices = {};
                  Object.keys(OrderStatusTitle).forEach((code, index) => {
                    orderIndices[code] = index;
                  });

                  // Sort based on the ordering
                  resultArray.sort((a, b) => {
                    return (
                      orderIndices[a.statusCode] - orderIndices[b.statusCode]
                    );
                  });

                  setSelectedGroupedStatusInfo(resultArray);
                  setIsAllDriverStatusModalOpen(true);
                }}
              >
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
                  {`${latestStatus?.statusLabel} : ${vehicle?.truckCount} ${t("labelUnit")}`}
                </BadgeStatusPesanan>
              </button>
            ) : (
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
                      : latestStatus?.statusLabel === OrderStatusEnum.COMPLETED
                        ? "success"
                        : "primary"
                }
                className="w-full"
              >
                {latestStatus?.statusLabel}
              </BadgeStatusPesanan>
            )}
          </div>
        </div>
        <div className="flex gap-x-4">
          {armadaData.map((item, key) => (
            <div
              className="flex flex-1 flex-col gap-y-3 text-xs leading-[1.1]"
              key={key}
            >
              <span className="font-medium text-neutral-600">{item.title}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-x-3">
          <Button
            className="w-full text-xs leading-[1.1]"
            variant="muatparts-primary-secondary"
            onClick={() =>
              router.push(`/daftarpesanan/detailpesanan/${orderId}`)
            }
          >
            Detail
          </Button>
          {latestStatus === OrderStatusEnum.DOCUMENT_DELIVERY ? (
            <Button
              onClick={() => setIsDocumentReceivedModalOpen(true)}
              variant="muatparts-primary"
              className="w-full text-xs leading-[1.1]"
            >
              {t("buttonSelesaikanPesanan")}
            </Button>
          ) : latestStatus === OrderStatusEnum.COMPLETED ? (
            <Button
              variant="muatparts-primary"
              className="w-full text-xs leading-[1.1]"
            >
              {t("buttonBeriUlasan")}
            </Button>
          ) : beforeLoadingStatus.includes(latestStatus) ||
            latestStatus.statusCode === OrderStatusEnum.COMPLETED ||
            latestStatus.statusCode === OrderStatusEnum.CANCELED_BY_SHIPPER ||
            latestStatus.statusCode === OrderStatusEnum.CANCELED_BY_SYSTEM ||
            latestStatus.statusCode ===
              OrderStatusEnum.CANCELED_BY_TRANSPORTER ? (
            <Button
              variant="muatparts-primary"
              className="w-full text-xs leading-[1.1]"
              onClick={() => {
                // setSelectedOrderId(order.orderId);
                setIsReorderFleetModalOpen(true);
              }}
            >
              {t("buttonPesanUlang")}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Bottomsheet Lokasi Muat Bongkar */}
      <LocationBottomsheet
        isOpen={isLocationBottomsheetOpen}
        setOpen={setLocationBottomsheetOpen}
        locationType={locationType}
        selectedLocations={selectedLocations}
      />

      {/* Bottomsheet status driver */}
      <DriverStatusBottomsheet
        isOpen={isAllDriverStatusModalOpen}
        setOpen={setIsAllDriverStatusModalOpen}
        selectedGroupedStatusInfo={selectedGroupedStatusInfo}
      />

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModalResponsive
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{ text: "Informasi" }}
        description={{
          text: 'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.',
        }}
        cancel={{
          text: t("buttonBelum"),
        }}
        confirm={{
          text: t("buttonSudah"),
          onClick: handleReceiveDocument,
        }}
      />
    </>
  );
};

export default OrderItem;
