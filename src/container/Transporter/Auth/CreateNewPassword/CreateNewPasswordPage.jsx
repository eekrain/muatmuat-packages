"use client";

import Image from "next/image";
import React, { useState } from "react";

// HAPUS import valibot
// import { valibotResolver } from "@hookform/resolvers/valibot";
// import * as v from "valibot";
import { useForm } from "react-hook-form";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

const CreateNewPasswordPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const onSubmit = (data) => {
    console.log("Password berhasil diubah:", { password: data.password });
    alert("Password berhasil diubah!");
  };

  return (
    <div className="flex items-center justify-center pt-40">
      <Card className="w-full max-w-[814px] rounded-lg border-none bg-white p-10">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/muattrans.svg"
            alt="Muatrans Logo"
            width={136}
            height={27.30501937866211}
            className="mb-3"
          />

          <h1 className="mb-6 font-semibold text-neutral-900">
            Buat Password Baru
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col gap-4">
              <Input
                {...register("password", {
                  required: "Password wajib diisi.",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 karakter.",
                  },
                })}
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
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
                      aria-label="Toggle password visibility"
                      className="focus:outline-none"
                    >
                      <IconComponent
                        src={
                          isPasswordVisible
                            ? "/icons/eye.svg"
                            : "/icons/eye-off.svg"
                        }
                        alt="Toggle visibility"
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
                  required: "Konfirmasi Password wajib diisi.",
                  validate: (value) =>
                    value === passwordValue || "Password tidak sama.",
                })}
                type={isConfirmPasswordVisible ? "text" : "password"}
                placeholder="Konfirmasi Password"
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
                      aria-label="Toggle confirm password visibility"
                      className="focus:outline-none"
                    >
                      <IconComponent
                        src={
                          isConfirmPasswordVisible
                            ? "/icons/eye.svg"
                            : "/icons/eye-off.svg"
                        }
                        alt="Toggle visibility"
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
              disabled={!isValid}
              className="mt-6 w-full py-5 text-muat-trans-secondary-900 disabled:border-none disabled:bg-neutral-200 disabled:text-neutral-500"
              variant={
                isValid ? "muattrans-primary" : "muattrans-primary-secondary"
              }
            >
              Ubah Password
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CreateNewPasswordPage;
