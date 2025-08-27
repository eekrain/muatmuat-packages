import Image from "next/image";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const FotoMuatan = () => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const cargoPhotos = useSewaArmadaStore(
    (state) => state.formValues.cargoPhotos
  );
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setCargoPhotos } = useSewaArmadaActions();
  const [activeIndex, setActiveIndex] = useState(null);

  const { trigger, isMutating } = useSWRMutateHook("v1/orders/upload", "POST");

  const handleImageUpload = async (index, image) => {
    if (!image) {
      setCargoPhotos(index, image);
    }
    setActiveIndex(index);
    const formData = new FormData();
    formData.append("file", image);
    await trigger(formData)
      .then((response) => {
        setCargoPhotos(index, response.Data.photoUrl);
      })
      .catch((err) => {
        console.error("Error uploading image:", err);
      });
  };

  return (
    <FormContainer>
      <FormLabel required>Lampiran/Foto Muatan</FormLabel>
      <div className="flex-1">
        <div className="flex flex-wrap gap-4">
          {isEditPage
            ? cargoPhotos
                .filter((item) => item)
                .map((item, key) => (
                  <Image
                    className="rounded-xl"
                    src={item}
                    key={key}
                    width={124}
                    height={124}
                    alt={`Foto Muatan ${key}`}
                  />
                ))
            : [...Array(4)].map((_, key) => (
                <Fragment key={key}>
                  <ImageUploaderWeb
                    onUpload={(value) =>
                      handleFirstTime(() => handleImageUpload(key, value))
                    }
                    isCircle
                    uploadText={key === 0 ? "Foto Utama" : `Foto ${key}`}
                    maxSize={10}
                    className="!size-[124px]"
                    value={cargoPhotos?.[key]}
                    isLoading={isMutating && activeIndex === key}
                    isNull={formErrors.cargoPhotos}
                    cropperTitle="Upload Foto Muatan"
                    variant="muatparts"
                  />
                </Fragment>
              ))}
          <p
            className={cn(
              "w-full text-xs font-medium leading-[14.4px]",
              formErrors?.cargoPhotos ? "text-error-400" : "text-neutral-600"
            )}
          >
            {formErrors?.cargoPhotos ??
              "Maksimal unggah 4 foto muatan dengan format .jpg/.jpeg/.png, besar file maks. 10MB"}
          </p>
        </div>
      </div>
    </FormContainer>
  );
};
