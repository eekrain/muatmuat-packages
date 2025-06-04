import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useAuthStore } from "@/store/auth/authStore";
import { useSewaArmadaStore } from "@/store/forms/sewaArmadaStore";

const FirstTimer = () => {
  const { setOrderType } = useSewaArmadaStore();
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

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
            onClick={() => handleClickArmadaOption("instan")}
          />

          <ArmadaOption
            title="Terjadwal"
            description="Pesan jasa angkut untuk penjemputan dan pengiriman di Hari+2 sampai dengan Hari+30."
            iconType="scheduled"
            onClick={() => handleClickArmadaOption("terjadwal")}
          />
        </div>
      </div>
      <ModalLogin open={openModalLogin} setOpen={setOpenModalLogin} />
    </div>
  );
};
export default FirstTimer;

const ArmadaOption = ({ title, description, iconType, onClick }) => {
  // Icon path based on type
  const iconPath =
    iconType === "instant"
      ? "/icons/muattrans-instan.svg"
      : "/icons/muattrans-terjadwal32.svg";

  return (
    <div
      className="flex h-[136px] w-[369px] cursor-pointer flex-col items-center justify-center rounded-xl border border-neutral-400 bg-white p-6 transition-colors duration-500 hover:border-[#FFC217]"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-3">
        <IconComponent src={iconPath} width={32} height={32} />

        <div className="flex flex-col items-center gap-3">
          <h3 className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
            {title}
          </h3>

          <p className="w-[294px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const ModalLogin = ({ open, setOpen }) => {
  return (
    <Modal open={open} onOpenChange={setOpen} closeOnOutsideClick>
      <ModalContent>
        <ModalHeader size="small" />
        <div className="w-modal-small px-6 py-9">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Judul Modal */}
            <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Informasi
            </h2>

            <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
              Untuk melanjutkan pemesanan jasa angkut, kamu perlu login terlebih
              dahulu. Silakan login untuk melanjutkan.
            </p>

            <a
              href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=muattrans`}
            >
              <Button className="bg-buyer-seller-900">
                <span className="text-[14px] font-semibold leading-[1] text-neutral-50">
                  Masuk
                </span>
              </Button>
            </a>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
