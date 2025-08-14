import { useClientWidth } from "@/hooks/use-client-width";

import { CardItem } from "./CardItem";

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

export const AgendaRowItem = ({ armada }) => {
  const { ref, width: containerWidth } = useClientWidth();
  if (!armada) return null;
  return (
    <div className="grid grid-cols-[202px_1fr] grid-rows-[109px] divide-x">
      <div className="px-3 py-4">
        <h5 className="text-xs font-bold">L 1239 CAM</h5>
        <span className="text-xxs font-semibold">Colt Diesel Engkel - Box</span>
      </div>

      <div
        className="relative grid grid-cols-5 divide-x overflow-hidden"
        ref={ref}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        {armada.rowData.map((item, index) => (
          <CardItem key={index} {...item} containerWidth={containerWidth} />
        ))}
      </div>
    </div>
  );
};
