"use client";

import Image from "next/image";
import React from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import Input from "@/components/Form/Input";

// Regex untuk validasi dasar nomor HP Indonesia
const phoneRegex = /^08[0-9]{8,12}$/;

// Skema validasi menggunakan Valibot
const ForgotPasswordSchema = v.object({
  whatsapp: v.pipe(
    v.string(),
    v.minLength(1, "No. Whatsapp wajib diisi."),
    v.regex(phoneRegex, "Format No. Whatsapp tidak valid. Contoh: 081234567890")
  ),
});

const ForgotPasswordPage = () => {
  // Integrasi react-hook-form dengan valibotResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: valibotResolver(ForgotPasswordSchema),
    defaultValues: {
      whatsapp: "",
    },
  });

  // Fungsi ini hanya akan dipanggil jika validasi berhasil
  const onSubmit = (data) => {
    console.log("Mencari akun dengan No. Whatsapp:", data.whatsapp);
    alert(`Mencari akun untuk nomor ${data.whatsapp}...`);
    // TODO: Implementasi logika API untuk mencari akun
  };

  return (
    <div className="flex items-center justify-center pt-48">
      <Card className="w-full max-w-[814px] rounded-lg border-none bg-white p-10">
        <div className="flex flex-col items-center">
          <Image
            src="/icons/muattrans.svg"
            alt="Muatrans Logo"
            width={136}
            height={27.30501937866211}
            className="mb-5"
          />

          <h1 className="mb-3 font-semibold text-neutral-900">
            Temukan Akun muatrans Kamu
          </h1>

          <p className="mb-8 max-w-xl text-center text-xs font-normal text-neutral-700">
            Masukkan No. Whatsapp yang telah terhubung dengan akun muatrans
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-[440px]"
          >
            <div className="flex flex-col">
              <Input
                {...register("whatsapp")}
                placeholder="No. Whatsapp"
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
              />
            </div>

            <Button
              type="submit"
              variant="muattrans-primary"
              className="mt-6 w-full py-5 text-muat-trans-secondary-900"
            >
              Cari Akun
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
