import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useResponsiveLayoutActions } from "@/store/responsiveLayout";

const SewaArmadaResponsive = () => {
  const router = useRouter();

  const { setDefaultScreen } = useResponsiveLayoutActions();

  useEffect(() => {
    setDefaultScreen({
      header: {
        onClickBackButton: () => {
          router.back();
        },
        onClickChatButton: () => {
          alert("implement redirect chat");
        },
        onClickNotificationButton: () => {
          alert("implement redirect notification");
        },
        onClickMenuButton: () => {
          alert("implement redirect menu");
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="mt-[62px]">abc</div>;
};

export default SewaArmadaResponsive;
