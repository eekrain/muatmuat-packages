"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import ExampleResponsive from "@/container/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Example/Web/ExampleWeb";
import useDevice from "@/hooks/use-device";
import {
  useResponsiveRouter,
  useResponsiveRouterStore,
} from "@/store/responsiveRouter";

const ExampleMobileSearchBar = () => {
  const router = useRouter();
  const { replaceScreen } = useResponsiveRouter();
  const searchValue = useResponsiveRouterStore((state) => state.searchValue);

  useEffect(() => {
    replaceScreen({
      layout: "form",
      screen: null,
      header: {
        title: {
          label: "Form",
          className: "", // Buat case spesifik, misal untuk form, bisa tambahkan class untuk ukuran text title
        },
        onClickBackButton: () => {
          alert("back button");
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ExampleResponsive searchValue={searchValue} />;
};

export default function Page() {
  const { isMobile, mounted } = useDevice();

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return <ExampleMobileSearchBar />;
  }
  return <ExampleWeb />;
}
