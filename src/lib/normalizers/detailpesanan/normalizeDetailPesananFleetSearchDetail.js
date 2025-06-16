// Data didapat dari:
//  /api/v1/orders/{orderId}/fleet-search-detail
//  /api/v1/orders/{orderId}/summary
// Di normalize supaya bisa langsung dipakai di props component
import { LocationTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

// Kita passing hasil dari API dataFleetSearchDetail dan dataSummary
// Proses merging / normaliasi terjadi di sini
export const normalizeDetailPesananFleetSearchDetail = ({
  dataFleetSearchDetail,
  dataPaymentStatus,
}) => {
  try {
    console.log("🚀 ~ dataFleetSearchDetail:", dataFleetSearchDetail);
    const dataStatusPesanan = {
      orderCode: dataFleetSearchDetail?.orderCode,
      orderStatus: dataFleetSearchDetail?.orderStatus,
      withShippingAdditionalService:
        dataFleetSearchDetail?.additionalServices &&
        dataFleetSearchDetail?.additionalServices.length > 0
          ? true
          : false,
    };

    const route = { muat: [], bongkar: [] };
    const dataDetailPIC = { muat: [], bongkar: [] };

    for (const location of dataFleetSearchDetail?.locations) {
      if (location.locationType === LocationTypeEnum.PICKUP) {
        route.muat.push({
          fullAddress: location.fullAddress,
        });
        dataDetailPIC.muat.push({
          key: `${dataFleetSearchDetail?.locationType}-${location?.sequence}`,
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
          key: `${dataFleetSearchDetail?.locationType}-${location?.sequence}`,
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
      estimatedDistance: dataFleetSearchDetail?.summary?.estimatedDistance,
      vehicle: {
        name: `${dataFleetSearchDetail?.vehicle?.carrierName} - ${dataFleetSearchDetail?.vehicle?.truckTypeName}`,
        image: "/img/recommended1.png",
        truckCount: dataFleetSearchDetail?.summary?.truckCount,
      },
      cargos: dataFleetSearchDetail?.cargos || [],
      cargoPhotos: dataFleetSearchDetail?.cargoPhotos || [],
      cargoDescription:
        "Jenis karet yang dimuat adalah karet alam (natural rubber) dengan tingkat kekeringan 95% dan kandungan kotoran kurang dari 1%. Karet ini akan digunakan untuk keperluan industri seperti pembuatan ban, alas lantai, dan produk karet lainnya. Kondisi muatan harus dijaga dalam suhu ruangan yang stabil, tidak boleh terkena sinar matahari langsung, dan dihindari dari kontak dengan air untuk menjaga kualitas karet mentah selama pengiriman.",
      isHalalLogistics: Boolean(dataFleetSearchDetail?.isHalalLogistics),
      loadTimeStart: dataFleetSearchDetail?.summary?.loadTimeStart,
      loadTimeEnd: dataFleetSearchDetail?.summary?.loadTimeEnd,
      deliveryOrderNumbers:
        dataFleetSearchDetail?.documdeliveryOrderNumbers || [],
    };

    const dataRingkasanPembayaran = {
      paymentMethod: dataFleetSearchDetail?.paymentMethod,
      paymentDueDateTime: dataFleetSearchDetail?.paymentDueDateTime,
      vaNumber: dataPaymentStatus?.vaNumber,
      transportFee: dataFleetSearchDetail?.pricing?.transportFee,
      insuranceFee: dataFleetSearchDetail?.pricing?.insuranceFee,
      additionalServiceFee:
        dataFleetSearchDetail?.pricing?.additionalServiceFee,
      voucherDiscount: dataFleetSearchDetail?.pricing?.voucherDiscount,
      adminFee: dataFleetSearchDetail?.pricing?.adminFee,
      taxAmount: dataFleetSearchDetail?.pricing?.taxAmount,
      totalPrice: dataFleetSearchDetail?.pricing?.totalPrice,
      orderStatus: dataFleetSearchDetail?.orderStatus,
    };
    const additionalServiceData =
      dataFleetSearchDetail?.additionalServices?.find((item) =>
        Boolean(item.documentShipping)
      );

    if (additionalServiceData) {
      dataRingkasanPembayaran.additionalServiceDetail = {
        recipientName: additionalServiceData?.documentShipping?.recipientName,
        recipientPhone:
          additionalServiceData?.documentShipping?.recipientPhoneNumber,
        destinationAddress:
          additionalServiceData?.documentShipping?.destinationAddress,
        detailDestinationAddress: "Rumah pagar coklat",
        district: "Tegalsari",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "60261",
        shippingOption: additionalServiceData?.documentShipping?.shippingOption,
        shippingCost: additionalServiceData?.documentShipping?.shippingCost,
        price: additionalServiceData?.price,
        insurance: 10000,
      };
    }

    return {
      dataStatusPesanan,
      dataRingkasanPesanan,
      dataDetailPIC,
      dataRingkasanPembayaran,
    };
  } catch (error) {
    console.error(
      "🚀 ~ normalizeDetailPesananFleetSearchDetail ~ error:",
      error
    );
  }
};
