import { Fragment } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { cn } from "@/lib/utils";

export const BottomsheetDocumentShipping = ({ open, onOpenChange }) => {
  const dummyDocumentShippingEvidencePhotos = [
    "/img/recommended1.png",
    "/img/recommended1.png",
    "/img/recommended1.png",
    "/img/recommended1.png",
  ];

  const documentShippingDetail = [
    {
      title: "Tanggal",
      content: (
        <span className="text-xs font-medium leading-[1.1] text-neutral-900">
          04 Okt 2024 18:00 WIB
        </span>
      ),
    },
    {
      title: "Foto Bukti Pengiriman",
      content: (
        <div className="flex items-center gap-x-3">
          {dummyDocumentShippingEvidencePhotos.map((photo, index) => (
            <Fragment key={index}>
              <LightboxProvider image={photo}>
                <LightboxPreview image={photo} className="h-[72px] w-[72px]" />
              </LightboxProvider>
            </Fragment>
          ))}
        </div>
      ),
    },
    {
      title: "Catatan",
      content: (
        <span className="text-xs font-medium leading-[1.1] text-neutral-900">
          Kami informasikan bahwa dokumen telah kami kirim dan saat ini sudah
          diterima oleh Bapak Ervin Sudjatmiko. Mohon konfirmasi apabila ada hal
          yang perlu ditindaklanjuti lebih lanjut. Kami siap membantu apabila
          dibutuhkan klarifikasi atau kelengkapan tambahan. Terima kasih atas
          perhatian dan kerja samanya.
        </span>
      ),
    },
  ];

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>Bukti Pengiriman Dokumen</BottomSheetHeader>
        <div className="flex flex-col gap-y-4 px-4 py-6">
          {documentShippingDetail.map((item, key) => (
            <div
              className={cn(
                "flex flex-col gap-y-3",
                documentShippingDetail.length - 1 === key
                  ? ""
                  : "border-b border-b-neutral-400 pb-4"
              )}
              key={key}
            >
              <h4 className="text-sm font-semibold leading-[1.1] text-neutral-900">
                {item.title}
              </h4>
              {item.content}
            </div>
          ))}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
