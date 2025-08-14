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
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import MuatBongkarModal from "@/container/Shipper/DetailPesanan/Web/RingkasanPesanan/MuatBongkarModal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

const PesananTable = ({
  queryParams,
  onChangeQueryParams,
  tempSearch,
  setTempSearch,
  orders,
  isOrdersLoading,
  searchOnly = false,
  hasNoOrders,
  hasFilteredOrders,
  lastFilterField,
  statusTabOptions,
  statusRadioOptions,
}) => {
  const { t } = useTranslation();

  const router = useRouter();

  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [isLokasiMuatBongkarModalOpen, setIsLokasiMuatBongkarModalOpen] =
    useState(false);
  const [isAllDriverStatusModalOpen, setIsAllDriverStatusModalOpen] =
    useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedGroupedStatusInfo, setSelectedGroupedStatusInfo] = useState(
    []
  );
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  console.log("selectedGroupedStatusInfo", selectedGroupedStatusInfo);

  // Initialize the document received mutation hook
  const { trigger: confirmDocumentReceived, isMutating: isConfirmingDocument } =
    useSWRMutateHook(
      selectedOrderId ? `v1/orders/${selectedOrderId}/document-received` : null,
      "POST"
    );

  const selectedFilter = useShallowMemo(
    () =>
      statusRadioOptions
        ?.flatMap((item) => item.children || [])
        .find((item) => item.value === queryParams.status),
    [statusRadioOptions, queryParams]
  );

  const handleSearch = (e) => {
    if (e.key === "Enter" && tempSearch.length >= 3) {
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

  const handleReceiveDocument = async () => {
    try {
      const result = await confirmDocumentReceived();

      if (result?.Message?.Code === 200) {
        toast.success(t("messagePesananBerhasilDiselesaikan"));
        setIsDocumentReceivedModalOpen(false);

        // Optionally refresh the page or update the order status
        // router.refresh();
      } else {
        toast.error(result?.Message?.Text || "Gagal mengkonfirmasi dokumen");
      }
    } catch (error) {
      console.error("Error confirming document received:", error);
      toast.error("Terjadi kesalahan saat mengkonfirmasi dokumen");
    }
  };

  const handleReorderFleet = (id) => {
    if (id) {
      router.push(`/sewaarmada?orderId=${id}`);
    } else {
      router.push("/sewaarmada");
    }
    setIsReorderFleetModalOpen(false);
    setSelectedOrderId(null);
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
      <Card className="mt-6 h-auto w-full border-none shadow-muat">
        <CardContent className="p-0">
          {/* Table Filter */}
          <div className="flex flex-col gap-y-6 p-6 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <Input
                  className="gap-0"
                  disabled={
                    hasNoOrders || (!hasFilteredOrders && !queryParams.search)
                  }
                  appearance={{ containerClassName: "w-[262px]" }}
                  placeholder={t("placeholderCariPesanan")}
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
                      hasNoOrders ||
                      (!hasFilteredOrders &&
                        !statusRadioOptions
                          .flatMap((item) => item.children)
                          .some((item) => item.value === queryParams.status))
                    }
                    options={statusRadioOptions}
                    value={queryParams.status}
                    onChange={({ name, value }) =>
                      onChangeQueryParams(name, value)
                    }
                  />
                )}
              </div>
              {searchOnly ? null : (
                <div className="flex items-center gap-x-3">
                  <span className="text-xs font-bold leading-[14.4px] text-neutral-900">
                    {t("labelTampilkan")}
                  </span>
                  {statusTabOptions.map((tab, key) => {
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
                          "flex h-7 cursor-pointer items-center rounded-full px-3 py-[6px] font-semibold",
                          queryParams.status === tab.value || isActiveAllTab
                            ? "border border-primary-700 bg-primary-50 text-primary-700"
                            : "bg-neutral-200 text-neutral-900"
                        )}
                      >
                        <span className="text-xxs">{tab.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedFilter ? (
              <div className="flex h-8 items-center gap-x-3">
                <button
                  className="text-xs font-bold leading-[14.4px] text-primary-700"
                  onClick={() => onChangeQueryParams("status", "")}
                >
                  {t("buttonHapusSemuaFilter")}
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
          ) : !hasNoOrders ? (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-y border-neutral-400 text-xs font-bold leading-[14.4px] text-neutral-600">
                    <th className="w-[156px] px-6 py-5 text-left">
                      <div className="flex items-center gap-x-2">
                        <span>{t("labelKodePesanan")}</span>
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
                        <span>{t("labelTanggalMuat")}</span>
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
                      {t("labelLokasi")}
                    </th>
                    <th className="w-[200px] py-5 pl-0 pr-6 text-left">
                      {t("labelArmada")}
                    </th>
                    <th className="w-[232px] py-5 pl-0 pr-6 text-left">
                      {t("labelStatusHeader")}
                    </th>
                    <th className="w-[174px] py-5 pl-0 pr-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, key) => {
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
                            <span className="text-xs font-medium text-neutral-900">
                              {order.invoice}
                            </span>
                          </td>

                          {/* Tanggal Muat */}
                          <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <span className="text-xs font-medium text-neutral-900">
                              {`${formatDate(order.loadTimeStart)}${order.loadTimeEnd ? " s/d" : ""}`}
                              {order.loadTimeEnd ? (
                                <>
                                  <br />
                                  {formatDate(order.loadTimeEnd)}
                                </>
                              ) : null}
                            </span>
                          </td>

                          {/* Lokasi */}
                          <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                            <div className="relative flex flex-col gap-3">
                              <TimelineContainer>
                                {firstPickupDropoff.map((item, key) => (
                                  <NewTimelineItem
                                    key={key}
                                    variant="bullet"
                                    index={key}
                                    activeIndex={0}
                                    isLast={
                                      key === firstPickupDropoff.length - 1
                                    }
                                    title={item.fullAddress}
                                    className="pb-3"
                                    appearance={{
                                      titleClassname: "line-clamp-1 break-all",
                                    }}
                                  />
                                ))}
                              </TimelineContainer>
                              {/* Only show "Lihat Lokasi Lainnya" if there are multiple pickup or dropoff locations */}
                              {(order.locations.pickup.length > 1 ||
                                order.locations.dropoff.length > 1) && (
                                <button
                                  onClick={() => openLocationModal(order)}
                                  className="text-left text-xs font-medium text-primary-700"
                                >
                                  {t("buttonLihatLokasiLainnya")}
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
                                <span className="text-xs font-bold text-neutral-900">
                                  {order.vehicle?.truckTypeName || "N/A"}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xxs font-medium text-neutral-600">
                                    {t("labelCarrier")}
                                  </span>
                                  <span className="text-xxs font-medium text-neutral-900">
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
                                    <span className="text-nowrap text-xxs font-medium text-neutral-900">
                                      {order.vehicle?.truckCount || 0}{" "}
                                      {t("labelUnit")}
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
                                    <span className="text-xxs font-medium text-neutral-900">
                                      2.500 kg
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="w-[232px] pb-4 pl-0 pr-6 pt-5 align-top">
                            {order.vehicle?.truckCount > 1 ||
                            order.statusInfo.length > 1 ? (
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
                                        count:
                                          order.vehicle?.truckCount > 1
                                            ? order.vehicle?.truckCount
                                            : 1,
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

                                  setSelectedGroupedStatusInfo(resultArray);
                                  setIsAllDriverStatusModalOpen(true);
                                }}
                              >
                                <BadgeStatusPesanan
                                  variant={
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_PAYMENT_1 ||
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_PAYMENT_2 ||
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_PAYMENT_3 ||
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_PAYMENT_4 ||
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_REPAYMENT_1 ||
                                    latestStatus?.statusCode ===
                                      OrderStatusEnum.WAITING_REPAYMENT_2
                                      ? "warning"
                                      : latestStatus?.statusCode ===
                                            OrderStatusEnum.CANCELED_BY_SHIPPER ||
                                          latestStatus?.statusCode ===
                                            OrderStatusEnum.CANCELED_BY_SYSTEM ||
                                          latestStatus?.statusCode ===
                                            OrderStatusEnum.CANCELED_BY_TRANSPORTER
                                        ? "error"
                                        : latestStatus?.statusCode ===
                                            OrderStatusEnum.COMPLETED
                                          ? "success"
                                          : "primary"
                                  }
                                  className="w-fit"
                                >
                                  {`${latestStatus?.statusLabel} : ${order.vehicle?.truckCount} ${t("labelUnit")}`}
                                </BadgeStatusPesanan>
                              </button>
                            ) : (
                              <BadgeStatusPesanan
                                variant={
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_PAYMENT_1 ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_PAYMENT_2 ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_PAYMENT_3 ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_PAYMENT_4 ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_REPAYMENT_1 ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.WAITING_REPAYMENT_2
                                    ? "warning"
                                    : latestStatus?.statusCode ===
                                          OrderStatusEnum.CANCELED_BY_SHIPPER ||
                                        latestStatus?.statusCode ===
                                          OrderStatusEnum.CANCELED_BY_SYSTEM ||
                                        latestStatus?.statusCode ===
                                          OrderStatusEnum.CANCELED_BY_TRANSPORTER
                                      ? "error"
                                      : latestStatus?.statusCode ===
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
                              {latestStatus?.statusCode ===
                              OrderStatusEnum.DOCUMENT_DELIVERY ? (
                                <Button
                                  onClick={() =>
                                    setIsDocumentReceivedModalOpen(true)
                                  }
                                  variant="muatparts-primary"
                                  className="w-full"
                                >
                                  {t("buttonSelesaikanPesanan")}
                                </Button>
                              ) : latestStatus?.statusCode ===
                                OrderStatusEnum.COMPLETED ? (
                                <Button
                                  variant="muatparts-primary"
                                  className="w-full"
                                >
                                  {t("buttonBeriUlasan")}
                                </Button>
                              ) : !(
                                  beforeLoadingStatus.includes(
                                    latestStatus?.statusCode
                                  ) ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.COMPLETED ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.CANCELED_BY_SHIPPER ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.CANCELED_BY_SYSTEM ||
                                  latestStatus?.statusCode ===
                                    OrderStatusEnum.CANCELED_BY_TRANSPORTER
                                ) ? (
                                <Button
                                  variant="muatparts-primary"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedOrderId(order.orderId);
                                    setIsReorderFleetModalOpen(true);
                                  }}
                                >
                                  {t("buttonPesanUlang")}
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
                                {t("buttonDetail")}
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {/* Conditional Alert Row */}
                        {order.paymentDeadline ? (
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center justify-between rounded-xl bg-secondary-100 px-4">
                                <div className="flex items-center gap-x-3">
                                  <IconComponent
                                    className="icon-stroke-warning-900"
                                    src="/icons/warning24.svg"
                                    size="medium"
                                  />
                                  <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                                    {order.statusInfo?.[0]?.statusCode ===
                                    "WAITING_PAYMENT"
                                      ? t("messageLakukanPembayaranSebelum")
                                      : t("messageLakukanPelunasanSebelum")}
                                    <span className="font-bold">
                                      {` ${formatDate(order.paymentDeadline)}`}
                                    </span>
                                  </span>
                                </div>
                                {order.statusInfo?.[0]?.statusCode ===
                                "WAITING_REPAYMENT" ? (
                                  <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                                    {t("labelTambahanBiaya")}
                                    <span className="font-bold">{`Rp${order.additionalCost.toLocaleString("id-ID")}`}</span>
                                  </span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ) : order.requiresConfirmation ? (
                          // Pesanan Membutuhkan Konfirmasi
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center gap-x-3 rounded-xl bg-secondary-100 px-4">
                                <IconComponent
                                  className="icon-stroke-warning-900"
                                  src="/icons/warning24.svg"
                                  size="medium"
                                />
                                <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                                  {t("messagePesananMembutuhkanKonfirmasi")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : order.isRefundProcessing ? (
                          // Pengembalian dana sedang dalam proses.
                          <tr className="border-b border-neutral-400">
                            <td colSpan={6} className="px-6 pb-4">
                              <div className="flex h-12 items-center gap-x-3 rounded-xl bg-secondary-100 px-4">
                                <IconComponent
                                  className="icon-stroke-warning-900"
                                  src="/icons/warning24.svg"
                                  size="medium"
                                />
                                <span className="text-xs font-semibold leading-[14.4px] text-neutral-900">
                                  {t("messagePengembalianDanaDalamProses")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
              {!hasFilteredOrders ? (
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
                        title={t("titleKeywordTidakDitemukan")}
                        width={142}
                        height={122}
                        type="search"
                      />
                    ) : (
                      <DataNotFound
                        className="gap-y-3"
                        textClass="text-[#868686] w-[117px]"
                        title={t("titleTidakAdaData")}
                        width={96}
                        height={77}
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[358px] w-full justify-center pb-6">
              <div className="flex flex-col items-center justify-center gap-y-3">
                <DataNotFound
                  className="gap-y-3"
                  textClass="text-[#868686] leading-[19.2px] w-[289px]"
                  title={t("titleDaftarPesananKosong")}
                  width={96}
                  height={77}
                />
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("messageMulaiBuatPesanan")}
                </span>
                <Button
                  className="max-w-[135px]"
                  variant="muatparts-primary"
                  onClick={() => router.push("/sewaarmada")}
                  type="button"
                >
                  {t("buttonBuatPesanan")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModal
        variant="muatparts"
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{
          text: t("titleInformasi"),
        }}
        description={{
          text: t("messageKlikSudahJikaSudahMenerimaDokumen"),
        }}
        cancel={{
          text: t("buttonBelum"),
          disabled: isConfirmingDocument,
        }}
        confirm={{
          text: t("buttonSudah"),
          onClick: handleReceiveDocument,
          disabled: isConfirmingDocument,
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModal
        variant="muatparts"
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: t("messageApakahInginMenyalinPesanan"),
          className: "leading-[16.8px]",
        }}
        cancel={{
          text: t("buttonPesanBaru"),
          onClick: () => handleReorderFleet(),
        }}
        confirm={{
          text: t("buttonPesanUlangModal"),
          onClick: () => handleReorderFleet(selectedOrderId),
        }}
      />

      {/* Modal Lokasi Muat dan Bongkar */}
      <MuatBongkarModal
        isOpen={isLokasiMuatBongkarModalOpen}
        setIsOpen={setIsLokasiMuatBongkarModalOpen}
        data={selectedLocations}
        title={t("titleLokasi")}
      />

      <Modal
        closeOnOutsideClick={true}
        open={isAllDriverStatusModalOpen}
        onOpenChange={setIsAllDriverStatusModalOpen}
      >
        <ModalContent type="muatmuat">
          <div className="flex w-[320px] flex-col items-center gap-y-6 px-6 py-8">
            <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
              {t("titleStatusLainnya")}
            </h1>
            <div className="flex w-full flex-col gap-y-2">
              {selectedGroupedStatusInfo.map((status, key) => (
                <Fragment key={key}>
                  <BadgeStatusPesanan
                    variant={
                      status?.statusCode ===
                        OrderStatusEnum.WAITING_PAYMENT_1 ||
                      status?.statusCode ===
                        OrderStatusEnum.WAITING_PAYMENT_2 ||
                      status?.statusCode ===
                        OrderStatusEnum.WAITING_PAYMENT_3 ||
                      status?.statusCode ===
                        OrderStatusEnum.WAITING_PAYMENT_4 ||
                      status?.statusCode ===
                        OrderStatusEnum.WAITING_REPAYMENT_1 ||
                      status?.statusCode === OrderStatusEnum.WAITING_REPAYMENT_2
                        ? "warning"
                        : status?.statusCode ===
                              OrderStatusEnum.CANCELED_BY_SHIPPER ||
                            status?.statusCode ===
                              OrderStatusEnum.CANCELED_BY_SYSTEM ||
                            status?.statusCode ===
                              OrderStatusEnum.CANCELED_BY_TRANSPORTER
                          ? "error"
                          : status?.statusCode === OrderStatusEnum.COMPLETED
                            ? "success"
                            : "primary"
                    }
                    className="w-full"
                  >
                    {`${status.statusLabel} : ${status.count} ${t("labelUnit")}`}
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
