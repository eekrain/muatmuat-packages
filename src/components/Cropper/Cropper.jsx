"use client";

// import viewport from "@/store/zustand/common";
import CropperWeb from "./CropperWeb";
// import CropperResponsive from "./CropperResponsive";

const Cropper = (props) => {
  // const { isMobile } = viewport();

  // if (isMobile) {
  //   return <CropperResponsive {...props} />;
  // }
  return <CropperWeb {...props} />;
};

export default Cropper;
