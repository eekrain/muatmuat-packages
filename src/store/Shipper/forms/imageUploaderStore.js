import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  image: null,
  imageFile: null,
  isCircle: true,
};

export const useImageUploaderStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        ...defaultValues,
        setterActions: {
          setImage: (image) =>
            set({
              image,
            }),
          setImageFile: (imageFile) =>
            set({
              imageFile,
            }),
          reset: () =>
            set({
              ...defaultValues,
            }),
        },
      }),
      {
        name: "image-uploader-store",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          image: state.image,
          imageFile: state.imageFile,
          isCircle: state.isCircle,
        }),
      }
    )
  )
);

export const useImageUploaderActions = () => {
  const { reset, setImage, setImageFile } = useImageUploaderStore(
    (state) => state.setterActions
  );
  return {
    reset,
    setImage,
    setImageFile,
  };
};
