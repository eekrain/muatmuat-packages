import { defaultValues } from "@/store/Shipper/forms/sewaArmadaStore";

const normalizeLocation = (location) => {
  return {
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
  };
};

export const normalizeReorderFleet = (
  reorderFleetData,
  tempShippingOptions
) => {
  const {
    locations,
    cargos,
    otherInformation,
    additionalService,
    businessEntity,
  } = reorderFleetData;
  const cargoPhotos = otherInformation.cargoPhotos || [];
  // Filter into pickup and dropoff arrays then sort by sequence
  const pickupLocations = locations
    .filter((location) => location.locationType === "PICKUP")
    .sort((a, b) => a.sequence - b.sequence);
  const dropoffLocations = locations
    .filter((location) => location.locationType === "DROPOFF")
    .sort((a, b) => a.sequence - b.sequence);

  return {
    ...defaultValues,
    lokasiMuat: pickupLocations.map((item) => normalizeLocation(item)),
    lokasiBongkar: dropoffLocations.map((item) => normalizeLocation(item)),
    cargoTypeId: otherInformation.cargoTypeId,
    cargoCategoryId: otherInformation.cargoCategoryId,
    isHalalLogistics: otherInformation.isHalalLogistics,
    informasiMuatan: cargos.map((item) => ({
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
        label: item.cargoName,
        value: item.cargoNameId,
      },
    })),
    cargoPhotos: cargoPhotos.concat(Array(4 - cargoPhotos.length).fill(null)),
    cargoDescription: otherInformation.cargoDescription,
    additionalServices: additionalService.map((item) => {
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
        ...(item.isShipping && {
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
        }),
      };
    }),
    tempShippingOptions,
    deliveryOrderNumbers: otherInformation.numberDeliveryOrder,
    businessEntity: {
      isBusinessEntity: businessEntity.isBusinessEntity,
      name: businessEntity.name,
      taxId: businessEntity.npwp,
    },
  };
};
