// Data didapat dari:
//  /api/v1/orders/{orderId}/fleet-search-detail
//  /api/v1/orders/{orderId}/summary
// Di normalize supaya bisa langsung dipakai di props component
import { LocationTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

// Kita passing hasil dari API dataFleetSearchDetail dan dataSummary
// Proses merging / normaliasi terjadi di sini
export const normalizeDetailPesananOrderDetail = ({
  dataOrderDetail,
  dataPaymentCountdown,
  dataFleetSearchDetail,
}) => {
  try {
    const dataStatusPesanan = {
      orderCode: dataOrderDetail?.invoiceNumber,
      orderStatus: dataOrderDetail?.orderStatus,
      withShippingAdditionalService:
        dataOrderDetail?.additionalServices &&
        dataOrderDetail?.additionalServices.length > 0
          ? true
          : false,
      paymentDueDateTime: dataPaymentCountdown?.paymentDueDateTime,
    };

    const route = { muat: [], bongkar: [] };
    const dataDetailPIC = { muat: [], bongkar: [] };

    for (const location of dataOrderDetail?.locations) {
      if (location.locationType === LocationTypeEnum.PICKUP) {
        route.muat.push({
          fullAddress: location.fullAddress,
        });
        dataDetailPIC.muat.push({
          sequence: location?.sequence,
          locationType: location?.locationType,
          fullAddress: location?.fullAddress,
          // Di API tidak ada note, jadi diisi dengan dummy data
          detailAddress: location?.detailAddress,
          picName: location?.picName,
          picPhoneNumber: location?.picPhoneNumber,
        });
      } else if (location.locationType === LocationTypeEnum.DROPOFF) {
        route.bongkar.push({
          fullAddress: location.fullAddress,
        });
        dataDetailPIC.bongkar.push({
          sequence: location?.sequence,
          locationType: location?.locationType,
          fullAddress: location?.fullAddress,
          // Di API tidak ada note, jadi diisi dengan dummy data
          detailAddress: location?.detailAddress,
          picName: location?.picName,
          picPhoneNumber: location?.picPhoneNumber,
        });
      }
    }

    const dataRingkasanPesanan = {
      route,
      estimatedDistance: dataOrderDetail?.summary?.estimatedDistance,
      vehicle: {
        name: `${dataOrderDetail?.carrier?.name} - ${dataOrderDetail?.truckType?.name}`,
        image: "/img/recommended1.png",
        truckCount: dataOrderDetail?.truckCount,
      },
      cargos:
        dataOrderDetail?.cargo.map((val) => ({
          name: val.name,
          weight: val.weight,
          weightUnit: val.weightUnit,
        })) || [],
      cargoPhotos: dataFleetSearchDetail?.cargoPhotos || [],
      cargoDescription: dataOrderDetail?.cargoDescription || "",
      isHalalLogistics: Boolean(dataOrderDetail?.isHalalLogistics),
      loadTimeStart: dataOrderDetail?.loadTimeStart,
      loadTimeEnd: dataOrderDetail?.loadTimeEnd,
      deliveryOrderNumbers: dataOrderDetail?.documents.map(
        (item) => item.doNumber
      ),
    };

    const dataRingkasanPembayaran = {
      paymentMethod: dataOrderDetail?.paymentMethod,
      paymentDueDateTime: dataOrderDetail?.paymentDueDateTime,
      transportFee: dataOrderDetail?.transportFee,
      insuranceFee: dataOrderDetail?.insuranceFee,
      additionalServiceFee: dataOrderDetail?.additionalServiceFee,
      voucherDiscount: dataOrderDetail?.voucherDiscount,
      adminFee: dataOrderDetail?.adminFee,
      taxAmount: dataOrderDetail?.taxAmount,
      totalPrice: dataOrderDetail?.totalPrice,
      orderStatus: dataOrderDetail?.orderStatus,
    };

    return {
      dataStatusPesanan,
      dataRingkasanPesanan,
      dataDetailPIC,
      dataRingkasanPembayaran,
    };
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};
