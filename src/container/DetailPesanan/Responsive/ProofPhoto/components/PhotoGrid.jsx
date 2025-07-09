import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

export const PhotoGrid = () => {
  const photos = [
    "https://picsum.photos/360/270",
    "https://picsum.photos/360/270",
    "https://picsum.photos/360/270",
    "https://picsum.photos/360/270",
  ];

  return (
    <div className="flex flex-col gap-4 bg-white px-4 py-5">
      <div className="text-sm font-semibold">Bukti Tiba di Lokasi Muat 1 </div>
      <div className="grid grid-cols-4 place-items-center gap-3">
        {photos.map((photo, index) => (
          <LightboxProvider image={photo} key={index}>
            <LightboxPreview image={photo} className="h-[72px] w-[72px]" />
          </LightboxProvider>
        ))}
      </div>
    </div>
  );
};
