import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import {
  OrderStatusEnum,
  OrderTypeEnum,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

// import { ORDER_STATUS } from "@/utils/CS/orderStatus";

const useMockData = true;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail pesanan berhasil diambil",
    },
    Data: {
      order: {
        id: "uuid", // [dbt_mt_order.id]
        orderCode: "MT2024010001", // [dbt_mt_order.orderCode]
        orderStatus: OrderStatusEnum.CANCELED_BY_SHIPPER, // [dbt_mt_order.orderStatus]
        truckCount: 1, // [dbt_mt_order.truckCount]
        orderType: OrderTypeEnum.INSTANT, // [dbt_mt_order.orderType]
        totalPrice: 1500000.0, // [dbt_mt_order.totalPrice]
        cancelledAt: "2024-01-15T10:30:00Z", // [dbt_mt_order_cancellation.cancelledAt]
        cancellationReason: "Jadwal berubah", // [dbt_mt_order_cancellation.additionalInfo]
      },
      shipper: {
        companyName: "PT Maju Jaya", // [dbm_mt_transporter.companyName]
        fullName: "John Doe", // [dbm_mt_user.fullName]
        phoneNumber: "+6281234567890", // [dbm_mt_user.phoneNumber]
        district: "Menteng", // Derived from location
        city: "Jakarta Pusat", // Derived from location,
        fullAddress: "Jl. Contoh Alamat Lengkap", // Placeholder or replace with actual value
        logoUrl: "https://cdn.muattrans.com/logos/shipper.jpg", // [dbm_mt_user.profileImage]
      },
      orderSummary: {
        cargoDescription: "Elektronik", // [dbt_mt_order.cargoDescription]
        cargoPhotos: ["https://example.com/photo1.jpg"], // [dbt_mt_order_photo.photoUrl]
        truckPhoto: "https://example.com/photo1.jpg",
        cargoInformation: [
          {
            goods: "Besi",
            Qty: 1000,
            Uom: "kg",
            Dimension: "1x2x2 cm",
          },
        ],
        deliveryOrderNumber: ["DO2024010001"], // [dbt_mt_delivery_order.doNumber]
        additionalServices: ["Asuransi Cargo"], // [dbt_mt_order_additional_service]
        Documents: [
          {
            Address: "jl kalimas timur",
            addressDetail: "kantor gudang",
            recipientName: "siti",
            recipientPhone: "01920391203",
            shippingCargo: "JNE",
          },
        ],
        estimatedDistance: "100 km",
        pickupLocations: [
          {
            fullAddress: "Jl. Sudirman No. 1, Menteng", // [dbt_mt_location.fullAddress]
            detailAddress: "Gedung A Lantai 5", // [dbt_mt_location.detailAddress]
            district: "Menteng", // [dbt_mt_location.district]
            city: "Jakarta Pusat", // [dbt_mt_location.city]
            picName: "Ahmad", // [dbt_mt_location.picName]
            picPhoneNumber: "+6281234567891", // [dbt_mt_location.picPhoneNumber]
            notes: "Barang sudah siap di lobby", // Optional
          },
        ],
        dropoffLocations: [
          {
            fullAddress: "Jl. Thamrin No. 2, Tanah Abang", // [dbt_mt_location.fullAddress]
            detailAddress: "Lantai 3 Ruang 301", // [dbt_mt_location.detailAddress]
            district: "Tanah Abang", // [dbt_mt_location.district]
            city: "Jakarta Pusat", // [dbt_mt_location.city]
            picName: "Siti", // [dbt_mt_location.picName]
            picPhoneNumber: "+6281234567892", // [dbt_mt_location.picPhoneNumber]
            notes: "-", // Optional, display "-" if empty
          },
        ],
      },
    },
    Type: "ORDER_DETAIL",
  },
};

// Fetcher function for additional cost report detail
export const getCanceledOrderDetail = async (url) => {
  let result;
  if (useMockData) {
    return (result = mockAPIResult.data?.Data);
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return result?.data?.Data || {};
};

// SWR hook for additional cost report detail
export const useGetCanceledOrderDetail = (id) =>
  useSWR(`/v1/cs/canceled-orders/${id}/detail`, getCanceledOrderDetail);
