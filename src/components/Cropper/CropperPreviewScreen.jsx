import Image from "next/image";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import {
  useImageUploaderActions,
  useImageUploaderStore,
} from "@/store/Shipper/forms/imageUploaderStore";

const CropperPreviewScreen = () => {
  const navigation = useResponsiveNavigation();
  const { previewImage } = useImageUploaderStore();
  const { reset, setIsReadyUploadPhoto } = useImageUploaderActions();

  useShallowCompareEffect(() => {
    if (!previewImage) {
      navigation.popTo("/InformasiPesanan");
    }
  }, [previewImage]);

  const handleSaveImage = () => {
    setIsReadyUploadPhoto(true);
    navigation.popTo("/InformasiPesanan");
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Upload Foto Muatan",
      }}
      onClickBackButton={() => {
        reset();
        navigation.popTo("/InformasiPesanan");
      }}
    >
      <div className="mb-16 w-full bg-neutral-100">
        <div className="flex aspect-square w-full justify-center bg-[#cccccc] p-4">
          <div className="overflow-hidden rounded-full">
            <Image
              alt="preview"
              className="size-full bg-neutral-50"
              src={previewImage}
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-y-3">
          <Button
            className="w-[134px]"
            variant="muatparts-primary-secondary"
            onClick={() => {}}
          >
            Ubah Foto
          </Button>
          <span className="text-sm font-medium leading-[14px] text-[#676767]">
            Max. size foto 10MB
          </span>
        </div>
      </div>
      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="w-full"
          onClick={handleSaveImage}
          type="button"
        >
          Lanjut
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default CropperPreviewScreen;
