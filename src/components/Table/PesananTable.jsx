import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { TagBubble } from "@/components/Badge/TagBubble";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Filter from "@/components/Filter/Filter";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineItem,
} from "@/components/Timeline";
import MuatBongkarModal from "@/container/DetailPesanan/Web/RingkasanPesanan/MuatBongkarModal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const PesananTable = ({
  queryParams,
  onChangeQueryParams,
  tempSearch,
  setTempSearch,
  hasOrders,
  orders,
  isOrdersLoading,
  searchOnly = false,
  isFirstTimer,
  lastFilterField,
  tabs,
}) => {
  // Updated options with new structure
  const options = [
    {
      key: "status",
      label: "Status",
      children: [
        { value: "CONFIRMED", label: "Pesanan Terkonfirmasi" },
        { value: "SCHEDULED_FLEET", label: "Armada Dijadwalkan" },
        { value: "LOADING", label: "Proses Muat" },
        { value: "UNLOADING", label: "Proses Bongkar" },
        { value: "PREPARE_DOCUMENT", label: "Dokumen Sedang Disiapkan" },
        { value: "COMPLETED", label: "Selesai" },
        { value: "CANCELED", label: "Dibatalkan" },
      ],
    },
  ];
  const router = useRouter();

  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [isLokasiMuatBongkarModalOpen, setIsLokasiMuatBongkarModalOpen] =
    useState(false);
  const [isAllDriverStatusModalOpen, setIsAllDriverStatusModalOpen] =
    useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGroupedStatusInfo, setSelecetedGroupedStatusInfo] = useState(
    []
  );

  const selectedFilter = useShallowMemo(
    () =>
      options
        .flatMap((item) => item.children || [])
        .find((item) => item.value === queryParams.status),
    [options, queryParams]
  );

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      onChangeQueryParams("search", tempSearch);
    }
  };

  const handleClearSearch = () => {
    onChangeQueryParams("search", "");
    setTempSearch("");
  };

  // Function to get the appropriate sort icon based on current sort state
  const getSortIcon = (columnName) => {
    if (queryParams.sort === columnName) {
      return queryParams.order === "desc"
        ? "/icons/sort-descending16.svg"
        : "/icons/sort-ascending16.svg";
    }
    return "/icons/sorting16.svg";
  };

  // Generic function to handle sorting for any column
  const handleSort = (columnName) => {
    // If sort is empty or not the current column, set to current column and order to desc
    if (queryParams.sort !== columnName) {
      onChangeQueryParams("sort", columnName);
      onChangeQueryParams("order", "desc");
    }
    // If sort is the current column and order is desc, change to asc
    else if (queryParams.sort === columnName && queryParams.order === "desc") {
      onChangeQueryParams("order", "asc");
    }
    // If sort is the current column and order is asc, reset sort and order
    else {
      onChangeQueryParams("sort", "");
      onChangeQueryParams("order", "");
    }
  };

  // Handlers for specific columns
  const handleKodePesananSort = () => handleSort("invoice");
  const handleTanggalMuatSort = () => handleSort("loadTimeStart");

  const handleReceiveDocument = () => {
    // Hit API /base_url/v1/orders/{orderId}/document-received
    alert("Hit API /base_url/v1/orders/{orderId}/document-received");
    setIsDocumentReceivedModalOpen(false);
    toast.success("Pesanan berhasil diselesaikan");
  };

  const handleReorderFleet = (id) => {
    if (id) {
      alert("Pesan ulang");
    } else {
      router.push("/sewaarmada");
    }
    setIsReorderFleetModalOpen(false);
  };

  const openLocationModal = (order) => {
    // Prepare locations data from API response
    const locationData = [];

    // Add pickup locations
    if (order.locations?.pickup) {
      order.locations.pickup.forEach((loc, index) => {
        locationData.push({
          fullAddress: loc.fullAddress,
          isPickup: true,
          index: index,
          isBullet: false,
        });
      });
    }

    // Add dropoff locations
    if (order.locations?.dropoff) {
      order.locations.dropoff.forEach((loc, index) => {
        locationData.push({
          fullAddress: loc.fullAddress,
          isPickup: false,
          index: index,
          isBullet: false,
        });
      });
    }

    setSelectedLocations(locationData);
    setIsLokasiMuatBongkarModalOpen(true);
  };

  return (
    <>
      <Card className="shadow-muat mt-6 h-auto w-[1232px] border-none">
        <CardContent className="p-0">
          {/* Table Filter */}
          <div className="flex flex-col gap-y-6 p-6 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <Input
                  className="gap-0"
                  disabled={!hasOrders && (isFirstTimer || !queryParams.search)}
                  appearance={{ containerClassName: "w-[262px]" }}
                  placeholder="Cari Pesanan"
                  icon={{
                    left: "/icons/search16.svg",
                    right: tempSearch ? (
                      <IconComponent
                        src="/icons/silang16.svg"
                        onClick={handleClearSearch}
                      />
                    ) : null,
                  }}
                  value={tempSearch}
                  onChange={({ target: { value } }) => setTempSearch(value)}
                  onKeyUp={handleSearch}
                />
                {searchOnly ? null : (
                  <Filter
                    disabled={
                      (!hasOrders && isFirstTimer) ||
                      (!isFirstTimer &&
                        !options
                          .flatMap((item) => item.children)
                          .some((item) => item.value === queryParams.status))
                    }
                    options={options}
                    value={queryParams.status}
                    onChange={({ name, value }) =>
                      onChangeQueryParams(name, value)
                    }
                  />
                )}
              </div>
              {searchOnly ? null : (
                <div className="flex items-center gap-x-3">
                  <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                    Tampilkan:
                  </span>
                  {tabs.map((tab, key) => {
                    // Check if this is the "Semua" tab (empty value) and if the current queryParams.status
                    // isn't one of the specific tab values
                    const isActiveAllTab =
                      tab.value === "" &&
                      queryParams.status !== "WAITING_PAYMENT" &&
                      queryParams.status !== "WAITING_REPAYMENT" &&
                      queryParams.status !== "DOCUMENT_SHIPPING";

                    return (
                      <div
                        key={key}
                        onClick={() => onChangeQueryParams("status", tab.value)}
                        className={cn(
                          "cursor-pointer rounded-full px-3 py-[6px] text-[10px] font-semibold",
                          queryParams.status === tab.value || isActiveAllTab
                            ? "border border-primary-700 bg-[#E2F2FF] text-primary-700"
                            : "bg-[#F1F1F1] text-neutral-900"
                        )}
                      >
                        {tab.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedFilter ? (
              <div className="flex h-8 items-center gap-x-3">
                <button
                  className="text-[12px] font-bold leading-[14.4px] text-primary-700"
                  onClick={() => onChangeQueryParams("status", "")}
                >
                  Hapus Semua Filter
                </button>
                <TagBubble
                  withRemove={{
                    onRemove: () => onChangeQueryParams("status", ""),
                  }}
                >
                  {selectedFilter.label}
                </TagBubble>
              </div>
            ) : null}
          </div>

          {/* Table Component with proper structure */}
          {isOrdersLoading ? (
            <div className="flex min-h-[358px] w-full animate-pulse bg-neutral-200"></div>
          ) : hasOrders || !isFirstTimer ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-y border-neutral-400 text-[12px] font-bold leading-[14.4px] text-neutral-600">
                    <th className="w-[156px] px-6 py-5 text-left">
                      <div className="flex items-center gap-x-2">
                        <span>Kode Pesanan</span>
                        <IconComponent
                          src={getSortIcon("invoice")}
                          onClick={handleKodePesananSort}
                          className={
                            queryParams.sort === "invoice" ? "icon-blue" : ""
                          }
                        />
                      </div>
                    </th>
                    <th className="w-[156px] py-5 pl-0 pr-6 text-left">
                      <div className="flex items-center gap-x-2">
                        <span>Tanggal Muat</span>
                        <IconComponent
                          src={getSortIcon("loadTimeStart")}
                          onClick={handleTanggalMuatSort}
                          className={
                            queryParams.sort === "loadTimeStart"
                              ? "icon-blue"
                              : ""
                          }
                        />
                      </div>
                    </th>
                    <th className="w-[156px] py-5 pl-0 pr-6 text-left">
                      Lokasi
                    </th>
                    <th className="w-[200px] py-5 pl-0 pr-6 text-left">
                      Armada
                    </th>
                    <th className="w-[232px] py-5 pl-0 pr-6 text-left">
                      Status
                    </th>
                    <th className="w-[174px] py-5 pl-0 pr-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, key) => {
                    const firstPickupDropoff = [
                      ...order.locations.pickup,
                      ...order.locations.dropoff,
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

                    const beforeLoadingStatus = [
                      OrderStatusEnum.PREPARE_FLEET,
                      OrderStatusEnum.WAITING_PAYMENT_1,
                      OrderStatusEnum.WAITING_PAYMENT_2,
                      OrderStatusEnum.SCHEDULED_FLEET,
                      OrderStatusEnum.CONFIRMED,
                    ];
                    return (
                      <Fragment key={key}>
                        {/* Main row - conditional border based on whether it has a warning */}
                        <tr
                          className={
                            !order.paymentDeadline &&
                            !order.requiresConfirmation &&
                            !order.isRefundProcessing
                              ? "border-b border-neutral-400"
                              : "border-b-0"
                          }
                        >
                          {/* Kode Pesanan */}
                          <td className="w-[156px] px-6 pb-4 pt-5 align-top">
                            <span className="text-[12px] font-medium text-neutral-900">
                              {order.invoice}
                            </span>
                          </td>

                          {/* Tanggal Muat */}
                          <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <span className="text-[12px] font-medium text-neutral-900">
                              {new Date(order.loadTimeStart).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              WIB s/d{" "}
                              {new Date(order.loadTimeEnd).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              WIB
                            </span>
                          </td>

                          {/* Lokasi */}
                          <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <div className="relative flex flex-col gap-3">
                              <TimelineContainer>
                                {firstPickupDropoff.map((item, key) => (
                                  <Fragment key={key}>
                                    <TimelineItem
                                      variant="bullet"
                                      totalLength={firstPickupDropoff.length}
                                      index={key}
                                      activeIndex={0}
                                    >
                                      <TimelineContentAddress
                                        title={item.fullAddress}
                                        className={`text-[10px] font-bold leading-[13px] ${
                                          key === firstPickupDropoff?.length - 1
                                            ? "pb-0"
                                            : ""
                                        }`}
                                      />
                                    </TimelineItem>
                                  </Fragment>
                                ))}
                              </TimelineContainer>
                              {/* Only show "Lihat Lokasi Lainnya" if there are multiple pickup or dropoff locations */}
                              {(order.locations.pickup.length > 1 ||
                                order.locations.dropoff.length > 1) && (
                                <button
                                  onClick={() => openLocationModal(order)}
                                  className="text-[12px] font-medium text-primary-700"
                                >
                                  Lihat Lokasi Lainnya
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Armada */}
                          <td className="w-[200px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <div className="flex gap-2">
                              <div className="h-12 w-12 overflow-hidden rounded bg-neutral-50">
                                <ImageComponent
                                  src="/img/truck.png"
                                  width={48}
                                  height={48}
                                  alt="Truck image"
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="text-[12px] font-bold text-neutral-900">
                                  {order.vehicle?.truckTypeName || "N/A"}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-medium text-neutral-600">
                                    Carrier :
                                  </span>
                                  <span className="text-[10px] font-medium text-neutral-900">
                                    {order.vehicle?.carrierName || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <IconComponent
                                      className="icon-fill-muat-trans-secondary-900"
                                      src="/icons/transporter14.svg"
                                      width={14}
                                      height={14}
                                    />
                                    <span className="text-[10px] font-medium text-neutral-900">
                                      {order.vehicle?.truckCount || 0} Unit
                                    </span>
                                  </div>
                                  <div className="h-[2px] w-[2px] rounded-full bg-neutral-600"></div>
                                  <div className="flex items-center gap-1">
                                    <IconComponent
                                      className="icon-fill-muat-trans-secondary-900"
                                      src="/icons/estimasi-kapasitas14.svg"
                                      width={14}
                                      height={14}
                                    />
                                    <span className="text-[10px] font-medium text-neutral-900">
                                      2.500 kg
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="w-[232px] pb-4 pl-0 pr-6 pt-5 align-top">
                            {order.vehicle?.truckCount > 1 ? (
                              <button
                                onClick={() => {
                                  // Create an empty result object
                                  const result = {};

                                  // First pass: group by statusLabel and count
                                  order.statusInfo.forEach((item) => {
                                    const { statusLabel } = item;

                                    if (!result[statusLabel]) {
                                      result[statusLabel] = {
                                        statusLabel,
                                        statusCode: item.statusCode,
                                        count: 1,
                                      };
                                    } else {
                                      result[statusLabel].count++;
                                    }
                                  });

                                  // Convert to array for sorting
                                  const resultArray = Object.values(result);

                                  // Create ordering map (status code -> index in OrderStatusTitle)
                                  const orderIndices = {};
                                  Object.keys(OrderStatusTitle).forEach(
                                    (code, index) => {
                                      orderIndices[code] = index;
                                    }
                                  );

                                  // Sort based on the ordering
                                  resultArray.sort((a, b) => {
                                    return (
                                      orderIndices[a.statusCode] -
                                      orderIndices[b.statusCode]
                                    );
                                  });

                                  setSelecetedGroupedStatusInfo(resultArray);
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
                                  className="w-fit"
                                >
                                  {`${latestStatus?.statusLabel} : ${order.vehicle?.truckCount} Unit`}
                                </BadgeStatusPesanan>
                              </button>
                            ) : (
                              <BadgeStatusPesanan
                                variant={
                                  latestStatus ===
                                    OrderStatusEnum.WAITING_PAYMENT_1 ||
                                  latestStatus ===
                                    OrderStatusEnum.WAITING_PAYMENT_2 ||
                                  latestStatus ===
                                    OrderStatusEnum.WAITING_REPAYMENT_1 ||
                                  latestStatus ===
                                    OrderStatusEnum.WAITING_REPAYMENT_2
                                    ? "warning"
                                    : latestStatus ===
                                          OrderStatusEnum.CANCELED_BY_SHIPPER ||
                                        latestStatus ===
                                          OrderStatusEnum.CANCELED_BY_SYSTEM ||
                                        latestStatus ===
                                          OrderStatusEnum.CANCELED_BY_TRANSPORTER
                                      ? "error"
                                      : latestStatus ===
                                          OrderStatusEnum.COMPLETED
                                        ? "success"
                                        : "primary"
                                }
                                className="w-fit"
                              >
                                {latestStatus?.statusLabel}
                              </BadgeStatusPesanan>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="w-[174px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <div className="flex flex-col gap-y-3">
                              {/* Conditional button based on status */}
                              {latestStatus ==
                              OrderStatusEnum.DOCUMENT_DELIVERY ? (
                                <Button
                                  onClick={() =>
                                    setIsDocumentReceivedModalOpen(true)
                                  }
                                  variant="muatparts-primary"
                                  className="w-full"
                                >
                                  Selesaikan Pesanan
                                </Button>
                              ) : latestStatus === OrderStatusEnum.COMPLETED ? (
                                <Button
                                  variant="muatparts-primary"
                                  className="w-full"
                                >
                                  Beri Ulasan
                                </Button>
                              ) : beforeLoadingStatus.includes(latestStatus) ? (
                                <Button
                                  variant="muatparts-primary"
                                  className="w-full"
                                  onClick={() => {
                                    setIsReorderFleetModalOpen(true);
                                  }}
                                >
                                  Pesan Ulang
                                </Button>
                              ) : null}
                              <Button
                                variant="muatparts-primary-secondary"
                                className="w-full"
                                onClick={() =>
                                  router.push(
                                    `/daftarpesanan/detailpesanan/${order.orderId}`
                                  )
                                }
                              >
                                Detail
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Conditional Alert Row - Only shown if the pesanan has a payment deadline */}
                        {order.paymentDeadline && (
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center justify-between rounded-xl bg-secondary-100 px-4">
                                <div className="flex items-center gap-x-3">
                                  <IconComponent
                                    className="icon-stroke-warning-900"
                                    src="/icons/warning24.svg"
                                    size="medium"
                                  />
                                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                    {order.statusInfo?.[0]?.statusCode ===
                                    "WAITING_PAYMENT"
                                      ? "Lakukan pembayaran sebelum "
                                      : "Lakukan pelunasan sebelum "}
                                    <span className="font-bold">
                                      {new Date(
                                        order.paymentDeadline
                                      ).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </span>
                                </div>
                                {order.statusInfo?.[0]?.statusCode ===
                                "WAITING_REPAYMENT" ? (
                                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                    {"Tambahan Biaya "}
                                    <span className="font-bold">{`Rp${order.additionalCost.toLocaleString("id-ID")}`}</span>
                                  </span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        )}
                        {/* Pesanan Membutuhkan Konfirmasi */}
                        {order.requiresConfirmation && (
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center gap-x-3 rounded-xl bg-secondary-100 px-4">
                                <IconComponent
                                  className="icon-stroke-warning-900"
                                  src="/icons/warning24.svg"
                                  size="medium"
                                />
                                <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                  Pesanan membutuhkan konfirmasi
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                        {/* Pengembalian dana sedang dalam proses. */}
                        {order.isRefundProcessing && (
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center gap-x-3 rounded-xl bg-secondary-100 px-4">
                                <IconComponent
                                  className="icon-stroke-warning-900"
                                  src="/icons/warning24.svg"
                                  size="medium"
                                />
                                <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                  Pengembalian dana sedang dalam proses.
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
              {!hasOrders ? (
                <div className="flex w-full pb-6">
                  <div
                    className={cn(
                      "flex w-full items-center justify-center",
                      lastFilterField === "search" ? "h-[193px]" : "h-[145px]"
                    )}
                  >
                    {lastFilterField === "search" ? (
                      <DataNotFound
                        className="gap-y-5"
                        textClass="text-[#868686] leading-[19.2px] w-[197px]"
                        title="Keyword Tidak Ditemukan"
                        width={142}
                        height={122}
                        type="search"
                      />
                    ) : (
                      <DataNotFound
                        className="gap-y-3"
                        textClass="text-[#868686] w-[117px]"
                        title="Tidak ada data"
                        width={96}
                        height={77}
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ) : isFirstTimer ? (
            <div className="flex min-h-[358px] w-full justify-center pb-6">
              <div className="flex flex-col items-center justify-center gap-y-3">
                <DataNotFound
                  className="gap-y-3"
                  textClass="text-[#868686] leading-[19.2px] w-[289px]"
                  title="Oops, daftar pesananmu masih kosong"
                  width={96}
                  height={77}
                />
                <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                  Mulai buat pesanan sekarang untuk kebutuhan pengiriman kamu
                </span>
                <Button
                  className="max-w-[135px]"
                  variant="muatparts-primary"
                  onClick={() => router.push("/sewaarmada")}
                  type="button"
                >
                  Buat Pesanan
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModal
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{
          text: "Informasi",
        }}
        description={{
          // eslint-disable-next-line quotes
          text: 'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.',
        }}
        cancel={{
          text: "Belum",
        }}
        confirm={{
          text: "Sudah",
          onClick: handleReceiveDocument,
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModal
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: "Apakah kamu ingin menyalin pesanan ini untuk digunakan kembali atau membuat pesanan baru dengan detail yang berbeda?",
          className: "leading-[16.8px]",
        }}
        cancel={{
          text: "Pesan Baru",
          onClick: () => handleReorderFleet(),
        }}
        confirm={{
          text: "Pesan Ulang",
          onClick: () => handleReorderFleet(1),
        }}
      />

      {/* Modal Lokasi Muat dan Bongkar */}
      <MuatBongkarModal
        isOpen={isLokasiMuatBongkarModalOpen}
        setIsOpen={setIsLokasiMuatBongkarModalOpen}
        data={selectedLocations}
        title="Lokasi"
      />

      <Modal
        closeOnOutsideClick={true}
        open={isAllDriverStatusModalOpen}
        onOpenChange={setIsAllDriverStatusModalOpen}
      >
        <ModalContent>
          <div className="flex w-[320px] flex-col items-center gap-y-6 px-6 py-8">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Status Lainnya
            </h1>
            <div className="flex w-full flex-col gap-y-2">
              {selectedGroupedStatusInfo.map((status, key) => (
                <Fragment key={key}>
                  <BadgeStatusPesanan
                    variant={
                      status?.statusLabel ===
                        OrderStatusEnum.WAITING_PAYMENT_1 ||
                      status?.statusLabel ===
                        OrderStatusEnum.WAITING_PAYMENT_2 ||
                      status?.statusLabel ===
                        OrderStatusEnum.WAITING_REPAYMENT_1 ||
                      status?.statusLabel ===
                        OrderStatusEnum.WAITING_REPAYMENT_2
                        ? "warning"
                        : status?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_SHIPPER ||
                            status?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_SYSTEM ||
                            status?.statusLabel ===
                              OrderStatusEnum.CANCELED_BY_TRANSPORTER
                          ? "error"
                          : status?.statusLabel === OrderStatusEnum.COMPLETED
                            ? "success"
                            : "primary"
                    }
                    className="w-full"
                  >
                    {`${status.statusLabel} : ${status.count} Unit`}
                  </BadgeStatusPesanan>
                </Fragment>
              ))}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PesananTable;
