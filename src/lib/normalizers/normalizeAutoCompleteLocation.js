export const normalizeAutoCompleteLocation = (data, messageData) => {
  return {
    location: {
      name: data.Title,
      value: data.ID,
    },
    coordinates: {
      latitude: messageData?.lat,
      longitude: messageData?.lng,
    },
  };
};
