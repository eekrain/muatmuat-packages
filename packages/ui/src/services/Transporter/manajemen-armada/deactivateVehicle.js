import { fetcherMuatrans } from "@/lib/axios";

const isMockDeactivateVehicle = true;

const mockDeactivateVehicleResponse = (vehicleId) => ({
  Message: {
    Code: 200,
    Text: "Armada berhasil dinonaktifkan",
  },
  Data: {
    vehicleId: vehicleId,
    status: "INACTIVE",
    deactivatedAt: new Date().toISOString(),
  },
  Type: "VEHICLE_DEACTIVATE",
});

export const deactivateVehicle = async (vehicleId) => {
  if (isMockDeactivateVehicle) {
    return mockDeactivateVehicleResponse(vehicleId);
  }

  const result = await fetcherMuatrans.patch(
    `v1/vehicles/${vehicleId}/status`,
    {
      status: "INACTIVE",
    }
  );
  return result?.data;
};
