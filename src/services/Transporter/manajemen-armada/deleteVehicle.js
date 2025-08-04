import { fetcherMuatrans } from "@/lib/axios";

const isMockDeleteVehicle = true;

const mockDeleteVehicleResponse = (vehicleId) => ({
  Message: {
    Code: 200,
    Text: "Armada berhasil dihapus",
  },
  Data: {
    vehicleId: vehicleId,
    deletedAt: new Date().toISOString(),
  },
  Type: "VEHICLE_DELETE",
});

export const deleteVehicle = async (vehicleId) => {
  if (isMockDeleteVehicle) {
    return mockDeleteVehicleResponse(vehicleId);
  }

  const result = await fetcherMuatrans.delete(`v1/vehicles/${vehicleId}`);
  return result?.data;
};
