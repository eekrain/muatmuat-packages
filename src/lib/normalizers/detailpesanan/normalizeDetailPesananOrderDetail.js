import {
  LocationTypeEnum,
  OrderStatusIcon,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const normalizeDetailPesananOrderDetail = ({
  dataOrderDetail,
  dataOrderStatusHistory,
  dataPayment,
  dataAdditionalServices = [],
  dataAlerts,
}) => {
  try {
    const foundDocumentShipping = dataAdditionalServices.find(
      (val) => val.isShipping
    );
    const foundOtherAdditionalService = dataAdditionalServices.find(
      (val) => !val.isShipping
    );

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
        stepper:
          dataOrderStatusHistory?.statusHistory?.map((val) => ({
            label: val.statusName,
            status: val.statusCode,
            icon: OrderStatusIcon[val.statusCode],
          })) || [],
        activeIndex: dataOrderStatusHistory?.statusHistory?.findIndex(
          (val) => val.statusCode === dataOrderDetail.general?.orderStatus
        ),
      },
      withDocumentShipping: Boolean(foundDocumentShipping),
      expiredAt: dataPayment?.payment?.expiredAt,
      driverStatus: dataOrderStatusHistory?.driverStatus,
      alerts: dataAlerts?.alerts || [],
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
      paymentMethod: dataPayment?.payment?.method,
      vaNumber: dataPayment?.payment?.vaNumber,
      expiredAt: dataPayment?.payment?.expiredAt,
      transportFee: dataOrderDetail.summary?.price?.transportFee,
      insuranceFee: dataOrderDetail.summary?.price?.insuranceFee,
      voucherDiscount: dataOrderDetail.summary?.price?.voucherDiscount,
      adminFee: dataOrderDetail.summary?.price?.adminFee,
      taxAmount: dataOrderDetail.summary?.price?.taxAmount,
      totalPrice: dataOrderDetail.summary?.price?.totalPrice,
      orderStatus: dataOrderDetail.general?.orderStatus,
      documentShippingDetail: {
        recipientName: foundDocumentShipping?.recipientName,
        recipientPhone: foundDocumentShipping?.recipientPhone,
        fullAddress: foundDocumentShipping?.addressInformation?.fullAddress,
        detailAddress: foundDocumentShipping?.addressInformation?.detailAddress,
        district: foundDocumentShipping?.addressInformation?.district,
        city: foundDocumentShipping?.addressInformation?.city,
        province: foundDocumentShipping?.addressInformation?.province,
        postalCode: foundDocumentShipping?.addressInformation?.postalCode,

        courier: foundDocumentShipping?.courier,
        courierPrice: foundDocumentShipping?.courierPrice,
        insurancePrice: foundDocumentShipping?.insurancePrice,
        totalPrice:
          (Number(foundDocumentShipping?.courierPrice) || 0) +
          (Number(foundDocumentShipping?.insurancePrice) || 0),
      },
      otherAdditionalService: {
        totalPrice: foundOtherAdditionalService?.courierPrice,
      },
    };

    return {
      dataStatusPesanan,
      dataRingkasanPesanan,
      dataDetailPIC,
      dataRingkasanPembayaran,
    };
  } catch (error) {}
};
