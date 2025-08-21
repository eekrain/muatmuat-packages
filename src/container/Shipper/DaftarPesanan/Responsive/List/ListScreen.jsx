import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import BottomNavigationBar from "@/components/BottomNavigationBar/BottomNavigationBar";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import OrderItem from "@/container/Shipper/DaftarPesanan/Responsive/components/OrderItem";
import PeriodDropdown from "@/container/Shipper/DaftarPesanan/Responsive/components/PeriodDropdown";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { useWaitingSettlementModalAction } from "@/store/Shipper/forms/waitingSettlementModalStore";

const ListScreen = ({
  type,
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  isOrdersLoading,
  settlementAlertInfo,
  hasNoOrders,
  lastFilterField,
  statusTabOptions,
  setFiltering,
  filterType,
  setFilterType,
}) => {
  const router = useRouter();
  const navigation = useResponsiveNavigation();
  const [isPeriodBottomsheetOpen, setPeriodBottomsheetOpen] = useState(false);
  const { t } = useTranslation();
  const { setIsOpen } = useWaitingSettlementModalAction();

  const isDefaultPage = type === "default";
  const alertTitles = {
    needConfirmation: "Terdapat pesanan yang membutuhkan konfirmasi",
    waitingPayment: "Terdapat pesanan yang menunggu pembayaran",
    waitingRepayment: "Terdapat pesanan yang menunggu pelunasan",
  };

  const alertItems = useShallowMemo(() => {
    if (!settlementAlertInfo) return [];

    const listPesananUrl = [
      "/daftarpesanan/pesananmenunggupembayaran",
      "/daftarpesanan/pesananmenunggupelunasan",
      "/daftarpesanan/butuhkonfirmasianda",
      "/daftarpesanan/butuhkonfirmasianda",
    ];

    return settlementAlertInfo
      .map((item, key) => {
        if (!item.orderId || item.orderId.length === 0) {
          return null;
        }
        if (key === 1) {
          return {
            label: item.alertText,
            onClick: () => setIsOpen(true),
          };
        }
        return {
          label: item.alertText,
          onClick: () =>
            router.push(
              item.orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                : listPesananUrl[key]
            ),
        };
      })
      .filter(Boolean);
  }, [settlementAlertInfo, router, setIsOpen]);

  const periodOptions = [
    {
      name: `${t("EksekusiTenderIndexSemuaPeriode")} (Default)`,
      value: "",
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
      value: 365,
      format: "year",
    },
  ];

  const handleChangePeriod = ({ startDate, endDate, value }) => {
    if (value === "custom") {
      onChangeQueryParams("startDate", startDate);
      onChangeQueryParams("endDate", endDate);
    } else if (value === "") {
      onChangeQueryParams("startDate", null);
      onChangeQueryParams("endDate", null);
    } else {
      // Get local dates using direct component extraction, not toISOString()
      const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Get today as end date
      const today = new Date();
      const endDate = getLocalDateString(today);

      // Calculate start date
      let startDate;
      if (value === 0) {
        // Today
        startDate = endDate;
      } else {
        // Other periods (7 days, 30 days, etc.)
        const startDateObj = new Date();
        // Set to noon to avoid any date boundary issues
        startDateObj.setHours(12, 0, 0, 0);
        startDateObj.setDate(today.getDate() - value);
        startDate = getLocalDateString(startDateObj);
      }

      onChangeQueryParams("startDate", startDate);
      onChangeQueryParams("endDate", endDate);
    }
  };

  const hasFilteredOrders = orders.length > 0;

  return (
    <SearchBarResponsiveLayout
      withMenu={
        isDefaultPage
          ? {
              onClickPeriod: () => setPeriodBottomsheetOpen(true),
              periodSelected: queryParams.startDate && queryParams.endDate,
            }
          : null
      }
      onEnterPress={(value) => onChangeQueryParams("search", value)}
      placeholder="Cari Pesanan"
      shouldResetSearchValue={false}
    >
      <div
        className={cn(
          "flex min-h-[calc(100vh_-_62px)] flex-col bg-neutral-200 text-neutral-900",
          hasNoOrders || !hasFilteredOrders ? "gap-y-0" : "mb-[110px] gap-y-2"
        )}
      >
        {/* Filter */}
        {isDefaultPage ? (
          <>
            <div className="scrollbar-hide flex items-center gap-x-1 overflow-x-auto border-b border-b-neutral-400 bg-neutral-50 py-5 pl-4">
              <button
                className={cn(
                  "flex h-[30px] items-center gap-x-2 rounded-3xl px-3",
                  filterType === "radio" && queryParams.status
                    ? "border border-primary-700 bg-primary-50 text-primary-700"
                    : "bg-neutral-200 text-neutral-900"
                )}
                onClick={() => {
                  setFiltering(true);
                  navigation.push("/StatusFilter");
                }}
              >
                <span className="text-sm font-medium leading-[1.1]">
                  Filter
                </span>
                <IconComponent
                  className={
                    filterType === "radio" && queryParams.status
                      ? "text-primary-700"
                      : "text-neutral-900"
                  }
                  src="/icons/filter14.svg"
                  width={14}
                  height={14}
                />
              </button>
              <div className="flex items-center gap-x-1">
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
                      onClick={() => {
                        onChangeQueryParams("status", tab.value);
                        setFilterType("tab");
                      }}
                      className={cn(
                        "flex h-[30px] min-w-fit cursor-pointer items-center rounded-full px-3 py-[6px] font-medium",
                        (queryParams.status === tab.value &&
                          filterType === "tab") ||
                          isActiveAllTab
                          ? "border border-primary-700 bg-primary-50 text-primary-700"
                          : "bg-neutral-200 text-neutral-900"
                      )}
                    >
                      <span className="text-sm leading-[1.1]">{tab.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <AlertMultilineResponsive
              items={alertItems}
              className="w-full rounded-none"
            />
          </>
        ) : hasFilteredOrders ? (
          <Alert variant="warning" className="w-full gap-2.5">
            <span className="text-xs font-medium text-neutral-900">
              {alertTitles[type] || ""}
            </span>
          </Alert>
        ) : null}

        {/* List Pesanan */}
        {isOrdersLoading ? null : !hasNoOrders ? (
          !hasFilteredOrders ? (
            <div className="flex w-full pb-6">
              <div
                className={cn(
                  "flex min-h-[calc(100vh_-_198px)] w-full items-center justify-center"
                )}
              >
                {lastFilterField === "search" ? (
                  <DataNotFound
                    className="gap-y-3"
                    textClass="text-[#868686] leading-[1.1] w-[197px]"
                    title={t("titleKeywordTidakDitemukan")}
                    width={127}
                    height={109}
                  />
                ) : (
                  <DataNotFound
                    className="gap-y-3"
                    textClass="text-[#868686] w-[117px]"
                    title={t("titleTidakAdaData")}
                    width={94}
                    height={76}
                    type="data"
                  />
                )}
              </div>
            </div>
          ) : (
            orders.map((order, key) => (
              <Fragment key={key}>
                <OrderItem {...order} />
              </Fragment>
            ))
          )
        ) : (
          <div className="flex min-h-[calc(100vh_-_198px)] items-center justify-center">
            <div className="flex max-w-[328px] flex-col gap-y-3">
              <DataNotFound
                className="gap-y-3"
                textClass="leading-[19.2px] w-full"
                title="Oops, daftar pesananmu masih kosong"
                width={94}
                height={76}
                type="data"
              />
              <div className="max-w-[320px] text-center text-xs font-medium text-neutral-600">
                Mulai buat pesanan sekarang untuk kebutuhan pengiriman kamu
              </div>
              <Button
                className="h-7 text-xs leading-[1.1]"
                variant="muatparts-primary"
                onClick={() => router.push("/sewaarmada")}
              >
                Buat Pesanan
              </Button>
            </div>
          </div>
        )}
      </div>
      {isDefaultPage ? <BottomNavigationBar /> : null}

      {/* Bottomsheet pilih periode */}
      <PeriodDropdown
        isOpen={isPeriodBottomsheetOpen}
        setIsOpen={setPeriodBottomsheetOpen}
        options={periodOptions}
        onChange={handleChangePeriod}
      />
    </SearchBarResponsiveLayout>
  );
};

export default ListScreen;
