import { fetcherMuatrans } from "@/lib/axios";

const isMockUpdateDriverFleet = true;

const mockUpdateDriverFleetResponse = (driverId, fleetId) => ({
  Message: {
    Code: 200,
    Text: "Armada berhasil diperbarui",
  },
  Data: {
    driverId: driverId,
    fleetId: fleetId,
    updatedAt: new Date().toISOString(),
  },
  Type: "DRIVER_FLEET_UPDATE",
});

export const updateDriverFleet = async (driverId, fleetId) => {
  if (isMockUpdateDriverFleet) {
    return mockUpdateDriverFleetResponse(driverId, fleetId);
  }

  const result = await fetcherMuatrans.put(`v1/drivers/${driverId}/fleet`, {
    fleetId: fleetId,
  });
  return result?.data;
};
