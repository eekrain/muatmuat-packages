import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import PageTitle from "@/components/PageTitle/PageTitle";

const EmptyDriver = () => {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1232px] py-6">
      <PageTitle withBack={false}>Manajemen Driver</PageTitle>
      <DataEmpty
        title="Belum Ada Driver"
        subtitle="Tambahkan driver pertamamu sekarang!"
        buttonText="Search Again"
        iconPlus={false}
        onButtonClick={() => {}}
      >
        <Button
          variant="muattrans-primary-secondary"
          iconLeft={<Plus size={16} />}
          onClick={() => router.push("/manajemen-driver/tambah-massal")}
        >
          <span className="pt-0.5">{"Tambah Driver Massal"}</span>
        </Button>
        <Button
          iconLeft={<Plus size={16} />}
          onClick={() => router.push("/manajemen-driver/tambah")}
        >
          <span className="pt-0.5">{"Tambah Driver"}</span>
        </Button>
      </DataEmpty>
    </div>
  );
};

export default EmptyDriver;
