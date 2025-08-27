<!-- 4. Get Filter Options

Deskripsi
Mengambil opsi filter yang tersedia untuk agenda

Endpoint
GET /v1/transporter/agenda-schedules/filter-options

LD References
LDF-18 - Panel Filter dengan Options (Armada View)
LDF-51 - Panel Filter dengan Options (Driver View)

Parameters
Query Parameters
Path Parameters
| Parameter | Tipe | Wajib | Default |Deskripsi |
| :------------ | :--------------- | :---- | :---- | :-------------------------- |
| Id | String | Ya | armada |Jenis tampilan: armada/driver |

Request Headers

| Header        | Nilai          | Wajib | Deskripsi                   |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya    | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Opsi filter berhasil dimuat"
},
"Data": {
"statusOptions": [
{
"value": "DIJADWALKAN",
"label": "Dijadwalkan",
"count": 5,
"color": "#FFF9C1"
},
{
"value": "BERTUGAS",
"label": "Bertugas",
"count": 7,
"color": "#E2F2FF"
}
],
"truckTypeOptions": [
{
"id": "uuid", // [dbt_mt_order.truckTypeID]
"name": "Box Truck", // [dbt_mt_order.truckTypeName]
"count": 8
}
]
},
"Type": "GET_FILTER_OPTIONS"
} -->

<!-- 1. Get Agenda Schedule Data (OK)

Deskripsi
Mengambil data jadwal agenda armada atau driver berdasarkan periode dan filter yang diterapkan

Endpoint
GET /v1/transporter/agenda-schedules

LD References -->

<!-- LDF-1 - First Timer Empty State (data availability check)
LDF-2 - Main Agenda Display
LDF-5 - Horizontal Date Navigation
LDF-5.1 - Vertical Armada List Scrolling
LDF-5.2 - Auto-disable Navigation at Boundaries
LDF-6 - Today at Column 1 (start period)
LDF-6.1 - Today at Column 2 (balanced start)
LDF-6.2 - Today at Column 3 (optimal position)
LDF-7 - Today at Column 5 (end period) -->

<!-- LDF-19 - Filter Results Display
LDF-20 - Empty State Filter Results
LDF-23 - License Plate Search Results
LDF-24 - Empty State Search Failed
LDF-25 - Combined Search and Filter Success
LDF-26 - Empty State Search + Filter
LDF-27 - Empty State Filter + Search -->

<!-- LDF-37 - Driver Agenda Display
LDF-40 - Driver Horizontal Date Scroll
LDF-40.1 - Driver Vertical List Scroll
LDF-40.2 - Driver Date Navigation Control -->

<!-- LDF-52 - Driver Filter Success
LDF-53 - Driver Filter Failed
LDF-56 - Driver Search Success
LDF-57 - Driver Search Failed
LDF-58 - Driver Search+Filter Success
LDF-59 - Driver Search+Filter Failed (search priority)
LDF-60 - Driver Filter+Search Failed (filter priority)

Parameters
Query Parameters

| Parameter          | Tipe    | Wajib | Default | Deskripsi                          |
| :----------------- | :------ | :---- | :------ | ---------------------------------- |
| page               | integer | Tidak | 1       | Nomor Halaman                      |
| limit              | integer | Tidak | 10      | Items per Halaman                  |
| view type          | string  | Ya    | armada  | Jenis Tampilan: armada/driver      |
| schedule_date_from | date    | Tidak | today   | Tanggal-mulai periode (YYYY-MM-DD) |
| schedule_date_to   | date    | Tidak | today+4 | tanggal-akhir-periode (YYYY-MM-DD) |
| agenda_status      | array   | Tidak | all     | filter-status-agenda               |
| search             | string  | Tidak | -       | Pencarian No Polisi/nama driver    |

Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |
| Content-Type | application/json | Ya | Format Request |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Data agenda berhasil dimuat",
},
"Data": {
"schedules": [
{
// tergantung view type "armada" atau "driver" bisa jadi value dibawah ini bakal nullable
// mode "armada" bakal render licensePlate dan truckType
"licensePlate": "B1234ABC", // nullable
"truckType": "CDD - box", // nullable
// mode "driver" bakal render driverName, driverPhone, dan driverEmail
"driverName": "John Doe", // nullable
"driverPhone": "08123456789", // nullable
"driverEmail": "john.doe@example.com", // nullable

       "schedule": [
         {
           "id": "uuid", // [dbt_mt_agenda_schedule.id]
           "orderID": "uuid", // [dbt_mt_agenda_schedule.orderID]
           "fleetID": "uuid", // [dbt_mt_agenda_schedule.fleetID]
           "driverID": "uuid", // [dbt_mt_agenda_schedule.driverID]
           "scheduleDate": "2024-04-01", // [dbt_mt_agenda_schedule.scheduleDate]
           "scheduleEndDate": "2024-04-05", // dari estimasi jarak dan rata2 kecepatan armada
           "additionalUnloadTimeStart": "2024-04-06", // dari schedule end + hari dari bo
           "additionalUnloadTimeEnd": "2024-04-06", // dari schedule end + hari dari bo
           "scheduledStartTime": "2024-04-01T08:00:00Z", // [dbt_mt_agenda_schedule.scheduledStartTime]
           "scheduledEndTime": "2024-04-01T17:00:00Z", // [dbt_mt_agenda_schedule.scheduledEndTime]


           //Field di bawah ini confirmed dipake sama EKA
           "agendaStatus": "BERTUGAS", // [dbt_mt_agenda_schedule.agendaStatus]
           "position": 0, // posisi mulai render di tanggal terkait
           "scheduled": 2, // jumlah kolom sebelah kiri card
           "additional": 1, // jumlah kolom sebelah kanan card
           "hasSosIssue": false, // [dbt_mt_agenda_schedule.hasSosIssue]
           "isConflicted": false, // [dbt_mt_agenda_schedule.isConflicted] isConflicted itu pasti juga urgentIssue, hasUrgentIssue tak hapus
    	“scheduleConflictID”: uuid
           "estimation": {
             "currentLocation": "Jakarta", // [dbt_mt_agenda_schedule.currentLocationName],
             "nextDistance": 10, //jarak ke next destinasi
             "nextTime": 30, //waktu tempuh ke next destinasi (menit), dari FE perlu convert jadi relative time
           },
           "firstDestinationName": "Surabaya, Kec. Pabean",
           "estimatedTotalDistanceKm": 121.5, // estimasi total jarak dari firstDestination ke lastDestination
           "lastDestinationName": "Bali, Kec. Denpasar",


           // tergantung view type "armada" atau "driver" bisa jadi value dibawah ini bakal nullable
           // mode "armada" bakal render "driverName"
           "driverName": "John Doe", // [dbt_mt_drivers.name]
           // mode "driver" bakal render "licensePlate - truckType"
           "licensePlate": "B1234ABC", // [dbm_mt_fleet.licensePlate]
           "truckType": "Box", // [dbt_mt_order.truckType]
         },
       ],
     },

],
"pagination": {
"currentPage": 1,
"totalPages": 5,
"totalItems": 45,
"itemsPerPage": 10,
},
"summary": {
"totalArmada": 15,
"totalDriver": 12,
"statusCounts": {
"DIJADWALKAN": 5,
"MENUNGGU_JAM_MUAT": 3,
"BERTUGAS": 7,
"PENGIRIMAN_SELESAI": 2,
"NON_AKTIF": 1,
"SOS": 0,
},
// jumlah tugas di hari yg berkaitan (buat di header)
"countPerDay": [
1, 2, 3, 2, 3,
],
// konflik di hari yg berkaitan (buat di header)
"countConflictedPerDay": [
false, false, true, false, false,
],
},
"lastUpdated": "2024-04-01T10:30:00Z",
},
"Type": "GET_AGENDA_SCHEDULES",
}

Error Response (400 Bad Request)
{
"Message": {
"Code": 400,
"Text": "Parameter tidak valid"
},
"Data": {
"errors": [
{
"field": "view_type",
"message": "Nilai harus armada atau driver"
}
]
},
"Type": "GET_AGENDA_SCHEDULES_ERROR"
}

5. Get Search Suggestions

Deskripsi
Mengambil saran pencarian berdasarkan input pengguna

Endpoint
GET /v1/transporter/agenda-schedules/search-suggestions

LD References
LDF-22 - Real-time Search Suggestions (Armada View)
LDF-55 - Real-time Search Suggestions (Driver View)

Parameters
Query Parameters
Parameters
Query Parameters

| Parameter | Tipe    | Wajib | Default | Deskripsi                           |
| :-------- | :------ | :---- | :------ | ----------------------------------- |
| query     | string  | Ya    | -       | Keyowrd Pencarian ( min 2 karakter) |
| limit     | integer | Tidak | 5       | Maksimal suggestions                |
| view_type | string  | Ya    | armada  | Jenis Tampilan: armada/driver       |

Request Headers

| Header        | Nilai          | Wajib | Deskripsi                   |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya    | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Saran pencarian berhasil dimuat"
},
"Data": {
"suggestions": [
{
"type": "LICENSE_PLATE", // [dbt_mt_agenda_search_cache.searchType]
"value": "B1234ABC",
"label": "B 1234 ABC - Box Truck",
"fleetID": "uuid", // [dbm_mt_fleet.id]
"matchCount": 3
},
{
"type": "DRIVER_NAME",
"value": "John Doe",
"label": "John Doe - Driver",
"driverID": "uuid", // [dbt_mt_drivers.id]
"matchCount": 2
}
],
"cacheHit": true
},
"Type": "GET_SEARCH_SUGGESTIONS"
} -->

<!--
7. Get Schedule Conflicts

Deskripsi
Mengambil daftar konflik jadwal yang terdeteksi

Endpoint
GET /v1/transporter/agenda-schedules/conflicts

LD References
LDF-29 - Modal Edit Jadwal Bertabrakan (Armada View)
LDF-62 - Modal Edit Jadwal Bertabrakan (Driver View)

Parameters
Query Parameters
| Parameter | Tipe | Wajib | Default Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| resolution_status | string | Tidak |PENDING |status resolusi: PENDING/RESLVED |

Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Data konflik jadwal berhasil dimuat"
},
"Data": {
"conflicts": [
{
"id": "uuid", // [dbt_mt_schedule_conflict.id]
"conflictType": "TIME_OVERLAP", // [dbt_mt_schedule_conflict.conflictType]
"resolutionStatus": "PENDING", // [dbt_mt_schedule_conflict.resolutionStatus]
"primarySchedule": {
"agendaStatus": "Bertugas", // [dbt_mt_agenda_schedule.status]
"estimatedDistanceKm": 10, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
"id": "uuid", // [dbt_mt_schedule_conflict.primaryScheduleID]
"orderCode": "ORD-001", // [dbt_mt_order.orderCode]
"fleetLicensePlate": "B1234ABC", // [dbm_mt_fleet.licensePlate]
"driverName": "John Doe", // [dbt_mt_drivers.name]
"unloadingName": "Jakarta", // [dbt_mt_agenda_schedule.unloadingName]
"loadingName": "Surabaya", // [dbt_mt_agenda_schedule.loadingName]
"scheduledTime": "2024-04-01T08:00:00Z" // [dbt_mt_agenda_schedule.scheduledStartTime]
},
"conflictingSchedule": {
"agendaStatus": "Bertugas", // [dbt_mt_agenda_schedule.status]
"estimatedDistanceKm": 10, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
"id": "uuid", // [dbt_mt_schedule_conflict.conflictingScheduleID]
"orderCode": "ORD-002", // [dbt_mt_order.orderCode]
"fleetLicensePlate": "B1234ABC", // [dbm_mt_fleet.licensePlate]
"driverName": "John Doe", // [dbt_mt_drivers.name]
"unloadingName": "Jakarta", // [dbt_mt_agenda_schedule.unloadingName]
"loadingName": "Surabaya", // [dbt_mt_agenda_schedule.loadingName]
"scheduledTime": "2024-04-01T08:30:00Z" // [dbt_mt_agenda_schedule.scheduledStartTime]
},
"detectedAt": "2024-04-01T07:45:00Z" // [dbt_mt_schedule_conflict.detectedAt]
}
]
},
"Type": "GET_SCHEDULE_CONFLICTS"
}

8. Get Alternative Fleet Options

Deskripsi
Mengambil pilihan armada alternatif untuk resolusi konflik

Endpoint
GET /v1/transporter/agenda-schedules/conflicts/{conflict_id}/alternatives

LD References
LDF-30 - Dropdown Search Armada Alternatif (Armada View)
LDF-63 - Dropdown Search Armada Alternatif (Driver View)
LDF-64 - Search Data Ditemukan (Driver View)
LDF-65 - Search Data Tidak Ditemukan (Driver View)

Parameters
Path Parameters
| Parameter | Tipe | Wajib |Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| conflict_id | string | Ya |ID konflik jadwal |

Query Parameters

| Parameter | Tipe   | Wajib | Default Deskripsi |
| :-------- | :----- | :---- | :---------------- | ----------------------------- |
| search    | string | Tidak | -                 | Pencarian armada authentikasi |

Request Headers
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Armada alternatif berhasil dimuat"
},
"Data": {
"alternatives": [
{
"fleetID": "uuid", // [dbm_mt_fleet.id]
"licensePlate": "B5678DEF", // [dbm_mt_fleet.licensePlate]
"truckTypeName": "Box Truck", // [dbt_mt_order.truckTypeName]
"availableDriver": {
"id": "uuid", // [dbt_mt_drivers.id]
"name": "Jane Smith", // [dbt_mt_drivers.name]
"driverStatus": "AVAILABLE" // [dbt_mt_drivers.driverStatus]
},
"isCompatible": true,
"availabilityScore": 95,
"estimatedReadyTime": "2024-04-01T07:30:00Z"
}
]
},
"Type": "GET_ALTERNATIVE_FLEETS"
}

9. Resolve Schedule Conflict

Deskripsi
Menyelesaikan konflik jadwal dengan memilih resolusi

Endpoint
PUT /v1/transporter/agenda-schedules/conflicts/{conflict_id}/resolve

LD References
LDF-29 - Modal Edit Jadwal Bertabrakan (Armada View)
LDF-62 - Modal Edit Jadwal Bertabrakan (Driver View)

Parameters
Path Parameters
| Parameter | Tipe | Wajib |Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| conflict_id | String | Ya |ID konflik jadwal |

Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |
| Content-Type | application/json | Ya | Format request body |

Request Body
{
"resolutionType": "REASSIGN_FLEET", // [dbt_mt_schedule_conflict.resolutionType]
"newFleetID": "uuid", // [dbm_mt_fleet.id]
"newDriverID": "uuid", // [dbt_mt_drivers.id]
"resolutionNotes": "Reassigned to available fleet" // [dbt_mt_schedule_conflict.resolutionNotes]
}
Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Konflik jadwal berhasil diselesaikan"
},
"Data": {
"conflictID": "uuid", // [dbt_mt_schedule_conflict.id]
"resolutionStatus": "RESOLVED", // [dbt_mt_schedule_conflict.resolutionStatus]
"resolvedAt": "2024-04-01T11:00:00Z", // [dbt_mt_schedule_conflict.resolvedAt]
"updatedSchedule": {
"id": "uuid", // [dbt_mt_agenda_schedule.id]
"fleetID": "uuid", // [dbt_mt_agenda_schedule.fleetID]
"driverID": "uuid", // [dbt_mt_agenda_schedule.driverID]
"isConflicted": false // [dbt_mt_agenda_schedule.isConflicted]
}
},
"Type": "RESOLVE_SCHEDULE_CONFLICT"
} -->
<!--
3. Get Available Periods

Deskripsi
Mengambil daftar tahun dan bulan yang memiliki data agenda

Endpoint
GET /v1/transporter/agenda-schedules/available-periods

LD References
LDF-14 - Dropdown Pilih Tahun (Armada View)
LDF-15 - Dropdown Pilih Bulan (Armada View)
LDF-16 - Update View dengan Periode Baru (Armada View)
LDF-47 - Dropdown Pilih Tahun (Driver View)
LDF-48 - Dropdown Pilih Bulan (Driver View)
LDF-49 - Update View dengan Periode Baru (Driver View)

Parameters
Query Parameters
| Parameter | Tipe | Wajib | Default ~ Deskripsi |
| :-------- | :----- | :---- | :---------------- | ----------------------------- |
| year | integer | Tidak | - | Tahun untuk filter bulan |

Request Headers
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Data periode berhasil dimuat"
},
"Data": {
"availableYears": [2023, 2024], // ini gk perlu
"availableMonths": {
"2024": [1, 2, 3, 4],
"2023": [10, 11, 12]
},
"dataRanges": {
"earliest": "2023-10-01",
"latest": "2024-04-30"
}
},
"Type": "GET_AVAILABLE_PERIODS"
} -->

10. Update Schedule Estimation

Deskripsi
Mengupdate estimasi jarak dan waktu untuk jadwal

Endpoint
PUT /v1/transporter/agenda-schedules/{id}/estimation

LD References
LDF-35 - Modal Edit Estimasi (Armada View)
LDF-35.1 - Modal Edit Estimasi Variation (Armada View)
LDF-35.3 - Modal Edit Estimasi Final (Armada View)
LDF-67 - Modal Edit Estimasi (Driver View)
LDF-67.1 - Modal Edit Estimasi Variation (Driver View)
LDF-67.2 - Modal Edit Estimasi Final (Driver View)

Parameters
Path Parameters
| Parameter | Tipe | Wajib | Deskripsi |
| :-------- | :----- | :---- | ----------------------------- |
| id | string | Ya | ID agenda schedule |

Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |
| Content-Type | application/json | Ya | Format request body |

Request Body
{
"estimatedDistanceKm": 125.0, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
"estimatedDurationMinutes": 500, // [dbt_mt_agenda_schedule.estimatedDurationMinutes]
"updateReason": "Traffic condition changed" // [dbt_mt_schedule_estimation.updateReason]
}
Response Success (200 OK)
{
"Message": {
"Code": 200,
"Text": "Estimasi berhasil diperbarui"
},
"Data": {
"scheduleID": "uuid", // [dbt_mt_agenda_schedule.id]
"previousEstimation": {
"distanceKm": 121.5, // [dbt_mt_schedule_estimation.originalDistanceKm]
"durationMinutes": 480 // [dbt_mt_schedule_estimation.originalDurationMinutes]
},
"newEstimation": {
"distanceKm": 125.0, // [dbt_mt_schedule_estimation.currentDistanceKm]
"durationMinutes": 500 // [dbt_mt_schedule_estimation.currentDurationMinutes]
},
"lastRecalculated": "2024-04-01T11:15:00Z" // [dbt_mt_schedule_estimation.lastRecalculated]
},
"Type": "UPDATE_SCHEDULE_ESTIMATION"
}
Error Response (400 Bad Request)
{
"Message": {
"Code": 400,
"Text": "Estimasi tidak valid"
},
"Data": {
"errors": [
{
"field": "estimatedDistanceKm",
"message": "Jarak tidak boleh kurang dari 1 km"
}
]
},
"Type": "UPDATE_SCHEDULE_ESTIMATION_ERROR"
}
