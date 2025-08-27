import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";

import { useTranslation } from "@/hooks/use-translation";

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
  const { t } = useTranslation();

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t(
              "BottomSheetPeriksaPesananKamu.title",
              {},
              "Periksa Pesanan Kamu"
            )}
          </BottomSheetTitle>
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
            {t(
              "BottomSheetPeriksaPesananKamu.termsAgreement",
              {},
              "*Dengan memesan jasa angkut ini, kamu telah menyetujui"
            )}
            <br />
            <a
              href="#"
              className="font-semibold text-primary-700 hover:underline"
            >
              {t(
                "BottomSheetPeriksaPesananKamu.termsAndConditions",
                {},
                "Syarat dan Ketentuan Muatrans"
              )}
            </a>
          </span>

          <Button variant="muatparts-primary" className="w-full">
            {t(
              "BottomSheetPeriksaPesananKamu.orderNowButton",
              {},
              "Pesan Sekarang"
            )}
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
