import IconComponent from "@/components/IconComponent/IconComponent";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import { useTranslation } from "@/hooks/use-translation";

const RekeningPengembalianDana = ({ bank }) => {
  const { t } = useTranslation();
  const refundAccountData = [
    {
      title: t("RekeningPengembalianDana.labelBankName", {}, "Nama Bank"),
      value: (
        <div className="flex items-center gap-x-2">
          <IconComponent src="/icons/bca24.svg" size="medium" />
          <span>{bank?.bankName || "-"}</span>
        </div>
      ),
    },
    {
      title: t(
        "RekeningPengembalianDana.labelAccountNumber",
        {},
        "Nomor Rekening"
      ),
      value: bank?.accountNumber || "-",
    },
    {
      title: t(
        "RekeningPengembalianDana.labelAccountHolderName",
        {},
        "Nama Pemilik Rekening"
      ),
      value: bank?.accountHolderName || "-",
    },
  ];
  return (
    <ResponsiveSection
      title={t(
        "RekeningPengembalianDana.titleRefundAccount",
        {},
        "Rekening Pengembalian Dana"
      )}
    >
      {refundAccountData.map((item, key) => (
        <div className="flex flex-col gap-y-4" key={key}>
          <h4 className="text-sm font-semibold text-neutral-900">
            {item.title}
          </h4>
          <div className="text-xs font-semibold leading-[1.1] text-neutral-900">
            {item.value}
          </div>
        </div>
      ))}
    </ResponsiveSection>
  );
};

export default RekeningPengembalianDana;
