import { fetcherMuatrans } from "@/lib/axios";

const isMockNonaktifkanDriver = false;

const mockNonaktifkanDriverResponse = (driverId) => ({
  Message: {
    Code: 200,
    Text: "Driver berhasil dinonaktifkan",
  },
  Data: {
    driverId: driverId,
    status: "INACTIVE",
    deactivatedAt: new Date().toISOString(),
  },
  Type: "DRIVER_DEACTIVATE",
});

export const nonaktifkanDriver = async (driverId) => {
  if (isMockNonaktifkanDriver) {
    return mockNonaktifkanDriverResponse(driverId);
  }

  const result = await fetcherMuatrans.put(`v1/drivers/${driverId}/deactivate`);
  return result?.data;
};
