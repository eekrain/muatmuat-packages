export const normalizeUserSavedLocation = (
  data,
  kecamatanList = [],
  postalCodeList = []
) => {
  const district = {
    name: data.District,
    value: data.DistrictID.toString(),
  };

  const postalCode = {
    name: data.PostalCode,
    value: data.PostalCode,
  };

  return {
    location: {
      name: data.Address,
      value: data.PlaceID,
    },
    coordinates: {
      latitude: data.Latitude,
      longitude: data.Longitude,
    },
    district,
    city: {
      name: data.City,
      value: data.CityID,
    },
    province: {
      name: data.Province,
      value: data.ProvinceID,
    },
    postalCode,
    kecamatanList: kecamatanList.length > 0 ? kecamatanList : [district],
    postalCodeList: postalCodeList.length > 0 ? postalCodeList : [postalCode],
  };
};
