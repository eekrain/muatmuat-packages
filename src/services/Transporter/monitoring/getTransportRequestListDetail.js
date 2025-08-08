import useSWR from "swr";

// Mock configuration for testing different states
const isMockTransportRequestDetail = true;

const apiResultTransportRequestDetail = {
  data: {
    Message: {
      Code: 200,
      Text: "Request detail retrieved and marked as viewed successfully",
    },
    Data: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      orderCode: "MT25A001A",
      invoiceNumber: "INV-2025-001",
      encryptedCode: "ENC123",
      orderType: "INSTANT",
      orderStatus: "PREPARE_FLEET",
      isHalalLogistics: true,
      isSaved: false, // Add isSaved field for bookmark status
      loadTimeStart: "2025-08-07T09:00:00+07:00",
      loadTimeEnd: "2025-08-07T11:00:00+07:00",
      estimatedDistance: 25.5,
      totalPrice: 1500000.0,
      transportFee: 1200000.0,
      insuranceFee: 100000.0,
      additionalServiceFee: 50000.0,
      adminFee: 25000.0,
      taxAmount: 125000.0,
      truckCount: 1,
      truckTypeID: "550e8400-e29b-41d4-a716-446655440099",
      truckTypeName: "Colt Diesel Engkel",
      headTruckID: "550e8400-e29b-41d4-a716-446655440098",
      carrierTruckID: "550e8400-e29b-41d4-a716-446655440097",
      carrierName: "Box",
      cargoDescription:
        "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih",
      pickupLocations: [
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          locationType: "PICKUP",
          sequence: 1,
          fullAddress: "Kab. Ogan Komering Ulu, Kec. Kedaton Peninjauan Raya",
          detailAddress: "Gedung A Lantai 5",
          latitude: -6.2088,
          longitude: 106.8456,
          district: "Kedaton Peninjauan Raya",
          city: "Ogan Komering Ulu",
          province: "Sumatera Selatan",
          postalCode: "32361",
          picName: "John Doe",
          picPhoneNumber: "081234567890",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          locationType: "PICKUP",
          sequence: 2,
          fullAddress:
            "Kab. Kepulauan Siau Tagulandang Biaro, Kec. Tagulandang Selatan Selatan",
          detailAddress: "Warehouse A",
          latitude: -6.21,
          longitude: 106.85,
          district: "Tagulandang Selatan Selatan",
          city: "Kepulauan Siau Tagulandang Biaro",
          province: "Sulawesi Utara",
          postalCode: "32362",
          picName: "Jane Doe",
          picPhoneNumber: "081234567891",
        },
      ],
      dropoffLocations: [
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          locationType: "DROPOFF",
          sequence: 1,
          fullAddress: "Kab. Pasuruan, Kec. Klojen",
          detailAddress: "Warehouse B",
          latitude: -6.921,
          longitude: 107.604,
          district: "Klojen",
          city: "Pasuruan",
          province: "Jawa Timur",
          postalCode: "40112",
          picName: "Jane Smith",
          picPhoneNumber: "081234567891",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          locationType: "DROPOFF",
          sequence: 2,
          fullAddress: "Kab. Malang, Kec. Singosari",
          detailAddress: "Warehouse C",
          latitude: -7.889,
          longitude: 112.666,
          district: "Singosari",
          city: "Malang",
          province: "Jawa Timur",
          postalCode: "65153",
          picName: "Bob Wilson",
          picPhoneNumber: "081234567892",
        },
      ],
      cargos: [
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          cargoTypeID: "550e8400-e29b-41d4-a716-446655440050",
          cargoCategoryID: "550e8400-e29b-41d4-a716-446655440051",
          cargoNameID: "550e8400-e29b-41d4-a716-446655440052",
          cargoTypeName: "Peralatan Konstruksi",
          cargoCategoryName: "Material",
          name: "Besi Baja",
          isCustomName: false,
          weight: 1000.0,
          weightUnit: "kg",
          length: 5.0,
          width: 2.0,
          height: 1.0,
          dimensionUnit: "m",
          sequence: 1,
          displayText: "Besi Baja (1.000 kg)",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          cargoTypeID: "550e8400-e29b-41d4-a716-446655440053",
          cargoCategoryID: "550e8400-e29b-41d4-a716-446655440054",
          cargoNameID: "550e8400-e29b-41d4-a716-446655440055",
          cargoTypeName: "Peralatan Konstruksi",
          cargoCategoryName: "Material",
          name: "Batu Bata",
          isCustomName: false,
          weight: 1000.0,
          weightUnit: "kg",
          length: null,
          width: null,
          height: null,
          dimensionUnit: null,
          sequence: 2,
          displayText: "Batu Bata (1.000 kg)",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          cargoTypeID: "550e8400-e29b-41d4-a716-446655440056",
          cargoCategoryID: "550e8400-e29b-41d4-a716-446655440057",
          cargoNameID: "550e8400-e29b-41d4-a716-446655440058",
          cargoTypeName: "Material Industri",
          cargoCategoryName: "Bahan Mentah",
          name: "Karet Mentah",
          isCustomName: false,
          weight: 500.0,
          weightUnit: "kg",
          length: null,
          width: null,
          height: null,
          dimensionUnit: null,
          sequence: 3,
          displayText: "Karet Mentah (500 kg)",
        },
      ],
      photos: [
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          photoUrl: "https://picsum.photos/400/300?random=1",
          photoType: "cargo",
          description: "Foto muatan tangga",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440016",
          photoUrl: "https://picsum.photos/400/300?random=2",
          photoType: "cargo",
          description: "Foto muatan batu bata",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440017",
          photoUrl: "https://picsum.photos/400/300?random=3",
          photoType: "cargo",
          description: "Foto muatan keseluruhan",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440018",
          photoUrl: "https://picsum.photos/400/300?random=4",
          photoType: "cargo",
          description: "Foto detail muatan",
        },
      ],
      additionalServices: [
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          additionalServiceID: "550e8400-e29b-41d4-a716-446655440060",
          serviceName: "Kirim Berkas",
          recipientName: "Recipient Name",
          recipientPhone: "081234567892",
          destinationAddress: "Alamat tujuan layanan",
          shippingOption: "Regular",
          price: 50000.0,
          insuranceCost: 5000.0,
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          additionalServiceID: "550e8400-e29b-41d4-a716-446655440061",
          serviceName: "Bantuan Tambahan",
          recipientName: null,
          recipientPhone: null,
          destinationAddress: null,
          shippingOption: null,
          price: 75000.0,
          insuranceCost: 0.0,
        },
      ],
      overloadInfo: {
        hasOverload: true,
        overloadWeight: 200.0,
        overloadFee: 100000.0,
        notes: "Muatan melebihi kapasitas standar",
      },
      insuranceInfo: {
        insuranceOptionID: "550e8400-e29b-41d4-a716-446655440070",
        insuranceFee: 100000.0,
        cargoValue: 5000000.0,
      },
      timeLabel: {
        text: "Muat Hari Ini",
        color: "green",
        daysFromNow: 0,
        hasTimeRange: true,
      },
      userHalalCertification: {
        isHalalCertified: true,
        halalCertificateNo: "CERT-001",
        halalExpiryDate: "2025-12-31",
      },
      createdAt: "2025-08-06T08:00:00+07:00",
      updatedAt: "2025-08-06T08:30:00+07:00",
      viewedAt: "2025-08-08T10:30:00+07:00",
    },
    Type: "GET_TRANSPORT_REQUEST_DETAIL",
  },
};

export const fetcherTransportRequestDetail = async (id) => {
  if (isMockTransportRequestDetail) {
    // Simulate network delay for testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!id) {
      throw new Error("Request ID is required");
    }

    // Return the mock data, but you could filter by id if needed
    return apiResultTransportRequestDetail;
  }

  try {
    const response = await fetch(`/api/v1/transport-requests/${id}/detail`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.Message?.Text || "Failed to fetch transport request detail"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching transport request detail:", error);
    throw error;
  }
};

export const useGetTransportRequestDetail = (id) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `transport-request-detail-${id}` : null,
    () => fetcherTransportRequestDetail(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  return {
    data: data?.data?.Data || null,
    error,
    isLoading,
    mutate,
  };
};
