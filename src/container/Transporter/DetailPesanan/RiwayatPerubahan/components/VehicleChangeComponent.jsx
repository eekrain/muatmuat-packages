import BadgeStatus from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";

// Vehicle Change Component
function VehicleChangeComponent({
  previousVehicle,
  newVehicle,
  isSearchingReplacement = false,
}) {
  return (
    <>
      <div className="flex items-center gap-2 pt-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
          <IconComponent
            src={"/icons/truck-approved.svg"}
            width={16}
            height={16}
          />
        </span>
        <div className="space-y-2">
          <p className="text-xs font-bold">Terima Perubahan & Ubah Armada</p>
          <p className="text-xs font-medium text-neutral-600">
            Terdapat perubahan armada
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-neutral-400 px-12 py-4">
        <div>
          <p className="mb-4 text-xs font-medium text-neutral-600">
            Armada Sebelumnya dan Status Saat Perubahan
          </p>
          <div className="flex max-w-[398px] gap-4">
            <img
              src={previousVehicle?.image || "/img/depan.png"}
              alt="Truck"
              className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
            />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-neutral-900">
                {previousVehicle?.plateNumber || "B 2222 XYZ"}
              </p>
              <div className="flex items-center gap-1">
                <IconComponent
                  src={"/icons/user16.svg"}
                  width={16}
                  height={16}
                  className={"flex-shrink-0"}
                />
                <p className="text-xs font-medium text-neutral-900">
                  {previousVehicle?.driverName ||
                    "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra"}
                </p>
              </div>
              <BadgeStatus variant="primary" className={"w-max"}>
                {previousVehicle?.status || "Armada Dijadwalkan"}
              </BadgeStatus>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <IconComponent
            src={"/icons/arrow-right.svg"}
            width={16}
            height={16}
          />
        </div>
        <div>
          <p className="mb-4 text-xs font-medium text-neutral-600">
            Armada Pengganti
          </p>
          {!isSearchingReplacement && newVehicle ? (
            <div className="flex max-w-[398px] gap-4">
              <img
                src={newVehicle?.image || "/img/depan.png"}
                alt="Truck"
                className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
              />
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  {newVehicle?.plateNumber || "B 2222 XYZ"}
                </p>
                <div className="flex items-center gap-1">
                  <IconComponent
                    src={"/icons/user16.svg"}
                    width={16}
                    height={16}
                    className={"flex-shrink-0"}
                  />
                  <p className="text-xs font-medium text-neutral-900">
                    {newVehicle?.driverName || "Yoel Kurniawan"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-neutral-400 px-2 py-1">
              <p className="text-xs font-medium text-white">
                Armada pengganti sedang dalam proses pencarian
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VehicleChangeComponent;
