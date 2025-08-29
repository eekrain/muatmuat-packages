import Image from "next/image";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";

// Driver Change Component
function DriverChangeComponent({ previousDriver, newDriver, vehicle }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
          <IconComponent
            src={"/icons/card-perubahan/driver.svg"}
            width={16}
            height={16}
            className="text-muat-trans-secondary-900"
          />
        </span>
        <p className="text-xs font-bold">Perubahan Driver</p>
      </div>

      <div className="mt-4 border-t border-neutral-400 py-4">
        <div className="flex items-start justify-between gap-4 px-2 md:px-6">
          <div className="flex-1">
            <p className="mb-3 text-xs font-medium text-neutral-600">
              Driver Sebelumnya dan Status Saat Perubahan
            </p>
            <div className="flex items-center gap-3">
              <Image
                src={previousDriver?.avatar || "/img/avatar.png"}
                alt={previousDriver?.name || "Previous Driver"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-neutral-900">
                  {previousDriver?.name || "Noel Gallagher"}
                </p>
                <BadgeStatus variant="primary" className="w-max">
                  {previousDriver?.status || "Sedang Muat"}
                </BadgeStatus>
              </div>
            </div>
          </div>
          <IconComponent
            src={"/icons/arrow-right.svg"}
            width={24}
            height={24}
            className="flex-shrink-0 text-neutral-500"
          />
          <div className="flex-1">
            <p className="mb-3 text-xs font-medium text-neutral-600">
              Driver Pengganti
            </p>
            <div className="flex items-center gap-3">
              <Image
                src={newDriver?.avatar || "/img/avatar2.png"}
                alt={newDriver?.name || "New Driver"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="text-sm font-semibold text-neutral-900">
                {newDriver?.name ||
                  "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra"}
              </p>
            </div>
          </div>
        </div>

        <div className="my-4 border-t border-neutral-400" />

        <div className="px-2 md:px-6">
          <p className="mb-3 text-xs font-medium text-neutral-600">
            Armada Terkait
          </p>
          <div className="flex items-center gap-3">
            <img
              src={vehicle?.image || "/img/depan.png"}
              alt="Truck"
              className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {vehicle?.plateNumber || "AE 1111 LBA"}
              </p>
              <p className="text-xs text-neutral-600">
                {vehicle?.type || "Colt Diesel Double - Bak Terbuka"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverChangeComponent;
