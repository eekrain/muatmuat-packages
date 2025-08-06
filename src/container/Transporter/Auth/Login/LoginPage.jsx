"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
// Import Controller
import { Controller, useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const LoginPage = () => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const LoginSchema = v.object({
    emailOrPhone: v.pipe(
      v.string(),
      v.minLength(
        1,
        t(
          "LoginPage.errorEmailRequired",
          {},
          "No. Whatsapp / Email wajib diisi."
        )
      ),
      v.email(t("LoginPage.errorEmailInvalid", {}, "Format email tidak valid."))
    ),
    password: v.pipe(
      v.string(),
      v.minLength(
        1,
        t("LoginPage.errorPasswordRequired", {}, "Password wajib diisi.")
      )
    ),
    keepLoggedIn: v.optional(v.boolean()),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
      keepLoggedIn: false,
    },
  });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const router = useRouter();
  const [formErrors, setFormErrors] = useState({
    emailOrPhone: "",
    password: "",
  });

  const onSubmit = (data) => {
    // Reset previous errors
    setFormErrors({
      emailOrPhone: "",
      password: "",
    });

    // Mock authentication logic
    // In a real application, this would be replaced with an API call
    const mockCredentials = {
      email: "user@example.com",
      phone: "08123456789",
      password: "password123",
    };

    // Check if email/phone exists
    const isEmailOrPhoneValid =
      data.emailOrPhone === mockCredentials.email ||
      data.emailOrPhone === mockCredentials.phone;

    if (!isEmailOrPhoneValid) {
      setFormErrors((prev) => ({
        ...prev,
        emailOrPhone: t(
          "LoginPage.errorEmailIncorrect",
          {},
          "No. Whatsapp / Email yang kamu masukkan salah"
        ),
      }));
      return;
    }

    // Check if password is correct
    if (data.password !== mockCredentials.password) {
      setFormErrors((prev) => ({
        ...prev,
        password: t(
          "LoginPage.errorPasswordIncorrect",
          {},
          "Password yang kamu masukkan salah"
        ),
      }));
      return;
    }

    // If we get here, authentication was successful
    router.push("/dashboard");
    alert(t("LoginPage.alertLoginSuccess", {}, "Login Berhasil!"));
  };

  return (
    <div className="flex items-center justify-center pt-32">
      <Card className="w-full max-w-[814px] rounded-lg border-none bg-white p-10">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/muattrans.svg"
            alt={t("LoginPage.altMuatransLogo", {}, "Muatrans Logo")}
            width={136}
            height={27.30501937866211}
            className="mb-5"
          />

          <h1 className="mb-3 font-semibold text-neutral-900">
            {t("LoginPage.titleWelcome", {}, "Selamat Datang di muatrans")}
          </h1>

          <p className="mb-8 max-w-xl text-center text-xs font-normal text-neutral-700">
            {t(
              "LoginPage.descriptionIntro",
              {},
              "Dapatkan muatan kapan saja, di mana saja. Temukan pengiriman muatan yang sesuai dengan armada kamu secara instan di muatrans. Kelola perjalanan lebih efisien dan maksimalkan pendapatan"
            )}
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col gap-4">
              <Input
                {...register("emailOrPhone")}
                placeholder={t(
                  "LoginPage.placeholderEmailOrPhone",
                  {},
                  "No. Whatsapp / Email"
                )}
                icon={{
                  left: "/icons/user-login.svg",
                }}
                status={
                  errors.emailOrPhone || formErrors.emailOrPhone
                    ? "error"
                    : "default"
                }
                errorMessage={
                  formErrors.emailOrPhone || errors.emailOrPhone?.message
                }
                appearance={{
                  containerClassName: "!h-[40px]",
                  iconClassName: "size-5",
                }}
              />

              <Input
                {...register("password")}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={t("LoginPage.placeholderPassword", {}, "Password")}
                appearance={{
                  containerClassName: "!h-[40px]",
                  iconClassName: "size-5",
                }}
                icon={{
                  left: "/icons/password-login.svg",
                  right: (
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={t(
                        "LoginPage.ariaLabelTogglePassword",
                        {},
                        "Toggle password visibility"
                      )}
                      className="focus:outline-none"
                    >
                      <IconComponent
                        src={
                          isPasswordVisible
                            ? "/icons/eye.svg"
                            : "/icons/eye-off.svg"
                        }
                        height={20}
                        width={20}
                        alt={t(
                          "LoginPage.altToggleVisibility",
                          {},
                          "Toggle visibility"
                        )}
                        className="text-neutral-500"
                      />
                    </button>
                  ),
                }}
                status={
                  errors.password || formErrors.password ? "error" : "default"
                }
                errorMessage={formErrors.password || errors.password?.message}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Controller
                name="keepLoggedIn"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={t("LoginPage.labelStayLoggedIn", {}, "Tetap Masuk")}
                    checked={field.value}
                    onChange={(event) => field.onChange(event.checked)}
                  />
                )}
              />
              <Link
                href="/lupa-password"
                className="text-xs font-medium text-primary-700 hover:text-primary-800"
              >
                {t("LoginPage.linkForgotPassword", {}, "Lupa Password?")}
              </Link>
            </div>

            <Button
              type="submit"
              variant="muattrans-primary"
              className="mt-6 w-full py-5 text-muat-trans-secondary-900"
            >
              {t("LoginPage.buttonLogin", {}, "Masuk")}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
