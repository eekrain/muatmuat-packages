import IconComponent from "@/components/IconComponent/IconComponent";

export const DriverQRCodeAlert = () => {
  return (
    <div className="flex items-center gap-2 bg-warning-100 p-3">
      <IconComponent
        className="h-5 w-5 text-secondary-400"
        src="/icons/warning20.svg"
      />
      <div className="pt-0.5 text-xs font-medium">
        Harap tunjukkan QR Code ke pihak driver
      </div>
      <IconComponent
        className="h-4 w-4 text-neutral-700"
        src="/icons/info16.svg"
      />
    </div>
  );
};
