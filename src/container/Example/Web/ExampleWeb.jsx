import Link from "next/link";
import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import ToogleButton from "@/components/ToogleButton/ToogleButton";
import { toast } from "@/lib/toast";

import ExampleSwr from "./ExampleSwr";
import ExampleTimeline from "./ExampleTimeline";

const ExampleWeb = () => {
  const [courierStatus, setCourierStatus] = useState({
    ambilLangsung: false,
    kurirToko: false,
    gojekInstant: true,
    grabInstant: true,
    jtRegular: false,
    jneRegular: false,
    sicepat: false,
    anteraja: false,
    posIndonesia: false,
    jtCargo: false,
    jneTrucking: false,
    wahana: false,
  });
  const [openControlled, setOpenControlled] = useState(false);
  const toggleCourier = (courierName) => {
    setCourierStatus((prev) => ({
      ...prev,
      [courierName]: !prev[courierName],
    }));
  };

  return (
    <div className="flex flex-col gap-y-3 p-4">
      <div className="itmes-center flex gap-x-2">
        <Button
          color="primary"
          type="muattrans"
          onClick={() => setOpenControlled(true)}
        >
          Primary
        </Button>
        <Button color="primary_secondary" type="muattrans">
          Primary Secondary
        </Button>
        <Button color="error" type="muattrans">
          Error
        </Button>
        <Button color="error_secondary" type="muattrans">
          Error Seconary
        </Button>
        <Button color="warning" type="muattrans">
          Warning
        </Button>

        <Button
          color="primary"
          type="muattrans"
          onClick={() => toast.success("Toast Success")}
        >
          Toast Success
        </Button>
        <Button
          color="error"
          type="muattrans"
          onClick={() => toast.error("Toast Error")}
        >
          Toast Error
        </Button>
      </div>
      <div>
        <ToogleButton
          onClick={() => toggleCourier("ambilLangsung")}
          value={courierStatus.ambilLangsung}
        />
      </div>
      <Modal
        open={openControlled}
        onOpenChange={setOpenControlled}
        closeOnOutsideClick
      >
        <ModalContent>
          <ModalHeader size="big" />
          <div className="px-6 py-9">
            <div className="flex w-[406px] max-w-[510px] flex-col items-center justify-center gap-6">
              {/* Judul Modal */}
              <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Informasi
              </h2>

              {/* Box Peringatan */}
              <div className="flex w-full flex-row items-center gap-2.5 rounded-md bg-warning-100 p-6">
                <div className="flex items-center">
                  <IconComponent
                    src="/icons/warning24.svg"
                    height={24}
                    width={24}
                  />
                </div>
                <p className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                  Jika ada kendala pada persiapan atau perjalanan ke lokasi
                  muat, pengiriman mungkin tidak bisa dilanjutkan. Kami akan
                  tetap berusaha memberikan solusi terbaik.
                </p>
              </div>

              {/* Text Konfirmasi */}
              <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
                Apakah kamu yakin data yang kamu isi sudah benar? <br />
                Pastikan semua informasi telah diperiksa sebelum melanjutkan.
              </p>

              {/* Text Syarat dan Ketentuan */}
              <p className="w-[320px] text-center text-[12px] font-medium leading-[14.4px] text-neutral-900">
                *Dengan memesan jasa angkut ini, kamu telah menyetujui{" "}
                <Link href="/syarat-ketentuan">
                  <span className="text-primary-700 underline">
                    Syarat dan Ketentuan Muatrans
                  </span>
                </Link>
              </p>

              {/* Container Tombol */}
              <div className="flex flex-row justify-center gap-2">
                <Button
                  color="primary_secondary"
                  onClick={() => setOpenControlled(false)}
                  className="h-8 min-w-[132px]"
                  type="muatparts"
                >
                  Kembali
                </Button>
                <Button
                  color="primary"
                  onClick={() => setOpenControlled(false)}
                  className="h-8 min-w-[151px]"
                  type="muatparts"
                >
                  Pesan Sekarang
                </Button>
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <div className="mt-4">
        <ExampleTimeline />
      </div>

      <div className="mt-4">
        <ExampleSwr />
      </div>
    </div>
  );
};

export default ExampleWeb;
