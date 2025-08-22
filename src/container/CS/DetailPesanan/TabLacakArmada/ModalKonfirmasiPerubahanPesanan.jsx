import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

const TransporterInfo = ({ logo, name, units, phone }) => (
  <div className="flex items-start gap-2 self-stretch">
    <img
      src={logo}
      alt={`${name} logo`}
      className="h-10 w-10 rounded-full border border-neutral-500 object-contain"
    />
    <div className="flex flex-col items-start justify-center gap-3">
      <p className="text-xs font-bold text-neutral-900">{name}</p>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-1">
          <IconComponent
            src="/icons/transporter16.svg"
            alt="unit icon"
            className="h-4 w-4 text-muat-trans-secondary-900"
          />
          <p className="text-xs font-medium text-neutral-900">{units} Unit</p>
        </div>
        <div className="flex items-center gap-1">
          <IconComponent
            src="/icons/contact.svg"
            alt="phone icon"
            className="h-4 w-4 text-muat-trans-secondary-900"
          />
          <p className="text-xs font-medium text-neutral-900">{phone || "-"}</p>
        </div>
      </div>
    </div>
  </div>
);

const BlastOrderCard = ({ count }) => (
  <div className="flex flex-col items-start gap-3 self-stretch rounded-xl border border-neutral-400 p-3">
    <h3 className="text-xs font-bold text-neutral-900">Blast Order</h3>
    <p className="text-xs font-medium text-neutral-900">
      {count} armada akan dimasukkan ke daftar permintaan jasa angkut agar dapat
      dilihat oleh seluruh transporter
    </p>
  </div>
);

export const ModalKonfirmasiPerubahanPesanan = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  changes,
}) => {
  if (!changes) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[800px]">
        <div className="flex flex-col items-center gap-4 px-6 py-8">
          <h2 className="text-base font-bold text-neutral-900">
            Informasi Perubahan Pesanan
          </h2>
          <div className="flex flex-col items-start self-stretch rounded-lg border border-neutral-400 p-3">
            {/* Header */}
            <div className="flex items-center gap-4 self-stretch border-b border-neutral-400 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                <IconComponent
                  src="/icons/transporter16.svg"
                  alt="Perubahan Transporter"
                  className="h-4 w-4 text-muat-trans-secondary-900"
                />
              </div>
              <p className="text-xs font-bold text-neutral-900">
                Perubahan Transporter
              </p>
            </div>

            {/* Content */}
            <div className="flex items-start justify-between self-stretch px-12 pt-3">
              {/* Kolom Kiri - Transporter Awal */}
              <div className="flex w-[288px] flex-col items-start gap-4">
                <p className="text-xs font-medium text-neutral-600">
                  Transporter Awal
                </p>
                {changes.oldTransporters.map((transporter) => (
                  <TransporterInfo key={transporter.name} {...transporter} />
                ))}
              </div>

              {/* Separator */}
              <div className="h-auto w-[0.5px] self-stretch bg-neutral-400" />

              {/* Kolom Kanan - Transporter Baru */}
              <div className="flex w-[288px] flex-col items-start gap-4">
                <p className="text-xs font-medium text-neutral-600">
                  Transporter Baru
                </p>
                {changes.newTransporters.map((transporter) => (
                  <TransporterInfo key={transporter.name} {...transporter} />
                ))}
                {changes.blastCount > 0 && (
                  <BlastOrderCard count={changes.blastCount} />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              variant="muattrans-primary-secondary"
              className="min-w-[112px]"
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button
              variant="muattrans-primary"
              className="min-w-[156px]"
              onClick={onConfirm}
            >
              Kirim Perubahan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
