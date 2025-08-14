"use client";

import { useGetAvailableVehiclesList } from "@/services/Transporter/monitoring/daftar-pesanan-active/getAvailableVehiclesList";

import ArmadaTidakCukupiModal from "./ArmadaTidakCukupiModal";
import ArmadaTidakTersediaModal from "./ArmadaTidakTersediaModal";
import AssignArmadaModal from "./AssignArmadaModal";

const AssignArmadaWrapper = ({ isOpen, onClose, orderData }) => {
  // Fetch available vehicles to determine which modal to show
  const { data, isLoading } = useGetAvailableVehiclesList(orderData?.id);

  const totalUnitsNeeded =
    data?.orderInfo?.requiredTruckCount || orderData?.truckCount || 3;
  const availableVehicles = data?.availableVehicles || [];

  // Determine which modal to show
  const getModalType = () => {
    if (isLoading) return null;

    if (availableVehicles.length === 0) {
      return "no-vehicles"; // No vehicles available at all
    }

    if (availableVehicles.length < totalUnitsNeeded) {
      return "insufficient"; // Some vehicles but not enough
    }

    return "assign"; // Sufficient vehicles available
  };

  const modalType = getModalType();

  const handleChangeUnit = (order) => {
    // TODO: Implement change unit count functionality
    console.log("Change unit count for order:", order);
    // This would typically navigate to a change unit form or open another modal
    onClose?.();
  };

  // Show loading state
  if (isLoading && isOpen) {
    return (
      <AssignArmadaModal
        isOpen={isOpen}
        onClose={onClose}
        orderData={orderData}
      />
    );
  }

  // Render appropriate modal based on vehicle availability
  switch (modalType) {
    case "no-vehicles":
      return (
        <ArmadaTidakTersediaModal
          isOpen={isOpen}
          onClose={onClose}
          orderData={orderData}
        />
      );

    case "insufficient":
      return (
        <ArmadaTidakCukupiModal
          isOpen={isOpen}
          onClose={onClose}
          onChangeUnit={handleChangeUnit}
          orderData={orderData}
        />
      );

    case "assign":
      return (
        <AssignArmadaModal
          isOpen={isOpen}
          onClose={onClose}
          orderData={orderData}
        />
      );

    default:
      return null;
  }
};

export default AssignArmadaWrapper;
