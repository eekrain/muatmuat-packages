"use client";

import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";
import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();

  return (
    <StatusPage
      type="failed"
      title={t(
        "ExpiredPage.titleVerificationExpired",
        {},
        "Proses Verifikasi Tidak Dapat Dilakukan Karena Link Expired"
      )}
      description={
        <span>
          {t(
            "ExpiredPage.descriptionContactAdmin",
            {},
            "Silahkan hubungi Admin"
          )}{" "}
          <strong>Muatrans</strong>{" "}
          {t(
            "ExpiredPage.descriptionGetNewLink",
            {},
            "untuk mendapatkan link verifikasi baru"
          )}
        </span>
      }
      appearence={{
        containerClassName: "!max-w-4xl",
        descriptionClassName: "!max-w-4xl",
      }}
    />
  );
};

export default Page;
