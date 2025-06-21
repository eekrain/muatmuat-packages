"use client";

import { useEffect } from "react";

import DriverQRCodeWebview from "@/container/DriverQRCodeWebview/DriverQRCodeWebview";
import { useLoadingAction } from "@/store/loadingStore";

export default function QRCodePage() {
  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DriverQRCodeWebview />;
}
