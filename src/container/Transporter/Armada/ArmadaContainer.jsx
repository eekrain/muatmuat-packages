"use client";

import { Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";

const ArmadaContainer = () => {
  return (
    <div className="mx-auto max-w-[1232px] py-6">
      <h1 className="mb-4 text-xl font-bold">Manajemen Armada</h1>

      <DataEmpty
        title="Belum Ada Armada"
        subtitle="Tambahkan armada pertamamu sekarang!"
        buttonText="Search Again"
        iconPlus={false}
        onButtonClick={() => console.log("Search again clicked")}
      >
        <Button
          variant="muattrans-primary-secondary"
          iconLeft={<Plus size={16} />}
          onClick={() => {}}
        >
          <span className="pt-0.5">{"Tambah Armada Massal"}</span>
        </Button>
        <Button iconLeft={<Plus size={16} />} onClick={() => {}}>
          <span className="pt-0.5">{"Tambah Armada"}</span>
        </Button>
      </DataEmpty>
    </div>
  );
};
export default ArmadaContainer;
