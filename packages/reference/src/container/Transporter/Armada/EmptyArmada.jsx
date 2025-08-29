import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import PageTitle from "@/components/PageTitle/PageTitle";

const EmptyArmada = () => {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1232px] py-6">
      <PageTitle withBack={false}>Manajemen Armada</PageTitle>
      <DataEmpty
        title="Belum Ada Armada"
        subtitle="Tambahkan armada pertamamu sekarang!"
        buttonText="Search Again"
        iconPlus={false}
        onButtonClick={() => {}}
      >
        <Button
          variant="muattrans-primary-secondary"
          iconLeft={<Plus size={16} />}
          onClick={() => {}}
        >
          <span className="pt-0.5">{"Tambah Armada Massal"}</span>
        </Button>
        <Button
          iconLeft={<Plus size={16} />}
          onClick={() => router.push("/manajemen-armada/tambah")}
        >
          <span className="pt-0.5">{"Tambah Armada"}</span>
        </Button>
      </DataEmpty>
    </div>
  );
};
export default EmptyArmada;
