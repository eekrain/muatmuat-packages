import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";

const DriverInfo = () => {
  return (
    <div className="box-border flex w-full flex-col items-center justify-center border-b-2 border-[#461B02] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <BadgeStatusPesanan variant="primary" className="text-sm font-semibold">
          Antri di Lokasi Muat 1
        </BadgeStatusPesanan>

        <AvatarDriver
          name="Noel Gallagher"
          image="https://picsum.photos/50"
          licensePlate="B 123456"
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
        <Button
          variant="muatparts-primary-secondary"
          className="h-7 w-full text-xs font-semibold"
        >
          Hubungi Driver
        </Button>
        <Button
          variant="muatparts-primary"
          className="h-7 w-full text-xs font-semibold"
        >
          Lacak Armada
        </Button>
      </div>
    </div>
  );
};

export default DriverInfo;
