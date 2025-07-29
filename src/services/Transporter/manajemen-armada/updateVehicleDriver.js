import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdateVehicleDriver = true;

const mockUpdateVehicleDriverResponse = (vehicleId, driverId) => ({
  Message: {
    Code: 200,
    Text: "Driver berhasil diperbarui",
  },
  Data: {
    vehicleId: vehicleId,
    driverId: driverId,
    updatedAt: new Date().toISOString(),
  },
  Type: "VEHICLE_DRIVER_UPDATE",
});

export const updateVehicleDriver = async (vehicleId, driverId) => {
  if (isMockUpdateVehicleDriver) {
    return mockUpdateVehicleDriverResponse(vehicleId, driverId);
  }

  const result = await fetcherMuatrans.put(`v1/vehicles/${vehicleId}/driver`, {
    driverId: driverId,
  });
  return result?.data;
};
