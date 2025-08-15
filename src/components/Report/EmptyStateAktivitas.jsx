import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import Button from "@/components/Button/Button";

import DataEmpty from "../DataEmpty/DataEmpty";

export default function EmptyStateAktivitas({ type = "armada" }) {
  const router = useRouter();

  const config = {
    armada: {
      title: "Belum ada Armada",
      subtitle: "Tambahkan armada pertamamu sekarang!",
      addMassButton: "+ Tambah Armada Massal",
      addSingleButton: "+ Tambah Armada",
      icon: "/icons/armada-truck/truck-grey.png",
    },
    driver: {
      title: "Belum ada Driver",
      subtitle: "Tambahkan driver pertamamu sekarang!",
      addMassButton: "+ Tambah Driver Massal",
      addSingleButton: "+ Tambah Driver",
      icon: "/icons/dashboard/driver.svg",
    },
  };

  const currentConfig = config[type];

  const handleAddMass = () => {
    if (type === "armada") {
      router.push("/manajemen-armada/tambah-massal");
    } else {
      router.push("/manajemen-driver/tambah-massal");
    }
  };

  const handleAddSingle = () => {
    if (type === "armada") {
      router.push("/manajemen-armada/tambah");
    } else {
      router.push("/manajemen-driver/tambah");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <DataEmpty
        title={currentConfig.title}
        subtitle={currentConfig.subtitle}
        buttonText="Search Again"
        iconPlus={false}
        onButtonClick={() => {}}
      >
        <Button
          variant="muattrans-primary-secondary"
          iconLeft={<Plus size={16} />}
          onClick={handleAddMass}
        >
          <span className="pt-0.5">{currentConfig.addMassButton}</span>
        </Button>
        <Button iconLeft={<Plus size={16} />} onClick={handleAddSingle}>
          <span className="pt-0.5">{currentConfig.addSingleButton}</span>
        </Button>
      </DataEmpty>
    </div>
  );
}
