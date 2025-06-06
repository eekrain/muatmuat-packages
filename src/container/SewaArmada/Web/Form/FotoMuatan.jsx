import { Fragment } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
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
          {[...Array(4)].map((_, index) => (
            <Fragment key={index}>
              <ImageUploader
                getImage={(value) => handleImageUpload(index, value)}
                uploadText={index === 0 ? "Foto Utama" : `Foto ${index + 1}`}
                maxSize={10}
                className="!size-[124px]"
                value={fotoMuatan[index]}
                isNull={formErrors.fotoMuatan}
              />
            </Fragment>
          ))}
          <p className="w-full text-xs font-medium text-neutral-600">
            Maksimal unggah 4 foto muatan dengan format .jpg/.jpeg/.png, besar
            file maks. 10MB
          </p>
        </div>
      </div>
    </FormContainer>
  );
};
