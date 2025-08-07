import { useParams } from "next/navigation";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import PageTitle from "@/components/PageTitle/PageTitle";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useTranslation } from "@/hooks/use-translation";

export const LeftPanel = ({ dataTimeline }) => {
  const { t } = useTranslation();
  const params = useParams();
  const breadcrumbItems = [
    { name: t("labelDaftarPesanan"), href: "/daftarpesanan" },
    {
      name: t("labelDetailPesanan"),
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: t("titleLacakArmada") },
  ];

  return (
    <div className="grid max-h-[calc(100vh-92px)] grid-cols-1 grid-rows-[auto_auto_1fr] gap-6 bg-white px-6 pb-6 pt-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <BreadCrumb data={breadcrumbItems} />
      <PageTitle className="mb-0">{t("titleLacakArmada")}</PageTitle>

      {/* FIX: Added h-full and overflow-hidden to ensure this container properly fills the grid area and constrains its children. */}
      <div className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-[#C4C4C4] pt-5">
        <div className="px-4">
          <div className="flex flex-col gap-3 border-b border-neutral-400 pb-4">
            <BadgeStatusPesanan className="h-6 w-fit" variant="primary">
              {dataTimeline?.dataDriver?.statusTitle}
            </BadgeStatusPesanan>

            <AvatarDriver
              name={dataTimeline?.dataDriver?.name}
              image={dataTimeline?.dataDriver?.profileImage}
              licensePlate={dataTimeline?.dataDriver?.licensePlate}
            />
          </div>
        </div>

        <h2 className="px-4 text-xs font-semibold leading-[14.4px] text-black">
          {t("titleDetailStatusDriver")}
        </h2>

        {/* This div will now scroll correctly only when its content overflows the parent's available space. */}
        <div className="mr-2 flex-1 overflow-y-auto pb-5 pl-4 pr-1.5">
          <DriverTimeline dataTimeline={dataTimeline} />
        </div>
      </div>
    </div>
  );
};
