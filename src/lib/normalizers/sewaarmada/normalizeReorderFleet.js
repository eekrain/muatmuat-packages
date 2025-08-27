import {
  normalizeAdditionalServices,
  normalizeCargos,
  normalizeLocations,
} from "@/lib/normalizers/sewaarmada/normalizeApiToForm";

import { defaultValues } from "@/store/Shipper/forms/sewaArmadaStore";

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

  return {
    ...defaultValues,
    lokasiMuat: normalizeLocations(locations, "PICKUP"),
    lokasiBongkar: normalizeLocations(locations, "DROPOFF"),
    cargoTypeId: otherInformation.cargoTypeId,
    cargoCategoryId: otherInformation.cargoCategoryId,
    isHalalLogistics: otherInformation.isHalalLogistics,
    informasiMuatan: normalizeCargos(cargos),
    cargoPhotos: cargoPhotos.concat(Array(4 - cargoPhotos.length).fill(null)),
    cargoDescription: otherInformation.cargoDescription,
    additionalServices: normalizeAdditionalServices(
      additionalService,
      tempShippingOptions
    ),
    tempShippingOptions,
    deliveryOrderNumbers: otherInformation.numberDeliveryOrder,
    businessEntity: {
      isBusinessEntity: businessEntity.isBusinessEntity,
      name: businessEntity.name,
      taxId: businessEntity.npwp,
    },
  };
};
