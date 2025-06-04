"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  ResponsiveRoute,
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";

import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";

const SewaArmadaResponsive = () => {
  const router = useRouter();

  const navigation = useResponsiveNavigation();
  const params = useResponsiveRouteParams();
  console.log("🚀 ~ SewaArmadaResponsive ~ params:", params);
  useEffect(() => {
    navigation.push("/", {
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
      <ResponsiveRoute path="/" index component={<SewaArmadaHome />} />
      <ResponsiveRoute
        path="/PencarianLokasi"
        component={<PencarianLokasi />}
      />
      <ResponsiveRoute
        path="/PencarianLokasiTersimpan"
        component={<PencarianLokasiTersimpan />}
      />
      <ResponsiveRoute
        path="/InformasiMuatan"
        component={<InformasiMuatanScreen />}
      />
    </>
  );
};

export default SewaArmadaResponsive;
