export const normalizePostalCodeData = (
  data,
  kecamatanList = [],
  postalCodeList = []
) => {
  const district = {
    name: data.DistrictName,
    value: data.DistrictID.toString(),
  };

  const postalCode = {
    name: data.PostalCode,
    value: data.PostalCode,
  };

  return {
    district,
    city: {
      name: data.CityName,
      value: data.CityID,
    },
    province: {
      name: data.ProvinceName,
      value: data.ProvinceID,
    },
    postalCode,
    kecamatanList: kecamatanList.length > 0 ? kecamatanList : [district],
    postalCodeList: postalCodeList.length > 0 ? postalCodeList : [postalCode],
  };
};
