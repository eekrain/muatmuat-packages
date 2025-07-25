import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import PageTitle from "@/components/PageTitle/PageTitle";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { useClientHeight } from "@/hooks/use-client-height";
import { useTranslation } from "@/hooks/use-translation";

const IS_SHOW_ESTIMATE_ARRIVAL = false;

export const LeftPanel = ({ dataDriverStatus }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const breadcrumbItems = [
    { name: t("labelDaftarPesanan"), href: "/daftarpesanan" },
    {
      name: t("labelDetailPesanan"),
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: t("titleLacakArmada") },
  ];

  const contentRef = useRef(null);
  const contentHeight = useClientHeight({
    ref: contentRef,
    deps: [dataDriverStatus?.dataDriver?.statusDriver],
  });

  return (
    <div className="grid grid-cols-1 grid-rows-[16px_24px_1fr] gap-6 bg-white px-6 pb-6 pt-8 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <BreadCrumb data={breadcrumbItems} />

      <PageTitle className="mb-0">{t("titleLacakArmada")}</PageTitle>

      {dataDriverStatus && (
        <div className="flex flex-col gap-4 rounded-xl border border-[#C4C4C4] pt-5">
          <div className="px-4">
            <div className="flex flex-col gap-3 border-b border-neutral-400 pb-4">
              {/* Status Badge */}
              <BadgeStatusPesanan className="h-6 w-fit" variant="primary">
                {dataDriverStatus?.dataDriver?.statusTitle}
              </BadgeStatusPesanan>

              {/* Driver Profile */}
              <AvatarDriver
                name={dataDriverStatus?.dataDriver?.name}
                image={dataDriverStatus?.dataDriver?.profileImage}
                licensePlate={dataDriverStatus?.dataDriver?.licensePlate}
              />
            </div>
          </div>
          {dataDriverStatus?.dataDriver?.statusDriver?.startsWith("MENUJU") && (
            <div className="px-4">
              <div className="flex h-[45px] items-center justify-between bg-[#F1F1F1] px-3 text-xs leading-[1.1]">
                <span className="max-w-[120px] font-medium text-[#7B7B7B]">
                  {t("labelEstimasiTibaLokasiBongkar2")}
                </span>
                <span className="font-semibold text-black">
                  4 Okt 2024 05:30 WIB
                </span>
              </div>
            </div>
          )}

          <h2 className="px-4 text-xs font-semibold leading-[14.4px] text-black">
            {t("titleDetailStatusDriver")}
          </h2>

          <div
            ref={contentRef}
            className="pl-4 pr-[6px]"
            style={{
              ...(!contentHeight && { flex: 1 }),
            }}
          >
            {contentHeight && (
              <div
                className="overflow-y-auto pb-5 pr-[8px]"
                style={{
                  ...(contentHeight && { maxHeight: contentHeight }),
                }}
              >
                <DriverTimeline dataDriverStatus={dataDriverStatus} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
