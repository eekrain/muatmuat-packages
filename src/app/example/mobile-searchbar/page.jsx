"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ExampleResponsive from "@/container/Example/Responsive/ExampleResponsive";
import ExampleWeb from "@/container/Example/Web/ExampleWeb";
import useDevice from "@/hooks/use-device";
import { useResponsiveRouterActions } from "@/store/responsiveRouter";

const ExampleMobileSearchBar = () => {
  const router = useRouter();
  const { setSearchBarScreen } = useResponsiveRouterActions();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchBarScreen({
      header: {
        onClickBackButton: () => {
          router.back();
        },
        onSearchValueChange: setSearchValue,
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
