import { useState } from "react";

import RingkasanPesananBody from "@/container/CS/DetailTambahanBiaya//RingaksanPesanan/RIngkasanPesananBody";
// Assuming this is the correct import path
// Assuming lucide-react for icons
import OrderInformation from "@/container/CS/DetailTambahanBiaya/RingaksanPesanan/OrderInformation";
import PaymentDetail from "@/container/CS/DetailTambahanBiaya/RingaksanPesanan/PaymentDetail";
import ShipperContactedInformation from "@/container/CS/DetailTambahanBiaya/RingaksanPesanan/ShipperContactedInformation";
import { ORDER_STATUS } from "@/utils/CS/orderStatus";
import { TRACKING_STATUS } from "@/utils/Transporter/trackingStatus";

// Mock data to populate the component, making it easier to manage
const orderSummaryData = {
  isHalal: true,
  fleetInfo: {
    image: "https://picsum.photos/64/64?random=1", // Using placeholder as per guidelines
    type: "Colt Diesel Engkel - Box",
    needs: "3 Unit",
  },
  loadTime: "03 Okt 2024 18:00 WIB",
  route: {
    estimatedDistance: "178 km",
    locations: [
      {
        type: "muat",
        address:
          "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      },
      {
        type: "bongkar",
        address:
          "Jalan Perusahaan Raya No.46, Banjararum, Singosari, Malang, Jawa Timur, 65153, Indonesia",
      },
    ],
  },
  loadInfo: {
    totalWeight: "1.000 kg",
    items: [
      {
        name: "Besi Baja",
        details: "(1.000 kg) (1x2x5 m)",
      },
    ],
  },
};

const SectionRow = ({ label, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
    <p className="w-full text-xs font-medium text-neutral-600 md:w-[178px] md:flex-shrink-0">
      {label}
    </p>
    <div className="flex-1">{children}</div>
  </div>
);

// sementara pakek ini biar cepet, nanti kalo udh ga males ta ganti
const dataOrderDetail = {
  orderId: "dcdaf886-56d6-4d84-89d6-a21ec18d0bc1",
  orderCode: "MT25A002A",
  invoiceNumber: "INV/MT25A002A",
  // orderStatus: ORDER_STATUS.NEED_CHANGE_RESPONSE,
  // orderStatus: "CONFIRMED_ORDER",
  // orderStatus: "CANCELLED_BY_TRANSPORTER_2",
  orderStatus: "SCHEDULED_FLEET",
  // orderStatus: "WAITING_PAYMENT_2",
  // orderStatus: ORDER_STATUS.DOCUMENT_PREPARATION,
  // orderStatus: ORDER_STATUS.COMPLETED,
  // orderStatus: ORDER_STATUS.LOADING,
  // orderStatus: ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
  // orderStatus: "WAITING_PAYMENT_2", // Status dengan angka untuk testing
  // orderStatus: "UNKNOWN_STATUS_3", // Status yang tidak ada di enum untuk testing
  // orderStatus: "CUSTOM_LOADING_1", // Status custom untuk testing
  // orderStatus: ORDER_STATUS.NEED_ASSIGN_FLEET, // Status untuk trigger Assign Armada button
  // orderStatus : ORDER_STATUS.CHANGE_FLEET,
  orderStatusUnit: 1, // Unit untuk testing
  orderType: "SCHEDULED",
  loadTimeStart: "2024-10-03T18:00:00.000Z",
  // loadTimeEnd: "2024-10-04T08:00:00.000Z",
  loadTimeEnd: null,
  estimatedDistance: 178,
  truckCount: 3,
  hasSOSAlert: false,
  hasResponseDraft: false,
  isCancellable: true, // Pastikan bisa dibatalkan
  isHalalLogistics: true,
  vehicle: {
    truckTypeId: "62a0f025-3143-4f84-99d3-a1c5ac1b8658",
    truckTypeName: "Colt Diesel Engkel",
    carrierName: "Box",
    vehicleImage: "https://picsum.photos/200",
  },
  locations: [
    {
      id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7391",
      type: "PICKUP",
      sequence: 1,
      fullAddress:
        "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      detailAddress: "Rumah dengan pagar hitam",
      city: "Kota Surabaya",
      province: "Jawa Timur",
      latitude: -7.2741549,
      longitude: 112.7820621,
      picName: "Abe Maulana",
      picPhoneNumber: "081974012740",
    },
    {
      id: "ee06f46c-fd1d-4e6e-810c-2a1d4eda7392",
      type: "DROPOFF",
      sequence: 1,
      fullAddress:
        "Graha Aero, Jl. Kedungdoro 88, Kedungdoro, Kec Tegalsari, Kota Surabaya, Jawa Timur 60261",
      detailAddress: "Rumah dengan pagar hitam",
      city: "Kota Surabaya",
      province: "Jawa Timur",
      latitude: -7.2741549,
      longitude: 112.7820621,
      picName: "Abe Maulana",
      picPhoneNumber: "081974012740",
    },
  ],
  cargo: [
    {
      id: "1085a673-4f31-4a66-ada6-79e5e61fe434",
      name: "Besi Baja",
      weight: 1000,
      weightUnit: "kg",
      length: 1,
      width: 2,
      height: 5,
      dimensionUnit: "cm",
      cargoTypeName: "Cargo Type",
      cargoCategoryName: "Cargo Category",
    },
    // {
    //   id: "74b7ef5c-9732-47c0-9ea7-f327b65028d7",
    //   name: "Batu Bata",
    //   weight: 1000,
    //   weightUnit: "kg",
    //   length: 1,
    //   width: 2,
    //   height: 5,
    //   dimensionUnit: "cm",
    //   cargoTypeName: "Cargo Type",
    //   cargoCategoryName: "Cargo Category",
    // },
    // {
    //   id: "29e7018f-b331-4d7e-818d-3bf39ea8ddf2",
    //   name: "Karet Mentah",
    //   weight: 500,
    //   weightUnit: "kg",
    //   length: 1,
    //   width: 2,
    //   height: 5,
    //   dimensionUnit: "cm",
    //   cargoTypeName: "Cargo Type",
    //   cargoCategoryName: "Cargo Category",
    // },
  ],
  cargoDescription:
    "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
  photos: [
    "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
    "https://azlogistik.s3.ap-southeast-3.amazonaws.com/undefined/file-1752810489324.webp",
  ],
  deliveryOrders: ["DO-20241023-001", "DO-20241023-002"],
  additionalServices: [
    {
      id: "0f678054-8459-4a36-8b1d-662e8de7580c",
      serviceName: "Kirim Berkas",
    },
    // {
    //   id: "a0f1778f-0ee2-4ec1-8be8-3e7737832fe2",
    //   serviceName: "Bantuan Tambahan",
    // },
  ],
  incomeSummary: {
    totalPrice: 800000,
    transportFee: 800000,
    additionalServiceFee: 100000,
    taxAmount: 100000,
    totalRouteChange: 100000,
  },
  fleets: [
    {
      id: "fleet-001",
      licensePlate: "AE 1111 LBA",
      vehicleImage: "/img/truck.png",
      truckType: "Colt Diesel Engkel - Box",
      driver: {
        id: "uuid",
        name: "John Doe",
        phoneNumber: "081234567890",
        profileImage: "https://example.com/driver1.jpg",
      },
      hasSOSAlert: true,
      currentStatus: TRACKING_STATUS.LOADING,
      milestones: [
        {
          status: TRACKING_STATUS.SCHEDULED,
          statusName: "Armada Dijadwalkan",
          completed: true,
        },
        {
          status: TRACKING_STATUS.LOADING,
          statusName: "Proses Muat",
          completed: true,
        },
        {
          status: TRACKING_STATUS.UNLOADING,
          statusName: "Proses Bongkar",
          completed: false,
        },
        {
          status: TRACKING_STATUS.DOCUMENT_PREPARATION,
          statusName: "Dokumen Sedang Disiapkan",
          completed: false,
        },
        {
          status: TRACKING_STATUS.DOCUMENT_DELIVERY,
          statusName: "Proses Pengiriman Dokumen",
          completed: false,
        },
        {
          status: TRACKING_STATUS.COMPLETED,
          statusName: "Selesai",
          completed: false,
        },
      ],
      // Data untuk armada pengganti (jika ada)
      replacementFleet: null,
      // Data untuk driver pengganti (jika ada)
      replacementDriver: null,
      // Status perubahan armada
      fleetChangeStatus: null, // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
    },
    {
      id: "fleet-002",
      licensePlate: "AE 2222 LBA",
      vehicleImage: "/img/truck.png",
      truckType: "Colt Diesel Engkel - Box",
      driver: {
        id: "uuid-2",
        name: "Jane Smith",
        phoneNumber: "081234567891",
        profileImage: "https://example.com/driver2.jpg",
      },
      hasSOSAlert: false,
      currentStatus: "CUSTOM_MENUJU_KE_LOKASI_BONGKAR_2", // Status custom untuk testing
      milestones: [
        {
          status: TRACKING_STATUS.SCHEDULED,
          statusName: "Armada Dijadwalkan",
          completed: true,
        },
        {
          status: TRACKING_STATUS.LOADING,
          statusName: "Proses Muat",
          completed: true,
        },
        {
          status: TRACKING_STATUS.IN_TRANSIT, // Status dengan angka
          statusName: "Menuju ke Lokasi Bongkar",
          completed: true,
        },
        {
          status: TRACKING_STATUS.UNLOADING,
          statusName: "Proses Bongkar",
          completed: false,
        },
        {
          status: TRACKING_STATUS.DOCUMENT_PREPARATION,
          statusName: "Dokumen Sedang Disiapkan",
          completed: false,
        },
        {
          status: TRACKING_STATUS.DOCUMENT_DELIVERY,
          statusName: "Proses Pengiriman Dokumen",
          completed: false,
        },
        {
          status: TRACKING_STATUS.COMPLETED,
          statusName: "Selesai",
          completed: false,
        },
      ],
      // Contoh data armada pengganti
      replacementFleet: {
        id: "fleet-002-replacement",
        licensePlate: "AE 3333 LBA",
        vehicleImage: "/img/truck.png",
        truckType: "Colt Diesel Engkel - Box",
      },
      // Contoh data driver pengganti
      replacementDriver: {
        id: "uuid-3",
        name: "Bob Johnson",
        phoneNumber: "081234567892",
        profileImage: "https://example.com/driver3.jpg",
      },
      // Status perubahan armada
      fleetChangeStatus: "APPROVED", // "PENDING", "APPROVED", "REJECTED", "COMPLETED"
    },
    {
      id: "fleet-003",
      licensePlate: "AE 4444 LBA",
      vehicleImage: "/img/truck.png",
      truckType: "Colt Diesel Engkel - Box",
      driver: {
        id: "uuid-4",
        name: "Alice Brown",
        phoneNumber: "081234567893",
        profileImage: "https://example.com/driver4.jpg",
      },
      hasSOSAlert: false,
      currentStatus: TRACKING_STATUS.CANCELLED_BY_TRANSPORTER,
      milestones: [
        {
          status: TRACKING_STATUS.SCHEDULED,
          statusName: "Armada Dijadwalkan",
          completed: true,
        },
        {
          status: "CANCELLED",
          statusName: "Dibatalkan",
          completed: true,
        },
      ],
      // Data untuk armada pengganti (jika ada)
      replacementFleet: null,
      // Data untuk driver pengganti (jika ada)
      replacementDriver: null,
      // Status perubahan armada
      fleetChangeStatus: null,
    },
  ],
  otherStatus: [
    {
      orderStatus: ORDER_STATUS.CANCELLED_BY_TRANSPORTER,
      orderStatusUnit: 1,
    },
  ],
};

const RingkasanPesanan = ({
  order,
  contactSummary,
  shipper,
  transporters,
  costBreakdown,
  paymentDeadline,
}) => {
  const [isPicExpanded, setIsPicExpanded] = useState(false);
  const [isLoadMoreVisible, setIsLoadMoreVisible] = useState(false);

  return (
    <div className="flex gap-x-4">
      {/* Left Column */}
      <div className="flex w-full max-w-[878px] flex-col gap-y-4">
        <ShipperContactedInformation
          contactSummary={contactSummary}
          order={order}
        />
        <OrderInformation
          order={order}
          shipper={shipper}
          transporters={transporters}
        />
        <RingkasanPesananBody dataOrderDetail={dataOrderDetail} />
      </div>

      {/* Right Column */}
      <PaymentDetail
        costBreakdown={costBreakdown}
        order={order}
        paymentDeadline={paymentDeadline}
      />
    </div>
  );
};

export default RingkasanPesanan;
