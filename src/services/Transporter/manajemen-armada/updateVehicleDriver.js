// import { fetcherMuatrans } from "@/lib/axios";

export const updateVehicleDriver = async (vehicleId, driverId) => {
  // const result = await fetcherMuatrans.put(
  //   `v1/transporter/vehicles/${vehicleId}/driver`,
  //   {
  //     driverId: driverId,
  //   }
  // );
  // return result?.data;

  // Mock response for now
  return {
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
  };
};
