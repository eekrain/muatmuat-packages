import IconComponent from "@/components/IconComponent/IconComponent";

export const OrderLegends = () => {
  const legends = [
    {
      label: "Pesanan Terkonfirmasi",
      status: "CONFIRMED",
      icon: "/icons/stepper/stepper-scheduled.svg",
    },
    {
      label: "Proses Muat",
      status: "LOADING",
      icon: "/icons/stepper/stepper-box.svg",
    },
    {
      label: "Proses Bongkar",
      status: "UNLOADING",
      icon: "/icons/stepper/stepper-box-opened.svg",
    },
    {
      label: "Dokumen Disiapkan",
      status: "PREPARE_DOCUMENT",
      icon: "/icons/stepper/stepper-document-preparing.svg",
    },
    {
      label: "Pengiriman Dokumen",
      status: "DOCUMENT_DELIVERY",
      icon: "/icons/stepper/stepper-document-sending.svg",
    },
    {
      label: "Selesai",
      status: "COMPLETED",
      icon: "/icons/stepper/stepper-completed.svg",
    },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white px-4 py-5">
      <div className="font-bold text-neutral-900">
        Keterangan Status Pesanan
      </div>

      {legends.map((legend) => (
        <div key={legend.status} className="flex items-center gap-2">
          <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#FFC217] bg-[#FFC217] transition-all duration-300">
            <IconComponent
              src={legend.icon}
              width={16}
              height={16}
              className="text-muat-trans-primary-900"
            />
          </div>
          <span className="text-xs font-semibold text-neutral-900">
            {legend.label}
          </span>
        </div>
      ))}
    </div>
  );
};
