import Image from "next/image";
import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import HeaderMobile from "@/container/HeaderMobile/HeaderMobile";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const CropperPreviewResponsive = ({
  src,
  title = "Upload Foto",
  setIsShowPreview,
  onConfirm = () => {},
  uploadOptions,
  onCancelCrop,
  // 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066
  description = "Max. size foto 10MB",
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleEditImage = () => setIsBottomSheetOpen(true);

  return (
    <div className="fixed left-0 top-0 z-[102] h-screen w-full bg-white">
      <HeaderMobile
        onBack={() => {
          onCancelCrop();
          setIsShowPreview(false);
        }}
        title={title}
      />
      <div className="mt-[62px] flex h-full min-h-screen flex-col items-center">
        <div className="flex aspect-square w-full justify-center bg-[#cccccc] p-4">
          <div className="overflow-hidden rounded-full bg-neutral-50">
            <Image
              alt="preview"
              className="size-full"
              src={src}
              width={100}
              height={100}
            />
          </div>
        </div>
        <Button
          className="mt-6 h-10 px-6"
          color="primary_secondary"
          onClick={handleEditImage}
        >
          Ubah Foto
        </Button>
        <div className="mt-3 text-[14px] font-medium leading-[16.8px] text-[#676767]">
          {/* 24. THP 2 - MOD001 - MP - 015 - QC Plan - Web - MuatParts - Seller - Paket 039 A - Profil Seller - LB - 0066 */}
          {description}
        </div>
      </div>
      <div className="shadow-muat fixed bottom-0 left-0 w-full bg-neutral-50 px-4 py-3">
        <Button
          className="h-8 w-full max-w-full"
          color="primary"
          onClick={onConfirm}
        >
          Simpan Foto
        </Button>
      </div>
      <BottomSheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
        <BottomSheetContent>
          <BottomSheetHeader title="Pilih Sumber Foto" />
          <div className="flex justify-around py-4">
            {uploadOptions.map((option, key) => (
              <div className="flex flex-col items-center gap-y-4" key={key}>
                <div
                  className="size-16 cursor-pointer rounded-[50px] bg-primary-700 p-5"
                  onClick={() => {
                    option.onClick();
                    setIsBottomSheetOpen(false);
                  }}
                >
                  <IconComponent src={option.src} size="medium" />
                </div>
                <span className="text-[16px] font-semibold leading-[19.2px]">
                  {option.title}
                </span>
              </div>
            ))}
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </div>
  );
};

export default CropperPreviewResponsive;
