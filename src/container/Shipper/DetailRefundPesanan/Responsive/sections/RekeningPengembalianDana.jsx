import IconComponent from "@/components/IconComponent/IconComponent";
import Section from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/Section";

const RekeningPengembalianDana = ({ bank }) => {
  const refundAccountData = [
    {
      title: "Nama Bank",
      value: (
        <div className="flex items-center gap-x-2">
          <IconComponent src="/icons/bca24.svg" size="medium" />
          <span>{bank?.bankName || "-"}</span>
        </div>
      ),
    },
    {
      title: "Nomor Rekening",
      value: bank?.accountNumber || "-",
    },
    {
      title: "Nama Pemilik Rekening",
      value: bank?.accountHolderName || "-",
    },
  ];
  return (
    <Section title="Rekening Pengembalian Dana">
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
    </Section>
  );
};

export default RekeningPengembalianDana;
