"use client";

import viewport from "@/store/zustand/common";
import ImageUploaderWeb from "./ImageUploaderWeb";
// import ImageUploaderResponsive from "./ImageUploaderResponsive";
// import SWRHandler from "@/services/useSWRHook";
// import axios from "axios";

const ImageUploader = (props) => {
  const { isMobile } = viewport();
  // const { useSWRMutateHook } = SWRHandler;
  // const {
  //   data: dataUploadPhoto,
  //   error: errorUploadPhoto,
  //   trigger: uploadPhoto,
  //   isMutating: isMutatingUploadPhoto,
  // } = useSWRMutateHook(
  //   `${process.env.NEXT_PUBLIC_GLOBAL_API}v1/muatparts/product/photo`,
  //   "POST",
  //   (url, arg) => {
  //     return axios({
  //       url,
  //       method: "POST",
  //       data: arg,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //   }
  // );

  const handleFinishCrop = async (value) => {
    const formData = new FormData();
    formData.append("file", value);
    props.getImage(value);
    // return await uploadPhoto(formData)
    //   .then((data) => {
    //     props.getImage(data.data.Data);
    //   })
    //   .catch(() => value);
  };

  const sharedProps = {
    onFinishCrop: handleFinishCrop,
    // isLoading: isMutatingUploadPhoto,
  };

  // if (isMobile) {
  //   return <ImageUploaderResponsive {...props} {...sharedProps} />;
  // }
  return <ImageUploaderWeb {...props} {...sharedProps} />;
};

export default ImageUploader;
