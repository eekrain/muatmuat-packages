import {
  LocationTypeEnum,
  OrderStatusIcon,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const normalizeDetailPesananOrderDetail = ({
  dataOrderDetail,
  dataOrderStatusHistory,
  dataPayment,
  dataAdditionalServices = [],
  dataAlerts,
  dataCancellationHistory,
  dataLegendStatus,
}) => {
  try {
    const foundDocumentShipping = dataAdditionalServices.find(
      (val) => val.isShipping
    );
    const foundOtherAdditionalService = dataAdditionalServices.filter(
      (val) => !val.isShipping
    );
    const priceCharge = dataOrderDetail.summary?.priceCharge;
    let newPriceCharge = null;

    if (priceCharge?.totalCharge && priceCharge?.totalCharge > 0) {
      newPriceCharge = priceCharge;
    }

    const priceChange = dataOrderDetail.summary?.priceChange;
    let newPriceChange = null;

    if (priceChange?.totalCharge && priceChange?.totalCharge > 0) {
      newPriceChange = priceChange;
    }

    const dataStatusPesanan = {
      orderId: dataOrderDetail.general?.orderId,
      orderCode:
        dataOrderDetail.general?.invoiceNumber ||
        dataOrderDetail.general?.orderCode,
      orderStatus: dataOrderDetail.general?.orderStatus,
      unitFleetStatus: dataOrderDetail.general?.unitFleetStatus || 1,
      driverStatus:
        dataOrderStatusHistory?.driverStatus?.map(
          ({ stepStatus, ...item }) => ({
            ...item,
            stepperData: stepStatus.map((step) => ({
              label: OrderStatusTitle[step.statusCode],
              status: step.statusCode,
              icon: OrderStatusIcon[step.statusCode],
            })),
            activeIndex: stepStatus.findIndex(
              (step) => step.statusCode === item.orderStatus
            ),
          })
        ) || [],
      legendStatus: {
        stepperData: dataLegendStatus?.map((legend) => ({
          label: legend.statusName,
          status: legend.statusCode,
          icon: OrderStatusIcon[legend.statusCode],
        })),
        activeIndex: dataLegendStatus?.findIndex(
          (legend) => legend.statusCode === dataOrderDetail.general?.orderStatus
        ),
      },
      otherStatus: dataOrderDetail?.otherStatus || [],
      withDocumentShipping: Boolean(foundDocumentShipping),
      expiredAt: dataPayment?.payment?.expiryTime,
      expiredAtFromOrderDetail:
        dataOrderDetail.summary?.payment?.paymentDueDateTime,
      alerts: dataAlerts || [],
      cancellationHistory: dataCancellationHistory,
      hasFoundFleet:
        dataOrderStatusHistory?.driverStatus &&
        dataOrderStatusHistory?.driverStatus?.length > 0,
      hasPriceCharge: newPriceCharge && newPriceCharge?.isPaid === false,
      hasPriceChange: Boolean(newPriceChange),
      totalUnit: dataOrderDetail.summary?.truckType?.totalUnit || 1,
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
          cargoId: val.cargoId,
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
      paymentMethodId: dataOrderDetail.summary?.payment?.paymentMethodId,
      paymentLogo: dataOrderDetail.summary?.payment?.paymentLogo,
      vaNumber: dataPayment?.payment?.vaNumber,
      expiredAt: dataPayment?.payment?.expiredAt,
      expiredAtFromOrderDetail:
        dataOrderDetail.summary?.payment?.paymentDueDateTime,
      transportFee: dataOrderDetail.summary?.price?.transportFee,
      insuranceFee: dataOrderDetail.summary?.price?.insuranceFee,
      voucherDiscount: dataOrderDetail.summary?.price?.voucherDiscount,
      adminFee: dataOrderDetail.summary?.price?.adminFee,
      taxAmount: dataOrderDetail.summary?.price?.taxAmount,
      totalPrice: dataOrderDetail.summary?.price?.totalPrice,
      orderStatus: dataOrderDetail.general?.orderStatus,
      totalTruckUnit: dataOrderDetail.summary?.truckType?.totalUnit,
      documentShippingDetail: {
        recipientName: foundDocumentShipping?.addressInformation?.recipientName,
        recipientPhone:
          foundDocumentShipping?.addressInformation?.recipientPhone,
        fullAddress: foundDocumentShipping?.addressInformation?.fullAddress,
        detailAddress: foundDocumentShipping?.addressInformation?.detailAddress,
        district: foundDocumentShipping?.addressInformation?.district,
        city: foundDocumentShipping?.addressInformation?.city,
        province: foundDocumentShipping?.addressInformation?.province,
        postalCode: foundDocumentShipping?.addressInformation?.postalCode,

        courier: foundDocumentShipping?.addressInformation?.courier,
        courierPrice: foundDocumentShipping?.price,
        insurancePrice:
          foundDocumentShipping?.addressInformation?.insurancePrice,
        totalPrice:
          (Number(foundDocumentShipping?.price) || 0) +
          (Number(foundDocumentShipping?.addressInformation?.insurancePrice) ||
            0),
      },
      otherAdditionalService: {
        totalPrice:
          foundOtherAdditionalService.reduce(
            (sum, item) => sum + item.price,
            0
          ) || 0,
      },
      priceCharge: newPriceCharge,
      priceChange: newPriceChange,
    };

    return {
      dataStatusPesanan,
      dataRingkasanPesanan,
      dataDetailPIC,
      dataRingkasanPembayaran,
    };
  } catch (error) {
    console.error(
      "🚀 ~ file: normalizeDetailPesananOrderDetail.js:141 ~ error:",
      error
    );
  }
};
