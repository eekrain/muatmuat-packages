import { fetcherMuatrans } from "@/lib/axios";

const isMockUnlinkDriver = false;

const mockUnlinkDriverResponse = (driverId) => ({
  Message: {
    Code: 200,
    Text: "Driver berhasil dilepas dari armada",
  },
  Data: {
    driverId: driverId,
    vehicleId: null,
    unlinkedAt: new Date().toISOString(),
  },
  Type: "DRIVER_UNLINK",
});

export const unlinkDriver = async (driverId) => {
  if (isMockUnlinkDriver) {
    return mockUnlinkDriverResponse(driverId);
  }

  const result = await fetcherMuatrans.put(
    `v1/vehicles/${driverId}/unassign-driver`
  );
  return result?.data;
};
