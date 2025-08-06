"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// HAPUS import valibot
// import { valibotResolver } from "@hookform/resolvers/valibot";
// import * as v from "valibot";
import { useForm } from "react-hook-form";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

const CreateNewPasswordPage = () => {
  const { t } = useTranslation();
  const route = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    // HAPUS resolver dari sini
    // resolver: valibotResolver(CreateNewPasswordSchema),
    mode: "onChange", // Mode 'onChange' SANGAT PENTING untuk validasi instan
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // 'watch' tetap digunakan untuk mendapatkan nilai password secara real-time
  const passwordValue = watch("password");

  // Only clear manual error when password changes, don't set it during typing
  useEffect(() => {
    // Only clear errors when the user changes the password after a manual error was set
    if (errors.password?.type === "manual" && passwordValue !== "Password123") {
      clearErrors("password");
    }
  }, [passwordValue, clearErrors, errors.password?.type]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);

    // Simulate checking if password is the same as previous one
    // This check is ONLY performed when the form is submitted
    if (data.password === "Password123") {
      setError("password", {
        type: "manual",
        message: t(
          "CreateNewPasswordPage.messageErrorPasswordSameAsBefore",
          {},
          "Password tidak boleh sama dengan sebelumnya"
        ),
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with delay
    setTimeout(() => {
      setIsSubmitting(false);
      //   alert("Password berhasil diubah!");
      console.log("halo");

      route.push("/password-success");
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center pt-40">
      <Card className="w-full max-w-[814px] rounded-lg border-none bg-white p-10">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/muattrans.svg"
            alt={t(
              "CreateNewPasswordPage.altMuatransLogo",
              {},
              "Muatrans Logo"
            )}
            width={136}
            height={27.30501937866211}
            className="mb-3"
          />

          <h1 className="mb-6 font-semibold text-neutral-900">
            {t(
              "CreateNewPasswordPage.titleCreateNewPassword",
              {},
              "Buat Password Baru"
            )}
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col gap-4">
              <Input
                {...register("password", {
                  required: t(
                    "CreateNewPasswordPage.messageErrorPasswordRequired",
                    {},
                    "Password wajib diisi."
                  ),
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: t(
                      "CreateNewPasswordPage.messageErrorPasswordFormat",
                      {},
                      "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 karakter."
                    ),
                  },
                  // No real-time validation for password reuse
                })}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={t(
                  "CreateNewPasswordPage.placeholderPassword",
                  {},
                  "Password"
                )}
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
                        "CreateNewPasswordPage.ariaLabelTogglePasswordVisibility",
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
                        alt={t(
                          "CreateNewPasswordPage.altToggleVisibility",
                          {},
                          "Toggle visibility"
                        )}
                        width={20}
                        height={20}
                        className="text-neutral-500"
                      />
                    </button>
                  ),
                }}
                status={errors.password ? "error" : "default"}
                errorMessage={errors.password?.message}
              />

              <Input
                {...register("confirmPassword", {
                  required: t(
                    "CreateNewPasswordPage.messageErrorConfirmPasswordRequired",
                    {},
                    "Konfirmasi Password wajib diisi."
                  ),
                  validate: (value) =>
                    value === passwordValue ||
                    t(
                      "CreateNewPasswordPage.messageErrorPasswordNotMatch",
                      {},
                      "Password tidak sama."
                    ),
                })}
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder={t(
                  "CreateNewPasswordPage.placeholderConfirmPassword",
                  {},
                  "Konfirmasi Password"
                )}
                appearance={{
                  containerClassName: "!h-[40px]",
                  iconClassName: "size-5",
                }}
                icon={{
                  left: "/icons/password-login.svg",
                  right: (
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={t(
                        "CreateNewPasswordPage.ariaLabelToggleConfirmPasswordVisibility",
                        {},
                        "Toggle confirm password visibility"
                      )}
                      className="focus:outline-none"
                    >
                      <IconComponent
                        src={
                          isConfirmPasswordVisible
                            ? "/icons/eye.svg"
                            : "/icons/eye-off.svg"
                        }
                        alt={t(
                          "CreateNewPasswordPage.altToggleVisibility",
                          {},
                          "Toggle visibility"
                        )}
                        className="text-neutral-500"
                        width={20}
                        height={20}
                      />
                    </button>
                  ),
                }}
                status={errors.confirmPassword ? "error" : "default"}
                errorMessage={errors.confirmPassword?.message}
              />
            </div>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-6 w-full py-5 text-muat-trans-secondary-900 disabled:border-none disabled:bg-neutral-200 disabled:text-neutral-500"
              variant={
                isValid ? "muattrans-primary" : "muattrans-primary-secondary"
              }
            >
              {t(
                "CreateNewPasswordPage.buttonChangePassword",
                {},
                "Ubah Password"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CreateNewPasswordPage;
