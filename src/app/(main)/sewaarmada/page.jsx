"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const Page = () => {
  const searchParams = useSearchParams();
  const urlFormId = searchParams.get("formid");
  const localFormId = useSewaArmadaStore((state) => state.formId);
  const { setFormId, reset } = useSewaArmadaActions();

  useEffect(() => {
    if (urlFormId !== localFormId) {
      reset();
      setFormId(urlFormId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFormId, localFormId]);

  const { isMobile, mounted } = useDevice();
  if (!mounted) return null;
  if (isMobile) return <SewaArmadaResponsive />;

  return <SewaArmadaWeb />;
};

export default Page;
