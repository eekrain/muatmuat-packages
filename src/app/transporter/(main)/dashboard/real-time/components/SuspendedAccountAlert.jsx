import Link from "next/link";
import React from "react";

import { Alert } from "@/components/Alert/Alert";

import { useTranslation } from "@/hooks/use-translation";

const SuspendedAccountAlert = ({ status }) => {
  const { t } = useTranslation();

  if (!status?.isSuspended) {
    return null;
  }

  return (
    <Alert variant="error" className="mb-6 px-6 py-4">
      <p>
        {t(
          "SuspendedAccountAlert.messageSuspended",
          {},
          "Akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivasi kembali"
        )}{" "}
        <Link
          href="/support"
          className="font-medium text-[#176CF7] hover:text-[#1257C6]"
        >
          {t("SuspendedAccountAlert.linkHere", {}, "disini")}
        </Link>
      </p>
    </Alert>
  );
};

export default SuspendedAccountAlert;
