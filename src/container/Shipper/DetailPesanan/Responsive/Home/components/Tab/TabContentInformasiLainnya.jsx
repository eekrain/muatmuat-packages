import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { TabsContent } from "@/components/Tabs/Tabs";

export const TabContentInformasiLainnya = ({ dataRingkasanPesanan }) => {
  const images = (dataRingkasanPesanan?.cargoPhotos || []).map((src, index) => ({
    id: index + 1,
    src,
    alt: `Foto Muatan ${index + 1}`,
  }));

  const doNumbers = dataRingkasanPesanan?.numberDeliveryOrder || [];
  const cargoDescription = dataRingkasanPesanan?.cargoDescription || "";
  return (
    <TabsContent
      value="informasi-lainnya"
      className="flex flex-col gap-6 px-4 py-5"
    >
      {images.length > 0 && (
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
      )}
      {/* Deskripsi Muatan Section */}
      {cargoDescription && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold leading-tight text-neutral-900">
            Deskripsi Muatan
          </h2>
          <p className="text-xs font-medium leading-tight text-neutral-900">
            {cargoDescription}
          </p>
        </div>
      )}
      {/* No. Delivery Order (DO) Section */}
      {doNumbers.length > 0 && (
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
      )}
    </TabsContent>
  );
};
