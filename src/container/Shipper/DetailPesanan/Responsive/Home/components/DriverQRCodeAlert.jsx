import IconComponent from "@/components/IconComponent/IconComponent";

export const DriverQRCodeAlert = () => {
  return (
    <>
      {false && (
        <div className="flex items-center gap-2 bg-warning-100 p-3">
          <IconComponent
            className="h-6 w-6 text-secondary-400"
            src="/icons/warning20.svg"
          />
          <div className="text-xs font-medium">
            Harap tunjukkan QR Code ke pihak driver
          </div>
          <IconComponent
            className="h-4 w-4 text-neutral-700"
            src="/icons/info16.svg"
          />
        </div>
      )}

      {true && (
        <div className="flex items-start gap-2 bg-warning-100 p-3">
          <IconComponent
            className="h-6 w-6 text-secondary-400"
            src="/icons/warning20.svg"
          />
          <div className="text-xs font-medium">
            <span className="font-semibold">
              Pesanan Anda memiliki tambahan biaya.
            </span>
            <br />
            Mohon selesaikan pembayaran sebelum tanggal <br />{" "}
            <span className="font-semibold">07 Juli 2024.</span>
          </div>
        </div>
      )}
    </>
  );
};
