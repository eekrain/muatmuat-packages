"use client";

import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";
import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();

  return (
    <StatusPage
      type="failed"
      title={t(
        "VerifikasiDitolakPage.titleVerificationStopped",
        null,
        "Berhasil Menghentikan Proses Verifikasi Transporter"
      )}
      description={
        <span>
          {t(
            "VerifikasiDitolakPage.descriptionNoMoreEmails",
            null,
            "Kamu tidak akan menerima lagi Email verifikasi dari"
          )}{" "}
          <strong>Muatrans</strong>
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
