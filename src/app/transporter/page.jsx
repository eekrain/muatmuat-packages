"use client";

import { useEffect } from "react";

import { useLoadingAction } from "@/store/loadingStore";

const Page = () => {
  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Haloooo</div>;
};
export default Page;
