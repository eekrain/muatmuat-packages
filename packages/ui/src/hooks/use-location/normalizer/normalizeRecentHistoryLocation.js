export const normalizeRecentHistoryLocation = (
  data,
  kecamatanList = [],
  postalCodeList = []
) => {
  const district = {
    name: data.DistrictDescription,
    value: data?.DistrictID?.toString?.(),
  };

  const postalCode = {
    name: data.PostalCode,
    value: data.PostalCode,
  };

  return {
    location: {
      name: data.pencarian,
      value: null,
    },
    coordinates: {
      latitude: data.Latitude,
      longitude: data.Longitude,
    },
    district,
    city: {
      name: data?.CityDescription,
      value: data?.CityID,
    },
    province: {
      name: data?.ProvinceDescription,
      value: data?.ProvinceID,
    },
    postalCode,
    kecamatanList: kecamatanList.length > 0 ? kecamatanList : [district],
    postalCodeList: postalCodeList.length > 0 ? postalCodeList : [postalCode],
  };
};
