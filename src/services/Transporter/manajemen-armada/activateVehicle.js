import { fetcherMuatrans } from "@/lib/axios";

const isMockActivateVehicle = true;

const mockActivateVehicleResponse = (vehicleId) => ({
  Message: {
    Code: 200,
    Text: "Armada berhasil diaktifkan",
  },
  Data: {
    vehicleId: vehicleId,
    status: "READY_FOR_ORDER",
    activatedAt: new Date().toISOString(),
  },
  Type: "VEHICLE_ACTIVATE",
});

export const activateVehicle = async (vehicleId) => {
  if (isMockActivateVehicle) {
    return mockActivateVehicleResponse(vehicleId);
  }

  const result = await fetcherMuatrans.patch(
    `v1/vehicles/${vehicleId}/status`,
    {
      status: "READY_FOR_ORDER",
    }
  );
  return result?.data;
};
