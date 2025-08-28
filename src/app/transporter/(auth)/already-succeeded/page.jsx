"use client";

import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();

  return (
    <StatusPage
      type="success"
      title={t(
        "AlreadySucceededPage.titleAlreadyVerified",
        {},
        "Sebelumnya Kamu Sudah Berhasil Verifikasi"
      )}
      description={t(
        "AlreadySucceededPage.descriptionAccountReady",
        {},
        "Akun Transporter Kamu sudah siap digunakan. Silahkan masuk ke akunmu atau hubungi CS Muatrans jika ada kendala"
      )}
      buttonLabel={t(
        "AlreadySucceededPage.buttonLoginToMuatrans",
        {},
        "Masuk ke Muatrans"
      )}
      buttonHref="/login"
    />
  );
};

export default Page;
