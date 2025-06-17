import {
  LocationTypeEnum,
  OrderStatusEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { PaymentInstructionTitle } from "@/lib/constants/detailpesanan/payment.enum";

export const normalizeDetailPesananOrderDetail = ({
  general,
  summary,
  otherInformation,
  paymentData,
  documents,
}) => {
  try {
    const dataStatusPesanan = {
      orderCode: general?.invoiceNumber,
      orderStatus: general?.orderStatus,
      withShippingAdditionalService:
        summary?.additionalService && summary?.additionalService.length > 0
          ? true
          : false,
      paymentDueDateTime: summary?.payment?.paymentDueDateTime,
    };

    const route = { muat: [], bongkar: [] };
    const dataDetailPIC = { muat: [], bongkar: [] };

    for (const location of summary?.locations) {
      if (location.locationType === LocationTypeEnum.PICKUP) {
        route.muat.push({
          fullAddress: location.fullAddress,
        });
        dataDetailPIC.muat.push({
          sequence: location?.sequence,
          locationType: location?.locationType,
          fullAddress: location?.fullAddress,
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
          detailAddress: location?.detailAddress,
          picName: location?.picName,
          picPhoneNumber: location?.picPhoneNumber,
        });
      }
    }

    const dataRingkasanPesanan = {
      route,
      estimatedDistance: summary?.distance,
      vehicle: {
        name: `${summary?.carrier?.name} - ${summary?.truckType?.name}`,
        image: "/img/recommended1.png",
        truckCount: summary?.truckType?.totalUnit,
      },
      cargos:
        summary?.cargo.map((val) => ({
          name: val.name,
          weight: val.weight,
          weightUnit: val.weightUnit,
        })) || [],
      cargoPhotos: otherInformation?.cargoPhotos || [],
      cargoDescription: otherInformation?.cargoDescription || "",
      isHalalLogistics: Boolean(summary?.isHalalLogistic),
      loadTimeStart: summary?.loadTimeStart,
      loadTimeEnd: summary?.loadTimeEnd,
      deliveryOrderNumbers: [documents?.doNumber],
    };

    const dataRingkasanPembayaran = {
      paymentMethod: summary?.payment?.paymentMethod,
      vaNumber: paymentData?.vaNumber,
      paymentDueDateTime: summary?.payment?.paymentDueDateTime,
      transportFee: summary?.price?.transportFee,
      insuranceFee: summary?.price?.insuranceFee,
      additionalServiceFee: summary?.price?.additionalServiceFee,
      voucherDiscount: summary?.price?.voucherDiscount,
      adminFee: summary?.price?.adminFee,
      taxAmount: summary?.price?.taxAmount,
      totalPrice: summary?.price?.totalPrice,
      orderStatus: general?.orderStatus,
    };

    let instructionFormatted = null;
    if (
      general?.orderStatus === OrderStatusEnum.PENDING_PAYMENT &&
      paymentData?.paymentInstructions
    ) {
      const temp = Object.keys(paymentData?.paymentInstructions);
      console.log("🚀 ~ temp:", temp);
      instructionFormatted = temp.map((key) => ({
        title: PaymentInstructionTitle[key],
        item: paymentData?.paymentInstructions[key],
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
    console.error("🚀 ~ normalizeDetailPesananOrderDetail ~ error:", error);
  }
};
