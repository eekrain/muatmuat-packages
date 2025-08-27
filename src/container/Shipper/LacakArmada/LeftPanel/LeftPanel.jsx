import { useParams } from "next/navigation";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import PageTitle from "@/components/PageTitle/PageTitle";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusDriverMetadata } from "@/lib/normalizers/detailpesanan/getStatusDriverMetadata";

export const LeftPanel = ({ dataDriverTimeline }) => {
  const { t } = useTranslation();
  const params = useParams();
  const breadcrumbItems = [
    {
      name: t("LeftPanel.breadcrumbDaftarPesanan", {}, "Daftar Pesanan"),
      href: "/daftarpesanan",
    },
    {
      name: t("LeftPanel.breadcrumbDetailPesanan", {}, "Detail Pesanan"),
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: t("LeftPanel.breadcrumbLacakArmada", {}, "Lacak Armada") },
  ];

  const statusMeta = getStatusDriverMetadata({
    driverStatus: dataDriverTimeline?.dataDriver?.driverStatus,
    orderStatus: dataDriverTimeline?.dataDriver?.orderStatus,
    t,
  });

  return (
    <div className="grid max-h-[calc(100vh-92px)] grid-cols-1 grid-rows-[auto_auto_1fr] gap-6 bg-white px-6 pb-6 pt-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <BreadCrumb data={breadcrumbItems} />
      <PageTitle className="mb-0">
        {t("LeftPanel.titleLacakArmada", {}, "Lacak Armada")}
      </PageTitle>

      <div className="flex h-fit max-h-full flex-col gap-4 overflow-hidden rounded-xl border border-[#C4C4C4] pt-5">
        <div className="px-4">
          <div className="flex flex-col gap-3 border-b border-neutral-400 pb-4">
            <BadgeStatusPesanan
              className="h-6 w-fit"
              variant={statusMeta.variant}
            >
              {statusMeta.label}
            </BadgeStatusPesanan>

            <AvatarDriver
              name={dataDriverTimeline?.dataDriver?.name}
              image={dataDriverTimeline?.dataDriver?.profileImage}
              licensePlate={dataDriverTimeline?.dataDriver?.licensePlate}
            />
          </div>
        </div>

        <h2 className="px-4 text-xs font-semibold leading-[14.4px] text-black">
          {t("LeftPanel.titleDetailStatusDriver", {}, "Detail Status Driver")}
        </h2>

        {/* This div will now scroll correctly only when its content overflows the parent's available space. */}
        <div className="mr-2 flex-1 overflow-y-auto pb-5 pl-4 pr-1.5">
          <DriverTimeline dataTimeline={dataDriverTimeline} />
        </div>
      </div>
      {/* 
      <pre>{JSON.stringify(statusMeta, null, 2)}</pre>
      <pre>{JSON.stringify(dataDriverTimeline, null, 2)}</pre> */}
    </div>
  );
};
