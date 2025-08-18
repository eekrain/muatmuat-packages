/**
 * @typedef {Object} CardItemProps
 * @property {"BERTUGAS" | "PENGIRIMAN_SELESAI" | "NON_AKTIF" | "MENUNGGU_JAM_MUAT" | "DIJADWALKAN"} [statusCode="BERTUGAS"] - Status code that determines the title displayed
 * @property {string} [driverName="Ahmad Maulana"] - Name of the driver assigned to this schedule
 * @property {string} [currentLocation="Rest Area KM 50"] - Current location of the driver/vehicle
 * @property {string} [estimation="est. 30km (1jam 30menit)"] - Estimated distance and time to destination
 * @property {number} [distanceRemaining=121] - Remaining distance in kilometers between pickup and delivery locations
 * @property {LocationData} [dataMuat] - Object containing pickup location information
 * @property {LocationData} [dataBongkar] - Object containing delivery location information
 * @property {number} [DIJADWALKAN=2] - Number of DIJADWALKAN time slots (affects the width of the main card section)
 * @property {number} [additional=1] - Number of additional time slots (affects the width of the additional card section)
 * @property {number} [position=0] - Horizontal position offset for the card (multiplied by 205px)
 */
import { CardItem } from "./CardItem";
import { useAgendaNavigatorStore } from "./agendaNavigatorStore";

/**
 * @typedef {Object} ArmadaProps
 * @property {string} plateNumber - The plate number of the vehicle (e.g., "L 1239 CAM")
 * @property {string} truckType - The type of the truck (e.g., "Colt Diesel Engkel - Box")
 * @property {CardItemProps[]} rowData - Array of card item data to be displayed in the agenda line item
 */

/**
 * CardItem component displays a DIJADWALKAN delivery card with driver information, locations, and timing details.
 * The card consists of two sections: a main DIJADWALKAN section and an additional section for delivery time estimation.
 *
 * @param {{armada: ArmadaProps}} props - The component props
 * @returns {JSX.Element} A card component showing delivery schedule information
 */

export const AgendaRowItem = ({ data, cellWidth }) => {
  const { viewType } = useAgendaNavigatorStore();

  if (!data) return null;

  // Handle placeholder items for consistent grid layout
  if (data.isPlaceholder) {
    return (
      <div className="grid grid-cols-[202px_1fr] grid-rows-[109px] divide-x">
        <div className="px-3 py-4">{/* Empty placeholder content */}</div>
        <div className="relative grid grid-cols-5 overflow-hidden">
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-neutral-200" />
          {/* No cards for placeholder rows */}
        </div>
      </div>
    );
  }

  // Handle driver view data structure
  if (data.driverName && data.schedules) {
    return (
      <div className="grid grid-cols-[202px_1fr] grid-rows-[109px] divide-x">
        <div className="border-b border-neutral-200 px-3 py-4">
          <h5 className="mb-3 text-xs font-bold">{data.driverName}</h5>

          {data.driverPhone && (
            <p className="mb-2 text-xxs font-semibold text-neutral-900">
              {data.driverPhone}
            </p>
          )}
          {data.driverEmail && (
            <p className="text-xxs font-medium text-neutral-900">
              {data.driverEmail}
            </p>
          )}
        </div>

        <div className="relative grid grid-cols-5 overflow-hidden">
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-r border-neutral-200" />
          <div className="border-b border-neutral-200" />
          {data.schedules.map((item, index) => (
            <CardItem
              key={index}
              {...item}
              cellWidth={cellWidth}
              viewType={viewType}
            />
          ))}
        </div>
      </div>
    );
  }

  // Handle armada view data structure (original logic)
  return (
    <div className="grid grid-cols-[202px_1fr] grid-rows-[109px] divide-x">
      <div className="border-b border-neutral-200 px-3 py-4">
        <h5 className="text-xs font-bold">{data.plateNumber}</h5>
        <span className="text-xxs font-semibold">{data.truckType}</span>
      </div>

      <div className="relative grid grid-cols-5 overflow-hidden">
        <div className="border-b border-r border-neutral-200" />
        <div className="border-b border-r border-neutral-200" />
        <div className="border-b border-r border-neutral-200" />
        <div className="border-b border-r border-neutral-200" />
        <div className="border-b border-neutral-200" />
        {data.rowData?.map((item, index) => (
          <CardItem
            key={index}
            {...item}
            cellWidth={cellWidth}
            viewType={viewType}
          />
        ))}
      </div>
    </div>
  );
};
