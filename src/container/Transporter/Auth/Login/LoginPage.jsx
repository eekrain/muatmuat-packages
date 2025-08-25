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
import { fetcherMuatrans } from "@/lib/axios";
// Import fetcherMuatrans
import { useTokenStore } from "@/store/AuthStore/tokenStore";
import { useUserStore } from "@/store/AuthStore/userStore";

const LoginPage = () => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  const LoginSchema = v.object({
    emailOrPhone: v.pipe(
      v.string(),
      v.minLength(
        1,
        t(
          "LoginPage.errorEmailRequired",
          {},
          "No. Whatsapp / Email wajib diisi"
        )
      ),
      v.custom(
        (input) => {
          const isEmail = v.is(v.email(), input);
          const isPhone = /^(08|\+62)/.test(input);
          return isEmail || isPhone;
        },
        t(
          "LoginPage.errorEmailOrPhoneInvalid",
          {},
          "Format No. Whatsapp / Email tidak valid."
        )
      )
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

  const onSubmit = async (data) => {
    setFormErrors({
      emailOrPhone: "",
      password: "",
    });
    setIsSubmitting(true); // Start loading

    try {
      const response = await fetcherMuatrans.post("/v1/auth/login", {
        identifier: data.emailOrPhone,
        password: data.password,
        rememberMe: data.keepLoggedIn,
      });

      if (response.data.Message.Code === 200) {
        // Handle successful login
        const {
          token,
          refreshToken,
          expiryTime,
          user,
          transporter,
          redirectUrl,
        } = response.data.Data;

        // Store tokens and user data
        useTokenStore.getState().actions.setToken({
          accessToken: token,
          refreshToken: refreshToken,
          expiryTime: expiryTime,
        });
        useUserStore.getState().actions.setUser({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage,
          role: user.role,
          transporterId: transporter.id,
          companyName: transporter.companyName,
          verificationStatus: transporter.verificationStatus,
          isActive: transporter.isActive,
        });

        alert(t("LoginPage.alertLoginSuccess", {}, "Login Berhasil!"));
        router.push(redirectUrl || "/dashboard");
      } else {
        // This part might not be reached if fetcherMuatrans throws on non-2xx codes
        setFormErrors((prev) => ({
          ...prev,
          emailOrPhone:
            response.data.Message.Text || "Terjadi kesalahan saat login.",
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle API errors
      const errorData = error.response?.data?.Data;
      if (errorData?.errors) {
        errorData.errors.forEach((err) => {
          if (err.field === "identifier") {
            setFormErrors((prev) => ({
              ...prev,
              emailOrPhone: err.message,
            }));
          } else if (err.field === "password") {
            setFormErrors((prev) => ({
              ...prev,
              password: err.message,
            }));
          }
        });
      } else if (error.response?.data?.Message?.Text) {
        // Generic error message from API
        setFormErrors((prev) => ({
          ...prev,
          emailOrPhone: error.response.data.Message.Text,
        }));
      } else {
        // Fallback for unexpected errors
        alert(
          t("LoginPage.alertLoginFailed", {}, "Terjadi kesalahan saat login.")
        );
      }
    } finally {
      setIsSubmitting(false); // End loading
    }
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
                    appearance={{
                      labelClassName: "text-neutral-700",
                    }}
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
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("LoginPage.buttonLoginLoading", {}, "Masuk...")
                : t("LoginPage.buttonLogin", {}, "Masuk")}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
