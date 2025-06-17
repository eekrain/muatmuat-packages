export const normalizeLocationByLatLong = (data, coords) => {
  return {
    location: {
      name: data.formatted_address,
      value: data.place_id,
    },
    coordinates: {
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
  };
};
