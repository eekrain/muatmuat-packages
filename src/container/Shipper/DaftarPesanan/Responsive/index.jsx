import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import BottomNavigationBar from "@/components/BottomNavigationBar/BottomNavigationBar";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import OrderItem from "@/container/Shipper/DaftarPesanan/Responsive/components/OrderItem";
import PeriodDropdown from "@/container/Shipper/DaftarPesanan/Responsive/components/PeriodDropdown";
import { useTranslation } from "@/hooks/use-translation";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { cn } from "@/lib/utils";

const DaftarPesananResponsive = ({
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  isOrdersLoading,
  settlementAlertInfo,
  hasNoOrders,
  lastFilterField,
  tabs,
  currentPeriodValue,
  setCurrentPeriodValue,
}) => {
  console.log("orders", orders);
  const router = useRouter();
  const [isPeriodBottomsheetOpen, setPeriodBottomsheetOpen] = useState(false);
  const { t } = useTranslation();
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

  return (
    <SearchBarResponsiveLayout
      withMenu={{
        onClickPeriod: () => setPeriodBottomsheetOpen(true),
      }}
      placeholder="Cari Pesanan"
    >
      <div
        className={cn(
          "flex min-h-[calc(100vh_-_62px)] flex-col gap-y-2 bg-neutral-200 text-neutral-900",
          hasNoOrders ? "" : "mb-[110px]"
        )}
      >
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
                    "flex h-[30px] min-w-fit cursor-pointer items-center rounded-full px-3 py-[6px] font-medium",
                    queryParams.status === tab.value || isActiveAllTab
                      ? "border border-primary-700 bg-[#E2F2FF] text-primary-700"
                      : "bg-[#F1F1F1] text-neutral-900"
                  )}
                >
                  <span className="text-sm leading-[1.1]">{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* List Pesanan */}
        {isOrdersLoading ? null : !hasNoOrders ? (
          orders.map((order, key) => (
            <Fragment key={key}>
              <OrderItem {...order} />
            </Fragment>
          ))
        ) : (
          <div className="flex min-h-[calc(100vh_-_198px)] items-center justify-center">
            <div className="flex max-w-[328px] flex-col gap-y-3">
              <DataNotFound
                className="gap-y-3"
                textClass="leading-[19.2px] w-full"
                title="Oops, daftar pesananmu masih kosong"
                width={94}
                height={76}
                type="search"
              />
              <div className="max-w-[320px] text-center text-xs font-medium text-neutral-600">
                Mulai buat pesanan sekarang untuk kebutuhan pengiriman kamu
              </div>
              <Button
                variant="muatparts-primary"
                onClick={() => router.push("/sewaarmada")}
              >
                Buat Pesanan
              </Button>
            </div>
          </div>
        )}
      </div>
      <BottomNavigationBar />

      {/* Bottomsheet pilih periode */}
      <PeriodDropdown
        isOpen={isPeriodBottomsheetOpen}
        setIsOpen={setPeriodBottomsheetOpen}
        options={periodOptions}
      />
    </SearchBarResponsiveLayout>
  );
};

export default DaftarPesananResponsive;
