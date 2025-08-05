import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheetUp";
import Button from "@/components/Button/Button";

import { InformasiArmadaFragment } from "../fragments/InformasiArmadaFragment";
import { InformasiMuatanFragment } from "../fragments/InformasiMuatanFragment";
import { LocationRouteFragment } from "../fragments/LocationRouteFragment";
import { WaktuMuatFragment } from "../fragments/WaktuMuatFragment";

export const BottomSheetPeriksaPesananKamu = ({
  open,
  onOpenChange,
  dataRingkasanPesanan,
  dataStatusPesanan,
}) => {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Periksa Pesanan Kamu</BottomSheetTitle>
        </BottomSheetHeader>

        <div className="px-4 pb-6">
          <WaktuMuatFragment
            className="mt-0"
            dataRingkasanPesanan={dataRingkasanPesanan}
          />

          <hr className="my-4 border-neutral-400" />

          <LocationRouteFragment dataRingkasanPesanan={dataRingkasanPesanan} />

          <hr className="my-4 border-neutral-400" />

          <InformasiArmadaFragment
            className="px-0 py-0"
            dataStatusPesanan={dataStatusPesanan}
          />
          <hr className="my-4 border-neutral-400" />

          <InformasiMuatanFragment
            dataRingkasanPesanan={dataRingkasanPesanan}
          />

          <span className="my-4 block text-xs font-medium text-neutral-900">
            *Dengan memesan jasa angkut ini, kamu telah menyetujui
            <br />
            <a
              href="#"
              className="font-semibold text-primary-700 hover:underline"
            >
              Syarat dan Ketentuan Muatrans
            </a>
          </span>

          <Button variant="muatparts-primary" className="w-full">
            Pesan Sekarang
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
