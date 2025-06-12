import useDevice from "@/hooks/use-device";

import ImagesPreviewResponsive from "./ImagesPreviewResponsive";
import ImagesPreviewWeb from "./ImagesPreviewWeb";

const ImagesPreview = (props) => {
  const { isMobile } = useDevice();

  if (isMobile) {
    return <ImagesPreviewResponsive {...props} />;
  } else {
    return <ImagesPreviewWeb {...props} />;
  }
};

export default ImagesPreview;
