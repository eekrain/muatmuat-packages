import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import {
  normalizeAutoCompleteNotFound,
  normalizeDistrictData,
  normalizeLocationByLatLong,
} from "@/lib/normalizers/location";

const getLocationByLatLong = async (coordinates) => {
  const res1 = await fetcherMuatparts.post("/v1/location_by_lat_long", {
    Lat: coordinates.latitude,
    Long: coordinates.longitude,
  });
  const getLocation = res1.data.Data;

  const res2 = await fetcherMuatparts.post(
    "v1/district_by_token",
    new URLSearchParams({ placeId: getLocation.place_id })
  );
  const getDistrict = res2.data.Data;

  let result;
  if (getDistrict.Districts?.[0]) {
    result = {
      ...normalizeDistrictData(getDistrict),
      ...normalizeLocationByLatLong(getLocation, coordinates),
    };
  } else {
    result = normalizeLocationByLatLong(getLocation, coordinates);
    if (getLocation?.postal) {
      result = {
        ...result,
        postalCode: {
          name: getLocation.postal,
          value: getLocation.postal,
        },
      };
    }
  }

  return result;
};

const getLocationByPlaceId = async (location) => {
  const res = await fetcherMuatparts.post(
    "v1/district_by_token",
    new URLSearchParams({ placeId: location.ID })
  );
  const dataDistrict = res.data.Data;
  const dataNotFound = res.data?.Data?.Message;

  let result;
  if (dataDistrict?.Districts?.[0]) {
    result = {
      ...normalizeDistrictData(dataDistrict),
      location: { name: location.Title, value: location.ID },
    };
  } else if (dataNotFound) {
    const temp = normalizeAutoCompleteNotFound(location, dataNotFound);
    const getDetailedLocation = await getLocationByLatLong(temp.coordinates);
    result = {
      ...getDetailedLocation,
      location: { name: temp.location.name, value: temp.location.value },
    };
  }

  return result;
};

const saveRecentSearchedLocation = async (result) =>
  fetcherMuatrans
    .post("v1/orders/save-search-location", {
      q: result.location.name,
      Latitude: result.coordinates.latitude,
      Longitude: result.coordinates.longitude,
      Province: result.province.name,
      ProvinceID: result.province.value,
      City: result.city.name,
      CityID: result.city.value,
      District: result.district.name,
      DistrictID: result.district.value,
      PostalCode: result.postalCode.value,
    })
    .catch((err) => {
      console.warn("Failed to save recently searched location:", err.message);
    });

export const fetcher = {
  getLocationByLatLong,
  getLocationByPlaceId,
  saveRecentSearchedLocation,
};
