// Data didapat dari:
//  /api/v1/orders/{orderId}/fleet-search-detail
//  /api/v1/orders/{orderId}/summary
// Di normalize supaya bisa langsung dipakai di props component
import {
  LocationTypeEnum,
  OrderStatusEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { PaymentInstructionTitle } from "@/lib/constants/detailpesanan/payment.enum";

// Kita passing hasil dari API dataFleetSearchDetail dan dataSummary
// Proses merging / normaliasi terjadi di sini
export const normalizeDetailPesananOrderDetail = ({
  dataFleetSearchDetail,
  dataOrderDetail,
  dataPaymentStatus,
  dataPaymentCountdown,
  dataPaymentInstruction,
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
      vaNumber: dataPaymentStatus?.vaNumber,
      paymentDueDateTime: dataPaymentCountdown?.paymentDueDateTime,
      transportFee: dataOrderDetail?.transportFee,
      insuranceFee: dataOrderDetail?.insuranceFee,
      additionalServiceFee: dataOrderDetail?.additionalServiceFee,
      voucherDiscount: dataOrderDetail?.voucherDiscount,
      adminFee: dataOrderDetail?.adminFee,
      taxAmount: dataOrderDetail?.taxAmount,
      totalPrice: dataOrderDetail?.totalPrice,
      orderStatus: dataOrderDetail?.orderStatus,
    };

    let instructionFormatted = null;
    if (
      dataOrderDetail?.orderStatus === OrderStatusEnum.PENDING_PAYMENT &&
      dataPaymentInstruction?.paymentInstructions
    ) {
      const temp = Object.keys(dataPaymentInstruction?.paymentInstructions);
      console.log("🚀 ~ temp:", temp);
      instructionFormatted = temp.map((key) => ({
        title: PaymentInstructionTitle[key],
        item: dataPaymentInstruction?.paymentInstructions[key],
      }));
    }

    return {
      dataStatusPesanan,
      dataRingkasanPesanan,
      dataDetailPIC,
      dataRingkasanPembayaran,
      dataPaymentInstruction: instructionFormatted,
    };
  } catch (error) {
    console.error("🚀 ~ error:", error);
  }
};
