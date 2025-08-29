import IconComponent from "@/components/IconComponent/IconComponent";

// Vehicle Item Component
function VehicleItem({
  vehicle,
  showTopBorder = false,
  showBottomBorder = false,
  isLast = false,
}) {
  // Extract vehicle data with proper fallbacks
  const {
    image,
    photoUrl,
    plateNumber,
    licensePlate,
    driverName,
    assignDriver,
    id,
    vehicleType,
    truckType,
    status,
  } = vehicle || {};

  // Determine the best image source
  const vehicleImage = image || photoUrl || "/img/depan.png";

  // Determine the best plate number
  const vehiclePlate = plateNumber || licensePlate || "B 2222 XYZ";

  // Determine the best driver name
  const vehicleDriver =
    driverName ||
    assignDriver ||
    "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra";

  // Determine vehicle type display
  const vehicleTypeDisplay = vehicleType || truckType?.name || "Truck";

  return (
    <div
      className={`flex items-center gap-4 px-12 py-4 transition-colors hover:bg-gray-50 ${
        showTopBorder ? "border-t border-neutral-400" : ""
      } ${showBottomBorder && !isLast ? "border-b border-neutral-400" : ""}`}
    >
      <div className="relative">
        <img
          src={vehicleImage}
          alt={`Vehicle ${vehiclePlate}`}
          className="h-14 w-14 rounded-md bg-gray-100 object-cover shadow-sm"
          onError={(e) => {
            e.target.src = "/img/depan.png";
          }}
        />
        {status && (
          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-bold text-neutral-900">
            {vehiclePlate}
          </p>
          {vehicleTypeDisplay !== "Truck" && (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
              {vehicleTypeDisplay}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <IconComponent src={"/icons/user16.svg"} width={16} height={16} />
          <p
            className="truncate text-xs font-medium text-neutral-900"
            title={vehicleDriver}
          >
            {vehicleDriver}
          </p>
        </div>

        {id && <p className="text-xs text-neutral-500">ID: {id}</p>}
      </div>
    </div>
  );
}

// Accept Change Component
function AcceptChangeComponent({
  vehicles = [],
  vehicle = null, // For backward compatibility with single vehicle
  title = "Terima Perubahan",
  subtitle = "Tidak ada perubahan armada",
  showBorders = true,
  icon = "/icons/truck-approved.svg",
  iconBgColor = "bg-muat-trans-primary-400",
  customContent = null, // For custom content display
  maxDisplayVehicles = null, // Limit number of vehicles displayed
}) {
  // Handle backward compatibility - if single vehicle prop is provided, convert to array
  const vehicleList = vehicles.length > 0 ? vehicles : vehicle ? [vehicle] : [];

  // Apply display limit if specified
  const displayVehicles = maxDisplayVehicles
    ? vehicleList.slice(0, maxDisplayVehicles)
    : vehicleList;

  // Check if there are more vehicles than displayed
  const hasMoreVehicles =
    maxDisplayVehicles && vehicleList.length > maxDisplayVehicles;
  const remainingCount = hasMoreVehicles
    ? vehicleList.length - maxDisplayVehicles
    : 0;

  return (
    <>
      <div className="flex items-center gap-2 pt-4">
        <span
          className={`grid h-8 w-8 place-items-center rounded-full ${iconBgColor}`}
        >
          <IconComponent src={icon} width={16} height={16} />
        </span>
        <div className="space-y-2">
          <p className="text-xs font-bold">{title}</p>
          <p className="text-xs font-medium text-neutral-600">
            {subtitle}
            {displayVehicles.length > 1 &&
              ` (${displayVehicles.length} armada)`}
            {hasMoreVehicles && ` +${remainingCount} lainnya`}
          </p>
        </div>
      </div>

      {/* Dynamic vehicle list */}
      <div className="mt-4">
        {customContent ? (
          <div className="px-12 py-4">{customContent}</div>
        ) : displayVehicles.length > 0 ? (
          <>
            {displayVehicles.map((vehicleItem, index) => (
              <VehicleItem
                key={
                  vehicleItem?.plateNumber ||
                  vehicleItem?.id ||
                  `vehicle-${index}`
                }
                vehicle={vehicleItem}
                showTopBorder={showBorders && index === 0}
                showBottomBorder={showBorders && displayVehicles.length > 1}
                isLast={index === displayVehicles.length - 1}
              />
            ))}
            {hasMoreVehicles && (
              <div className="flex items-center justify-center py-3 text-xs text-neutral-600">
                <span className="rounded-full bg-neutral-100 px-3 py-1">
                  +{remainingCount} armada lainnya tidak ditampilkan
                </span>
              </div>
            )}
          </>
        ) : (
          // Fallback when no vehicles provided
          <VehicleItem
            vehicle={null}
            showTopBorder={showBorders}
            showBottomBorder={false}
            isLast={true}
          />
        )}
      </div>
    </>
  );
}

export default AcceptChangeComponent;
