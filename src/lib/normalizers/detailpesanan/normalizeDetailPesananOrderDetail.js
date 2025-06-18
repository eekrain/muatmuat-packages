import {
  LocationTypeEnum,
  OrderStatusEnum,
  OrderStatusIcon,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { PaymentInstructionTitle } from "@/lib/constants/detailpesanan/payment.enum";

export const normalizeDetailPesananOrderDetail = ({
  dataOrderDetail,
  dataOrderStatusHistory,
}) => {
  try {
    const dataStatusPesanan = {
      orderId: dataOrderDetail.general?.orderId,
      orderCode:
        dataOrderDetail.general?.invoiceNumber ||
        dataOrderDetail.general?.orderCode,
      orderStatus: dataOrderDetail.general?.orderStatus,
      orderStatusTitle: dataOrderStatusHistory?.statusHistory?.find(
        (val) => val.statusCode === dataOrderDetail.general?.orderStatus
      )?.statusName,
      statusHistory: {
        stepper: dataOrderStatusHistory?.statusHistory?.map((val) => ({
          label: val.statusName,
          status: val.statusCode,
          icon: OrderStatusIcon[val.statusCode],
        })),
        activeIndex: dataOrderStatusHistory?.statusHistory?.findIndex(
          (val) => val.statusCode === dataOrderDetail.general?.orderStatus
        ),
      },
      withShippingAdditionalService:
        dataOrderDetail.summary?.additionalService &&
        dataOrderDetail.summary?.additionalService.length > 0
          ? true
          : false,
      paymentDueDateTime: dataOrderDetail.summary?.payment?.paymentDueDateTime,
      driverStatus: dataOrderStatusHistory?.driverStatus,
    };

    const route = { muat: [], bongkar: [] };
    const dataDetailPIC = { muat: [], bongkar: [] };

    for (const location of dataOrderDetail.summary?.locations) {
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
      estimatedDistance: dataOrderDetail.summary?.distance,
      vehicle: {
        name: `${dataOrderDetail.summary?.carrier?.name} - ${dataOrderDetail.summary?.truckType?.name}`,
        image: "/img/recommended1.png",
        truckCount: dataOrderDetail.summary?.truckType?.totalUnit,
      },
      cargos:
        dataOrderDetail.summary?.cargo.map((val) => ({
          name: val.name,
          weight: val.weight,
          weightUnit: val.weightUnit,
        })) || [],
      cargoPhotos: dataOrderDetail.otherInformation?.cargoPhotos || [],
      cargoDescription:
        dataOrderDetail.otherInformation?.cargoDescription || "",
      isHalalLogistics: Boolean(dataOrderDetail.summary?.isHalalLogistic),
      loadTimeStart: dataOrderDetail.summary?.loadTimeStart,
      loadTimeEnd: dataOrderDetail.summary?.loadTimeEnd,
      numberDeliveryOrder:
        dataOrderDetail.otherInformation?.numberDeliveryOrder || [],
    };

    const dataRingkasanPembayaran = {
      paymentMethod: dataOrderDetail.summary?.payment?.paymentMethod,
      vaNumber: dataOrderDetail.paymentData?.vaNumber,
      paymentDueDateTime: dataOrderDetail.summary?.payment?.paymentDueDateTime,
      transportFee: dataOrderDetail.summary?.price?.transportFee,
      insuranceFee: dataOrderDetail.summary?.price?.insuranceFee,
      additionalServiceFee:
        dataOrderDetail.summary?.price?.additionalServiceFee,
      voucherDiscount: dataOrderDetail.summary?.price?.voucherDiscount,
      adminFee: dataOrderDetail.summary?.price?.adminFee,
      taxAmount: dataOrderDetail.summary?.price?.taxAmount,
      totalPrice: dataOrderDetail.summary?.price?.totalPrice,
      orderStatus: dataOrderDetail.general?.orderStatus,
    };

    let instructionFormatted = null;
    if (
      dataOrderDetail.general?.orderStatus ===
        OrderStatusEnum.PENDING_PAYMENT &&
      dataOrderDetail.paymentData?.paymentInstructions
    ) {
      const temp = Object.keys(
        dataOrderDetail.paymentData?.paymentInstructions
      );
      console.log("🚀 ~ temp:", temp);
      instructionFormatted = temp.map((key) => ({
        title: PaymentInstructionTitle[key],
        item: dataOrderDetail.paymentData?.paymentInstructions[key],
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
