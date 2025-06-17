import { fetcherMuatparts } from "@/lib/axios";
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
  console.log("🚀 ~ getLocationByLatLong ~ getLocation:", getLocation);

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
  console.log("🚀 ~ getLocationByPlaceId ~ location:", location);
  const res = await fetcherMuatparts.post(
    "v1/district_by_token",
    new URLSearchParams({ placeId: location.ID })
  );
  console.log("🚀 ~ getLocationByPlaceId ~ res:", res);
  const dataDistrict = res.data.Data;
  const dataNotFound = res.data?.Data?.Message?.Data;

  let result;
  if (dataDistrict?.Districts?.[0]) {
    result = {
      ...normalizeDistrictData(dataDistrict),
      location: { name: location.Title, value: location.ID },
    };
  } else if (dataNotFound) {
    const temp = normalizeAutoCompleteNotFound(location, dataNotFound);
    console.log("🚀 ~ getLocationByPlaceId ~ temp:", temp);
    const getDetailedLocation = await getLocationByLatLong(temp.coordinates);
    result = {
      ...getDetailedLocation,
      location: { name: temp.location.name, value: temp.location.value },
    };
    console.log("🚀 ~ getLocationByPlaceId ~ result:", result);
  }

  return result;
};

export const fetcher = {
  getLocationByLatLong,
  getLocationByPlaceId,
};
