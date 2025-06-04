"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ResponsiveMenu } from "@/container/ResponsiveMenu";
import DefaultResponsiveLayout from "@/layout/ResponsiveLayout/DefaultResponsiveLayout";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import SearchBarResponsiveLayout from "@/layout/ResponsiveLayout/SearchBarResponsiveLayout";
import {
  ResponsiveRoute,
  useNavigationStore,
  useResponsiveNavigation,
} from "@/lib/responsive-navigation";

import { SewaArmadaHome } from "./Home";
import InformasiMuatanScreen from "./InformasiMuatan/InformasiMuatanScreen";
import { PencarianLokasi } from "./PencarianLokasi";
import { PencarianLokasiTersimpan } from "./PencarianLokasiTersimpan";
import { PinPointMap } from "./PinPointMap";

const SewaArmadaResponsive = () => {
  const router = useRouter();
  const tes = useNavigationStore((state) => state.stack);
  console.log("🚀 ~ SewaArmadaResponsive ~ tes:", tes);
  const navigation = useResponsiveNavigation();

  useEffect(() => {
    navigation.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ResponsiveRoute
        path="/"
        layout={(children) => (
          <DefaultResponsiveLayout
            mode="default"
            onClickBackButton={() => {
              router.back();
            }}
            onClickChatButton={() => {
              alert("implement redirect chat");
            }}
            onClickNotificationButton={() => {
              alert("implement redirect notification");
            }}
            onClickMenuButton={() => {
              navigation.push("/menu");
            }}
          >
            {children}
          </DefaultResponsiveLayout>
        )}
        component={<SewaArmadaHome />}
      />
      <ResponsiveRoute
        path="/PencarianLokasi"
        layout={(children) => (
          <SearchBarResponsiveLayout
            onClickBackButton={() => {
              navigation.pop();
            }}
            placeholder="Cari Lokasi Muat"
          >
            {children}
          </SearchBarResponsiveLayout>
        )}
        component={<PencarianLokasi />}
      />
      <ResponsiveRoute
        path="/PencarianLokasiTersimpan"
        layout={(children) => (
          <SearchBarResponsiveLayout
            onClickBackButton={() => {
              navigation.pop();
            }}
            placeholder="Cari Lokasi yang Disimpan"
          >
            {children}
          </SearchBarResponsiveLayout>
        )}
        component={<PencarianLokasiTersimpan />}
      />
      <ResponsiveRoute
        path="/InformasiMuatan"
        layout={(children) => (
          <FormResponsiveLayout
            onClickBackButton={() => {
              navigation.pop();
            }}
            title={{
              label: "Informasi Muatan",
            }}
          >
            {children}
          </FormResponsiveLayout>
        )}
        component={<InformasiMuatanScreen />}
      />
      <ResponsiveRoute
        path="/PinPointMap"
        layout={(children) => (
          <FormResponsiveLayout
            onClickBackButton={() => {
              navigation.pop();
            }}
          >
            {children}
          </FormResponsiveLayout>
        )}
        component={<PinPointMap />}
      />
      <ResponsiveRoute
        path="/menu"
        layout={(children) => (
          <DefaultResponsiveLayout
            mode="menu"
            onClickBackButton={() => {
              navigation.pop();
            }}
            onClickChatButton={() => {
              alert("implement redirect chat");
            }}
            onClickNotificationButton={() => {
              alert("implement redirect notification");
            }}
          >
            {children}
          </DefaultResponsiveLayout>
        )}
        component={<ResponsiveMenu />}
      />
    </>
  );
};

export default SewaArmadaResponsive;
