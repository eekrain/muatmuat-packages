import { isSameDay } from "date-fns";

import Card, { CardContent } from "@/components/Card/Card";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { formatDate, formatTime } from "@/lib/utils/dateFormat";

const SectionRow = ({ label, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <p className="w-full text-xs font-medium text-neutral-600 md:w-[178px] md:flex-shrink-0">
      {label}
    </p>
    <div className="flex-1">{children}</div>
  </div>
);

const RingkasanPesananBody = ({ dataRingkasanPesanan }) => {
  const isSameLoadDay = isSameDay(
    new Date(dataRingkasanPesanan?.loadTimeStart),
    new Date(dataRingkasanPesanan?.loadTimeEnd)
  );

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        {dataRingkasanPesanan?.isHalalLogistics && (
          <div className="flex h-10 w-full items-center gap-3 rounded-xl bg-[#F7EAFD] px-4">
            <img
              src="/icons/halal.svg"
              width={18}
              height={24}
              alt="Halal Indonesia"
            />
            <span className="mt-0.5 text-center text-xs font-semibold text-[#652672]">
              Menggunakan Layanan Halal Logistik
            </span>
          </div>
        )}
        <h1 className="text-lg font-semibold leading-tight text-neutral-900">
          Ringkasan Pesanan
        </h1>

        {/* --- Always Visible Sections --- */}
        <SectionRow label="Informasi Armada">
          <div className="flex items-center gap-4">
            <LightboxProvider
              image={dataRingkasanPesanan?.vehicle?.vehicleImage}
              title={dataRingkasanPesanan?.vehicle?.truckTypeName}
            >
              <LightboxPreview
                image={dataRingkasanPesanan?.vehicle?.vehicleImage}
                alt={dataRingkasanPesanan?.vehicle?.truckTypeName}
                className="size-[68px] rounded-xl object-cover"
              />
            </LightboxProvider>
            <div>
              <h3 className="text-xs font-bold text-neutral-900">
                {dataRingkasanPesanan?.vehicle?.truckTypeName}
              </h3>
              <p className="mt-2 text-xs font-medium text-neutral-900">
                Kebutuhan : {dataRingkasanPesanan?.truckCount} Unit
              </p>
            </div>
          </div>
        </SectionRow>

        <SectionRow label="Waktu Muat">
          <p className="text-xs font-medium text-neutral-900">
            {formatDate(dataRingkasanPesanan?.loadTimeStart)} s/d{" "}
            {isSameLoadDay
              ? formatTime(dataRingkasanPesanan?.loadTimeEnd)
              : formatDate(dataRingkasanPesanan?.loadTimeEnd)}
          </p>
        </SectionRow>

        {/* <SectionRow label="Rute">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-neutral-900">
              Estimasi {dataRingkasanPesanan?.estimatedDistance} km
            </p>
            <TimelineContainer>
              <NewTimelineItem
                variant="bullet"
                index={0}
                activeIndex={0}
                title={dataRingkasanPesanan?.route?.muat?.[0]?.fullAddress}
                isLast={false}
                appearance={{ titleClassname: "text-xs font-medium md:mt-0.5" }}
                buttonDetail={
                  dataRingkasanPesanan?.route?.muat?.length > 1 ? (
                    <ButtonMini className="mt-1">
                      Lihat Lokasi Muat Lainnya
                    </ButtonMini>
                  ) : null
                }
              />
              <NewTimelineItem
                variant="bullet"
                index={1}
                activeIndex={0}
                title={dataRingkasanPesanan?.route?.bongkar?.[0]?.fullAddress}
                isLast={true}
                appearance={{ titleClassname: "text-xs font-medium md:mt-0.5" }}
                buttonDetail={
                  dataRingkasanPesanan?.route?.bongkar?.length > 1 ? (
                    <ButtonMini className="mt-1">
                      Lihat Lokasi Bongkar Lainnya
                    </ButtonMini>
                  ) : null
                }
              />
            </TimelineContainer>
          </div>
        </SectionRow>

        <SectionRow label="Informasi Muatan">
          <div className="flex flex-col gap-2">
            {dataRingkasanPesanan?.cargos?.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <IconComponent
                  src="/icons/muatan16.svg"
                  className="size-4"
                  alt="Muatan Icon"
                />
                <p className="text-xs font-medium text-neutral-900">
                  {item.name} ({item.weight} {item.weightUnit})
                </p>
              </div>
            ))}
          </div>
        </SectionRow> */}
      </CardContent>
    </Card>
  );
};

export default RingkasanPesananBody;
