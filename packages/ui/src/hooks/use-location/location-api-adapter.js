import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";

import {
  normalizeAutoCompleteNotFound,
  normalizeDistrictData,
  normalizeLocationByLatLong,
  normalizeLocationDataForSaving,
} from "./normalizer";

const LocationApiAdapter = {
  useGetAutoCompleteLocation: () =>
    useSWRMutation("v1/autocompleteStreet", async (url, { arg }) => {
      const res = await fetcherMuatparts.post(url, arg);
      return res.data?.slice(0, 3) || [];
    }),

  useGetAutoCompleteByPostalCode: () =>
    useSWRMutation("v1/autocompleteStreetLocal", async (url, { arg }) => {
      const res = await fetcherMuatparts.post(url, arg);
      return res.data?.Data?.data?.Data || [];
    }),

  getLocationByLatLong: async (coordinates) => {
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
  },

  getLocationByPlaceId: async (location) => {
    const res = await fetcherMuatparts.post(
      "v1/district_by_token",
      new URLSearchParams({ placeId: location.ID })
    );
    const dataDistrict = res.data.Data;
    const dataNotFound = normalizeAutoCompleteNotFound(
      location,
      res.data?.Data?.Message
    );

    let result;
    if (dataDistrict?.Districts?.[0]) {
      result = {
        ...normalizeDistrictData(dataDistrict),
        location: { name: location.Title, value: location.ID },
      };
    } else if (dataNotFound?.coordinates) {
      const getDetailedLocation = await LocationApiAdapter.getLocationByLatLong(
        dataNotFound.coordinates
      );
      result = {
        ...getDetailedLocation,
        location: {
          name: dataNotFound.location.name,
          value: dataNotFound.location.value,
        },
      };
    }

    return result;
  },

  useGetUserSavedLocation: () =>
    useSWR("v1/muatparts/profile/location", async (url) => {
      const res = await fetcherMuatparts.get(url);
      return res.data.Data || [];
    }),

  useGetUserLocationHistory: (historyLocationType) =>
    useSWR(
      historyLocationType
        ? `v1/orders/history-locations?locationType=${historyLocationType}`
        : null,
      async (url) => {
        if (!url) {
          return {
            userRecentSearchedLocation: [],
            userRecentTransactionLocation: [],
          };
        }

        const res = await fetcherMuatrans.get(url);
        return {
          userRecentSearchedLocation: res.data.Data?.TerakhirDicari || [],
          userRecentTransactionLocation: res.data.Data?.TransaksiTerakhir || [],
        };
      }
    ),

  saveRecentSearchedLocation: async (result) =>
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
        // eslint-disable-next-line no-console
        console.warn("Failed to save recently searched location:", err.message);
      }),

  saveUserLocation: async (formValues) =>
    fetcherMuatparts.post("v1/muatparts/profile/location", {
      param: normalizeLocationDataForSaving(formValues),
    }),

  updateUserLocation: async (formValues, IDtoUpdate) =>
    fetcherMuatparts.put("v1/muatparts/profile/location", {
      param: {
        ...normalizeLocationDataForSaving(formValues),
        ID: IDtoUpdate,
      },
    }),
};

export default LocationApiAdapter;
