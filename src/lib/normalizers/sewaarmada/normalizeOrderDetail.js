import {
  normalizeAdditionalServices,
  normalizeCargos,
  normalizeLocations,
} from "@/lib/normalizers/sewaarmada/normalizeApiToForm";
import { defaultValues } from "@/store/Shipper/forms/sewaArmadaStore";

export const normalizeOrderDetail = (
  orderDetail,
  reorderFleet,
  tempShippingOptions
) => {
  const { summary, otherInformation, businessEntity } = orderDetail;
  const {
    loadTimeStart,
    loadTimeEnd,
    locations,
    cargo,
    carrier,
    truckType,
    isHalalLogistic,
    distance,
  } = summary;
  const cargoPhotos = otherInformation.cargoPhotos || [];

  return {
    ...defaultValues,
    loadTimeStart,
    ...(loadTimeEnd && { loadTimeEnd, showRangeOption: true }),
    lokasiMuat: normalizeLocations(locations, "PICKUP"),
    lokasiBongkar: normalizeLocations(locations, "DROPOFF"),
    cargoTypeId: reorderFleet.otherInformation.cargoTypeId,
    cargoCategoryId: reorderFleet.otherInformation.cargoCategoryId,
    isHalalLogistics: isHalalLogistic,
    informasiMuatan: normalizeCargos(cargo),
    cargoPhotos: cargoPhotos.concat(Array(4 - cargoPhotos.length).fill(null)),
    cargoDescription: otherInformation.cargoDescription,
    carrierId: carrier.carrierId,
    truckTypeId: truckType.truckTypeId,
    truckCount: truckType.totalUnit,
    distance,
    distanceUnit: "km",
    additionalServices: normalizeAdditionalServices(
      reorderFleet.additionalService,
      tempShippingOptions
    ),
    tempShippingOptions,
    deliveryOrderNumbers: otherInformation.numberDeliveryOrder,
    businessEntity,
  };
};
