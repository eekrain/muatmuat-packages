vehicles

```js
const x = {
  Message: {
    Code: 200,
    Text: "Fleet vehicles retrieved successfully",
  },
  Data: {
    vehicles: [
      {
        vehicleId: "vehicle-uuid-1",
        licensePlate: "B 1234 XYZ",
        orderStatus: "IN_PROGRESS",
        transporter: {
          id: "uuid", // [dbt_mt_transporters.id]
          name: "PT Transport ABC", // [dbt_mt_transporters.companyName]
          phone: "021-1234-5678", // [dbt_mt_transporters.phone]
        },
        driverName: "John Doe",
        driverStatus: {
          mainStatus: "LOADING",
          subStatus: "MENUJU_KE_LOKASI_MUAT",
          displayName: "Menuju ke Lokasi Muat 1",
        },
        sosStatus: {
          hasSos: true,
          sosId: "sos-uuid-1",
        },
      },
    ],
  },
  Type: "FLEET_VEHICLES_LIST",
};
```

```js
const d = {
  Message: {
    Code: 200,
    Text: "Vehicle tracking data retrieved successfully",
  },
  Data: {
    vehicle: {
      vehicleId: "uuid", // [dbt_mt_vehicles.id]
      plateNumber: "B1234XYZ", // [dbt_mt_vehicles.licensePlate]
      vehicleType: "Truck", // [dbt_mt_vehicles.vehicleType]
    },
    currentPosition: {
      latitude: -6.2088, // [dbt_mt_driver_location_log.latitude]
      longitude: 106.8456, // [dbt_mt_driver_location_log.longitude]
      speed: 45.5, // [dbt_mt_driver_location_log.speed]
      heading: 180.0, // [dbt_mt_driver_location_log.heading]
      accuracy: 5.2,
      recordedAt: "2025-01-15T10:30:00+07:00", // [dbt_mt_driver_location_log.recordedAt]
    },
    status: {
      statusCode: "ON_WAY_TO_PICKUP_1", // [dbt_mt_driver_status_log.statusCode]
      statusName: "Menuju ke Lokasi Muat 1", // [dbt_mt_driver_status_log.statusName]
      routeSegmentType: "TO_PICKUP", // [dbt_mt_driver_status_log.routeSegmentType]
      queuePosition: null, // [dbt_mt_driver_status_log.queuePosition]
      progressPercentage: 65.0, // [dbt_mt_driver_status_log.progressPercentage]
      estimatedCompletionTime: "2025-01-15T11:45:00+07:00", // [dbt_mt_driver_status_log.estimatedCompletionTime]
      loadingBayAssignment: null, // [dbt_mt_driver_status_log.loadingBayAssignment]
    },
    locations: {
      pickupLocations: [
        {
          locationId: "uuid", // [dbt_mt_location.id]
          name: "Lokasi Muat 1", // [dbt_mt_location.locationName]
          address: "Jl. Pelabuhan Utara No. 1", // [dbt_mt_location.address]
          latitude: -6.1, // [dbt_mt_location.latitude]
          longitude: 106.8, // [dbt_mt_location.longitude]
          sequence: 1,
          estimatedArrival: "2025-01-15T11:45:00+07:00",
        },
      ],
      dropoffLocations: [
        {
          locationId: "uuid", // [dbt_mt_location.id]
          name: "Lokasi Bongkar 1", // [dbt_mt_location.locationName]
          address: "Jl. Gudang Selatan No. 5", // [dbt_mt_location.address]
          latitude: -6.3, // [dbt_mt_location.latitude]
          longitude: 106.9, // [dbt_mt_location.longitude]
          sequence: 1,
          estimatedArrival: "2025-01-15T14:30:00+07:00",
        },
      ],
    },
    route: {
      activeRoute: {
        routeType: "ACTIVE", // [dbt_mt_driver_location_log.routeType]
        coordinates: [
          {
            latitude: -6.2088,
            longitude: 106.8456,
            segmentSequence: 1, // [dbt_mt_driver_location_log.segmentSequence]
          },
        ],
        distance: 15.2,
        estimatedDuration: 45,
      },
      historicalRoute: {
        routeType: "HISTORICAL", // [dbt_mt_driver_location_log.routeType]
        coordinates: [
          {
            latitude: -6.25,
            longitude: 106.8,
            timestamp: "2025-01-15T09:00:00+07:00",
          },
        ],
        totalDistance: 8.5,
        actualDuration: 35,
      },
      plannedRoute: {
        routeType: "PLANNED", // [dbt_mt_driver_location_log.routeType]
        coordinates: [
          {
            latitude: -6.15,
            longitude: 106.82,
          },
        ],
        estimatedDistance: 22.8,
        estimatedDuration: 60,
      },
    },
    queueInfo: {
      isInQueue: false,
      queueDetails: null,
    },
  },
  Type: "VEHICLE_TRACKING_DATA",
};
```

```js
const a = {
  Message: {
    Code: 200,
    Text: "Location details retrieved successfully",
  },
  Data: {
    pickupLocation: [
      {
        sequence: 1, // [dbt_mt_location.sequence]
        latitude: -6.208763, // [dbt_mt_location.latitude]
        longitude: 106.845599, // [dbt_mt_location.longitude]
        label: "Lokasi Muat", //ga tau bakal handle FE / BE
      },
    ],
    dropoffLocations: [
      {
        sequence: 1, // [dbt_mt_location.sequence]
        latitude: -6.195774, // [dbt_mt_location.latitude]
        longitude: 106.823892, // [dbt_mt_location.longitude]
        label: "Lokasi Muat", //ga tau bakal handle FE / BE
      },
    ],
    fleets: [
      {
        encodedPolyline: "~oifA~i|xSbAcAbBsBfCgDxAgBpBeC",
        start: {
          latitude: -6.195774, // [dbt_mt_location.latitude]
          longitude: 106.823892, // [dbt_mt_location.longitude]
        },
        end: {
          latitude: -6.195774, // [dbt_mt_location.latitude]
          longitude: 106.823892, // [dbt_mt_location.longitude]
        },
        plateNumber: "AB 1234 CD",
        transporterName: "PT. Siba Surya",
        hasSos: true,
      },
    ],
  },
  Type: "VEHICLE_TRACKING_DATA",
};
```

```js
const sosReport = {
  Message: {
    Code: 200,
    Text: "SOS report retrieved successfully",
  },
  Data: {
    category: "Truk/muatan dicuri", // nullable
    description:
      "truk mogok di tengah jalan, lalu segerombolan orang tiba-tiba datang membawa pickup naik keatas truk", // nullable
    licensePlate: "AB 1234 CD",
    truckImage: "https://picsum.photos/100?random=abc",
    reportTime: "2025-01-15T09:30:00+07:00", // [dbt_mt_sos.createdAt]
    images: [
      "https://picsum.photos/200?random=1",
      "https://picsum.photos/200?random=2",
      "https://picsum.photos/200?random=3",
      "https://picsum.photos/200?random=4",
    ],
    vehicleType: "Colt Diesel Double - Bak Terbuka",
    driverName: "Ardian Eka Candra",
    driverPhone: "0823-3123-1290",
    lastLocation: "Kab. Batu",
    orderNumber: "MT25A002A",
    pickupLocation: "Kota Surabaya, Kec. Tegalsari",
    dropoffLocation: "Kab. Pasuruan, Kec. Klojen",

    vehicleId: "uuid", // dipake buat fetching contact
  },
  Type: "SOS_REPORT_DETAILS",
};
```

```js
const contact = {
  Message: {
    Code: 200,
    Text: "Contact information retrieved successfully",
  },
  Data: {
    transporter: {
      entityType: "TRANSPORTER", // dipake buat nge log percobaan contact
      entityId: "uuid-transporter", // dipake buat nge log percobaan contact

      phoneCall: {
        pics: [
          {
            contactPersonId: "uuid-person-1", // tergantung haruse nge-log itu pas copy atau pas click driver/transporter
            name: "John Doe", // [dbm_mt_transporter.picName] (PIC 1 - existing)
            position: "Manager", // [dbm_mt_transporter.picPosition] (PIC 1 - existing)
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone] (PIC 1 - existing),
            Level: 1,
          },
          {
            contactPersonId: "uuid-person-2",
            name: "Jane Smith", // [dbm_mt_transporter.picName2]
            position: "Supervisor", // [dbm_mt_transporter.picPosition2]
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone2],
            Level: 2,
          },
          {
            contactPersonId: "uuid-person-3",
            name: "Bob Wilson", // [dbm_mt_transporter.picName3]
            position: "Coordinator", // [dbm_mt_transporter.picPosition3]
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone3],
            Level: 3,
          },
        ],
        emergencyContact: {
          contactPersonId: "uuid-person-4",
          name: "John Doe", // [dbm_mt_user.fullName]
          position: "Registrant", // Default value
          phoneNumber: "+628123456789", // [dbm_mt_user.phoneNumber]
        },
        companyContact: {
          contactPersonId: "uuid-person-5",
          phoneNumber: "081234567890",
        },
      },
    },
    driver: {
      entityType: "DRIVER", // dipake buat nge log percobaan contact
      entityId: "uuid-driver", // dipake buat nge log percobaan contact

      phoneCall: {
        pics: [
          {
            contactPersonId: "uuid-person-1",
            name: "John Doe", // [dbm_mt_transporter.picName] (PIC 1 - existing)
            position: "Manager", // [dbm_mt_transporter.picPosition] (PIC 1 - existing)
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone] (PIC 1 - existing),
            Level: 1,
          },
          {
            contactPersonId: "uuid-person-2",
            name: "Jane Smith", // [dbm_mt_transporter.picName2]
            position: "Supervisor", // [dbm_mt_transporter.picPosition2]
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone2],
            Level: 2,
          },
          {
            contactPersonId: "uuid-person-3",
            name: "Bob Wilson", // [dbm_mt_transporter.picName3]
            position: "Coordinator", // [dbm_mt_transporter.picPosition3]
            phoneNumber: "081234567890", // [dbm_mt_transporter.picPhone3],
            Level: 3,
          },
        ],
        emergencyContact: {
          contactPersonId: "uuid-person-4",
          name: "John Doe", // [dbm_mt_user.fullName]
          position: "Registrant", // Default value
          phoneNumber: "+628123456789", // [dbm_mt_user.phoneNumber]
        },
        companyContact: {
          contactPersonId: "uuid-person-5",
          phoneNumber: "081234567890",
        },
      },
    },
  },
  Type: "CONTACT_INFORMATION",
};
```

```js
const contactLogBody = {
  entityType: "TRANSPORTER", // or "DRIVER"
  entityId: "uuid", // [dbt_mt_transporters.id] or [dbt_mt_drivers.id]
  contactMethod: "PHONE_CALL", // PHONE_CALL
  contactPersonId: "uuid", // [dbt_mt_transporters_contacts.id] // tergantung haruse nge-log itu pas copy atau pas click driver/transporter
  vehicleId: "uuid", // [dbt_mt_vehicles.id]
  orderId: "uuid", // [dbt_mt_orders.id]
  reason: "SOS_RESPONSE", // SOS_RESPONSE, STATUS_UPDATE, GENERAL_INQUIRY
  notes: "Attempting to contact regarding engine issue", // kayae gamungkin ga sih
};
```
