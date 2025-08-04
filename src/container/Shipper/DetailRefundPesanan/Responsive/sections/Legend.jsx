import IconComponent from "@/components/IconComponent/IconComponent";
import Section from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/Section";

const Legend = () => {
  const legends = [
    {
      icon: "/icons/money16.svg",
      label: "Pengembalian Dana Diproses",
    },
    {
      icon: "/icons/stepper/stepper-check-circle.svg",
      label: "Dana Terkirim",
    },
  ];
  return (
    <Section title="Proses Pengembalian Dana">
      <div className="flex flex-col gap-y-3">
        {legends.map((item, key) => (
          <div className="flex items-center gap-x-2" key={key}>
            <div className="flex size-6 items-center justify-center rounded-[90px] bg-muat-trans-primary-400">
              <IconComponent src={item.icon} />
            </div>
            <span className="text-xs font-semibold leading-[1.1] text-neutral-900">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Legend;
