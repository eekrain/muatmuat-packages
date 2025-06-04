"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  ResponsiveRoute,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";

import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";

const SewaArmadaResponsive = () => {
  const router = useRouter();

  const navigation = useResponsiveNavigation();

  useEffect(() => {
    navigation.replace("/", {
      layout: "default",
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
          navigation.push("/", {
            layout: "menu",
            header: {
              onClickBackButton: () => {
                // mundur ke screen sebelumnya
                navigation.pop();
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
      <ResponsiveRoute path="/" index element={<SewaArmadaHome />} />
      <ResponsiveRoute path="/PencarianLokasi" element={<PencarianLokasi />} />
      <ResponsiveRoute
        path="/PencarianLokasiTersimpan"
        element={<PencarianLokasiTersimpan />}
      />
      <ResponsiveRoute
        path="/InformasiMuatan"
        element={<InformasiMuatanScreen />}
      />
    </>
  );
};

export default SewaArmadaResponsive;
