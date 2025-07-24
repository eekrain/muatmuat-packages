"use client";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";

const EmptyDriver = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center">
      <PageTitle withBack={false} className="mb-8">
        Manajemen Driver
      </PageTitle>

      <div className="flex max-w-md flex-col items-center text-center">
        <img
          src="/img/empty-driver.svg"
          alt="Empty Driver"
          className="mb-6 h-48 w-48"
        />

        <h2 className="mb-2 text-lg font-semibold text-neutral-900">
          Belum Ada Driver
        </h2>

        <p className="mb-6 text-sm text-neutral-600">
          Anda belum memiliki driver yang terdaftar. Tambahkan driver baru untuk
          mulai mengelola driver Anda.
        </p>

        <div className="flex gap-3">
          <Button
            variant="muattrans-primary-secondary"
            iconLeft={<Plus size={16} />}
            onClick={() => {}}
          >
            <span className="pt-0.5">{"Tambah Driver Massal"}</span>
          </Button>
          <Button
            iconLeft={<Plus size={16} />}
            onClick={() => router.push("/manajemen-driver/tambah")}
          >
            <span className="pt-0.5">{"Tambah Driver"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyDriver;
