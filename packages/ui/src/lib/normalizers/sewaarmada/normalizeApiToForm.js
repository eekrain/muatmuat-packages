// Filter into pickup and dropoff arrays then sort by sequence
export const normalizeLocations = (locations, type) => {
  return locations
    .filter((location) => location.locationType === type)
    .sort((a, b) => a.sequence - b.sequence)
    .map((location) => ({
      locationId: location.locationId, // Preserve locationId from API
      namaLokasi: "",
      dataLokasi: {
        district: {
          name: location.district,
          value: location.districtId,
        },
        city: {
          name: location.city,
          value: location.cityId,
        },
        province: {
          name: location.province,
          value: location.provinceId,
        },
        kecamatanList: [],
        postalCodeList: [],
        postalCode: {
          name: location.postalCode,
          value: null,
        },
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        location: {
          name: location.fullAddress,
          value: null,
        },
      },
      detailLokasi: location.detailAddress,
      namaPIC: location.picName,
      noHPPIC: location.picPhoneNumber,
      isMainAddress: false,
    }));
};

export const normalizeCargos = (cargos) =>
  cargos.map((item) => ({
    beratMuatan: {
      berat: item.weight,
      unit: item.weightUnit,
    },
    dimensiMuatan: {
      panjang: item.dimensions.length,
      lebar: item.dimensions.width,
      tinggi: item.dimensions.height,
      unit: item.dimensions.unit,
    },
    namaMuatan: {
      label: item.name || item.cargoName,
      value: item.cargoId || item.cargoNameId,
    },
  }));

export const normalizeAdditionalServices = (
  additionalServices,
  tempShippingOptions
) =>
  additionalServices.map((item) => {
    if (!item.isShipping) {
      return {
        serviceId: item.serviceId,
        withShipping: item.isShipping,
      };
    }
    const shippingOption = tempShippingOptions
      .flatMap((option) => option.expeditions)
      .find(
        (courier) => courier.id === item.addressInformation.shippingOptionId
      );

    return {
      serviceId: item.serviceId,
      withShipping: item.isShipping,
      shippingCost: shippingOption.originalCost,
      shippingDetails: {
        recipientName: item.addressInformation.recipientName,
        recipientPhone: item.addressInformation.recipientPhone,
        destinationAddress: item.addressInformation.fullAddress,
        detailAddress: item.addressInformation.detailAddress,
        district: item.addressInformation.district,
        city: item.addressInformation.city,
        province: item.addressInformation.province,
        postalCode: item.addressInformation.postalCode,
        shippingOptionId: item.addressInformation.shippingOptionId,
        withInsurance: item.addressInformation.insuranceCost > 0,
        insuranceCost: item.addressInformation.insuranceCost,
        latitude: item.addressInformation.latitude,
        longitude: item.addressInformation.longitude,
      },
    };
  });
