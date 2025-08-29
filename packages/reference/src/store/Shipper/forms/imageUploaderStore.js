import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  activeIndex: -1,
  image: null,
  imageFile: null,
  isReadyUploadPhoto: false,
  previewImage: null,
};

export const useImageUploaderStore = create(
  zustandDevtools((set) => ({
    ...defaultValues,
    actions: {
      setActiveIndex: (activeIndex) => set({ activeIndex }),
      setImage: (image) =>
        set({
          image,
        }),
      setImageFile: (imageFile) =>
        set({
          imageFile,
        }),
      setIsReadyUploadPhoto: (isReadyUploadPhoto) =>
        set({ isReadyUploadPhoto }),
      setPreviewImage: (previewImage) => set({ previewImage }),
      reset: () =>
        set({
          ...defaultValues,
        }),
    },
  }))
);

export const useImageUploaderActions = () => {
  const {
    reset,
    setActiveIndex,
    setImage,
    setImageFile,
    setPreviewImage,
    setIsReadyUploadPhoto,
  } = useImageUploaderStore((state) => state.actions);
  return {
    reset,
    setActiveIndex,
    setImage,
    setImageFile,
    setPreviewImage,
    setIsReadyUploadPhoto,
  };
};
