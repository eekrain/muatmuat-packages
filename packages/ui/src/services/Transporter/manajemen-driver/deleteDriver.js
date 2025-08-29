import { fetcherMuatrans } from "@/lib/axios";

const isMockDeleteDriver = false;

const mockDeleteDriverResponse = (driverId) => ({
  Message: {
    Code: 200,
    Text: "Driver berhasil dihapus",
  },
  Data: {
    driverId: driverId,
    deletedAt: new Date().toISOString(),
  },
  Type: "DRIVER_DELETE",
});

export const deleteDriver = async (driverId) => {
  if (isMockDeleteDriver) {
    return mockDeleteDriverResponse(driverId);
  }

  const result = await fetcherMuatrans.delete(`v1/drivers/${driverId}`);
  return result?.data;
};
