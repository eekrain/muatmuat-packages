"use client";

import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();

  return (
    <StatusPage
      type="success"
      title={t(
        "SuccessPage.titleRegistrationSuccess",
        null,
        "Selamat Pendaftaran Kamu Berhasil"
      )}
      description={t(
        "SuccessPage.descriptionAccountVerified",
        null,
        "Akun Transporter Muatrans Kamu berhasil terdaftar dan terverifikasi"
      )}
      buttonLabel={t(
        "SuccessPage.buttonLoginToMuatrans",
        null,
        "Masuk ke Muatrans"
      )}
      appearence={{
        descriptionClassName: "!max-w-xs",
      }}
      buttonHref="/login"
    />
  );
};

export default Page;
