export const normalizePostalCodeData = (
  data,
  kecamatanList = [],
  postalCodeList = []
) => {
  return {
    district: {
      name: data.DistrictName,
      value: data.DistrictID,
    },
    city: {
      name: data.CityName,
      value: data.CityID,
    },
    province: {
      name: data.ProvinceName,
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
