import { useParams, useRouter } from "next/navigation";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";

import { DriverTimeline } from "./DriverTimeline";

export const LeftPanel = ({ dataDriverStatus }) => {
  const router = useRouter();
  const params = useParams();
  const breadcrumbItems = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    {
      name: "Detail Pesanan",
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: "Lacak Armada" },
  ];

  return (
    <div className="flex h-[calc(100vh-60px)] w-[480px] flex-col bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      {/* Breadcrumb */}
      <div className="px-6 pb-2 pt-8">
        <BreadCrumb data={breadcrumbItems} />
      </div>

      <div className="flex items-center px-6 pb-6">
        <button onClick={() => router.back()}>
          <IconComponent src="/icons/arrow-left24.svg" size="medium" />
        </button>
        <div className="ml-3 mt-1 text-[20px] font-bold leading-[24px] text-neutral-900">
          Lacak Armada
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#C4C4C4] bg-white">
          {dataDriverStatus ? (
            <>
              {/* Driver Info Section */}
              <div className="flex flex-col gap-4 p-4 pb-0">
                {/* Status Badge */}
                <div className="w-fit">
                  <div className="flex items-center justify-center rounded-md bg-[#E2F2FF] px-2 py-1">
                    <span className="text-[12px] font-semibold leading-[14.4px] text-[#176CF7]">
                      {dataDriverStatus?.dataDriver?.statusTitle}
                    </span>
                  </div>
                </div>

                {/* Driver Profile */}
                <AvatarDriver
                  name={dataDriverStatus?.dataDriver?.name}
                  image={dataDriverStatus?.dataDriver?.profileImage}
                  licensePlate={dataDriverStatus?.dataDriver?.licensePlate}
                />
              </div>

              {/* Divider */}
              <div className="my-3 h-px w-full bg-[#C4C4C4]"></div>

              {/* Estimated Arrival */}
              <div className="rounded-none bg-[#F1F1F1] p-3">
                <div className="flex items-center justify-between">
                  <span className="max-w-[120px] text-[12px] font-medium leading-[13.2px] text-[#7B7B7B]">
                    Estimasi Tiba di Lokasi Bongkar 1
                  </span>
                  <span className="text-[12px] font-semibold leading-[13.2px] text-black">
                    4 Okt 2024 05:30 WIB
                  </span>
                </div>
              </div>

              {/* Detail Status Title */}
              <h2 className="my-4 px-4 text-[12px] font-semibold leading-[14.4px] text-black">
                Detail Status Driver
              </h2>

              <DriverTimeline dataDriverStatus={dataDriverStatus} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
