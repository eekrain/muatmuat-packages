"use client";

import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";
import { useTranslation } from "@/hooks/use-translation";

const Page = () => {
  const { t } = useTranslation();

  return (
    <StatusPage
      type="success"
      title={t(
        "PasswordSuccessPage.titlePasswordChanged",
        {},
        "Password Berhasil Diubah"
      )}
      description={t(
        "PasswordSuccessPage.descriptionLoginWithNewPassword",
        {},
        "Silahkan masuk kedalam akun muatrans kamu dengan menggunakan Password baru"
      )}
      buttonLabel={t(
        "PasswordSuccessPage.buttonLoginToMuatrans",
        {},
        "Masuk ke Muatrans"
      )}
      buttonHref="/login"
    />
  );
};

export default Page;
