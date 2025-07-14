"use client";

import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { useSWRMutateHook } from "@/hooks/use-swr";

// import ImageUploaderResponsive from "./ImageUploaderResponsive";

const ImageUploader = (props) => {
  // const { isMobile } = viewport();
  const { trigger: uploadPhoto, isMutating: isMutatingUploadPhoto } =
    useSWRMutateHook("v1/orders/upload", "POST");

  const handleFinishCrop = async (value) => {
    const formData = new FormData();
    formData.append("file", value);

    return await uploadPhoto(formData)
      .then((data) => {
        props.getImage(data.Data.photoUrl);
        return data;
      })
      .catch((error) => {
        return value;
      });
  };

  const sharedProps = {
    onFinishCrop: handleFinishCrop,
    isLoading: isMutatingUploadPhoto,
  };

  // if (isMobile) {
  //   return <ImageUploaderResponsive {...props} {...sharedProps} />;
  // }
  return <ImageUploaderWeb {...props} {...sharedProps} />;
};

export default ImageUploader;
