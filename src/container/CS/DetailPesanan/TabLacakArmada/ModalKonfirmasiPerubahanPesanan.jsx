import Button from "@/components/Button/Button";
import CardRiwayatPerubahan from "@/components/Card/CardRiwayatPerubahan";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { useTranslation } from "@/hooks/use-translation";

export const ModalKonfirmasiPerubahanPesanan = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  changes,
}) => {
  const { t } = useTranslation();

  if (!changes) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[800px]">
        <div className="flex flex-col items-center gap-4 px-6 py-8">
          <h2 className="text-base font-bold text-neutral-900">
            {t(
              "ModalKonfirmasiPerubahanPesanan.titleInformasiPerubahanPesanan",
              {},
              "Informasi Perubahan Pesanan"
            )}
          </h2>

          <div className="rounded-lg border border-neutral-400 p-3">
            <CardRiwayatPerubahan.ItemPerubahanTransporter
              title={t(
                "ModalKonfirmasiPerubahanPesanan.titlePerubahanTransporter",
                {},
                "Perubahan Transporter"
              )}
              before={changes.oldTransporters}
              after={changes.newTransporters}
              blastCount={changes.blastCount}
              isFirst={true}
              className="pb-3"
              appearance={{
                sectionContentClassName: "pt-3 pb-0",
              }}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="muattrans-primary-secondary"
              className="min-w-[112px]"
              onClick={onCancel}
            >
              {t("ModalKonfirmasiPerubahanPesanan.buttonBatal", {}, "Batal")}
            </Button>
            <Button
              variant="muattrans-primary"
              className="min-w-[156px]"
              onClick={onConfirm}
            >
              {t(
                "ModalKonfirmasiPerubahanPesanan.buttonKirimPerubahan",
                {},
                "Kirim Perubahan"
              )}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
