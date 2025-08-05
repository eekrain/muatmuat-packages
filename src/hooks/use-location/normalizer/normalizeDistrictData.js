export const normalizeDistrictData = (data) => {
  const district = data.Districts[0];
  const location = data.CompleteLocation;

  const newDistrict = {
    name: district.District,
    value: district.DistrictID.toString(),
  };

  const newCity = {
    name: location.city,
    value: location.cityid,
  };

  const newProvince = {
    name: location.province,
    value: location.provinceid,
  };

  const newKecamatanList = district.DistrictList.map((item) => ({
    value: item.DistrictID,
    name: item.District,
  }));

  const newPostalCodeList = district.PostalCodes.map((item) => ({
    value: item.PostalCode,
    name: item.PostalCode,
  }));

  const findPostalCode = district.PostalCodes.find(
    (item) => item.PostalCode === location.postal
  );

  if (!findPostalCode && location.postal) {
    newPostalCodeList.push({
      value: location.postal,
      name: location.postal,
    });
  }

  const newPostalCode = findPostalCode
    ? {
        name: findPostalCode.PostalCode,
        value: findPostalCode.PostalCode,
      }
    : {
        name: location.postal,
        value: location.postal,
      };

  const newCoordinates = {
    latitude: data.Lat,
    longitude: data.Long,
  };

  return {
    district: newDistrict,
    city: newCity,
    province: newProvince,
    kecamatanList: newKecamatanList,
    postalCodeList: newPostalCodeList,
    postalCode: newPostalCode,
    coordinates: newCoordinates,
  };
};
