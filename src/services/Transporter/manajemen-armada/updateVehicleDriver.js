import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdateVehicleDriver = true;

const mockUpdateVehicleDriverResponse = (vehicleId, driverId) => ({
  Message: {
    Code: 200,
    Text: "Driver berhasil dipasangkan",
  },
  Data: {
    vehicleId: vehicleId,
    driverId: driverId,
    assignedAt: new Date().toISOString(),
  },
  Type: "DRIVER_ASSIGNMENT",
});

export const updateVehicleDriver = async (vehicleId, driverId) => {
  if (isMockUpdateVehicleDriver) {
    return mockUpdateVehicleDriverResponse(vehicleId, driverId);
  }

  const result = await fetcherMuatrans.post(
    `v1/vehicles/${vehicleId}/assign-driver/${driverId}`
  );
  return result?.data;
};
