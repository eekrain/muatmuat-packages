export const normalizeAutoCompleteNotFound = (data, dataNotFound) => {
  return {
    location: {
      name: data.Title,
      value: data.ID,
    },
    coordinates: dataNotFound?.lat
      ? {
          latitude: dataNotFound?.lat,
          longitude: dataNotFound?.lng,
        }
      : dataNotFound?.Data?.lat
        ? {
            latitude: dataNotFound?.Data?.lat,
            longitude: dataNotFound?.Data?.lng,
          }
        : null,
  };
};
