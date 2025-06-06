import Image from "next/image";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const SummaryPanel = () => {
  const bantuanTambahan = useSewaArmadaStore(
    (state) => state.formValues.bantuanTambahan
  );
  const { validateForm } = useSewaArmadaActions();

  const handleValidateFleetOrder = () => {
    const isValidForm = validateForm();
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  return (
    <Card className="flex w-[338px] flex-col gap-6 rounded-xl border-none bg-white p-5 py-6 shadow-md">
      <h3 className="text-base font-bold text-black">Ringkasan Transaksi</h3>

      <div className="flex h-10 items-center gap-2 rounded-md border border-primary-700 bg-primary-50 px-3">
        <div className="relative h-6 w-6">
          <Image
            src="/icons/voucher24.svg"
            alt="Voucher"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xs font-medium text-black">
          Makin hemat pakai voucher
        </span>
        <IconComponent
          src="/icons/chevron-right.svg"
          width={16}
          height={16}
          className="ml-auto"
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              Rp{bantuanTambahan ? "105.000" : "0"}
            </span>
          </div>
        </div>
        <Button variant="muatparts-primary" onClick={handleValidateFleetOrder}>
          Lanjut Pembayaran
        </Button>
      </div>
    </Card>
  );
};
