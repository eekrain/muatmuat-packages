import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import ToogleButton from "@/components/ToogleButton/ToogleButton";
import Link from "next/link";
import { useState } from "react";

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
        wahana: false
    });
    const [openControlled, setOpenControlled] = useState(false);
    const toggleCourier = (courierName) => {
        setCourierStatus(prev => ({
            ...prev,
            [courierName]: !prev[courierName]
        }));
    };
    return (
        <div className="p-4 flex flex-col gap-y-3">
            <div className="flex itmes-center gap-x-2">
                <Button
                    color="primary"
                    type="muattrans"
                    onClick={() => setOpenControlled(true)}
                >
                    Primary
                </Button>
                <Button
                    color="primary_secondary"
                    type="muattrans"
                >
                    Primary Secondary
                </Button>
                <Button
                    color="error"
                    type="muattrans"
                >
                    Error
                </Button>
                <Button
                    color="error_secondary"
                    type="muattrans"
                >
                    Error Seconary
                </Button>
                <Button
                    color="warning"
                    type="muattrans"
                >
                    Warning
                </Button>
            </div>
            <div>
                <ToogleButton 
                    onClick={() => toggleCourier('ambilLangsung')} 
                    value={courierStatus.ambilLangsung} 
                />
            </div>
            <Modal open={openControlled} onOpenChange={setOpenControlled} closeOnOutsideClick={false}>
                <ModalContent>
                    <ModalHeader size="big" />
                    <div className="py-9 px-6">
                        <div className="flex flex-col items-center justify-center gap-6 w-[406px] max-w-[510px]">
                            {/* Judul Modal */}
                            <h2 className="font-bold text-[16px] leading-[19.2px] text-neutral-900 text-center w-full">
                                Informasi
                            </h2>

                            {/* Box Peringatan */}
                            <div className="flex flex-row items-center p-6 gap-2.5 w-full bg-warning-100 rounded-md">
                                <div className="flex items-center">
                                <IconComponent src="/icons/warning24.svg" height={24} width={24} />
                                </div>
                                <p className="font-medium text-[12px] leading-[14.4px] text-neutral-900">
                                    Jika ada kendala pada persiapan atau perjalanan ke lokasi muat, 
                                    pengiriman mungkin tidak bisa dilanjutkan. Kami akan tetap berusaha 
                                    memberikan solusi terbaik.
                                </p>
                            </div>

                            {/* Text Konfirmasi */}
                            <p className="font-medium text-[14px] leading-[16.8px] text-neutral-900 text-center w-full">
                                Apakah kamu yakin data yang kamu isi sudah benar? <br />Pastikan semua 
                                informasi telah diperiksa sebelum melanjutkan.
                            </p>

                            {/* Text Syarat dan Ketentuan */}
                            <p className="font-medium text-[12px] leading-[14.4px] text-neutral-900 text-center w-[320px]">
                                *Dengan memesan jasa angkut ini, kamu telah menyetujui{" "}
                                <Link href="/syarat-ketentuan">
                                    <span className="text-primary-700 underline">
                                        Syarat dan Ketentuan Muatrans
                                    </span>
                                </Link>
                            </p>

                            {/* Container Tombol */}
                            <div className="flex flex-row gap-2 justify-center">
                                <Button
                                    color="primary_secondary"
                                    onClick={() => setOpenControlled(false)}
                                    Class="min-w-[132px] h-8"
                                    type="muatparts"
                                >
                                    Kembali
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={() => setOpenControlled(false)}
                                    Class="min-w-[151px] h-8"
                                    type="muatparts"
                                >
                                    Pesan Sekarang
                                </Button>
                            </div>
                        </div>
                    </div>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ExampleWeb