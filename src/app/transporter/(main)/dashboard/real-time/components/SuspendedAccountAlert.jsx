import Link from "next/link";

import { Alert } from "@/components/Alert/Alert";

import { useTranslation } from "@/hooks/use-translation";

const SuspendedAccountAlert = ({ accountStatusData }) => {
  const { t } = useTranslation();

  // Check if account is suspended
  if (!accountStatusData?.isSuspended) {
    return null;
  }

  return (
    <Alert variant="error" className="mb-6 px-6 py-4">
      <p>
        {accountStatusData.suspensionMessage ||
          t(
            "SuspendedAccountAlert.messageSuspended",
            {},
            "Akun kamu ditangguhkan, hubungi dukungan pelanggan untuk aktivasi kembali"
          )}{" "}
        <Link
          href="/support"
          className="font-medium text-[#176CF7] hover:text-[#1257C6]"
        >
          {accountStatusData.contactSupport?.linkText ||
            t("SuspendedAccountAlert.linkHere", {}, "disini")}
        </Link>
      </p>
    </Alert>
  );
};

export default SuspendedAccountAlert;
