import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

// Mock configuration for testing different states
const isMockTransportRequestList = true;

// Testing configurations - Change these values to test different states:
const MOCK_CONFIG = {
  // UI States to test:
  showEmptyState: false, // true = empty state, false = show requests
  isSuspended: false, // true = suspended account, false = normal account
  driverDelegationEnabled: false, // true = show delegation warning, false = normal account
  isHalalCertified: false, // false = show halal certification warning, true = certified

  // Quick toggle functions for easy testing:
  // 1. Empty state: showEmptyState=true, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=true
  // 2. Normal state: showEmptyState=false, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=true
  // 3. Suspended state: showEmptyState=false, isSuspended=true, driverDelegationEnabled=false, isHalalCertified=true
  // 4. Driver delegation: showEmptyState=false, isSuspended=false, driverDelegationEnabled=true, isHalalCertified=true
  // 5. Halal certification needed: showEmptyState=false, isSuspended=false, driverDelegationEnabled=false, isHalalCertified=false
};
const apiResultTransportRequestList = {
  data: {
    Message: {
      Code: 200,
      Text: "Transport requests retrieved successfully",
    },
    Data: {
      requests: [
        {
          id: "550e8400-e29b-41d4-a716-446655440001",
          orderCode: "MT25A001A",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-06T09:00:00+07:00",
          loadTimeEnd: "2025-08-06T11:00:00+07:00",
          estimatedDistance: 121,
          totalPrice: 1500000.0,
          truckCount: 1,
          truckTypeName: "Colt Diesel Engkel",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440011",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Tegalsari",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440012",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440013",
              name: "Peralatan Tangga",
              weight: 2500,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440014",
              serviceName: "Bantuan Tambahan, Kirim Berkas",
            },
          ],
          photos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440015",
              photoUrl: "https://storage.example.com/photo1.jpg",
              photoType: "cargo",
            },
          ],
          timeLabel: {
            text: "Instan",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "03 Jan 2025 09:00 WIB s/d 11:00 WIB",
          potentialEarnings: "Rp1.500.000",
          overloadPotential: "Potensi Overload",
          createdAt: "2025-08-06T08:00:00+07:00",
          newRequestDuration: "2 menit yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440002",
          orderCode: "MT25A002B",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-07T10:00:00+07:00",
          loadTimeEnd: "2025-08-07T12:00:00+07:00",
          estimatedDistance: 85,
          totalPrice: 650000.0,
          truckCount: 2,
          truckTypeName: "Colt Diesel Double",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440021",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Tegalsari",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440022",
              sequence: 1,
              fullAddress: "Kab. Pasuruan, Kec. Klojen",
              city: "Pasuruan",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440023",
              name: "Material Bangunan",
              weight: 3000,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440024",
              serviceName: "Muat Besok",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 1,
          },
          loadTimeText: "Muat Besok",
          loadDateTime: "07 Agu 2025 10:00 WIB s/d 12:00 WIB",
          potentialEarnings: "Rp650.000",
          createdAt: "2025-08-06T05:30:00+07:00",
          newRequestDuration: "3 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440003",
          orderCode: "MT25A003C",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-08T14:00:00+07:00",
          loadTimeEnd: "2025-08-08T16:00:00+07:00",
          estimatedDistance: 75,
          totalPrice: 550000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440031",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Gubeng",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440032",
              sequence: 1,
              fullAddress: "Kota Malang, Kec. Klojen",
              city: "Malang",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440033",
              name: "Produk Halal",
              weight: 800,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440034",
              serviceName: "Asuransi Barang",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 3,
          },
          loadTimeText: "Muat 3 Hari Lagi",
          loadDateTime: "08 Agu 2025 14:00 WIB s/d 16:00 WIB",
          potentialEarnings: "Rp550.000",
          createdAt: "2025-08-05T06:15:00+07:00",
          newRequestDuration: "1 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440004",
          orderCode: "MT25A004D",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-06T14:00:00+07:00",
          loadTimeEnd: "2025-08-06T16:00:00+07:00",
          estimatedDistance: 45,
          totalPrice: 400000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440041",
              sequence: 1,
              fullAddress: "Kota Jakarta, Kec. Menteng",
              city: "Jakarta",
              province: "DKI Jakarta",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440042",
              sequence: 1,
              fullAddress: "Kota Depok, Kec. Pancoran Mas",
              city: "Depok",
              province: "Jawa Barat",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440043",
              name: "Furniture",
              weight: 500,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Instan",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "06 Agu 2025 14:00 WIB s/d 16:00 WIB",
          potentialEarnings: "Rp400.000",
          createdAt: "2025-08-06T07:45:00+07:00",
          newRequestDuration: "15 menit yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440005",
          orderCode: "MT25A005E",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-09T08:00:00+07:00",
          loadTimeEnd: "2025-08-09T10:00:00+07:00",
          estimatedDistance: 95,
          totalPrice: 750000.0,
          truckCount: 1,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440051",
              sequence: 1,
              fullAddress: "Kota Bandung, Kec. Cicendo",
              city: "Bandung",
              province: "Jawa Barat",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440052",
              sequence: 1,
              fullAddress: "Kota Yogyakarta, Kec. Gondokusuman",
              city: "Yogyakarta",
              province: "DI Yogyakarta",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440053",
              name: "Produk Makanan Halal",
              weight: 1800,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440054",
              serviceName: "Refrigerated Transport",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 3,
          },
          loadTimeText: "Muat 3 Hari Lagi",
          loadDateTime: "09 Agu 2025 08:00 WIB s/d 10:00 WIB",
          potentialEarnings: "Rp750.000",
          createdAt: "2025-08-06T03:00:00+07:00",
          newRequestDuration: "5 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440006",
          orderCode: "MT25A006F",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-10T06:00:00+07:00",
          loadTimeEnd: "2025-08-10T18:00:00+07:00",
          estimatedDistance: 850,
          totalPrice: 125000000.0,
          truckCount: 15,
          truckTypeName: "Trailer 40 Feet",
          carrierName: "Container",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440061",
              sequence: 1,
              fullAddress: "Pelabuhan Tanjung Priok, Jakarta Utara",
              city: "Jakarta",
              province: "DKI Jakarta",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440062",
              sequence: 1,
              fullAddress: "Kawasan Industri Surabaya, Jawa Timur",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440063",
              name: "Kontainer Elektronik Import",
              weight: 25000,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440064",
              serviceName: "Escort & Security, Asuransi Khusus",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 4,
          },
          loadTimeText: "Muat 4 Hari Lagi",
          loadDateTime: "10 Agu 2025 06:00 WIB s/d 18:00 WIB",
          potentialEarnings: "Rp125.000.000",
          createdAt: "2025-08-06T01:30:00+07:00",
          newRequestDuration: "6 jam yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440007",
          orderCode: "MT25A007G",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-06T16:00:00+07:00",
          loadTimeEnd: "2025-08-06T20:00:00+07:00",
          estimatedDistance: 1200,
          totalPrice: 250000000.0,
          truckCount: 8,
          truckTypeName: "Heavy Duty Trailer",
          carrierName: "Lowbed",
          hasOverload: true,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440071",
              sequence: 1,
              fullAddress: "Pabrik Heavy Equipment, Bekasi",
              city: "Bekasi",
              province: "Jawa Barat",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440072",
              sequence: 1,
              fullAddress: "Site Pertambangan, Kalimantan Timur",
              city: "Balikpapan",
              province: "Kalimantan Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440073",
              name: "Excavator & Heavy Machinery",
              weight: 45000,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440074",
              serviceName: "Special Permit, Police Escort, Crane Service",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Instan",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Hari Ini",
          loadDateTime: "06 Agu 2025 16:00 WIB s/d 20:00 WIB",
          potentialEarnings: "Rp250.000.000",
          createdAt: "2025-08-06T07:15:00+07:00",
          newRequestDuration: "45 menit yang lalu",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440008",
          orderCode: "MT25A008H",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: true,
          isHalalLogistics: true,
          isSaved: true,
          loadTimeStart: "2025-08-15T05:00:00+07:00",
          loadTimeEnd: "2025-08-17T17:00:00+07:00",
          estimatedDistance: 2100,
          totalPrice: 485000000.0,
          truckCount: 25,
          truckTypeName: "Multi Axle Trailer",
          carrierName: "Specialized",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440081",
              sequence: 1,
              fullAddress: "Pabrik Kimia Halal, Cilegon, Banten",
              city: "Cilegon",
              province: "Banten",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440082",
              sequence: 1,
              fullAddress: "Kawasan Industri Makassar, Sulawesi Selatan",
              city: "Makassar",
              province: "Sulawesi Selatan",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440083",
              name: "Chemical Products Halal Certified",
              weight: 180000,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440084",
              serviceName:
                "Hazmat Transport, Temperature Control, Multi-Point Delivery",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 9,
          },
          loadTimeText: "Muat 9 Hari Lagi",
          loadDateTime: "15 Agu 2025 05:00 WIB s/d 17 Agu 2025 17:00 WIB",
          potentialEarnings: "Rp485.000.000",
          createdAt: "2025-08-05T22:00:00+07:00",
          newRequestDuration: "10 jam yang lalu",
        },
        // Non-new requests (existing/older requests)
        {
          id: "550e8400-e29b-41d4-a716-446655440009",
          orderCode: "MT25A009I",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-12T09:00:00+07:00",
          loadTimeEnd: "2025-08-12T11:00:00+07:00",
          estimatedDistance: 65,
          totalPrice: 580000.0,
          truckCount: 1,
          truckTypeName: "Colt Diesel Engkel",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440091",
              sequence: 1,
              fullAddress: "Kota Semarang, Kec. Tembalang",
              city: "Semarang",
              province: "Jawa Tengah",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440092",
              sequence: 1,
              fullAddress: "Kota Solo, Kec. Laweyan",
              city: "Solo",
              province: "Jawa Tengah",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440093",
              name: "Produk Tekstil",
              weight: 1200,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 6,
          },
          loadTimeText: "Muat 6 Hari Lagi",
          loadDateTime: "12 Agu 2025 09:00 WIB s/d 11:00 WIB",
          potentialEarnings: "Rp580.000",
          createdAt: "2025-08-03T10:30:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440010",
          orderCode: "MT25A010J",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: true,
          isSaved: true,
          loadTimeStart: "2025-08-06T20:00:00+07:00",
          loadTimeEnd: "2025-08-06T22:00:00+07:00",
          estimatedDistance: 35,
          totalPrice: 320000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440101",
              sequence: 1,
              fullAddress: "Kota Jakarta, Kec. Kemayoran",
              city: "Jakarta",
              province: "DKI Jakarta",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440102",
              sequence: 1,
              fullAddress: "Kota Tangerang, Kec. Karawaci",
              city: "Tangerang",
              province: "Banten",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440103",
              name: "Makanan Halal Siap Saji",
              weight: 150,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440104",
              serviceName: "Refrigerated Transport",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Instan",
            color: "green",
            daysFromNow: 0,
          },
          loadTimeText: "Muat Malam Ini",
          loadDateTime: "06 Agu 2025 20:00 WIB s/d 22:00 WIB",
          potentialEarnings: "Rp320.000",
          createdAt: "2025-08-04T15:20:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440011",
          orderCode: "MT25A011K",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-11T07:00:00+07:00",
          loadTimeEnd: "2025-08-11T09:00:00+07:00",
          estimatedDistance: 140,
          totalPrice: 950000.0,
          truckCount: 2,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440111",
              sequence: 1,
              fullAddress: "Kota Medan, Kec. Medan Barat",
              city: "Medan",
              province: "Sumatera Utara",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440112",
              sequence: 1,
              fullAddress: "Kota Pekanbaru, Kec. Sukajadi",
              city: "Pekanbaru",
              province: "Riau",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440113",
              name: "Spare Part Otomotif",
              weight: 2800,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440114",
              serviceName: "Asuransi Barang, Bantuan Muat",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 5,
          },
          loadTimeText: "Muat 5 Hari Lagi",
          loadDateTime: "11 Agu 2025 07:00 WIB s/d 09:00 WIB",
          potentialEarnings: "Rp950.000",
          createdAt: "2025-08-02T14:45:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440012",
          orderCode: "MT25A012L",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-07T13:00:00+07:00",
          loadTimeEnd: "2025-08-07T15:00:00+07:00",
          estimatedDistance: 28,
          totalPrice: 280000.0,
          truckCount: 1,
          truckTypeName: "Pick Up",
          carrierName: "Terbuka",
          hasOverload: false,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440121",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Wonokromo",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440122",
              sequence: 1,
              fullAddress: "Kota Surabaya, Kec. Rungkut",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440123",
              name: "Produk Kosmetik Halal",
              weight: 85,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 1,
          },
          loadTimeText: "Muat Besok",
          loadDateTime: "07 Agu 2025 13:00 WIB s/d 15:00 WIB",
          potentialEarnings: "Rp280.000",
          createdAt: "2025-08-01T09:15:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440013",
          orderCode: "MT25A013M",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-14T10:00:00+07:00",
          loadTimeEnd: "2025-08-14T16:00:00+07:00",
          estimatedDistance: 425,
          totalPrice: 2850000.0,
          truckCount: 3,
          truckTypeName: "Trailer 20 Feet",
          carrierName: "Container",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440131",
              sequence: 1,
              fullAddress: "Pelabuhan Tanjung Perak, Surabaya",
              city: "Surabaya",
              province: "Jawa Timur",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440132",
              sequence: 1,
              fullAddress: "Kawasan Industri Cikarang, Bekasi",
              city: "Bekasi",
              province: "Jawa Barat",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440133",
              name: "Raw Material Import",
              weight: 18500,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440134",
              serviceName: "Customs Clearance, Escort Service",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 8,
          },
          loadTimeText: "Muat 8 Hari Lagi",
          loadDateTime: "14 Agu 2025 10:00 WIB s/d 16:00 WIB",
          potentialEarnings: "Rp2.850.000",
          createdAt: "2025-07-30T11:30:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440014",
          orderCode: "MT25A014N",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: false,
          loadTimeStart: "2025-08-07T16:00:00+07:00",
          loadTimeEnd: "2025-08-07T18:00:00+07:00",
          estimatedDistance: 92,
          totalPrice: 680000.0,
          truckCount: 1,
          truckTypeName: "Colt Diesel Double",
          carrierName: "Box",
          hasOverload: true,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440141",
              sequence: 1,
              fullAddress: "Kota Bandung, Kec. Bandung Wetan",
              city: "Bandung",
              province: "Jawa Barat",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440142",
              sequence: 1,
              fullAddress: "Kota Cirebon, Kec. Kejaksan",
              city: "Cirebon",
              province: "Jawa Barat",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440143",
              name: "Peralatan Elektronik",
              weight: 3200,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 1,
          },
          loadTimeText: "Muat Besok",
          loadDateTime: "07 Agu 2025 16:00 WIB s/d 18:00 WIB",
          potentialEarnings: "Rp680.000",
          createdAt: "2025-07-28T16:00:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440015",
          orderCode: "MT25A015O",
          orderType: "SCHEDULED",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: true,
          isSaved: false,
          loadTimeStart: "2025-08-13T08:00:00+07:00",
          loadTimeEnd: "2025-08-13T12:00:00+07:00",
          estimatedDistance: 180,
          totalPrice: 1250000.0,
          truckCount: 2,
          truckTypeName: "Fuso 6 Roda",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: true,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440151",
              sequence: 1,
              fullAddress: "Kota Palembang, Kec. Ilir Barat I",
              city: "Palembang",
              province: "Sumatera Selatan",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440152",
              sequence: 1,
              fullAddress: "Kota Lampung, Kec. Tanjung Karang",
              city: "Lampung",
              province: "Lampung",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440153",
              name: "Produk Farmasi Halal",
              weight: 1800,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [
            {
              id: "550e8400-e29b-41d4-a716-446655440154",
              serviceName: "Temperature Control, Medical Transport License",
            },
          ],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 7,
          },
          loadTimeText: "Muat 7 Hari Lagi",
          loadDateTime: "13 Agu 2025 08:00 WIB s/d 12:00 WIB",
          potentialEarnings: "Rp1.250.000",
          createdAt: "2025-07-29T13:20:00+07:00",
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440016",
          orderCode: "MT25A016P",
          orderType: "INSTANT",
          orderStatus: "PREPARE_FLEET",
          isNew: false,
          isHalalLogistics: false,
          isSaved: true,
          loadTimeStart: "2025-08-07T09:00:00+07:00",
          loadTimeEnd: "2025-08-07T11:00:00+07:00",
          estimatedDistance: 55,
          totalPrice: 480000.0,
          truckCount: 1,
          truckTypeName: "Colt Diesel Engkel",
          carrierName: "Box",
          hasOverload: false,
          hasAdditionalService: false,
          pickupLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440161",
              sequence: 1,
              fullAddress: "Kota Yogyakarta, Kec. Pakualaman",
              city: "Yogyakarta",
              province: "DI Yogyakarta",
            },
          ],
          dropoffLocations: [
            {
              id: "550e8400-e29b-41d4-a716-446655440162",
              sequence: 1,
              fullAddress: "Kab. Klaten, Kec. Klaten Utara",
              city: "Klaten",
              province: "Jawa Tengah",
            },
          ],
          cargos: [
            {
              id: "550e8400-e29b-41d4-a716-446655440163",
              name: "Kerajinan Tangan",
              weight: 950,
              weightUnit: "kg",
              sequence: 1,
            },
          ],
          additionalServices: [],
          photos: [],
          timeLabel: {
            text: "Terjadwal",
            color: "blue",
            daysFromNow: 1,
          },
          loadTimeText: "Muat Besok",
          loadDateTime: "07 Agu 2025 09:00 WIB s/d 11:00 WIB",
          potentialEarnings: "Rp480.000",
          createdAt: "2025-07-27T08:45:00+07:00",
        },
      ],
      newRequestsCount: {
        total: 18, // 2-digit counter to test blinking animation (10-99 range)
        display: "18",
        hasAnimation: true,
      },
      tabCounts: {
        tersedia: 35, // 2-digit total to test counter display and animation
        halal_logistik: 22, // 2-digit halal requests to test animation
        disimpan: 8, // Single digit saved requests
      },
      userStatus: {
        isSuspended: MOCK_CONFIG.isSuspended,
        driverDelegationEnabled: MOCK_CONFIG.driverDelegationEnabled,
        isHalalCertified: MOCK_CONFIG.isHalalCertified,
        suspensionReason: "Akun Kamu Ditangguhkan",
        suspensionMessage: "Hubungi dukungan pelanggan untuk aktivasi kembali",
        supportContactUrl: "tel:+62-811-1234-5678",
        delegationWarningMessage:
          "Pengaturan delegasi driver sedang aktif. Driver yang didelegasikan dapat menerima pesanan atas nama Anda.",
        delegationResetUrl: "/settings/driver-delegation",
        halalCertificationMessage:
          "Tambahkan sertifikasi halal dengan menghubungi kami",
        halalCertificationUrl: "tel:+62-811-1234-5678",
      },
      showEmptyState: MOCK_CONFIG.showEmptyState,
    },
    Type: "GET_TRANSPORT_REQUEST_LIST",
  },
};

export const fetcherTransportRequestList = async (params = {}) => {
  if (isMockTransportRequestList) {
    // Simulate filtering, searching, and sorting
    const result = { ...apiResultTransportRequestList };

    // Check if we should show empty state for testing
    if (result.data.Data.showEmptyState) {
      return {
        ...result.data.Data,
        requests: [],
        tabCounts: {
          tersedia: 0,
          halal_logistik: 0,
          disimpan: 0,
        },
        newRequestsCount: {
          total: 0,
          display: "0",
          hasAnimation: false,
        },
      };
    }

    // Apply filters if provided
    if (params.orderStatus) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.orderStatus === params.orderStatus
      );
    }

    if (params.orderType) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.orderType === params.orderType
      );
    }

    if (params.isHalalLogistics !== undefined) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isHalalLogistics === params.isHalalLogistics
      );
    }

    if (params.isSaved !== undefined) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isSaved === params.isSaved
      );
    }

    if (params.isNew !== undefined) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.isNew === params.isNew
      );
    }

    if (params.truckTypeName) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.truckTypeName === params.truckTypeName
      );
    }

    if (params.carrierName) {
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) => req.carrierName === params.carrierName
      );
    }

    // Apply search if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result.data.Data.requests = result.data.Data.requests.filter(
        (req) =>
          req.orderCode.toLowerCase().includes(searchLower) ||
          req.truckTypeName.toLowerCase().includes(searchLower) ||
          req.carrierName.toLowerCase().includes(searchLower) ||
          req.pickupLocations.some(
            (loc) =>
              loc.fullAddress.toLowerCase().includes(searchLower) ||
              loc.city.toLowerCase().includes(searchLower) ||
              loc.province.toLowerCase().includes(searchLower)
          ) ||
          req.dropoffLocations.some(
            (loc) =>
              loc.fullAddress.toLowerCase().includes(searchLower) ||
              loc.city.toLowerCase().includes(searchLower) ||
              loc.province.toLowerCase().includes(searchLower)
          ) ||
          req.cargos.some((cargo) =>
            cargo.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply sorting if provided
    if (params.sortBy) {
      result.data.Data.requests.sort((a, b) => {
        let aValue = a[params.sortBy];
        let bValue = b[params.sortBy];

        // Handle date sorting
        if (
          params.sortBy === "loadTimeStart" ||
          params.sortBy === "createdAt"
        ) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Handle price sorting
        if (params.sortBy === "totalPrice") {
          aValue = parseFloat(aValue);
          bValue = parseFloat(bValue);
        }

        if (params.sortOrder === "desc") {
          return aValue > bValue ? -1 : 1;
        }
        return aValue < bValue ? -1 : 1;
      });
    }

    // Update tab counts based on filtered results
    const filteredRequests = result.data.Data.requests;
    result.data.Data.tabCounts = {
      tersedia: filteredRequests.length,
      halal_logistik: filteredRequests.filter((req) => req.isHalalLogistics)
        .length,
      disimpan: filteredRequests.filter((req) => req.isSaved).length,
    };

    // Update new requests count
    const newRequests = filteredRequests.filter((req) => req.isNew);
    result.data.Data.newRequestsCount = {
      total: newRequests.length,
      display: newRequests.length > 99 ? "99+" : newRequests.length.toString(),
      hasAnimation: newRequests.length > 0,
    };

    return result.data.Data;
  }

  // Build query parameters
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.orderStatus) queryParams.append("orderStatus", params.orderStatus);
  if (params.orderType) queryParams.append("orderType", params.orderType);
  if (params.isHalalLogistics !== undefined)
    queryParams.append("isHalalLogistics", params.isHalalLogistics);
  if (params.isSaved !== undefined)
    queryParams.append("isSaved", params.isSaved);
  if (params.isNew !== undefined) queryParams.append("isNew", params.isNew);
  if (params.truckTypeName)
    queryParams.append("truckTypeName", params.truckTypeName);
  if (params.carrierName) queryParams.append("carrierName", params.carrierName);
  if (params.search) queryParams.append("search", params.search);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
  if (params.dateTo) queryParams.append("dateTo", params.dateTo);

  const queryString = queryParams.toString();
  const endpoint = queryString
    ? `v1/transport-requests?${queryString}`
    : "v1/transport-requests";

  const result = await fetcherMuatrans.get(endpoint);
  return result?.data?.Data || {};
};

export const useGetTransportRequestList = (params = {}) => {
  // Create cache key based on parameters
  const cacheKey = params
    ? `transport-request-list-${JSON.stringify(params)}`
    : "transport-request-list";

  return useSWR(cacheKey, () => fetcherTransportRequestList(params));
};

// Specialized hooks for common use cases
export const useGetAvailableTransportRequests = () => {
  return useGetTransportRequestList({ orderStatus: "PREPARE_FLEET" });
};

export const useGetHalalLogisticsRequests = () => {
  return useGetTransportRequestList({ isHalalLogistics: true });
};

export const useGetSavedTransportRequests = () => {
  return useGetTransportRequestList({ isSaved: true });
};

export const useGetNewTransportRequests = () => {
  return useGetTransportRequestList({ isNew: true });
};

export const useGetInstantTransportRequests = () => {
  return useGetTransportRequestList({ orderType: "INSTANT" });
};

export const useGetScheduledTransportRequests = () => {
  return useGetTransportRequestList({ orderType: "SCHEDULED" });
};
