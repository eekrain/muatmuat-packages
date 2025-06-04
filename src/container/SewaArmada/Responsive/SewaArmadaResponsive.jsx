"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ResponsiveRoute, useResponsiveRouter } from "@/store/responsiveRouter";

import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";

const SewaArmadaResponsive = () => {
  const router = useRouter();

  const { replaceScreen, pushScreen, popScreen } = useResponsiveRouter();

  useEffect(() => {
    replaceScreen({
      layout: "default",
      screen: null,
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
          pushScreen({
            layout: "menu",
            screen: null,
            header: {
              onClickBackButton: () => {
                // mundur ke screen sebelumnya
                popScreen();
              },
              onClickChatButton: () => {
                alert("implement redirect chat");
              },
              onClickNotificationButton: () => {
                alert("implement redirect notification");
              },
            },
          });
        },
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ResponsiveRoute index element={<SewaArmadaHome />} />
      <ResponsiveRoute screen="PencarianLokasi" element={<PencarianLokasi />} />
      <ResponsiveRoute
        screen="PencarianLokasiTersimpan"
        element={<PencarianLokasiTersimpan />}
      />
      <ResponsiveRoute
        screen="InformasiMuatan"
        element={<InformasiMuatanScreen />}
      />
    </>
  );
};

export default SewaArmadaResponsive;
