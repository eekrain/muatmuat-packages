"use client";

import { useRouter } from "next/navigation";

import { Home, Search } from "lucide-react";

import Button from "@/components/Button/Button";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex max-w-md flex-col items-center justify-center text-center">
        <ImageComponent
          src="/icons/search-not-found.svg"
          alt="404 Not Found"
          width={200}
          height={170}
          className="mb-6"
        />

        <h1 className="mb-3 text-6xl font-bold text-muat-trans-primary-400">
          404
        </h1>

        <h2 className="mb-2 text-2xl font-semibold text-neutral-800">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mb-8 text-base text-neutral-600">
          Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={<Search size={16} />}
            onClick={() => router.back()}
            className="min-w-[140px]"
          >
            <span className="pt-0.5">Kembali</span>
          </Button>

          <Button
            iconLeft={<Home size={16} />}
            onClick={() => router.push("/")}
            className="min-w-[140px]"
          >
            <span className="pt-0.5">Beranda</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
