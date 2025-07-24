import { getLoadTimes } from "@/lib/utils/dateTime";

// Calculate total weight and convert to tons
const calculateTotalWeight = (latestInformasiMuatan) => {
  let totalWeight = 0;

  if (latestInformasiMuatan && latestInformasiMuatan.length > 0) {
    // Sum all weights with unit conversion
    totalWeight = latestInformasiMuatan.reduce((sum, item) => {
      const weight = item.beratMuatan?.berat || 0;
      const unit = item.beratMuatan?.unit || "kg";

      // Convert to tons
      if (unit === "kg") {
        return sum + weight * 0.001; // kg to ton
      } else if (unit === "ton") {
        return sum + weight;
      } else {
        // For other units (like liters), convert based on estimation or just use as-is
        return sum + weight;
      }
    }, 0);
  }

  return {
    weight: totalWeight || 0,
    weightUnit: "ton", // Always use ton as per requirement
  };
};

// Get max dimensions from informasiMuatan and convert to meters
const getMaxDimensions = (latestInformasiMuatan) => {
  let maxLength = 0;
  let maxWidth = 0;
  let maxHeight = 0;

  if (latestInformasiMuatan && latestInformasiMuatan.length > 0) {
    latestInformasiMuatan.forEach((item) => {
      const length = item.dimensiMuatan?.panjang || 0;
      const width = item.dimensiMuatan?.lebar || 0;
      const height = item.dimensiMuatan?.tinggi || 0;
      const unit = item.dimensiMuatan?.unit || "m";

      // Convert to meters if needed
      const conversionFactor = unit === "cm" ? 0.01 : 1; // cm to m

      // Calculate max for each dimension independently
      const convertedLength = length * conversionFactor;
      const convertedWidth = width * conversionFactor;
      const convertedHeight = height * conversionFactor;

      // Update max values independently
      if (convertedLength > maxLength) maxLength = convertedLength;
      if (convertedWidth > maxWidth) maxWidth = convertedWidth;
      if (convertedHeight > maxHeight) maxHeight = convertedHeight;
    });
  }

  return {
    length: maxLength,
    width: maxWidth,
    height: maxHeight,
    dimensionUnit: "m", // Always use meters as per requirement
  };
};

// Get coordinates for origin and destination
const getOriginCoordinates = (lokasiMuat) =>
  lokasiMuat.map((item) => ({
    lat: item?.dataLokasi?.coordinates?.latitude || 0,
    long: item?.dataLokasi?.coordinates?.longitude || 0,
  }));

const getDestinationCoordinates = (lokasiBongkar) =>
  lokasiBongkar.map((item) => ({
    lat: item?.dataLokasi?.coordinates?.latitude,
    long: item?.dataLokasi?.coordinates?.longitude,
  }));

export const normalizeFetchTruck = ({
  orderType,
  loadTimeStart,
  loadTimeEnd,
  showRangeOption,
  lokasiMuat,
  lokasiBongkar,
  informasiMuatan,
  newInformasiMuatan,
  carrierId,
}) => {
  const latestInformasiMuatan = newInformasiMuatan || informasiMuatan;

  // Build the request payload
  const { weight, weightUnit } = calculateTotalWeight(latestInformasiMuatan);
  const dimensions = getMaxDimensions(latestInformasiMuatan);
  const origin = getOriginCoordinates(lokasiMuat);
  const destination = getDestinationCoordinates(lokasiBongkar);
  const loadTime = getLoadTimes(loadTimeStart, showRangeOption, loadTimeEnd);

  return {
    orderType,
    ...loadTime,
    origin,
    destination,
    weight,
    weightUnit,
    dimensions,
    carrierId,
  };
};
