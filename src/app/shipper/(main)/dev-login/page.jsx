"use client";

import { useEffect } from "react";

import DevLoginContainer from "@/container/Shared/DevLoginContainer";
import { useAuth } from "@/hooks/use-auth";

const Page = () => {
  const { dataUser } = useAuth();

  useEffect(() => {
    if (dataUser?.ID) {
      window.location.replace("/");
    }
  }, [dataUser]);

  return <DevLoginContainer onSuccessRedirect="/sewaarmada" />;
};
export default Page;
