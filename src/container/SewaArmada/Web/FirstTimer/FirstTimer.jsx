import { useState } from "react";

import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuthStore } from "@/store/auth/authStore";
import { useSewaArmadaActions } from "@/store/forms/sewaArmadaStore";

import { ArmadaOption } from "./ArmadaOption";
import { ModalLogin } from "./ModalLogin";

export const FirstTimer = () => {
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const { setOrderType } = useSewaArmadaActions();

  const handleClickArmadaOption = (type) => {
    if (!accessToken) {
      setOpenModalLogin(true);
    } else {
      setOrderType(type);
    }
  };

  return (
    <div className="">
      <div className="flex w-[814px] flex-col items-center rounded-xl bg-white p-8 shadow-md">
        <div className="mb-4">
          <ImageComponent
            src="/img/welcome-illustration.png"
            width={100}
            height={76}
          />
        </div>
        <div className="mb-6 flex flex-col items-center gap-6">
          <h1 className="text-center text-[16px] font-semibold leading-[19px] text-neutral-900">
            Ayo kirim muatan Anda dengan muatrans!
          </h1>

          <p className="w-[313px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
            Pesan truk kapan saja dan di mana saja dengan mudah. Serta lacak
            kiriman secara real-time untuk memastikan keamanan pengiriman dan
            dapatkan rekomendasi truk sesuai muatan agar lebih efisien!
          </p>
        </div>

        <div className="flex w-full justify-center gap-3">
          <ArmadaOption
            title="Instan"
            description="Pesan jasa angkut untuk penjemputan dan pengiriman segera atau di Hari+1."
            iconType="instant"
            onClick={() => handleClickArmadaOption("INSTANT")}
          />

          <ArmadaOption
            title="Terjadwal"
            description="Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai dengan Hari+30."
            iconType="scheduled"
            onClick={() => handleClickArmadaOption("SCHEDULED")}
          />
        </div>
      </div>
      <ModalLogin open={openModalLogin} setOpen={setOpenModalLogin} />
    </div>
  );
};
