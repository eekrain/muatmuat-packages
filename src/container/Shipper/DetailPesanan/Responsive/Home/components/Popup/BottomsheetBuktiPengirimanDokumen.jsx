import { Fragment } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/BottomSheet";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

export const BottomsheetBuktiPengirimanDokumen = ({ children }) => {
  const { t } = useTranslation();

  const dummyDocumentShippingEvidencePhotos = [
    "/img/recommended1.png",
    "/img/recommended1.png",
    "/img/recommended1.png",
    "/img/recommended1.png",
  ];

  const documentShippingDetail = [
    {
      title: t("labelDate", {}, "Tanggal"),
      content: (
        <span className="text-xs font-medium leading-[1.1] text-neutral-900">
          {formatDate(new Date().toISOString(), true)}
        </span>
      ),
    },
    {
      title: t("labelShippingEvidencePhoto", {}, "Foto Bukti Pengiriman"),
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
      title: t("labelNote", {}, "Catatan"),
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
    <BottomSheet>
      <BottomSheetTrigger asChild>{children}</BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t("titleDocumentShippingEvidence", {}, "Bukti Pengiriman Dokumen")}
          </BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-4 px-4 pb-6">
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
