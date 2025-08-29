const QRCode = ({ qrData }) => {
  return (
    <div className="place-items-center space-y-6 bg-white px-4 py-5">
      <img
        src={qrData?.qrCodeImage || ""}
        alt="QR Code"
        className="h-[328px] w-[328px]"
      />
      <div className="text-center text-xs font-medium">
        *Tunjukkan QR Code ini kepada pihak driver agar dapat melanjutkan ke
        proses muat.
      </div>
    </div>
  );
};
export default QRCode;
