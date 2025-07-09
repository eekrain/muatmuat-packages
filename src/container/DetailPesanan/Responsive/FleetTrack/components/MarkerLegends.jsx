import IconComponent from "@/components/IconComponent/IconComponent";

export const MarkerLegends = ({ legends }) => {
  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      {legends.map((legend, index) => (
        <div key={index} className="flex items-center gap-2">
          <IconComponent src={legend.icon} width={24} height={24} />
          <span className="text-sm font-semibold">{legend.title}</span>
        </div>
      ))}
    </div>
  );
};
