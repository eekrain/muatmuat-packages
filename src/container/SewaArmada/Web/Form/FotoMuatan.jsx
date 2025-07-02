import { Fragment } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const FotoMuatan = () => {
  const fotoMuatan = useSewaArmadaStore((state) => state.formValues.fotoMuatan);
  const formErrors = useSewaArmadaStore((state) => state.formErrors);
  const { setFotoMuatan } = useSewaArmadaActions();

  const handleImageUpload = (index, img) => setFotoMuatan(index, img);

  return (
    <FormContainer>
      <FormLabel required>Lampiran/Foto Muatan</FormLabel>
      <div className="flex-1">
        <div className="flex flex-wrap gap-4">
          {[...Array(4)].map((_, key) => (
            <Fragment key={key}>
              <ImageUploader
                getImage={(value) =>
                  handleFirstTime(() => handleImageUpload(key, value))
                }
                uploadText={key === 0 ? "Foto Utama" : `Foto ${key + 1}`}
                maxSize={10}
                className="!size-[124px]"
                value={fotoMuatan[key]}
                isNull={formErrors.fotoMuatan}
              />
            </Fragment>
          ))}
          <p
            className={cn(
              "w-full text-[12px] font-medium leading-[14.4px]",
              formErrors?.fotoMuatan ? "text-error-400" : "text-neutral-600"
            )}
          >
            {formErrors?.fotoMuatan ??
              "Maksimal unggah 4 foto muatan dengan format .jpg/.jpeg/.png, besar file maks. 10MB"}
          </p>
        </div>
      </div>
    </FormContainer>
  );
};
