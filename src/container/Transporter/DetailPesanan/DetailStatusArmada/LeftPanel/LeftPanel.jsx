import { useParams } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusDriverMetadata } from "@/lib/normalizers/detailpesanan/getStatusDriverMetadata";

export const LeftPanel = ({ dataDriverTimeline, allDriversData }) => {
  const { t } = useTranslation();
  const params = useParams();
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const breadcrumbItems = [
    { name: t("Daftar Pesanan"), href: "/daftar-pesanan" },
    {
      name: t("Detail Pesanan"),
      href: `/daftar-pesanan/${params.orderId}/detail-pesanan`,
    },
    { name: t("Detail Status Armada") },
  ];

  // Jika hanya ada 1 driver, langsung tampilkan timeline
  const isMultipleDrivers = allDriversData?.drivers?.length > 1;

  // Data driver yang sedang ditampilkan
  const currentDriverData = selectedDriverId
    ? allDriversData?.drivers?.find(
        (d) => d.dataDriver.driverId === selectedDriverId
      )
    : dataDriverTimeline;
  console.log(currentDriverData?.dataDriver?.driverStatus, "tes");
  const statusMeta = getStatusDriverMetadata({
    driverStatus: currentDriverData?.dataDriver?.driverStatus,
    orderStatus: currentDriverData?.dataDriver?.orderStatus,
    t,
  });

  const handleDriverClick = (driverId) => {
    if (selectedDriverId === driverId) {
      // Jika driver yang sama diklik, toggle collapse/expand
      setSelectedDriverId(null);
    } else {
      // Pilih driver baru
      setSelectedDriverId(driverId);
    }
  };

  // Jika tidak ada multiple drivers, tampilkan single driver timeline
  if (!isMultipleDrivers) {
    return (
      <div className="grid h-[596px] w-[480px] grid-cols-1 grid-rows-[auto_auto_1fr] gap-6 rounded-l-[20px] rounded-r-xl bg-white pb-6 pl-6 pr-3 pt-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        <BreadCrumb data={breadcrumbItems} />
        <PageTitle className="mb-0">Detail Status Armada</PageTitle>

        <div className="flex h-fit max-h-full flex-col gap-4 overflow-y-auto pr-3 [background-clip:content-box] [scrollbar-gutter:stable]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-xl border border-[rgb(196,196,196)] p-5">
              <div className="flex flex-col gap-3">
                <BadgeStatusPesanan
                  className="h-6 w-fit"
                  variant={statusMeta.variant}
                >
                  {statusMeta.label}
                </BadgeStatusPesanan>

                <div className="flex flex-col gap-3 border-b border-neutral-400 pb-4">
                  <AvatarDriver
                    name={currentDriverData?.dataDriver?.name}
                    image={currentDriverData?.dataDriver?.profileImage}
                    licensePlate={currentDriverData?.dataDriver?.licensePlate}
                  />
                </div>

                <div className="">
                  <h2 className="text-xs font-semibold leading-[14.4px] text-black">
                    {t("titleDetailStatusDriver")}
                  </h2>

                  <div className="flex-1 overflow-y-auto pb-5 pr-1.5 pt-2">
                    <DriverTimeline dataTimeline={currentDriverData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan multiple drivers dengan dropdown
  return (
    <div className="grid h-[596px] w-[480px] grid-cols-1 grid-rows-[auto_auto_1fr] gap-6 rounded-l-[20px] rounded-r-xl bg-white pb-6 pl-6 pr-3 pt-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <BreadCrumb data={breadcrumbItems} />
      <PageTitle className="mb-0">Detail Status Armada</PageTitle>

      <div className="flex h-fit max-h-full flex-col gap-4 overflow-y-auto pr-3 [background-clip:content-box] [scrollbar-gutter:stable]">
        <div className="flex flex-col gap-4">
          {allDriversData?.drivers?.map((driver) => {
            const driverStatusMeta = getStatusDriverMetadata({
              driverStatus: driver.dataDriver.driverStatus,
              orderStatus: driver.dataDriver.orderStatus,
              t,
            });
            const isSelected = selectedDriverId === driver.dataDriver.driverId;

            return (
              <div key={driver.dataDriver.driverId} className="flex flex-col">
                <div
                  className={`flex flex-col gap-4 rounded-xl border border-[rgb(196,196,196)] p-5 transition-colors hover:bg-neutral-50`}
                >
                  <div className="flex flex-col gap-3">
                    <BadgeStatusPesanan
                      className="h-6 w-fit"
                      variant={driverStatusMeta.variant}
                    >
                      {driverStatusMeta.label}
                    </BadgeStatusPesanan>

                    <div
                      className={`flex cursor-pointer items-center justify-between pb-4 ${isSelected ? "border-b border-neutral-400" : "border-b-none"}`}
                      onClick={() =>
                        handleDriverClick(driver.dataDriver.driverId)
                      }
                    >
                      <AvatarDriver
                        name={driver.dataDriver.name}
                        image={driver.dataDriver.profileImage}
                        licensePlate={driver.dataDriver.licensePlate}
                      />
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={`h-6 w-6 text-neutral-500 transition-transform duration-200 ${
                          isSelected ? "rotate-180" : ""
                        }`}
                        width={24}
                        height={24}
                      />
                    </div>
                    {/* Driver Timeline - Expandable */}
                    {isSelected && (
                      <div className="">
                        <h2 className="text-xs font-semibold leading-[14.4px] text-black">
                          {t("titleDetailStatusDriver")}
                        </h2>

                        <div className="flex-1 overflow-y-auto pb-5 pr-1.5 pt-2">
                          <DriverTimeline dataTimeline={currentDriverData} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
