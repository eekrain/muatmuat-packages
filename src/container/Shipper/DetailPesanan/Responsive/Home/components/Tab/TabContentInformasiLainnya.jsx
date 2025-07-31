import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { TabsContent } from "@/components/Tabs/Tabs";

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

export const TabContentInformasiLainnya = () => {
  return (
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
          tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur,
          terimakasih
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
  );
};
