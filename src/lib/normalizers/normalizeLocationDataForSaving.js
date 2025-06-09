export const normalizeLocationDataForSaving = (data) => {
  const payload = {};

  payload.Name = data.namaLokasi;
  payload.AddressDetail = data.detailLokasi;
  payload.PicName = data.namaPIC;
  payload.PicNoTelp = data.noHPPIC;
  payload.IsMainAddress = data.isMainAddress ? 1 : 0;

  const dataLokasi = data.dataLokasi;

  payload.Address = dataLokasi.location.name;
  payload.PlaceID = dataLokasi.location.value;

  payload.District = dataLokasi.district.name;
  payload.DistrictID = dataLokasi.district.value;

  payload.City = dataLokasi.city.name;
  payload.CityID = dataLokasi.city.value;

  payload.Province = dataLokasi.province.name;
  payload.ProvinceID = dataLokasi.province.value;

  payload.Latitude = dataLokasi.coordinates.latitude;
  payload.Longitude = dataLokasi.coordinates.longitude;

  payload.PostalCode = dataLokasi.postalCode.value;

  return payload;
};
