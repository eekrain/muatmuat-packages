import BadgeStatus from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";

// Cancellation Response Component
function CancellationResponseComponent({
  vehicle,
  vehicles,
  steps,
  activeIndex,
  maxDisplayVehicles = 3,
  showSeparators = true,
}) {
  // Support both single vehicle and multiple vehicles (backward compatibility)
  const vehicleList = vehicles || (vehicle ? [vehicle] : []);
  const displayVehicles = vehicleList.slice(0, maxDisplayVehicles);
  const remainingCount = vehicleList.length - maxDisplayVehicles;
  const hasOverflow = remainingCount > 0;

  // Single vehicle layout (backward compatibility)
  if (vehicleList.length <= 1) {
    const singleVehicle = vehicleList[0] || vehicle;
    return (
      <>
        <div className="flex items-center gap-2 pt-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
            <IconComponent
              src={"/icons/truck-reject.svg"}
              width={16}
              height={16}
            />
          </span>
          <div className="space-y-2">
            <p className="text-xs font-bold">
              Tolak Perubahan dan Batalkan Armada
            </p>
            <p className="text-xs font-medium text-neutral-600">
              Armada dibatalkan dan ada penyesuaian pendapatan
            </p>
          </div>
        </div>
        <div className="mt-4 grid w-full grid-cols-2 gap-3 border-t border-neutral-400 px-12 py-4">
          <div className="flex max-w-[398px] gap-4">
            <img
              src={singleVehicle?.image || "/img/depan.png"}
              alt="Truck"
              className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
            />
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-neutral-900">
                {singleVehicle?.plateNumber ||
                  singleVehicle?.licensePlate ||
                  "AE 1111 LBA"}
              </p>
              <div className="flex items-center gap-1">
                <IconComponent
                  src={"/icons/user16.svg"}
                  width={16}
                  height={16}
                  className={"flex-shrink-0"}
                />
                <p className="text-xs font-medium text-neutral-900">
                  {singleVehicle?.driverName ||
                    singleVehicle?.assignDriver ||
                    "Noel Gallagher"}
                </p>
              </div>
              <BadgeStatus variant="primary" className={"w-max"}>
                {singleVehicle?.status || "Armada Dijadwalkan"}
              </BadgeStatus>
            </div>
          </div>
          {steps && steps.length > 0 && (
            <StepperContainer
              totalStep={steps.length}
              activeIndex={activeIndex || 0}
            >
              {steps.map((step, index) => (
                <StepperItem key={index} step={step} index={index} />
              ))}
            </StepperContainer>
          )}
        </div>
      </>
    );
  }

  // Multiple vehicles layout
  return (
    <>
      <div className="flex items-center gap-2 pt-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
          <IconComponent
            src={"/icons/truck-reject.svg"}
            width={16}
            height={16}
          />
        </span>
        <div className="space-y-2">
          <p className="text-xs font-bold">
            Tolak Perubahan dan Batalkan Armada
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {vehicleList.length} armada dibatalkan dan ada penyesuaian
            pendapatan
          </p>
        </div>
      </div>

      {/* Multiple Vehicles Section */}
      <div className="mt-4 space-y-0">
        {displayVehicles.map((vehicleItem, index) => (
          <div key={vehicleItem?.id || index}>
            {showSeparators && index > 0 && (
              <div className="border-t border-neutral-300" />
            )}
            <div className="grid w-full grid-cols-2 gap-3 px-12 py-4">
              <div className="flex max-w-[398px] gap-4">
                <img
                  src={vehicleItem?.image || "/img/depan.png"}
                  alt="Truck"
                  className="h-14 w-14 flex-shrink-0 rounded-md bg-gray-100 object-cover"
                />
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold text-neutral-900">
                    {vehicleItem?.plateNumber ||
                      vehicleItem?.licensePlate ||
                      "N/A"}
                  </p>
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src={"/icons/user16.svg"}
                      width={16}
                      height={16}
                      className={"flex-shrink-0"}
                    />
                    <p className="text-xs font-medium text-neutral-900">
                      {vehicleItem?.driverName ||
                        vehicleItem?.assignDriver ||
                        "N/A"}
                    </p>
                  </div>
                  <BadgeStatus variant="primary" className={"w-max"}>
                    {vehicleItem?.status || "Armada Dijadwalkan"}
                  </BadgeStatus>
                </div>
              </div>

              {/* Show stepper only for the first vehicle */}
              {index === 0 && steps && steps.length > 0 && (
                <StepperContainer
                  totalStep={steps.length}
                  activeIndex={activeIndex || 0}
                >
                  {steps.map((step, stepIndex) => (
                    <StepperItem
                      key={stepIndex}
                      step={step}
                      index={stepIndex}
                    />
                  ))}
                </StepperContainer>
              )}
            </div>
          </div>
        ))}

        {/* Overflow indicator */}
        {hasOverflow && (
          <div>
            {showSeparators && <div className="border-t border-neutral-300" />}
            <div className="px-12 py-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <IconComponent
                  src={"/icons/truck-reject.svg"}
                  width={16}
                  height={16}
                  className="text-neutral-400"
                />
                <span>+{remainingCount} armada lainnya</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSeparators && <div className="border-b border-neutral-400" />}
    </>
  );
}

export default CancellationResponseComponent;
