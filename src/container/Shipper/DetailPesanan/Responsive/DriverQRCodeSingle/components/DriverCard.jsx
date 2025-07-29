import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

const DriverCard = () => {
  return (
    <div className="box-border flex w-full flex-col items-center justify-center bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <BadgeStatusPesanan
          variant="error"
          className="w-fit text-sm font-semibold"
        >
          {/* Belum Scan di Lokasi Muat 1 */}
          {/* Sudah Scan di Lokasi Muat 1 */}
          Belum Scan di Lokasi Bongkar 1
        </BadgeStatusPesanan>

        <AvatarDriver
          name="Noel Gallagher"
          image="https://picsum.photos/50"
          licensePlate="B 123456"
        />
      </div>
    </div>
  );
};

export default DriverCard;
