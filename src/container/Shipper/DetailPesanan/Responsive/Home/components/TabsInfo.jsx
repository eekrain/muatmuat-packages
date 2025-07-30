import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { formatDate } from "@/lib/utils/dateFormat";

import { DetailPICMobile } from "./DetailPICMobile";

const images = [
  {
    id: 1,
    src: "https://picsum.photos/200/200?random=1",
    alt: "Foto Muatan 1",
  },
  {
    id: 2,
    src: "https://picsum.photos/200/200?random=2",
    alt: "Foto Muatan 2",
  },
];

const doNumbers = ["DO-20241023-001", "DO-20241023-002"];

export const TabsInfo = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataDetailPIC,
}) => {
  return (
    <Tabs className="w-full bg-white" defaultValue={"ringkasan"}>
      <TabsList className="w-full">
        <TabsTriggerWithSeparator value="ringkasan">
          Ringkasan
        </TabsTriggerWithSeparator>
        <TabsTriggerWithSeparator value="informasi-lainnya">
          Informasi Lainnya
        </TabsTriggerWithSeparator>
        <TabsTriggerWithSeparator value="detail-pic" showSeparator={false}>
          Detail PIC
        </TabsTriggerWithSeparator>
      </TabsList>

      <TabsContent value="ringkasan" className="px-4 py-5">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Informasi Armada
            </h3>
            <div className="flex items-center gap-3">
              <LightboxProvider image="/img/truck.png">
                <LightboxPreview image="/img/truck.png" />
              </LightboxProvider>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-neutral-900">
                  Box - Colt Diesel Engkel
                </p>
                <p className="text-sm font-medium text-neutral-900">
                  Kebutuhan : {dataStatusPesanan?.totalUnit || 0} Unit
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold text-neutral-900">
              Waktu Muat
            </h3>
            <p className="text-xs font-semibold text-neutral-900">
              {formatDate(dataRingkasanPesanan?.loadTimeStart)}
              {dataRingkasanPesanan?.loadTimeEnd
                ? ` s/d ${formatDate(dataRingkasanPesanan?.loadTimeEnd)}`
                : ""}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent
        value="informasi-lainnya"
        className="flex flex-col gap-6 px-4 py-5"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold leading-tight text-neutral-900">
            Lampiran/Foto Muatan
          </h2>
          <LightboxProvider
            images={images.map((img) => img.src)}
            title="Lampiran/Foto Muatan"
          >
            <div className="flex flex-row flex-wrap gap-3">
              {images.map((image, index) => (
                <LightboxPreview
                  key={image.id}
                  image={image.src}
                  index={index}
                  alt={image.alt}
                  className="h-[72px] w-[72px] object-cover"
                />
              ))}
            </div>
          </LightboxProvider>
        </div>
        {/* Deskripsi Muatan Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold leading-tight text-neutral-900">
            Deskripsi Muatan
          </h2>
          <p className="text-xs font-medium leading-tight text-neutral-900">
            tolong kirim muatan dengan hati hati, jangan sampai rusak dan
            hancur, terimakasih
          </p>
        </div>
        {/* No. Delivery Order (DO) Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold leading-tight text-neutral-900">
            No. Delivery Order (DO)
          </h2>
          <div className="flex flex-row flex-wrap gap-2">
            {doNumbers.map((doNumber, index) => (
              <div
                key={index}
                className="flex items-center justify-center rounded-full border border-primary-700 bg-primary-50 px-3 py-2"
              >
                <span className="text-sm font-medium text-primary-700">
                  {doNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="detail-pic" className="">
        <DetailPICMobile dataDetailPIC={dataDetailPIC} />
      </TabsContent>
    </Tabs>
  );
};
