import Image from "next/image";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

const CropperPreviewScreen = () => {
  const params = useResponsiveRouteParams();
  return (
    <FormResponsiveLayout
      title={{
        label: params.title,
      }}
    >
      <div className="mb-16 w-full bg-neutral-100">
        <div className="flex aspect-square w-full justify-center bg-[#cccccc] p-4">
          <div className="overflow-hidden rounded-full">
            <Image
              alt="preview"
              className="size-full"
              src={src}
              width={100}
              height={100}
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col justify-center gap-y-3">
          <Button
            className="!h-[30px]"
            variant="muatparts-primary-secondary"
            onClick={() => {}}
          >
            Ubah Foto
          </Button>
          <span className="text-[14px] font-medium leading-[14px] text-[#676767]">
            Max. size foto 10MB
          </span>
        </div>
      </div>
      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={() => {}}
          type="button"
        >
          Lanjut
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default CropperPreviewScreen;
