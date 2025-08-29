import { getLoadTimes } from "@/lib/utils/dateTime";

export const normalizeFleetOrder = (orderType, formValues, calculatedPrice) => {
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    cargoTypeId,
    cargoCategoryId,
    isHalalLogistics,
    informasiMuatan,
    cargoPhotos,
    cargoDescription,
    carrierId,
    truckTypeId,
    truckCount,
    distance,
    // estimatedTime,
    additionalServices,
    deliveryOrderNumbers,
    businessEntity,
    voucherId,
    paymentMethodId,
  } = formValues;
  const loadTime = getLoadTimes(loadTimeStart, showRangeOption, loadTimeEnd);

  const transformedLokasiMuat = lokasiMuat.map((loc, index) => ({
    locationType: "PICKUP",
    sequence: index + 1,
    fullAddress: loc.dataLokasi.location.name,
    detailAddress: loc.detailLokasi,
    latitude: loc.dataLokasi.coordinates.latitude,
    longitude: loc.dataLokasi.coordinates.longitude,
    district: loc.dataLokasi.district.name,
    districtId: loc.dataLokasi.district.value,
    city: loc.dataLokasi.city.name,
    cityId: loc.dataLokasi.city.value,
    province: loc.dataLokasi.province.name,
    provinceId: loc.dataLokasi.province.value,
    postalCode: loc.dataLokasi.postalCode.name,
    picName: loc.namaPIC,
    picPhoneNumber: loc.noHPPIC,
  }));
  const transformedLokasiBongkar = lokasiBongkar.map((loc, index) => ({
    locationType: "DROPOFF",
    sequence: index + 1,
    fullAddress: loc.dataLokasi.location.name,
    detailAddress: loc.detailLokasi,
    latitude: loc.dataLokasi.coordinates.latitude,
    longitude: loc.dataLokasi.coordinates.longitude,
    district: loc.dataLokasi.district.name,
    districtId: loc.dataLokasi.district.value,
    city: loc.dataLokasi.city.name,
    cityId: loc.dataLokasi.city.value,
    province: loc.dataLokasi.province.name,
    provinceId: loc.dataLokasi.province.value,
    postalCode: loc.dataLokasi.postalCode.name,
    picName: loc.namaPIC,
    picPhoneNumber: loc.noHPPIC,
  }));
  return {
    orderType,
    ...loadTime,
    locations: [...transformedLokasiMuat, ...transformedLokasiBongkar],
    cargos: informasiMuatan.map((cargo, index) => ({
      cargoNameId: cargo.namaMuatan.value, // Assuming cargoNameId is a UUID
      customName: cargo.namaMuatan.label,
      weight: cargo.beratMuatan.berat,
      weightUnit: cargo.beratMuatan.unit,
      dimensions: {
        length: cargo.dimensiMuatan.panjang,
        width: cargo.dimensiMuatan.lebar,
        height: cargo.dimensiMuatan.tinggi,
        dimensionUnit: cargo.dimensiMuatan.unit,
      },
      sequence: index + 1,
    })),
    cargoTypeId,
    cargoCategoryId,
    cargoPhotos: cargoPhotos.filter((item) => item !== null),
    cargoDescription,
    isHalalLogistics,
    carrierId,
    truckTypeId,
    truckCount,
    estimatedDistance: distance,
    // estimatedTime,
    additionalServices,
    deliveryOrderNumbers,
    businessEntity,
    voucherId,
    paymentMethodId,
    pricing: {
      ...calculatedPrice,
      additionalServiceFee:
        calculatedPrice.additionalServiceFee?.reduce(
          (sum, item) => sum + item.totalCost,
          0
        ) || 0,
      voucherDiscount: calculatedPrice.voucher,
    },
  };
};
