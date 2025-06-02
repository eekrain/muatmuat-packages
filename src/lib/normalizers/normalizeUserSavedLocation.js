export const normalizeUserSavedLocation = (
  data,
  kecamatanList = [],
  postalCodeList = []
) => {
  return {
    location: {
      name: data.Address,
      value: data.PlaceID,
    },
    coordinates: {
      latitude: data.Latitude,
      longitude: data.Longitude,
    },
    district: {
      name: data.District,
      value: data.DistrictID.toString(),
    },
    city: {
      name: data.City,
      value: data.CityID,
    },
    province: {
      name: data.Province,
      value: data.ProvinceID,
    },
    postalCode: {
      name: data.PostalCode,
      value: data.PostalCode,
    },
    kecamatanList,
    postalCodeList,
  };
};
