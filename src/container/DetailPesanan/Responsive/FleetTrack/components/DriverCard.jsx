import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

const DriverCard = () => {
  return (
    <div className="box-border flex w-full flex-col items-center justify-center border-b-2 border-[#461B02] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <BadgeStatusPesanan
          variant="primary"
          className="w-fit text-sm font-semibold"
        >
          {/* Menuju ke Lokasi Muat 1 */}
          {/* Tiba di Lokasi Muat 1 */}
          {/* Antri di Lokasi Muat 1 */}
          Sedang Muat di Lokasi 1
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
