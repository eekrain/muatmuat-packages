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
          Sedang Muat
          {/* ------------------------------------------ */}
          {/* Menuju ke Lokasi Muat 1 */}
          {/* Tiba di Lokasi Muat 1 */}
          {/* Antri di Lokasi Muat 1 */}
          {/* Sedang Muat di Lokasi 1 */}
          {/* ------------------------------------------ */}
          {/* Menuju ke Lokasi Muat 2 */}
        </BadgeStatusPesanan>

        <AvatarDriver
          name="Noel Gallagher"
          image="https://picsum.photos/50"
          licensePlate="B 123456"
        />
        {true && (
          <div className="mx-auto flex items-center justify-center gap-1">
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
            <div className="h-2 w-8 rounded-full bg-primary-700"></div>
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
            <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverCard;
