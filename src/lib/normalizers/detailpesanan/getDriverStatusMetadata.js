import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";

export const getDriverStatusMetadata = (driverStatus = null) => {
  let label = "";
  let index = 0;
  const splitStatus = driverStatus?.split?.("_");
  if (!splitStatus) return { label, index };

  const locationIndex = Number(splitStatus.slice(-1)?.[0]);
  if (isNaN(locationIndex)) {
    label = DriverStatusLabel[driverStatus];
    return { label, index };
  }

  const newStatus = splitStatus.slice(0, -1).join("_");
  console.log("🚀 ~ getDriverStatusMetadata ~ newStatus:", newStatus);
  index = locationIndex;
  label = DriverStatusLabel[newStatus];

  return { label, index };
};
