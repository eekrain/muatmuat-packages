"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import Button from "@/components/Button/Button";

import { cn } from "@/lib/utils";

/**
 * Komponen halaman status untuk menampilkan pesan berhasil atau gagal.
 *
 * @param {object} props - Properti untuk komponen.
 * @param {'success' | 'failed'} props.type - Jenis status yang akan ditampilkan.
 * @param {string} props.title - Judul utama yang akan ditampilkan.
 * @param {string} props.description - Deskripsi atau pesan di bawah judul.
 * @param {string} props.buttonLabel - Teks untuk tombol aksi.
 * @param {string} props.buttonHref - URL tujuan saat tombol diklik.
 * @param {object} props.appearence - Konfigurasi appearance untuk komponen.
 * @returns {JSX.Element}
 */
const StatusPage = ({
  type,
  title,
  description,
  buttonLabel,
  buttonHref,
  appearence = {},
}) => {
  const {
    titleClassName = "",
    descriptionClassName = "",
    containerClassName = "",
  } = appearence;
  const imageConfig = {
    success: {
      src: "/img/otp-transporter/success.svg",
      alt: "Ilustrasi Berhasil",
    },
    failed: {
      src: "/img/otp-transporter/failed.svg",
      alt: "Ilustrasi Gagal",
    },
  };

  const selectedImage = imageConfig[type] || imageConfig.failed;

  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-hidden bg-primary-700 p-4">
      <div className="absolute left-0 top-0 hidden md:block">
        <Image
          src="/img/meteor1.png"
          alt="Dekorasi Kiri Atas"
          width={160}
          height={160}
        />
      </div>
      <div className="absolute bottom-0 right-0 hidden md:block">
        <Image
          src="/img/meteor2.png"
          alt="Dekorasi Kanan Bawah"
          width={160}
          height={160}
        />
      </div>

      <div className="absolute top-12 mb-10 flex flex-col items-center">
        <Image
          src="/img/otp-transporter/muatmuat.svg"
          alt="Logo MuatMuat"
          width={200}
          height={56}
        />
        <p className="mt-2 text-xs font-bold text-white">Jalan Mudah Bersama</p>
      </div>

      <div
        className={cn(
          "z-10 flex w-full max-w-lg flex-col items-center pt-48 text-center",
          containerClassName
        )}
      >
        <div className="mb-8">
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={120}
            height={120}
            className="h-auto w-auto"
          />
        </div>
        <h1
          className={cn("mb-4 text-2xl font-bold text-white", titleClassName)}
        >
          {title}
        </h1>
        <p
          className={cn(
            "mb-[136px] max-w-[465px] font-medium text-white",
            descriptionClassName
          )}
        >
          {description}
        </p>
        {buttonHref && buttonLabel && (
          <Link href={buttonHref}>
            <Button
              className="!h-10 text-buyer-seller-900"
              variant="muattrans-primary"
            >
              {buttonLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
