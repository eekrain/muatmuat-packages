import { BottomSheet, BottomSheetContent, BottomSheetHeader, BottomSheetTrigger } from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import ToogleButton from "@/components/ToogleButton/ToogleButton";
import { useState } from "react";

const ExampleResponsive = () => {
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
    const toggleCourier = (courierName) => {
        setCourierStatus(prev => ({
            ...prev,
            [courierName]: !prev[courierName]
        }));
    };
    return (
        <div className="p-4 flex flex-col gap-y-3">
            <div className="flex itmes-center gap-2 flex-wrap">
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
            <div>
                <BottomSheet>
                    <BottomSheetTrigger>
                        Open Bottom Sheet
                    </BottomSheetTrigger>
                    <BottomSheetContent>
                        <BottomSheetHeader title="Bagikan Produk"></BottomSheetHeader>
                        <div className="divide-y px-4">
                            <button className="w-full text-left px-6 py-4">Ringkasan Status Pesanan</button>
                            <button className="w-full text-left px-6 py-4">Detail Pengiriman Dokumen</button>
                            <button className="w-full text-left px-6 py-4">Detail Pembayaran</button>
                            <button className="w-full text-left px-6 py-4">Ubah Pesanan</button>
                            <button className="w-full text-left px-6 py-4">Unduh Dokumen Delivery Order (DO)</button>
                        </div>
                    </BottomSheetContent>
                </BottomSheet>
            </div>
        </div>
    );
}

export default ExampleResponsive