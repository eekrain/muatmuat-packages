"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Input from "@/components/Form/Input";
import { useTranslation } from "@/hooks/use-translation";

// Regex untuk validasi dasar nomor HP Indonesia
const phoneRegex = /^08[0-9]{8,12}$/;

const ForgotPasswordPage = () => {
  const { t } = useTranslation();

  // Skema validasi menggunakan Valibot
  const ForgotPasswordSchema = v.object({
    whatsapp: v.pipe(
      v.string(),
      v.minLength(
        1,
        t(
          "ForgotPasswordPage.errorWhatsappRequired",
          {},
          "No. Whatsapp wajib diisi."
        )
      ),
      v.regex(
        phoneRegex,
        t(
          "ForgotPasswordPage.errorWhatsappInvalid",
          {},
          "Format No. Whatsapp tidak valid. Contoh: 081234567890"
        )
      )
    ),
  });
  // State untuk menangani error akun tidak ditemukan
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Integrasi react-hook-form dengan valibotResolver
  const {
    register,
    handleSubmit,
    setError,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(ForgotPasswordSchema),
    defaultValues: {
      whatsapp: "",
    },
  });

  // Watch for changes in the whatsapp field
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "whatsapp" && accountNotFound) {
        setAccountNotFound(false);
        clearErrors("whatsapp");
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, accountNotFound, clearErrors]);
  const router = useRouter();

  const onSubmit = async (data) => {
    // Reset error status
    setAccountNotFound(false);
    setIsLoading(true);

    // Simulasi request API dengan delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulasi kondisi khusus untuk nomor 081234512345
    if (data.whatsapp === "081234512345") {
      setError("whatsapp", {
        type: "manual",
        message: t(
          "ForgotPasswordPage.errorAccountNotFound",
          {},
          "Akun tidak ditemukan. Coba lagi dengan No. Whatsapp lain"
        ),
      });
      setAccountNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    // Lanjutkan ke halaman OTP jika nomor valid
    router.push(`/otp?whatsapp=${data.whatsapp}&type=forgot-password`);
  };

  return (
    <div className="flex items-center justify-center pt-48">
      <Card className="w-full max-w-[814px] rounded-lg border-none bg-white p-10">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/muattrans.svg"
            alt={t("common.muatransLogo", {}, "Muatrans Logo")}
            width={136}
            height={27.30501937866211}
            className="mb-5"
          />

          <h1 className="mb-3 font-semibold text-neutral-900">
            {t(
              "ForgotPasswordPage.findYourAccount",
              {},
              "Temukan Akun muatrans Kamu"
            )}
          </h1>

          <p className="mb-8 max-w-xl text-center text-xs font-normal text-neutral-700">
            {t(
              "ForgotPasswordPage.enterWhatsappText",
              {},
              "Masukkan No. Whatsapp yang telah terhubung dengan akun muatrans"
            )}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col">
              <Input
                {...register("whatsapp", {
                  onChange: () => {
                    if (accountNotFound) {
                      setAccountNotFound(false);
                      clearErrors("whatsapp");
                    }
                  },
                })}
                placeholder={t("common.whatsappNumber", {}, "No. Whatsapp")}
                type="tel"
                icon={{
                  left: "/icons/whatsapp.svg",
                }}
                status={errors.whatsapp ? "error" : "default"}
                errorMessage={errors.whatsapp?.message}
                appearance={{
                  containerClassName: "!h-[40px]",
                  iconClassName: "size-5",
                }}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="muattrans-primary"
              className="mt-6 w-full py-5 text-muat-trans-secondary-900"
            >
              {t("ForgotPasswordPage.searchAccount", {}, "Cari Akun")}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
