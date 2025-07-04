API Kontrak Muat Trans - LENGKAP dengan Semua 67
Endpoints
Daftar Isi
•
Bagian 1: Pengaturan Aplikasi
•
Bagian 2: Pencarian dan Manajemen Lokasi

•
Bagian 3: Manajemen Muatan dan Kendaraan
•
Bagian 4: Layanan Tambahan dan Asuransi
•
Bagian 5: Sistem Pembayaran
•
Bagian 6: Manajemen Pesanan
•
Bagian 7: Tracking dan Monitoring
•
Bagian 8: Settlement dan Keuangan
•
Bagian 9: Analytics dan Reporting
•
Bagian 10: Alternate Flow Endpoints

Bagian 1: Pengaturan Aplikasi
1.1 Cek Status First Timer
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - LD References:
[LD-1] - Homepage popup ﬁrst timer functionality
Get User First Time Status
Deskripsi: Memeriksa apakah pengguna pertama kali mengunjungi aplikasi
untuk menampilkan popup.
Endpoint
GET /base_url/v1/orders/user-preferences
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)

{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"shouldShowPopup": true,
"language": "id"
},
"type": "USER_PREFERENCES"
}
Error Response (401 Unauthorized)
{
"message": {
"code": 401,
"text": "Unauthorized access"
},
"data": null,
"type": "USER_PREFERENCES"
}
1.2 Simpan Preferensi Popup
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - LD References:
[LD-1] - Homepage popup ﬁrst timer functionality
Save Popup Preference
Deskripsi: Menyimpan preferensi pengguna untuk tidak menampilkan popup di
kunjungan berikutnya.
Endpoint
POST /base_url/v1/orders/user-preferences
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body

Request Body
{
"dontShowAgain": true
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Preference saved successfully"
},
"data": {
"dontShowAgain": true,
"updatedAt": "2025-05-21T10:30:00Z"
},
"type": "USER_PREFERENCES"
}
1.3 Mendapatkan Jumlah Sidebar Count
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - KO-25 (Instant):
Daftar Pesanan - LD References: [LD-1.2] - Notiﬁcation and chat counter
display,[LD-2.2] - Order list counter format (1-99, >99 shows “99+”), [LD-2.3] -
Active order counter logic (all orders except COMPLETED status)
Get Sidebar Count
Deskripsi: Mendapatkan jumlah notiﬁkasi, chat, dan pesanan aktif.
Endpoint
GET /base_url/v1/orders/sidebar-count
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,

    "text": "Success"

},
"data": {
"notiﬁcation": 5,
"chat": 5,
"order": 5
},
"type": "/navbar-analytic/count"
}
1.4 Mendapatkan Banner Ads
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - LD References:
[LD-1.1] - Homepage Muatrans main interface layout
Get Banner Ads
Deskripsi: Mendapatkan data banner iklan dari CMS untuk ditampilkan di
homepage.
Endpoint
GET /base_url/v1/orders/banner-ads
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Tidak
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"banners": [
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"orderNumber": 1,
"imageUrlApp": "https://example.com/banner1.jpg",
"imageUrl": "https://example.com/banner1.jpg",
"link": "https://example.com/promo"
},
{

        "id": "550e8400-e29b-41d4-a716-446655440001",
        "orderNumber": 2,
        "imageUrlApp": "https://example.com/banner2.jpg",
        "imageUrl": "https://example.com/banner2.jpg",
        "link": "https://example.com/armada-baru"
      }
    ]

},
"type": "BANNER_ADS"
}
1.5 Mendapatkan Proﬁl Pengguna
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - LD References:
[LD-2] - Sidebar menu main layout and components
Get User Proﬁle
Deskripsi: Mendapatkan data proﬁl pengguna untuk ditampilkan di sidebar.
Endpoint
GET https://api-az.assetlogistik.com/v1/muatparts/proﬁle
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "OK"
},
"Data": {
"proﬁle": {
"id": "2953",
"name": "friday sub user",
"noWA": "081331731770",
"email": "fridayanditars@gmail.com",
"accountTypeID": 1,
"accountType": "Perusahaan",
"refferalCode": null,
"avatar":

"https://azlogistik.s3.ap-southeast-3.amazonaws.com/content-general/assets/avatar/pr
oﬁle/2953.png",
"isVerifPhone": 1,
"isVerifEmail": 0
},
"storeInformation": {},
"companyData": {},
"legality": {}
},
"Type": "/v1/muatparts/proﬁle"
}
1.6 Mendapatkan Pengaturan Waktu
Referensi KO & LD: - KO-01 (Instant & Scheduled): Tampilan awal form
pemesanan, sidebar menu dan pengisian tanggal & waktu muat - LD References:
[LD-3] - Default date & time picker bottomsheet, [LD-4] - Default time range
selection
Get Time Settings
Deskripsi: Mendapatkan pengaturan waktu dari backoﬃce untuk validasi waktu
minimal dan maksimal pemesanan.
Endpoint
GET /base_url/v1/orders/settings/time
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"instantOrder": {
"minHoursFromNow": 1,
"maxDaysFromNow": 1
},
"scheduledOrder": {
"minDaysFromNow": 24,

      "maxDaysFromNow": 30
    },
    "loadingTime": {
      "minRangeHours": 1,
      "maxRangeHours": 8
    },
    "waitingTime": {
      "toleranceHours": 12,
      "hourlyRate": 50000
    },
    "currentServerTime": "2025-05-21T12:30:00+07:00"

},
"type": "TIME_SETTINGS"
}

Bagian 2: Pencarian dan Manajemen Lokasi
2.1 Mendapatkan Riwayat Lokasi Transaksi
Referensi KO & LD: - KO-02 (Instant & Scheduled): Pengisian lokasi muat dan
bongkar - LD References: [LD-5.11] - Empty state when no recent searches, saved
locations, or transaction history
Get Location History
Deskripsi: Mendapatkan list lokasi transaksi terakhir.
Endpoint
GET /base_url/v1/orders/history-locations?locationType=DROPOFF/PICKUP
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {

    "locations": [
      {
        "ID": "uuid",
        "Address": "Wonocolo IV Jemur Wonosari Surabaya Jawa Timur Indonesia",
        "AddressDetail": "wonocolo AND 3159 AND 39593959",
        "Latitude": -7.3176429,
        "Longitude": 112.7365618,
        "Province": "Jawa Timur",
        "ProvinceID": 35,
        "City": "Kota Surabaya",
        "CityID": 3578,
        "District": "Wonocolo",
        "DistrictID": 357802,
        "PostalCode": "60236",
        "PicName": "friday",
        "PicNoTelp": "081357652067",
        "PlaceID": null,
      }
    ]

},
"type": "HISTORY-LOCATIONS"
}

Bagian 3: Manajemen Muatan dan Kendaraan
3.1 Mendapatkan Master Data Tipe Muatan
Referensi KO & LD: - KO-03 (Instant & Scheduled): Pengisian informasi muatan -
LD References: [LD-8.1] - Cargo type ﬁeld ﬁlled state
Get Cargo Types
Deskripsi: Mendapatkan daftar jenis muatan.
Endpoint
GET /base_url/v1/orders/cargos/types
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)

{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"types": [
{
"id": "550e8400-e29b-41d4-a716-446655440030",
"name": "Barang Mentah",
"description": "Barang mentah"
},
{
"id": "550e8400-e29b-41d4-a716-446655440031",
"name": "Barang Jadi",
"description": "Barang jadi"
}
]
},
"type": "CARGO_TYPES"
}
3.2 Mendapatkan Master Data Kategori Muatan
Referensi KO & LD: - KO-03 (Instant & Scheduled): Pengisian informasi muatan -
LD References: [LD-8.2] - Cargo weight ﬁeld ﬁlled state
Get Cargo Categories
Deskripsi: Mendapatkan daftar kategori muatan.
Endpoint
GET /base_url/v1/orders/cargos/categories
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},

"data": {
"categories": [
{
"id": "550e8400-e29b-41d4-a716-446655440030",
"name": "Padat",
"description": "Benda padat"
},
{
"id": "550e8400-e29b-41d4-a716-446655440031",
"name": "Cair",
"description": "Benda cair"
}
]
},
"type": "CARGO_CATEGORIES"
}
3.3 Mendapatkan Daftar Nama Muatan
Referensi KO & LD: - KO-03 (Instant & Scheduled): Pengisian informasi muatan -
LD References: [LD-8] - Cargo information form main page
Get Cargo Names
Deskripsi: Mendapatkan daftar nama muatan yang tersedia.
Endpoint
GET /base_url/v1/orders/cargos/names
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Default
Deskripsi
cargoTypeId
string
Ya

- ID tipe
  muatan
  cargoCatego
  ryId
  string
  Ya
- ID kategori
  muatan
  search
  string
  Tidak
  null
  Kata kunci
  pencarian
  page
  integer
  Tidak
  1
  Nomor
  halaman

Parameter
Tipe
Wajib
Default
Deskripsi
limit
integer
Tidak
10
Jumlah item
per halaman
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"cargoNames": [
{
"cargoNameId": "550e8400-e29b-41d4-a716-446655440030",
"name": "Beras",
"cargoTypeId": "550e8400-e29b-41d4-a716-446655440031",
"cargoCategoryId": "550e8400-e29b-41d4-a716-446655440032"
},
{
"cargoNameId": "550e8400-e29b-41d4-a716-446655440033",
"name": "Gula",
"cargoTypeId": "550e8400-e29b-41d4-a716-446655440031",
"cargoCategoryId": "550e8400-e29b-41d4-a716-446655440032",
"usageCount": 85
}
],
"pagination": {
"page": 1,
"limit": 10,
"totalItems": 2,
"totalPages": 1
}
},
"type": "CARGO_NAMES"
}
3.4 Mendapatkan Daftar Carrier yang Direkomendasikan
Referensi KO & LD: - KO-04 (Instant): Pengisian carrier dan truk - KO-04
(Scheduled): Pengisian carrier dan truk serta jumlah armada - LD References:
[LD-9] - Carrier selection main page
Get Recommended Carriers
Deskripsi: Mendapatkan daftar carrier yang direkomendasikan berdasarkan
lokasi dan preferensi.

Endpoint
GET /base_url/v1/orders/carriers/recommended
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Default
Deskripsi
cargoCatego
ryId
string
Ya
null
ID kategori
kargo
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"recommendedCarriers": [
{
"carrierId": "550e8400-e29b-41d4-a716-446655440050",
"name": "Box",
"image": "https://example.com/images/box.jpg",
"isRecommended": true
}
],
"nonRecommendedCarriers": [
{
"carrierId": "550e8400-e29b-41d4-a716-446655440052",
"name": "Tangki",
"image": "https://example.com/images/tank.jpg",
"isRecommended": false
},
{
"carrierId": "550e8400-e29b-41d4-a716-446655440053",
"name": "Bak Terbuka",
"image": "https://example.com/images/open.jpg",
"isRecommended": false
}
]
},

"type": "CARRIER_RECOMMENDATIONS"
}
3.5 Menghitung Jarak Antar Lokasi
Referensi KO & LD: - KO-07 (Instant & Scheduled): Informasi detail biaya - LD
References: [LD-13] - View cost details button and main cost breakdown
Calculate Distance
Deskripsi: Menghitung jarak antar lokasi untuk estimasi biaya.
Endpoint
POST /base_url/v1/orders/calculate-distance
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"origin": [{
"lat": -123123123,
"long": -123123123
}],
"destination": [{
"lat": -123123123,
"long": -123123123
}]
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"estimatedDistance": 75.5,
"distanceUnit": "km",
"estimatedTime": 3.5
},

"type": "CALCULATE_DISTANCE"
}
3.6 Mendapatkan Truk yang Direkomendasikan
Referensi KO & LD: - KO-04 (Instant): Pengisian carrier dan truk - KO-04
(Scheduled): Pengisian carrier dan truk serta jumlah armada - LD References:
[LD-10] - Truck selection main page
Get Recommended Trucks
Deskripsi: Mendapatkan daftar truk yang direkomendasikan berdasarkan muatan
dan jarak.
Endpoint
POST /base_url/v1/orders/trucks/recommended
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"carrierId": "550e8400-e29b-41d4-a716-446655440060",
"weight": 20,
“weightUnit”: “ton”,
"dimensions": {
"length": 4.3,
"width": 1.8,
"height": 1.8,
"dimensionUnit": "m"
},
"origin": [{
"lat": -123123123,
"long": -123123123
}],
"destination": [{
"lat": -123123123,
"long": -123123123
}],
"loadTimeStart": "2025-02-08T09:00:00Z",
"loadTimeEnd": "2025-02-08T12:00:00Z",

"orderType": "INSTANT"
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"recommendedTrucks": [
{
"truckTypeId": "550e8400-e29b-41d4-a716-446655440060",
"name": "CDE Engkel",
"description": "Colt Diesel Engkel box tertutup",
"unit": 2,
"basePrice": 500000,
"maxWeight": 2000,
"weightUnit": "kg",
"dimensions": {
"length": 4.3,
"width": 1.8,
"height": 1.8,
"dimensionUnit": "m"
},
"image": "https://example.com/images/cde.jpg",
"price": 1000000
}
],
"nonRecommendedTrucks": [
{
"truckTypeId": "550e8400-e29b-41d4-a716-446655440061",
"name": "CDD",
"description": "Colt Diesel Double box tertutup",
"maxWeight": 4000,
"weightUnit": "kg",
"dimensions": {
"length": 6.0,
"width": 2.0,
"height": 2.0,
"dimensionUnit": "m"
},
"image": "https://example.com/images/cdd.jpg",
"price": 2500000
}
],

    "priceComponents": {
      "estimatedDistance": 75.5,
      "distanceUnit": "km"
    }

},
"type": "TRUCK_RECOMMENDATIONS"
}
3.7 Menghitung Harga Jasa Angkut
Referensi KO & LD: - KO-07 (Instant & Scheduled): Informasi detail biaya - LD
References: [LD-13.1] - Cost details bottomsheet
Calculate Transport Price
Deskripsi: Menghitung harga jasa angkut berdasarkan parameter pesanan.
Endpoint
POST /base_url/v1/orders/calculate-price
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"calculationType": "FULL_ORDER_PRICING",
"truckData": {
"carrierId": "550e8400-e29b-41d4-a716-446655440050",
"truckTypeId": "550e8400-e29b-41d4-a716-446655440060",
"distance": 75.5,
"distanceUnit": "km",
"orderType": "INSTANT",
"truckCount": 1
},
"insuranceData": {
"insuranceOptionId": "550e8400-e29b-41d4-a716-446655440071",
"coverageAmount": 20000000
},
"additionalServices": [
{
"serviceId": "550e8400-e29b-41d4-a716-446655440000",
"price": 25000,
"withShipping": true,

      "shippingCost": 25000
    },
    {
      "serviceId": "550e8400-e29b-41d4-a716-446655440001",
      "price": 60000,
      "withShipping": false
    }

],
"voucherData": {
"voucherId": "550e8400-e29b-41d4-a716-446655440001",
"applyDiscount": true
},
"businessEntity": {
"isBusinessEntity": false,
"taxRate": 0.11
}
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"price": {
"transportFee": 1500000,
"insuranceFee": 0,
"additionalServiceFee": [],
"voucher": 0,
"adminFee": 10000,
"taxAmount": 150000,
"totalPrice": 1660000
}
},
"type": "SHIPPING_PRICE"
}

Bagian 4: Layanan Tambahan dan Asuransi
4.1 Mendapatkan Opsi Premi Asuransi
Referensi KO & LD: - KO-05 (Instant & Scheduled): Pengisian asuransi barang -
LD References: [LD-11] - Insurance selection bottomsheet
Get Insurance Options
Deskripsi: Mendapatkan opsi premi asuransi yang tersedia.
Endpoint
GET /api/v1/insurance/options
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"insuranceOptions": [
{
"insuranceOptionId": "550e8400-e29b-41d4-a716-446655440070",
"name": "Gratis perlindungan hingga Rp10.000.000",
"minCoverageAmount": 0,
"maxCoverageAmount": 10000000,
"premiumRate": 0,
"isFree": true
},
{
"insuranceOptionId": "550e8400-e29b-41d4-a716-446655440071",
"name": "Perlindungan hingga Rp30.000.000",
"minCoverageAmount": 10000001,
"maxCoverageAmount": 30000000,
"premiumRate": 0.001,
"isFree": false
}
],
"defaultOptionId": "550e8400-e29b-41d4-a716-446655440070"

},
"type": "INSURANCE_OPTIONS"
}
4.2 Menghitung Premi Asuransi
Referensi KO & LD: - KO-05 (Instant & Scheduled): Pengisian asuransi barang -
LD References: [LD-11.2] - Manual insurance amount input ﬁeld active
Calculate Insurance Premium
Deskripsi: Menghitung premi asuransi berdasarkan nilai barang dan opsi yang
dipilih.
Endpoint
POST /api/v1/insurance/calculate-premium
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"coverageAmount": 20000000,
"insuranceOptionId": "550e8400-e29b-41d4-a716-446655440071"
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"coverageAmount": 20000000,
"premiumAmount": 20000,
"premiumRate": 0.001,
"isCustomAmount": false,
"insuranceOptionId": "550e8400-e29b-41d4-a716-446655440071"
},
"type": "INSURANCE_PREMIUM"
}

4.3 Mendapatkan Layanan Tambahan Aktif
Referensi KO & LD: - KO-06 (Instant & Scheduled): Pengisian layanan tambahan -
LD References: [LD-12] - Additional services main page
Get Additional Services
Deskripsi: Mendapatkan daftar layanan tambahan yang tersedia.
Endpoint
GET /base_url/v1/orders/additional-services
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": [
{
"id": "550e8400-e29b-41d4-a716-446655440000",
"name": "Kirim Bukti Fisik Penerimaan Barang",
"description": "Layanan untuk mengirim bukti ﬁsik penerimaan barang ke alamat yang
ditentukan",
"price": 0
},
{
"id": "550e8400-e29b-41d4-a716-446655440001",
"name": "Troli",
"description": "Troli",
"price": 25000
}
],
"type": "ADDITIONAL_SERVICES"
}
4.4 Mendapatkan Opsi Pengiriman
Referensi KO & LD: - KO-06 (Instant & Scheduled): Pengisian layanan tambahan -
LD References: [LD-12.18] - Shipping option selection page

Get Shipping Options
Deskripsi: Mendapatkan opsi pengiriman untuk layanan tambahan.
Endpoint
GET /base_url/v1/orders/shipping-options
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Deskripsi
lat
string
Ya
lat tujuan
long
string
Ya
long tujuan
orderId
UUID
No
UUID Order
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"available": true,
"shippingOptions": [
{
"groupName": "Reguler",
"expeditions": [
{
"id": "0d5de669-e7ba-46f4-a8c6-0f3192ed7465",
"courierName": "J&T Express",
"libraryID": 1,
"rateID": 57,
"minEstimatedDay": 2,
"maxEstimatedDay": 4,
"originAreaId": 69700,
"destinationAreaId": 29645,
"weight": 1,
"originalCost": 127000,
"originalInsurance": 250,
"mustUseInsurance": false
}

        ]
      }
    ]

},
"type": "SHIPPING_OPTIONS"
}

Bagian 5: Sistem Pembayaran
5.1 Mengunggah Foto Muatan
Referensi KO & LD: - KO-08 (Instant & Scheduled): Informasi pesanan lanjutan -
LD References: [LD-14.1] - Photo/ﬁle upload bottomsheet options
Upload Cargo Photos
Deskripsi: Mengunggah foto muatan untuk dokumentasi pesanan.
Endpoint
POST /base_url/v1/orders/upload
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
multipart/form-
data
Ya
Format untuk
upload ﬁle
Request Form Data
Field
Tipe
Wajib
Deskripsi
ﬁle
ﬁle
Ya
File foto (jpg,
jpeg, png, max
10MB)
type
string
Ya
Tipe foto
(MAIN/ADDITION
AL)
sequence
integer
Tidak
Urutan foto
Response
Success Response (201 Created)

{
"message": {
"code": 201,
"text": "Photos uploaded successfully"
},
"data": {
"id": "550e8400-e29b-41d4-a716-446655440000",
"photoUrl": "https://storage.muatrans.com/cargos/photo-123456.jpg",
"type": "MAIN",
"sequence": 1
},
"type": "CARGO_UPLOAD"
}
5.2 Mendapatkan Metode Pembayaran
Referensi KO & LD: - KO-09 (Instant & Scheduled): Pilih opsi bayar & penggunaan
voucher - LD References: [LD-15] - Payment options main page, [LD-6.1] -
Payment method selection interface, [LD-6.2] - Payment method validation rules
Get Payment Methods
Deskripsi: Mendapatkan daftar metode pembayaran yang tersedia.
Endpoint
GET /api/v1/payment/methods
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": [
{
"channel": "VA",
"category": "Transfer Virtual Account",

            "icon":

"https://azlogistik-rce.s3.ap-southeast-3.amazonaws.com/rc/ﬁle-1739244169458.webp"
,
"methods": [
{
"id": "874df675-a424-4e41-a2b4-07b8c05b6c2f",
"name": "Permata Virtual Account",
"code": "permata",
"icon":
"https://azlogistik-rc.s3.ap-southeast-3.amazonaws.com/rc/ﬁle-1736740165999.webp",
"paymentType": "permata",
"fee": "1000",
"feeUnit": "currency",
"additionalFee": "0.00",
"subsidy": "3000.00"
}
]
"type": "PAYMENT_METHODS"
}
5.3 Mendapatkan Voucher Tersedia
Referensi KO & LD: - KO-09 (Instant & Scheduled): Pilih opsi bayar & penggunaan
voucher - LD References: [LD-16] - Voucher selection bottomsheet, [LD-6.3] -
Voucher validation and discount calculation, [LD-6.4] - Voucher application
process
Get Available Vouchers
Deskripsi: Mendapatkan daftar voucher yang tersedia untuk pengguna.
Endpoint
GET /base_url/v1/orders/vouchers

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"vouchers": [
{
"id": "550e8400-e29b-41d4-a716-446655440070",
"code": "DISKON50K",
"name": "Diskon 50 Ribu",
"description": "Potongan Rp 50.000 untuk transaksi minimal Rp 1.000.000",
"discountAmount": 50000,
"minOrderAmount": 300000,
"maxDiscountAmount": 100000,
"validFrom": "2023-01-01T00:00:00Z",
"validTo": "2023-12-31T23:59:59Z",
"termsAndConditions": "1. Voucher berlaku untuk semua pengguna\\n2. Masa
berlaku voucher sampai 31 Desember 2023\\n3. Minimum pembelian Rp 300.000"
}
]
},
"type": "AVAILABLE_VOUCHERS"
}
5.4 Validasi Voucher
Referensi KO & LD: - KO-09 (Instant & Scheduled): Pilih opsi bayar & penggunaan
voucher - LD References: [LD-16.8A] - Voucher minimum transaction amount
validation
Validate Voucher
Deskripsi: Memvalidasi kode voucher yang dimasukkan pengguna.
Endpoint
POST /api/v1/orders/vouchers/validate

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"voucherId": "550e8400-e29b-41d4-a716-446655440000",
"totalAmount": 3102000
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Voucher valid"
},
"data": {
"voucherId": "550e8400-e29b-41d4-a716-446655440000",
"code": "MUAT100",
"isValid": true,
"validationMessages": []
},
"type": "VOUCHER_VALIDATION"
}
5.4 Process Payment Transaction
Referensi KO & LD: - KO-09 (Instant & Scheduled): Pilih opsi bayar & penggunaan
voucher - LD References: [LD-6.5] - Payment gateway integration, [LD-7.4] -
Transaction processing, [LD-7.5] - Payment status callback
Process Payment
Deskripsi: Memproses transaksi pembayaran melalui payment gateway.
Endpoint
POST /base_url/v1/payments/process

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"paymentMethodId": "va_bca",
"amount": 2500000,
"voucherId": "VOUCHER_10PERCENT",
"discountAmount": 250000,
"ﬁnalAmount": 2250000,
"customerInfo": {
"email": "customer@example.com",
"phone": "081234567890"
}
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Payment processed successfully"
},
"data": {
"transactionId": "550e8400-e29b-41d4-a716-446655440095",
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"paymentStatus": "WAITING_PAYMENT",
"paymentMethod": {
"id": "va_bca",
"name": "Virtual Account BCA",
"accountNumber": "1234567890123456"
},
"amount": 2250000,
"paymentDeadline": "2024-01-01T15:00:00Z",
"paymentInstructions": [
"Transfer ke Virtual Account BCA: 1234567890123456",
"Nominal: Rp 2.250.000",
"Deadline: 01 Jan 2024 15:00 WIB"
]
},

"type": "PAYMENT_PROCESSING"
}
Error Response (400 Bad Request)
{
"message": {
"code": 400,
"text": "Invalid payment method or insuﬃcient balance"
},
"data": null,
"type": "PAYMENT_PROCESSING"
}

Bagian 6: Manajemen Pesanan
6.1 Membuat Pesanan Baru
Referensi KO & LD: - KO-10 (Instant & Scheduled): Bottomsheet periksa pesanan
kamu - LD References: [LD-18] - Order conﬁrmation bottomsheet
Create New Order
Deskripsi: Membuat pesanan baru dengan semua informasi yang telah diisi.
Endpoint
POST /base_url/v1/orders/create
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
{
"orderType": "INSTANT",
"loadTimeStart": "2025-05-22T09:00:00Z",
"loadTimeEnd": "2025-05-22T13:00:00Z",
"locations": [
{
"locationType": "PICKUP",
"sequence": 1,

        "fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
        "detailAddress": "Gedung ABC Lantai 5",
        "latitude": -6.2088,
        "longitude": 106.8456,
        "district": "Tanah Abang",
        "districtId": 2,
        "city": "Jakarta Pusat",
        "cityId": 213,
        "province": "DKI Jakarta",
        "provinceId": 35,
        "postalCode": "10270",
        "picName": "Budi Santoso",
        "picPhoneNumber": "081234567890"
      },
      {
        "locationType": "DROPOFF",
        "sequence": 1,
        "fullAddress": "Jl. Gatot Subroto No. 456, Jakarta Selatan",
        "detailAddress": "Lobby Utama",
        "latitude": -6.2500,
        "longitude": 106.8300,
        "district": "Setiabudi",
        "districtId": 2,
        "city": "Jakarta Pusat",
        "cityId": 213,
        "province": "DKI Jakarta",
        "provinceId": 35,
        "postalCode": "12930",
        "picName": "Sari Dewi",
        "picPhoneNumber": "081234567891"
      }
    ],
    "cargos": [
      {
        "cargoNameId": "550e8400-e29b-41d4-a716-446655440030",
        "customName": "Laptop dan Printer",
        "weight": 500.0,
        "weightUnit": "kg",
        "dimensions": {
          "length": 2.0,
          "width": 1.5,
          "height": 1.0,
          "dimensionUnit": "m"
        },
        "sequence": 1
      }
    ],
    "cargoTypeId": "550e8400-e29b-41d4-a716-446655440100",
    "cargoCategoryId": "550e8400-e29b-41d4-a716-446655440110",


    "cargoPhotos": [
      "https://storage.muatrans.com/cargos/photo-123456.jpg",
      "https://storage.muatrans.com/cargos/photo-123457.jpg"
    ],
    "cargoDescription": "Elektronik dan peralatan kantor",
    "isHalalLogistics": true,
    "carrierId": "550e8400-e29b-41d4-a716-446655440050",
    "truckTypeId": "550e8400-e29b-41d4-a716-446655440060",
    "truckCount": 2,
    "estimatedDistance": 75.5,
    "estimatedTime": 120,
    "insurance": {
      "insuranceOptionId": "550e8400-e29b-41d4-a716-446655440071",
      "coverageAmount": 20000000,
      "premiumAmount": 20000,
      "isCustomAmount": false,
      "insurancePolicyAccepted": true
    },
    "additionalServices": [
      {
        "serviceId": "550e8400-e29b-41d4-a716-446655440000",
        "withShipping": true,
        "shippingDetails": {
          "recipientName": "John Doe",
          "recipientPhone": "08123456789",
          "destinationAddress": "Jl. Contoh No. 123",
          "detailAddress": "Rumah cat putih",
          "district": "Tegalsari",
          "city": "Surabaya",
          "province": "Jawa Timur",
          "postalCode": "60261",
          "shippingOptionId": "0d5de669-e7ba-46f4-a8c6-0f3192ed7465",
          "withInsurance": true
        }
      },
      {
        "serviceId": "550e8400-e29b-41d4-a716-446655440001",
        "withShipping": false
      }
    ],
    "deliveryOrderNumbers": [
      "DO123456",
      "DO123457"
    ],
    "businessEntity": {
      "isBusinessEntity": true,
      "name": "PT Sukses Makmur",
      "taxId": "0123456789012345"
    },


    "voucherId": "550e8400-e29b-41d4-a716-446655440000",
    "paymentMethodId": "550e8400-e29b-41d4-a716-446655440000",
    "pricing": {
      "transportFee": 1500000,
      "insuranceFee": 20000,
      "additionalServiceFee": 85000,
      "voucherDiscount": 100000,
      "adminFee": 10000,
      "taxAmount": 161000,
      "totalPrice": 1676000
    }

}
}
Response
Success Response (201 Created)
{
"message": {
"code": 201,
"text": "Order created successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"orderCode": "MT25AA001",
"encryptedCode": "A1B",
"orderType": "INSTANT",
"orderStatus": "SEARCHING_FLEET",
"loadTimeStart": "2025-05-22T09:00:00Z",
"loadTimeEnd": "2025-05-22T13:00:00Z",
"totalPrice": 1676000,
"paymentMethod": "va_bca",
"paymentDueDateTime": "2025-05-22T12:30:00Z",
"estimatedDistance": 75.5,
"truckCount": 2,
"ﬂeetSearchStatus": "SEARCHING",
"searchStartedAt": "2025-05-21T12:30:00Z",
"maxSearchDurationMinutes": 30,
"locations": [
{
"locationId": "550e8400-e29b-41d4-a716-446655440020",
"locationType": "PICKUP",
"sequence": 1,
"fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
"picName": "Budi Santoso",
"picPhoneNumber": "081234567890"
},
{

        "locationId": "550e8400-e29b-41d4-a716-446655440021",
        "locationType": "DROPOFF",
        "sequence": 1,
        "fullAddress": "Jl. Gatot Subroto No. 456, Jakarta Selatan",
        "picName": "Sari Dewi",
        "picPhoneNumber": "081234567891"
      }
    ],
    "cargos": [
      {
        "cargoId": "550e8400-e29b-41d4-a716-446655440040",
        "name": "Laptop dan Printer",
        "weight": 500.0,
        "weightUnit": "kg",
        "dimensions": {
          "length": 2.0,
          "width": 1.5,
          "height": 1.0,
          "dimensionUnit": "m"
        }
      }
    ],
    "vehicle": {
      "carrierId": "550e8400-e29b-41d4-a716-446655440050",
      "carrierName": "Box",
      "truckTypeId": "550e8400-e29b-41d4-a716-446655440060",
      "truckTypeName": "CDE Engkel"
    },
    "insurance": {
      "coverageAmount": 20000000,
      "premiumAmount": 20000,
      "isCustomAmount": false
    },
    "additionalServices": [
      {
        "serviceId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Kirim Bukti Fisik Penerimaan Barang",
        "price": 25000,
        "withShipping": true
      },
      {
        "serviceId": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Terpal",
        "price": 60000,
        "withShipping": false
      }
    ],
    "voucher": {
      "id": "550e8400-e29b-41d4-a716-446655440000",


      "code": "MUAT100",
      "discount": 100000
    },
    "payment": {
      "paymentId": "550e8400-e29b-41d4-a716-446655440080",
      "method": "va_bca",
      "vaNumber": "12345678901234567890",
      "amount": 1676000,
      "status": "PENDING",
      "expiryTime": "2025-05-22T12:30:00Z"
    },
    "nextActions": {
      "primaryAction": "WAIT_FOR_FLEET",
      "canCancel": true,
      "canModify": false,
      "redirectUrl": "/orders/550e8400-e29b-41d4-a716-446655440090/tracking"
    },
    "createdAt": "2025-05-21T12:30:00Z"

},
"type": "CREATE_ORDER"
}
Error Response (400 Bad Request)
{
"message": {
"code": 400,
"text": "Order creation failed"
},
"data": {
"errors": [
{
"ﬁeld": "loadTimeStart",
"message": "Waktu muat tidak boleh kurang dari 1 jam dari sekarang"
},
{
"ﬁeld": "locations",
"message": "Minimal harus ada 1 lokasi pickup dan 1 lokasi dropoff"
},
{
"ﬁeld": "cargos.0.weight",
"message": "Berat muatan harus lebih dari 0"
},
{
"ﬁeld": "paymentMethodId",
"message": "Metode pembayaran wajib dipilih"
}
]
},

"type": "CREATE_ORDER"
}

// Error Response (402 Payment Required)
{
"message": {
"code": 402,
"text": "Payment gateway error"
},
"data": {
"errors": [
{
"ﬁeld": "payment",
"message": "Gagal membuat virtual account. Silakan coba lagi atau pilih metode
pembayaran lain"
}
],
"gatewayError": {
"code": "VA_CREATION_FAILED",
"message": "Temporary error from payment gateway"
}
},
"type": "CREATE_ORDER"
}

// Error Response (409 Conﬂict)
{
"message": {
"code": 409,
"text": "Order creation conﬂict"
},
"data": {
"errors": [
{
"ﬁeld": "loadTimeStart",
"message": "Slot waktu yang dipilih sudah tidak tersedia"
}
],
"conﬂictType": "TIME_SLOT_UNAVAILABLE",
"availableAlternatives": [
{
"loadTimeStart": "2025-05-22T10:00:00Z",
"loadTimeEnd": "2025-05-22T14:00:00Z"
},
{
"loadTimeStart": "2025-05-22T14:00:00Z",
"loadTimeEnd": "2025-05-22T18:00:00Z"
}

    ]

},
"type": "CREATE_ORDER"
}

// Error Response (422 Unprocessable Entity)
{
"message": {
"code": 422,
"text": "Business rule validation failed"
},
"data": {
"errors": [
{
"ﬁeld": "voucher",
"message": "Voucher sudah tidak berlaku atau sudah habis kuota"
},
{
"ﬁeld": "truckCapacity",
"message": "Berat muatan melebihi kapasitas truk yang dipilih"
}
],
"businessRules": [
{
"rule": "VOUCHER_VALIDITY",
"status": "FAILED",
"message": "Voucher MUAT100 sudah kedaluwarsa"
},
{
"rule": "TRUCK_CAPACITY",
"status": "FAILED",
"message": "Muatan 500kg melebihi kapasitas truk CDE Engkel (400kg)"
}
]
},
"type": "CREATE_ORDER"
}

// Error Response (503 Service Unavailable)
{
"message": {
"code": 503,
"text": "Fleet search service unavailable"
},
"data": {
"errors": [
{
"ﬁeld": "ﬂeetSearch",

        "message": "Layanan pencarian armada sedang mengalami gangguan. Silakan coba

lagi dalam beberapa menit"
}
],
"serviceStatus": "TEMPORARILY_UNAVAILABLE",
"estimatedRecoveryTime": "2025-05-21T13:00:00Z"
},
"type": "CREATE_ORDER"
}
6.2 Mendapatkan Status Pencarian Armada
Referensi KO & LD: - KO-16 (Instant): Armada Tidak Ditemukan - KO-15
(Scheduled): Armada Tidak Ditemukan - LD References: [LD-12.2] - Auto-cancel
popup for ﬂeet not found
Get Fleet Search Status
Deskripsi: Mengecek status pencarian armada untuk pesanan tertentu.
Endpoint
GET /base_url/v1/orders/{orderId}/ﬂeet-search-status
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"reminderMinutes": 15,
"shouldShowPopup": true
},

"type": "FLEET_SEARCH_STATUS"
}
6.3 Waiting Conﬁrmation
Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
(Scheduled): Pembayaran dan armada dijadwalkan - LD References: [LD-19] -
Order details during ﬂeet preparation status
Post Waiting Conﬁrmation
Deskripsi: Mengirim konﬁrmasi menunggu untuk pesanan.
Endpoint
POST /base_url/v1/orders/{orderId}/waiting-conﬁrmation
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"continueWaiting": true
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Waiting conﬁrmation saved successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"searchContinued": true
},
"type": "WAITING_CONFIRMATION"
}

6.4 Mendapatkan Alasan Pembatalan
Referensi KO & LD: - KO-18 (Instant): Batalkan Pesanan - KO-17/18 (Scheduled):
Batalkan Pesanan TERJADWAL - LD References: Cancellation ﬂow dengan
penalty calculation
Get Cancellation Reasons
Deskripsi: Mendapatkan daftar alasan pembatalan pesanan.
Endpoint
GET /api/v1/orders/cancellation-reasons
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Default
Deskripsi
reasonCateg
ory
string
Tidak

- SHIPPER,
  TRANSPORT
  ER, CS
  Response
  Success Response (200 OK)
  {
  "message": {
  "code": 200,
  "text": "Success"
  },
  "data": {
  "reasons": [
  {
  "reasonId": "550e8400-e29b-41d4-a716-446655440200",
  "reasonName": "Perubahan jadwal mendadak",
  "category": "SHIPPER"
  },
  {
  "reasonId": "550e8400-e29b-41d4-a716-446655440200",
  "reasonName": "Perubahan jadwal mendadak",
  "category": "SHIPPER"
  }
  ]
  },

  "type": "CANCELLATION_REASONS"
  }
  6.5 Batalkan Pesanan
  Referensi KO & LD: - KO-18 (Instant): Batalkan Pesanan - KO-17/18 (Scheduled):
  Batalkan Pesanan TERJADWAL - LD References: Cancellation ﬂow dengan
  penalty calculation
  Cancel Order
  Deskripsi: Membatalkan pesanan dengan alasan tertentu.
  Endpoint
  POST /base_url/v1/orders/{orderId}/cancel
  Path Parameters
  Parameter
  Tipe
  Wajib
  Deskripsi
  orderId
  string
  Ya
  ID unik pesanan
  Request Headers
  Header
  Nilai
  Wajib
  Deskripsi
  Authorization
  Bearer {token}
  Ya
  JWT token
  untuk
  autentikasi
  Content-Type
  application/json Ya
  Format request
  body
  Request Body
  {
  "reasonId": "550e8400-e29b-41d4-a716-446655440200",
  "additionalInfo": "Jadwal meeting tiba-tiba dimajukan", // kalau lainnya ini diisi
  }
  Response
  Success Response (200 OK)
  {
  "message": {
  "code": 200,
  "text": "Order cancelled successfully"
  },
  "data": {
  "orderId": "550e8400-e29b-41d4-a716-446655440090"
  },
  "type": "AUTO_CANCEL"
  }

  6.6 Mendapatkan Jumlah Pesanan Membutuhkan Konﬁrmasi
  Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
  (Scheduled): Pembayaran dan armada dijadwalkan - LD References: [LD-19] -
  Order details during ﬂeet preparation status
  Get Orders Requiring Conﬁrmation Count
  Deskripsi: Mendapatkan jumlah pesanan yang membutuhkan konﬁrmasi.
  Endpoint
  GET /base_url/v1/orders/requiring-conﬁrmation/count
  Request Headers
  Header
  Nilai
  Wajib
  Deskripsi
  Authorization
  Bearer {token}
  Ya
  JWT token
  untuk
  autentikasi
  Response
  Success Response (200 OK)
  {
  "message": {
  "code": 200,
  "text": "Success"
  },
  "data": {
  "count": 3,
  "hasConﬁrmationRequired": 15
  },
  "type": "PENDING_CONFIRMATION_COUNT"
  }
  6.7 Blast ke Fleet
  Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
  (Scheduled): Pembayaran dan armada dijadwalkan - LD References: [LD-19] -
  Order details during ﬂeet preparation status
  Blast to Fleet
  Deskripsi: Mengirim blast pesanan ke armada.
  Endpoint
  POST /base_url/v1/orders/{orderId}/blast-to-ﬂeet

Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Order blasted successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"orderCode": "MT25AA001",
"orderCodeEncoded": "MT25A001A",
"blastStatus": "SENT",
"targetTransporters": 85,
"blastRadius": 50,
"blastStartedAt": "2025-05-21T12:30:00+07:00",
"estimatedResponseTime": 300
},
"type": "ORDER_BLAST"
}
6.8 Auto Cancel
Referensi KO & LD: - KO-16 (Instant): Armada Tidak Ditemukan - KO-15
(Scheduled): Armada Tidak Ditemukan - LD References: Fleet search timeout dan
auto-cancel logic
Auto Cancel
Deskripsi: Membatalkan pesanan secara otomatis jika armada tidak ditemukan.
Endpoint
POST /base_url/v1/orders/{orderId}/auto-cancel

Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"cancellationReasonId": "uuid-reason-timeout",
"cancellerType": "SYSTEM",
"additionalInfo": "Automatic cancellation due to payment timeout"
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Order auto-cancelled due to payment timeout"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"cancelledAt": "2025-05-21T12:30:00+07:00",
"cancellationReason": "Payment timeout",
"refundStatus": "PROCESSING",
"refundAmount": 1500000
},
"type": "AUTO_CANCEL"
}
6.9 Konﬁrmasi Pembayaran
Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
(Scheduled): Pembayaran dan armada dijadwalkan - LD References: [LD-19] -
Order details during payment conﬁrmation, [LD-7.1] - Payment conﬁrmation ﬂow,
[LD-7.2] - Payment status validation, [LD-7.3] - Payment completion process
Conﬁrm Payment
Deskripsi: Mengkonﬁrmasi pembayaran pesanan.

Endpoint
POST /api/v1/orders/{orderId}/conﬁrm-payment
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"paymentId": "550e8400-e29b-41d4-a716-446655440100",
"transactionId": "TXN123456789",
"paidAt": "2025-05-22T10:30:00+07:00",
"paidAmount": 1676000
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Order payment conﬁrmed successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"orderCode": "MT25AA001",
"orderStatus": "PAYMENT_CONFIRMED",
"paymentStatus": "SUCCESS",
"paidAt": "2025-05-22T10:30:00+07:00",
"paidAmount": 1676000,
"transactionId": "TXN123456789",
"nextStatus": "WAITING_DRIVER_ASSIGNMENT"
},
"type": "ORDER_PAYMENT_CONFIRMATION"
}

6.10 Mendapatkan Detail Pesanan
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: [LD-19] - Real-time status updates
Get Order Details
Deskripsi: Mendapatkan detail lengkap pesanan.
Endpoint
GET /api/v1/orders/{orderId}
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
"Message": {
"Code": 200,
"Text": "Order detail retrieved successfully"
},
"Data": {
"general": {
"orderId": "550e8400-e29b-41d4-a716-446655440000",
"transporterOrderCode": "MT.25.AA.001",
"invoiceNumber": "INV/12345678",
"orderStatus": "CONFIRMED",
"orderType": "INSTANT",
"createdAt": "2024-01-01T10:00:00Z",
"updatedAt": "2024-01-01T14:30:00Z"
},
"summary": {
"distance": 12,
"carrier": {
"carrierId": "uuid-carrier-1",
"name": "Box Container",
"image": "https://example.com/box.jpg"
},
"truckType": {

        "truckTypeId": "uuid-truck-1",
        "name": "Medium Truck 4x2 Box",
        "image": "https://example.com/truck.jpg",
        "totalUnit": 2
      },
      "loadTimeStart": "2025-02-08T09:00:00Z",
      "loadTimeEnd": "2025-02-08T12:00:00Z",
      "locations": [
        {
          "locationId": "uuid-location-1",
          "locationType": "PICKUP",
          "sequence": 1,
          "fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
          "detailAddress": "Gedung ABC Lantai 5",
          "latitude": -6.2088,
          "longitude": 106.8456,
          "district": "Tanah Abang",
          "city": "Jakarta Pusat",
          "province": "DKI Jakarta",
          "postalCode": "10270",
          "picName": "Budi Santoso",
          "picPhoneNumber": "081234567890",
          "scanStatus": "NOT_SCANNED"
        }
      ],
      "isHalalLogistic": true,
      "canReview": true,
      "isEdit": true,
      "cargo": [
        {
          "cargoId": "550e8400-e29b-41d4-a716-446655440004",
          "cargoTypeName": "Elektronik",
          "cargoCategoryName": "Peralatan",
          "name": "Electronics",
          "weight": 500.0,
          "weightUnit": "kg",
          "dimensions": {
            "length": 2.0,
            "width": 1.0,
            "height": 1.5,
            "unit": "m"
          },
          "sequence": 1
        }
      ],
      "payment": {
        "paymentMethod": "va_bca",
        "paymentDueDateTime": "2025-02-08T15:00:00Z"
      },


      "price": {
        "totalPrice": 1500000.00,
        "transportFee": 1200000.00,
        "insuranceFee": 50000.00,
        "additionalServiceFee": [
          {
            "name": "",
            "price": 100000
          }
        ],
        "voucherDiscount": 0.00,
        "adminFee": 25000.00,
        "taxAmount": 125000.00,
        "waitingFee": {
          "totalAmount": 0.00,
          "totalHours": 0,
          "isChargeable": false
        },
        "overloadFee": 1000000
      },
      "additionalService": [
        {
          "name": "",
          "isShipping": true,
          "addressInformation": {
            "manlok": "sama seperti manlok"
          },
          "courier": "JNE",
          "courierPrice": 200000,
          "insurancePrice": 10000000000000
        }
      ]
    },
    "otherInformation": {
      "cargoPhotos": [
        "www"
      ],
      "cargoDescription": "",
      "numberDeliveryOrder": [
        "DO"
      ]
    },
    "changeCount": 0,
    "isChangeable": true,
    "isCancellable": true,
    "cancellationDeadline": "2025-02-06T09:00:00Z",
    "hasCancellationPenalty": false,
    "drivers": [
      {


        "driverId": "uuid-driver-1",
        "name": "Ahmad Rahman",
        "phoneNumber": "081234567891",
        "proﬁleImage": "https://example.com/driver1.jpg",
        "driverStatus": "Menuju ke Lokasi Muat",
        "licensePlate": "B 1234 CD"
      }
    ],
    "documents": {
      "doNumber": "DO123456",
      "doUrl": "https://example.com/do.pdf"
    },
    "businessEntity": {
      "isBusinessEntity": true,
      "name": "PT Sukses Makmur",
      "taxId": "0123456789012345"
    },
    "paymentData": {
      "paymentId": "uuid-payment-123",
      "method": "va_bca",
      "vaNumber": "12345678901234567890",
      "amount": 1500000.00,
      "status": "PENDING",
      "expiredAt": "2025-02-08T15:00:00Z"
    },
    "conﬁg": {
      "toleranceHours": 12,
      "hourlyRate": 25000.00,
      "alertHoursBefore": 1
    },
    "detailWaitingTime": [
      {
        "driverId": "uuid",
        "name": "hadi",
        "licensePlate": "abc",
        "startWaitingTime": "raw date",
        "endWaitingTime": "raw date",
        "waitingTime": 100,
        "waitingFee": 100000
      }
    ],
    "detailOverload": [
      {
        "driverId": "uuid",
        "name": "hadi",
        "licensePlate": "abc",
        "weight": 2000,
        "weightUnit": "ton",
        "overloadFee": 100000


      }
    ],
    "alerts": [
      {
        "type": "qr",
        "date": "raw date",
        "label": "labelAlertMultibahasa"
      }
    ],
    "Type": "ORDER_DETAIL"

}
6.11 Manajemen Fleet Assignment
Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
(Scheduled): Pembayaran dan armada dijadwalkan - LD References: [LD-29] -
Fleet assignment management, [LD-30] - Driver allocation system
Assign Driver to Order
Deskripsi: Menugaskan driver spesiﬁk ke pesanan dan melakukan tracking
assignment.
Endpoint
POST /base_url/v1/orders/{orderId}/assign-driver
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"driverId": "550e8400-e29b-41d4-a716-446655440092",
"vehicleId": "550e8400-e29b-41d4-a716-446655440093",
"assignmentType": "MANUAL",
"assignmentReason": "Speciﬁc driver request from customer",
"estimatedPickupTime": "2024-01-01T09:00:00Z"
}

Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Driver assigned successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"assignmentId": "550e8400-e29b-41d4-a716-446655440094",
"driverInfo": {
"driverId": "550e8400-e29b-41d4-a716-446655440092",
"name": "Ahmad Rahman",
"phone": "081234567890",
"rating": 4.8,
"licensePlate": "B 1234 CD"
},
"vehicleInfo": {
"vehicleId": "550e8400-e29b-41d4-a716-446655440093",
"truckType": "CDE Engkel",
"capacity": "3 Ton"
},
"assignmentTimestamp": "2024-01-01T08:30:00Z",
"estimatedPickupTime": "2024-01-01T09:00:00Z",
"status": "DRIVER_ASSIGNED"
},
"type": "DRIVER_ASSIGNMENT"
}
Error Response (404 Not Found)
{
"message": {
"code": 404,
"text": "Driver not available or not found"
},
"data": null,
"type": "DRIVER_ASSIGNMENT"
}

Bagian 7: Tracking dan Monitoring
7.1 Generate QR Code
Referensi KO & LD: - KO-12 (Instant & Scheduled): Proses muat - LD References:
[LD-22] - Loading process details with QR, [LD-20] - QR code generation algorithm,
[LD-21] - QR code validation process
Generate QR Code
Deskripsi: Menghasilkan QR code untuk pesanan.
Endpoint
POST /base_url/v1/orders/qr-codes/generate
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"driverId": "550e8400-e29b-41d4-a716-446655440090",
"token": "XXX",
"expiryMinutes": 30
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "QR Code generated successfully"
},
"data": {
"qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
"driverInfo": {
"driverId": "uuid-driver-1",
"driverImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
"name": "Ahmad Rahman",
"licensePlate": "B 1234 CD",
"statusScan": "belum",

    },
    "shareLink": "https://app.muattrans.com/qr/ABC123XYZ789",
    "expiryTime": "2024-01-01T15:00:00Z",

},
"type": "QR_CODE_GENERATION"
}
7.2 Proses Bongkar - Update Status
Referensi KO & LD: - KO-13 (Instant): Proses bongkar - LD References: [LD-23] -
Unloading process status updates, [LD-24] - Real-time status synchronization,
[LD-25] - Advanced progress tracking
Update Unloading Status
Deskripsi: Mengupdate status proses bongkar untuk pesanan instant.
Endpoint
PUT /base_url/v1/orders/{orderId}/unloading-status
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"status": "UNLOADING_IN_PROGRESS",
"locationId": "550e8400-e29b-41d4-a716-446655440091",
"driverId": "550e8400-e29b-41d4-a716-446655440092",
"timestamp": "2024-01-01T14:30:00Z",
"notes": "Mulai proses bongkar di lokasi 1"
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,

    "text": "Unloading status updated successfully"

},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"status": "UNLOADING_IN_PROGRESS",
"locationInfo": {
"locationId": "550e8400-e29b-41d4-a716-446655440091",
"address": "Jl. Sudirman No. 123, Jakarta",
"contactPerson": "Budi Santoso",
"contactPhone": "081234567890"
},
"estimatedCompletion": "2024-01-01T16:00:00Z",
"progressPercentage": 25
},
"type": "UNLOADING_STATUS_UPDATE"
}
Error Response (400 Bad Request)
{
"message": {
"code": 400,
"text": "Invalid unloading status"
},
"data": null,
"type": "UNLOADING_STATUS_UPDATE"
}
7.3 Mendapatkan Status Legend
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: [LD-19] - Status updates dan legend
Get Status Legend
Deskripsi: Mendapatkan legend status pesanan.
Endpoint
GET /base_url/v1/orders/{orderId}/status-legend
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"statusLegend": [
{
"id": "550e8400-e29b-41d4-a716-446655440020",
"statusCode": "CONFIRMED",
"statusName": "Pesanan Terkonﬁrmasi"
},
{
"id": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "MENUJU_LOKASI_MUAT_1",
"statusName": "Menuju Lokasi Muat 1"
},
{
"id": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "PROSES_BONGKAR",
"statusName": "Proses Bongkar"
},
{
"id": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "SELESAI",
"statusName": "SELESAI"
}
],
},
"type": "STATUS_LEGEND"
}
7.3 Mendapatkan Riwayat Status
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: [LD-19] - Status history tracking

Get Status History
Deskripsi: Mendapatkan riwayat perubahan status pesanan.
Endpoint
GET /base_url/v1/orders/{orderId}/status-history
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order status history retrieved successfully"
},
"Data": {
"statusHistory": [
{
"statusHistoryId": "550e8400-e29b-41d4-a716-446655440020",
"statusCode": "CONFIRMED",
"statusName": "Pesanan Terkonﬁrmasi"
},
{
"statusHistoryId": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "MENUJU_LOKASI_MUAT_1",
"statusName": "Menuju Lokasi Muat 1"
},
{
"statusHistoryId": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "PROSES_BONGKAR",
"statusName": "Proses Bongkar"
},
{
"statusHistoryId": "550e8400-e29b-41d4-a716-446655440021",
"statusCode": "SELESAI",
"statusName": "SELESAI"
}

    ],
    "driverStatus": [
      {
        "driverId": "uuid-driver-1",
        "name": "Ahmad Rahman",
        "licensePlate": "B 1234 CD",
        "statusDriver": "MENUJU_LOKASI_MUAT_1",
        "stepStatus": [
          {
            "statusCode": "MENUJU_LOKASI_MUAT_1",
            "statusName": "Menuju Lokasi Muat 1"
          },
          {
            "statusCode": "MENUJU_LOKASI_MUAT_2",
            "statusName": "Menuju Lokasi Muat 2"
          }
        ]
      }
    ]

},
"Type": "ORDER_STATUS_HISTORY"
}
7.4 Mendapatkan Layanan Tambahan Pesanan
Referensi KO & LD: - KO-06 (Instant & Scheduled): Pengisian layanan tambahan -
LD References: [LD-12] - Additional services tracking
Get Order Additional Services
Deskripsi: Mendapatkan layanan tambahan yang digunakan dalam pesanan.
Endpoint
GET /api/v1/orders/{orderId}/additional-services
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)

{
"Message": {
"Code": 200,
"Text": "Order detail retrieved successfully"
},
"Data": {
"additionalService": [
{
"name": "",
"isShipping": true,
"addressInformation": {
"fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
"detailAddress": "Gedung ABC Lantai 5",
"latitude": -6.2088,
"longitude": 106.8456,
"district": "Tanah Abang",
"districtId": 2,
"city": "Jakarta Pusat",
"cityId": 213,
"province": "DKI Jakarta",
"provinceId": 35,
"postalCode": "10270"
},
"courier": "JNE",
"courierPrice": 200000,
"insurancePrice": 10000000000000
}
]
},
"Type": "ADDITIONAL_SERVICES_ORDER_DETAIL"
}
7.5 Mendapatkan Info Pembayaran
Referensi KO & LD: - KO-09 (Instant & Scheduled): Pilih opsi bayar & penggunaan
voucher - LD References: [LD-15] - Payment tracking
Get Payment Info
Deskripsi: Mendapatkan informasi pembayaran pesanan.
Endpoint
GET /api/v1/orders/{orderId}/payment
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order detail retrieved successfully"
},
"Data": {
"payment": {
"paymentId": "uuid-payment-123",
"method": "va_bca",
"vaNumber": "12345678901234567890",
"amount": 1500000.00,
"status": "PENDING",
"expiredAt": "2025-02-08T15:00:00Z"
}
},
"Type": "PAYMENT_ORDER_DETAIL"
}
7.6 Mendapatkan Info Waktu Tunggu
Referensi KO & LD: - KO-21 (Instant): Informasi Kena Biaya Waktu Tunggu -
KO-20 (Scheduled): Informasi Kena Biaya Waktu Tunggu - LD References:
Waiting time calculation dan billing
Get Waiting Time Info
Deskripsi: Mendapatkan informasi waktu tunggu dan biayanya.
Endpoint
GET /api/v1/orders/{orderId}/waiting-time
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order detail retrieved successfully"
},
"Data": {
"waitingTime": [
{
"driverId": "uuid",
"name": "hadi",
"licensePlate": "abc",
"startWaitingTime": "raw date",
"endWaitingTime": "raw date",
"waitingTime": 100,
"waitingFee": 100000
}
]
},
"Type": "WAITING_TIME_ORDER_DETAIL"
}
7.7 Mendapatkan Info Overload
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: Overload detection dan billing
Get Overload Info
Deskripsi: Mendapatkan informasi kelebihan muatan dan biayanya.
Endpoint
GET /api/v1/orders/{orderId}/overload
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order detail retrieved successfully"
},
"Data": {
"overload": [
{
"driverId": "uuid",
"name": "hadi",
"licensePlate": "abc",
"weight": 2000,
"weightUnit": "ton",
"overloadFee": 100000
}
]
},
"Type": "OVERLOAD_ORDER_DETAIL"
}
7.8 Mendapatkan Alerts
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: Alert notiﬁcations
Get Order Alerts
Deskripsi: Mendapatkan alert/peringatan untuk pesanan.
Endpoint
GET /api/v1/orders/{orderId}/alerts
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"alerts": [
{
"type": "OVERLOAD_DETECTED",
"date": "2025-05-21T14:30:00+07:00",
"label": "labelmultibahasa",
},
{
"type": "DELIVERY_DELAY",
"date": "2025-05-21T14:30:00+07:00",
"label": "labelmultibahasa",
}
]
},
"type": "ORDER_ALERTS"
}
7.9 Mendapatkan Status Driver
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: Driver status tracking
Get Driver Status
Deskripsi: Mendapatkan status driver untuk pesanan.
Endpoint
GET /base_url/v1/orders/status-driver

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
driverId
string
Ya
ID unik driver
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Driver status deﬁnitions retrieved successfully"
},
"Data": {
"statusDeﬁnitions": [
{
"mappedOrderStatus": "PROSES_BONGKAR",
"children": [
{
"statusCode": "MENUJU_LOKASI_MUAT_1",
"statusName": "Menuju Lokasi Muat 1",
"date": "raw date",
"requiresQRScan": false,
"requiresPhoto": false,
"triggersWaitingFee": false,
"photoEvidences": {
"packages": [],
"pods": []
}
}
]
},
{
"mappedOrderStatus": "PROSES_MUAT",
"children": [
{
"statusCode": "MENUJU_LOKASI_MUAT_1",
"statusName": "Menuju Lokasi Muat 1",
"date": "raw date",
"requiresQRScan": false,

            "requiresPhoto": false,
            "triggersWaitingFee": false,
            "photoEvidences": {
              "packages": [],
              "pods": []
            }
          }
        ]
      },
      {
        "mappedOrderStatus": "PROSES_PENGIRIMAN_DOC",
        "children": [],
        "shippingEvidence": {
          "date": {},
          "photo": [],
          "noted": {}
        }
      }
    ]

},
"Type": "DRIVER_STATUS_DEFINITIONS"
}
7.10 Memberikan Review
Referensi KO & LD: - KO-15 (Instant): Pesanan selesai dan beri rating - KO-14
(Scheduled): Pesanan selesai dan beri rating - LD References: [LD-44] - Rating
and completion process, [LD-45] - Order completion status display, [LD-46] -
Review form interface, [LD-47] - Rating submission validation, [LD-48] -
Completion conﬁrmation ﬂow
Post Review
Deskripsi: Memberikan review dan rating untuk pesanan.
Endpoint
POST /api/v1/orders/{orderId}/reviews
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi

Header
Nilai
Wajib
Deskripsi
Content-Type
application/json Ya
Format request
body
Request Body
{
"driverId": "550e8400-e29b-41d4-a716-446655440001",
"orderId": "uuid-order-123",
"rating": 5,
"review": "Driver sangat profesional dan tepat waktu. Pengiriman berjalan lancar."
}
Response
Success Response (201 Created)
{
"Message": {
"Code": 201,
"Text": "Driver review created successfully"
},
"Data": {
"ratingId": "550e8400-e29b-41d4-a716-446655440090",
"orderId": "550e8400-e29b-41d4-a716-446655440000",
"driverId": "550e8400-e29b-41d4-a716-446655440001",
"rating": 5,
"review": "Driver sangat profesional dan tepat waktu. Pengiriman berjalan lancar.",
"reviewLength": 67,
"ratedAt": "2024-01-05T10:00:00Z"
},
"Type": "CREATE_DRIVER_REVIEW"
}
7.11 Mendapatkan Review
Referensi KO & LD: - KO-15 (Instant): Pesanan selesai dan beri rating - KO-14
(Scheduled): Pesanan selesai dan beri rating - LD References: [LD-44] - Rating
display
Get Reviews
Deskripsi: Mendapatkan review yang telah diberikan untuk pesanan.
Endpoint
GET /api/v1/orders/{orderId}/reviews
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Driver reviews retrieved successfully"
},
"Data": {
"orderId": "uuid-order-123",
"orderCode": "MTR/250208/001/AAA",
"drivers": [
{
"driverId": "uuid-driver-1",
"name": "Ahmad Rahman",
"phoneNumber": "081234567891",
"proﬁleImage": "https://example.com/driver1.jpg",
"licensePlate": "B 1234 CD",
"canReview": true,
"reviewedAt": "",
"rating": 0,
"review": ""
},
{
"driverId": "uuid-driver-2",
"name": "Budi Santoso",
"phoneNumber": "081234567892",
"proﬁleImage": "https://example.com/driver2.jpg",
"licensePlate": "B 5678 EF",
"canReview": false,
"reviewedAt": "2025-02-11T16:00:00Z",
"rating": 5,
"review": "Driver sangat baik dan profesional"
}
],
"summary": {
"totalReviews": 1,
"averageRating": 5,
"ratingDistribution": {
"5": 1,
"4": 0,

        "3": 0,
        "2": 0,
        "1": 0
      }
    }

},
"Type": "GET_ORDER_DRIVER_REVIEWS"
}
7.12 Konﬁrmasi Dokumen Diterima
Referensi KO & LD: - KO-14 (Instant): Dokumen sedang disiapkan dan proses
kirim dokumen - LD References: [LD-19.3] - Document preparation
Document Received
Deskripsi: Konﬁrmasi bahwa dokumen telah diterima.
Endpoint
POST /base_url/v1/orders/{orderId}/document-received
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Document receipt conﬁrmed successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"newStatus": "COMPLETED",
"isDocumentReceived": true
},

"type": "DOCUMENT_RECEIPT_CONFIRMATION"
}
7.13 Auto Complete Pesanan
Referensi KO & LD: - KO-15 (Instant): Pesanan selesai dan beri rating - KO-14
(Scheduled): Pesanan selesai dan beri rating - LD References: Auto completion
process
Auto Complete Order
Deskripsi: Menyelesaikan pesanan secara otomatis.
Endpoint
POST /base_url/v1/orders/auto-complete
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Order auto-completed successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"orderStatus": "COMPLETED",
"requiresRating": true
},
"type": "ORDER_AUTO_COMPLETION"
}
7.14 Mendapatkan Akses Fitur
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: Feature access control
Get Feature Access
Deskripsi: Mendapatkan akses ﬁtur untuk pesanan tertentu.

Endpoint
GET /api/v1/orders/{orderId}/feature-access
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Success"
},
"data": {
"featureAccess": {
"canCancel": true,
"canModify": false,
"canReorder": false,
"canRate": true,
"canTrackRealtime": true,
"canViewDocuments": true,
"canChatDriver": true,
"canRequestSupport": true,
"restrictions": [
{
"feature": "MODIFY_ORDER",
"reason": "Order already in progress",
"disabledUntil": null
}
]
}
},
"type": "FEATURE_ACCESS"
}
7.15 Reorder
Referensi KO & LD: - KO-17 (Instant): Pesan Ulang - KO-16 (Scheduled): Pesan
Ulang - LD References: Reorder functionality

Reorder
Deskripsi: Membuat pesanan ulang berdasarkan pesanan sebelumnya.
Endpoint
GET /base_url/v1/orders/{orderId}/reorder
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order duplicated successfully"
},
"Data": {
"templateData": {
"locations": [
{
"locationId": "uuid-location-1",
"locationType": "PICKUP",
"sequence": 1,
"fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
"detailAddress": "Gedung ABC Lantai 5",
"latitude": -6.2088,
"longitude": 106.8456,
"district": "Tanah Abang",
"city": "Jakarta Pusat",
"province": "DKI Jakarta",
"postalCode": "10270",
"picName": "Budi Santoso",
"picPhoneNumber": "081234567890",
"scanStatus": "NOT_SCANNED"
}
],
"cargos": [
{

          "cargoId": "550e8400-e29b-41d4-a716-446655440004",
          "cargoTypeName": "Elektronik",
          "cargoCategoryName": "Peralatan",
          "name": "Electronics",
          "weight": 500.0,
          "weightUnit": "kg",
          "dimensions": {
            "length": 2.0,
            "width": 1.0,
            "height": 1.5,
            "unit": "m"
          }
        }
      ],
      "isHalalLogistics": true,
      "additionalService": [
        {
          "name": "",
          "isShipping": true,
          "addressInformation": {
            "manlok": "sama seperti manlok"
          },
          "courier": "JNE",
          "courierPrice": 200000,
          "insurancePrice": 10000000000000
        }
      ]
    },
    "otherInformation": {
      "cargoPhotos": ["www"],
      "cargoDescription": "",
      "numberDeliveryOrder": ["DO"]
    },
    "businessEntity": {
      "isBusinessEntity": true,
      "name": "PT Sukses Makmur",
      "npwp": "0123456789012345"
    }

},
"Type": "ORDER_REORDER"
}
7.16 Mendapatkan Payment Timer
Referensi KO & LD: - KO-11 (Instant): Blast order dan pembayaran - KO-11
(Scheduled): Pembayaran dan armada dijadwalkan - LD References: Payment
timer display

Get Payment Timer
Deskripsi: Mendapatkan waktu countdown pembayaran.
Endpoint
GET /api/v1/payments/payment-timer/{orderId}
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Payment timer retrieved successfully"
},
"Data": {
"paymentDueDateTime": "2025-02-08T15:00:00Z",
"currentServerTime": "2025-02-08T10:30:00Z",
"remainingTimeSeconds": 16200,
"isExpired": false,
"paymentMethod": "va_bca",
"amount": 1500000.00
},
"Type": "PAYMENT_TIMER"
}
7.17 Tracking Lokasi
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: [LD-19] - Real-time location tracking
Track Location
Deskripsi: Melacak lokasi real-time armada.
Endpoint
GET /base_data/v1/orders/tracking/{orderId}/location

Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Query Parameters
Parameter
Tipe
Wajib
Default
Deskripsi
driverId
string
Ya

- Filter untuk
  driver
  tertentu
  Request Headers
  Header
  Nilai
  Wajib
  Deskripsi
  Authorization
  Bearer {token}
  Ya
  JWT token
  untuk
  autentikasi
  Response
  Success Response (200 OK)
  {
  "Message": {
  "Code": 200,
  "Text": "Fleet location retrieved successfully"
  },
  "Data": {
  "orderId": "uuid-order-123",
  "orderCode": "MTR/250208/001/AAA",
  "route": {
  "pickupPoints": [
  {
  "name": "Lokasi Muat 1",
  "latitude": -6.2088,
  "longitude": 106.8456
  }
  ],
  "dropoffPoints": [
  {
  "name": "Lokasi Bongkar 1",
  "latitude": -6.3744,
  "longitude": 106.8294
  }
  ]
  },
  "ﬂeets": [
  {
  "ﬂeetId": "uuid-ﬂeet-1",

          "driverId": "uuid-driver-1",
          "driverName": "Ahmad Rahman",
          "licensePlate": "B 1234 CD",
          "currentLocation": {
            "latitude": -6.2500,
            "longitude": 106.8300,
            "accuracy": 10.5,
            "heading": 135.0,
            "speed": 45.2,
            "lastUpdate": "2025-02-10T09:45:00Z"
          },
          "status": "HEADING_TO_DROPOFF",
          "estimatedArrival": {
            "nextDestination": "Lokasi Bongkar 1",
            "estimatedTime": "2025-02-10T11:30:00Z",
            "remainingDistance": 8.5
          }
        }
      ]

  },
  "Type": "FLEET_TRACKING"
  }
  7.18 Auto Cancel Process
  Referensi KO & LD: - KO-16 (Instant): Armada Tidak Ditemukan - KO-15
  (Scheduled): Armada Tidak Ditemukan - LD References: Auto-cancel processing
  Auto Cancel Process
  Deskripsi: Memproses pembatalan otomatis pesanan.
  Endpoint
  POST /base_url/v1/orders/{orderId}/auto-cancel-process
  Path Parameters
  Parameter
  Tipe
  Wajib
  Deskripsi
  orderId
  string
  Ya
  ID unik pesanan
  Request Headers
  Header
  Nilai
  Wajib
  Deskripsi
  Authorization
  Bearer {token}
  Ya
  JWT token
  untuk
  autentikasi
  Content-Type
  application/json Ya
  Format request
  body

Request Body
{
"cancelType": "AUTO_CANCEL_NO_FLEET",
"loadTimeStart": "2025-05-22T09:00:00+07:00",
"autoCancelTriggeredAt": "2025-05-22T08:00:00+07:00",
"reasonId": "550e8400-e29b-41d4-a716-446655440250",
"hasActivePopup": false
}
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Order auto-cancelled successfully"
},
"Data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"orderCode": "MT25AA001",
"oldStatus": "SEARCHING_FLEET",
"newStatus": "AUTO_CANCELLED",
"cancellation": {
"cancellationId": "550e8400-e29b-41d4-a716-446655440300",
"cancelType": "AUTO_CANCEL_NO_FLEET",
"reasonId": "550e8400-e29b-41d4-a716-446655440250",
"reasonName": "Otomatis dibatalkan - Tidak ada armada tersedia",
"cancelledAt": "2025-05-22T08:00:00+07:00",
"cancelledBy": "SYSTEM",
"triggerCondition": "H_MINUS_1_NO_FLEET"
},
"refund": {
"refundStatus": "PROCESSING",
"totalRefundAmount": 1790000,
"penaltyAmount": 0,
"adminFeeAmount": 0,
"netRefundAmount": 1790000,
"estimatedRefundDate": "2025-05-24T08:00:00+07:00"
}
},
"Type": "ORDER_AUTO_CANCEL"
}
7.19 Document Management System
Referensi KO & LD: - KO-14 (Instant): Dokumen sedang disiapkan dan proses
kirim dokumen - LD References: [LD-31] - Document upload interface, [LD-32] -
Document veriﬁcation process, [LD-33] - Document status tracking

Upload Order Document
Deskripsi: Mengunggah dokumen pengiriman untuk pesanan (POD, surat jalan,
dll).
Endpoint
POST /base_url/v1/orders/{orderId}/documents
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
multipart/form-
data
Ya
Format untuk
upload ﬁle
Request Form Data
Field
Tipe
Wajib
Deskripsi
documentTyp
e
string
Ya
Tipe dokumen (POD,
SURAT_JALAN,
INVOICE)
ﬁle
ﬁle
Ya
File dokumen (pdf, jpg,
png, max 10MB)
description
string
Tidak
Deskripsi dokumen
driverId
string
Ya
ID driver yang
mengunggah
Response
Success Response (201 Created)
{
"message": {
"code": 201,
"text": "Document uploaded successfully"
},
"data": {
"documentId": "550e8400-e29b-41d4-a716-446655440096",
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"documentType": "POD",
"ﬁleName": "POD_ORDER_12345.pdf",
"ﬁleSize": 1048576,

    "uploadedBy": {
      "driverId": "550e8400-e29b-41d4-a716-446655440092",
      "name": "Ahmad Rahman"
    },
    "uploadTimestamp": "2024-01-01T16:30:00Z",
    "veriﬁcationStatus": "PENDING_VERIFICATION",
    "documentUrl":

"https://storage.muatrans.com/documents/order_12345/POD_ORDER_12345.pdf"
},
"type": "DOCUMENT_UPLOAD"
}
Error Response (400 Bad Request)
{
"message": {
"code": 400,
"text": "Invalid document type or ﬁle format"
},
"data": null,
"type": "DOCUMENT_UPLOAD"
}

Bagian 8: Settlement dan Keuangan
8.1 Mendapatkan Info Refund
Referensi KO & LD: - KO-18 (Instant): Batalkan Pesanan - KO-17/18 (Scheduled):
Batalkan Pesanan TERJADWAL - LD References: Refund processing
Get Refund Info
Deskripsi: Mendapatkan informasi refund untuk pesanan yang dibatalkan.
Endpoint
GET /base_url/v1/orders/{orderId}/refund
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Refund details retrieved successfully"
},
"Data": {
"orderId": "550e8400-e29b-41d4-a716-446655440000",
"orderCode": "MT25AA001",
"refundStatus": "PROCESSING",
"requestedAt": "2025-02-10T10:00:00Z",
"processedAt": null,
"completedAt": null,
"bankAccount": {
"bankName": "Bank Central Asia",
"accountNumber": "1234567890",
"accountHolderName": "John Doe"
},
"refundBreakdown": {
"originalAmount": 1500000.00,
"waitingTimeFee": 100000.00,
"penaltyAmount": 225000.00,
"adminFee": 25000.00,
"totalRefundAmount": 1175000.00
},
"detailWaitingTime": [
{
"driverId": "uuid",
"name": "hadi",
"licensePlate": "abc",
"startWaitingTime": "raw date",
"endWaitingTime": "raw date",
"waitingTime": 100,
"waitingFee": 100000
}
]
},
"Type": "REFUND_DETAILS"
}

8.2 Mendapatkan Riwayat Pembatalan
Referensi KO & LD: - KO-18 (Instant): Batalkan Pesanan - KO-17/18 (Scheduled):
Batalkan Pesanan TERJADWAL - LD References: Cancellation history tracking
Get Cancellation History
Deskripsi: Mendapatkan riwayat pembatalan pesanan.
Endpoint
GET /base_url/v1/orders/{orderId}/cancellation-history
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Cancellation history retrieved successfully"
},
"Data": {
"cancellationId": "550e8400-e29b-41d4-a716-446655440031",
"orderId": "550e8400-e29b-41d4-a716-446655440000",
"cancelledAt": "2025-02-10T10:00:00Z",
"cancelledBy": "USER",
"reason": {
"reasonId": "550e8400-e29b-41d4-a716-446655440030",
"reasonName": "Perubahan jadwal mendadak",
"reasonCategory": "CUSTOMER",
"additionalInfo": "Perubahan jadwal mendadak"
},
"hasRefund": true,
"refundStatus": "PROCESSING"
},
"Type": "CANCELLATION_HISTORY"
}

8.3 Mendapatkan Alert Info Settlement
Referensi KO & LD: - KO-19/20 (Instant): Bayar Reimbursement (Tambahan
Biaya) - KO-19 (Scheduled): Bayar Reimbursement (Tambahan Biaya) - LD
References: Settlement alert processing
Get Settlement Alert Info
Deskripsi: Mendapatkan informasi alert settlement.
Endpoint
GET /base_url/v1/orders/settlement/alert-info
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Settlement alert info retrieved successfully"
},
"Data": {
"hasSettlement": true,
"settlementCount": 2,
"totalAmount": 350000.00,
"nearDueCount": 1,
"alertMessage": "Terdapat pesanan yang menunggu pelunasan",
"popupMessage": "Anda memiliki 2 pesanan yang membutuhkan pelunasan segera",
"singleOrderId": null
},
"Type": "SETTLEMENT_ALERT"
}
8.4 Mendapatkan Detail Overload
Referensi KO & LD: - KO-12/13 (Instant & Scheduled): Proses muat dan bongkar -
LD References: Overload detail calculation
Get Overload Details
Deskripsi: Mendapatkan detail informasi overload dan biayanya.

Endpoint
GET /api/v1/orders/{orderId}/overload-details
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Overload details retrieved successfully"
},
"Data": {
"orderId": "uuid-order-123",
"orderCode": "MTR/250208/001/AAA",
"overloadCharges": [
{
"driverId": "uuid-driver-1",
"driverName": "Ahmad Rahman",
"licensePlate": "B 1234 CD",
"reportedAt": "2025-02-10T12:00:00Z",
"overloadWeight": 500.0,
"weightUnit": "kg",
"ratePerKg": 100.00,
"totalAmount": 50000.00,
"evidence": {
"photoUrl": "https://example.com/overload-proof.jpg",
"notes": "Kelebihan muatan dari estimasi awal"
}
}
],
"totalOverloadAmount": 50000.00,
"approvedBy": "uuid-admin-1",
"approvedAt": "2025-02-10T14:00:00Z"
},
"Type": "OVERLOAD_DETAILS"
}

8.5 Proses Pembayaran Tambahan
Referensi KO & LD:
Process Additional Payment
Deskripsi: Memproses pembayaran settlement dan generate virtual account.
Endpoint
POST /base_url/v1/orders/{orderId}/payment
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"paymentMethod": "va_bca",
"amount": 198000.00,
"includeWaitingFee": true,
"includeOverloadFee": true
}
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Settlement payment initiated successfully"
},
"Data": {
"orderId": "uuid-order-123",
"settlementPaymentId": "uuid-settlement-payment-123",
"paymentMethod": "va_bca",
"vaNumber": "12345678901234567890",
"amount": 198000.00,
"status": "PENDING",
"expiryTime": "2025-02-11T15:00:00Z",

    "paymentInstructions": {
      "bankName": "BCA",
      "accountNumber": "12345678901234567890"
    }

},
"Type": "SETTLEMENT_PAYMENT"
}
8.6 Mendapatkan Settlement Deadline
Referensi KO & LD: - KO-19/20 (Instant): Bayar Reimbursement (Tambahan
Biaya) - KO-19 (Scheduled): Bayar Reimbursement (Tambahan Biaya) - LD
References: Settlement deadline tracking
Get Settlement Deadline
Deskripsi: Mendapatkan batas waktu settlement untuk pesanan.
Endpoint
GET /base_url/v1/orders/{orderId}/settlement-deadline
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Settlement deadline validated successfully"
},
"Data": {
"orderId": "uuid-order-123",
"completedAt": "2025-02-10T15:00:00Z",
"settlementDueDate": "2025-03-10T23:59:59Z",
"currentTime": "2025-02-15T10:00:00Z",
"daysRemaining": 23,
"hoursRemaining": 565,
"isOverdue": false,

    "canStillPay": true,
    "urgencyLevel": "NORMAL",
    "alertMessage": "Lakukan pembayaran sebelum 10 Mar 2025"

},
"Type": "SETTLEMENT_DEADLINE"
}
8.7 Menghitung PPH Tax
Referensi KO & LD: - KO-08 (Instant & Scheduled): Informasi pesanan lanjutan -
LD References: Business entity tax calculation
Calculate PPH Tax
Deskripsi: Menghitung pajak PPH untuk entitas bisnis.
Endpoint
POST /api/v1/settlement/calculate-pph-tax
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"orderId": "uuid-order-123",
"baseAmount": 200000.00,
"isBusinessEntity": true,
"taxYear": 2025
}
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "PPh tax calculated successfully"
},
"Data": {
"orderId": "uuid-order-123",
"baseAmount": 200000.00,
"isBusinessEntity": true,
"taxCalculation": {

      "taxType": "PPh_23",
      "taxRate": 0.02,
      "taxAmount": 4000.00,
      "netAmount": 196000.00
    },
    "taxDetails": {
      "taxYear": 2025,
      "taxCategory": "TRANSPORTATION_SERVICE",
      "calculationMethod": "GROSS_AMOUNT",
      "taxableAmount": 200000.00
    }

},
"Type": "PPH_TAX_CALCULATION"
}

Bagian 9: Analytics dan Reporting
9.1 Mendapatkan Daftar Pesanan
Referensi KO & LD: - KO-25 (Instant): Daftar Pesanan - LD References: [LD-2] -
Order list interface
Get Order List
Deskripsi: Mendapatkan daftar pesanan dengan ﬁlter dan pagination.
Endpoint
GET /base_url/v1/orders/list
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Query Parameters
Parameter
Tipe
Wajib
Default
Deskripsi
page
integer
Tidak
1
Nomor halaman
limit
integer
Tidak
10
Jumlah item per
halaman
status
string
Tidak
null
Filter
berdasarkan
status tertentu

Parameter
Tipe
Wajib
Default
Deskripsi
search
string
Tidak
null
Kata kunci
pencarian (min
3 karakter)
startDate
date
Tidak
null
Tanggal mulai
(untuk CUSTOM
period)
endDate
date
Tidak
null
Tanggal akhir
(untuk CUSTOM
period)
sort
string
Tidak
“loadTimeSt
art”
Field
pengurutan
(inv/loadTime)
order
string
Tidak
“asc”
Arah
pengurutan
(asc/desc)
requiresConﬁrm
ation
string
Tidak
false
true/false
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Orders list retrieved successfully"
},
"Data": {
"orders": [
{
"orderId": "550e8400-e29b-41d4-a716-446655440000",
"invoice": "MTR/250208/001/AAA",
"orderType": "INSTANT",
"loadTimeStart": "2025-02-08T09:00:00Z",
"loadTimeEnd": "2025-02-08T13:00:00Z",
"locations": {
"pickup": [
{
"sequence": 1,
"fullAddress": "Jl. Sudirman No. 123, Jakarta Pusat",
"city": "Jakarta Pusat"
}
],
"dropoff": [
{

              "sequence": 1,
              "fullAddress": "Jl. Gatot Subroto No. 456, Jakarta Selatan",
              "city": "Jakarta Selatan"
            }
          ],
          "hasMultiplePickup": false,
          "hasMultipleDropoff": false
        },
        "vehicle": {
          "carrierName": "Box",
          "truckTypeName": "CDE Engkel",
          "truckCount": 2
        },
        "statusInfo": [
          {
            "statusLabel": "Menunggu Pembayaran",
            "statusCode": "WAITING_PAYMENT",
            "totalUnit": 3,
            "paymentDeadline": "2025-02-08T15:00:00Z",
            "requiresConﬁrmation": false,
            "isRefundProcessing": false
          }
        ],
        "createdAt": "2025-02-08T08:00:00Z",
        "hasReview": true,
        "additionalCost": 1000000
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }

},
"Type": "ORDERS_LIST"
}
9.2 Mendapatkan Jumlah Pesanan per Status
Referensi KO & LD: - KO-25 (Instant): Daftar Pesanan - LD References: [LD-2.1] -
Order list with ﬁlters and status bubbles
Get Order Count by Status
Deskripsi: Mengambil jumlah pesanan untuk setiap status.
Endpoint
GET /base_url/v1/orders/count-by-status

Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Orders count by status retrieved successfully"
},
"Data": {
"statusCounts": {
"all": 25,
"waitingPayment": 3,
"awaitingSettlement": 2,
"documentProcess": 1
},
"lastUpdated": "2025-02-08T10:30:00Z"
},
"Type": "ORDERS_COUNT_BY_STATUS"
}

Bagian 10: Alternate Flow Endpoints
Bagian ini mencakup semua endpoint untuk skenario alternate ﬂow yang
tercantum dalam Knowledge Object (KO), termasuk:
10.1 Armada Tidak Ditemukan
•
Endpoint ﬂeet search status (sudah tercantum di bagian 6.2)
•
Endpoint auto-cancel (sudah tercantum di bagian 6.8)
10.2 Pesan Ulang
•
Endpoint reorder (sudah tercantum di bagian 7.15)
10.3 Batalkan Pesanan
•
Endpoint cancellation reasons (sudah tercantum di bagian 6.4)
•
Endpoint cancel order (sudah tercantum di bagian 6.5)

10.4 Reimbursement dan Tambahan Biaya
•
Endpoint additional payment (sudah tercantum di bagian 8.5)
•
Endpoint settlement deadline (sudah tercantum di bagian 8.6)
10.5 Biaya Waktu Tunggu
•
Endpoint waiting time info (sudah tercantup di bagian 7.6)
10.6 Ubah Pesanan
Referensi KO & LD: - KO-22 (Instant): Ubah Pesanan Instan (Ubah/Tambah
Lokasi Bongkar - Sebelum Muat) - KO-23 (Instant): Ubah Pesanan Instan (Sudah
Muat & Tidak Ada Tambahan Biaya) - KO-24 (Instant): Ubah Pesanan Instan
(Sudah Muat & Ada Tambahan Biaya) - KO-21 (Scheduled): Ubah Pesanan
Sebelum Berangkat TERJADWAL - KO-22 (Scheduled): Ubah Pesanan Ada
Penalti & Harga Lebih Mahal TERJADWAL - LD References: [LD-22] - Dynamic
pricing adjustments, [LD-24] - Exception handling workﬂows
Single Endpoint untuk Semua Skenario Ubah Pesanan
Deskripsi: Endpoint uniﬁed untuk mengubah pesanan dengan automatic
business rules detection berdasarkan timing, order status, dan modiﬁcation type.
Backend akan secara otomatis menentukan apakah ada biaya tambahan, perlu
approval, atau dapat diproses langsung sesuai dengan KO-22 (sebelum muat),
KO-23 (sudah muat tanpa biaya), atau KO-24 (sudah muat dengan biaya).
Endpoint
PUT /base_url/v1/orders/{orderId}/update
Path Parameters
Parameter
Tipe
Wajib
Deskripsi
orderId
string
Ya
ID unik pesanan
Request Headers
Header
Nilai
Wajib
Deskripsi
Authorization
Bearer {token}
Ya
JWT token
untuk
autentikasi
Content-Type
application/json Ya
Format request
body
Request Body
{
"modiﬁcation_type": "location_change",
"modiﬁcations": {
"pickup_locations": [
{

        "location_id": "string",
        "address": "Jl. Sudirman No. 123, Jakarta",
        "coordinates": {
          "latitude": -6.2088,
          "longitude": 106.8456
        },
        "contact_person": "John Doe",
        "contact_phone": "081234567890"
      }
    ],
    "delivery_locations": [
      {
        "location_id": "string",
        "address": "Jl. Gatot Subroto No. 456, Jakarta",
        "coordinates": {
          "latitude": -6.2088,
          "longitude": 106.8456
        },
        "contact_person": "Jane Smith",
        "contact_phone": "081234567891"
      }
    ],
    "cargo_details": {
      "weight": 1500,
      "volume": 2.5,
      "description": "Elektronik"
    },
    "schedule": {
      "pickup_time": "2024-01-15T08:00:00Z",
      "delivery_time": "2024-01-15T15:00:00Z"
    }

}
}
Response
Success Response (200 OK)
{
"message": {
"code": 200,
"text": "Order modiﬁcation processed successfully"
},
"data": {
"orderId": "550e8400-e29b-41d4-a716-446655440090",
"cost_impact": {
"additional_cost": 0,
"penalty_fee": 0,
"total_adjustment": 0,

      "requires_payment": false
    },
    "updated_order": {
      "order_id": "550e8400-e29b-41d4-a716-446655440090",
      "pickup_locations": [...],
      "delivery_locations": [...],
      "total_cost": 2500000
    },

},
"type": "ORDER_MODIFICATION"
}
Error Response (400 Bad Request)
{
"message": {
"code": 400,
"text": "Order modiﬁcation not allowed"
},
"error": {
"error_code": "MODIFICATION_NOT_ALLOWED",
"details": {
"current_status": "completed",
"allowed_statuses": ["conﬁrmed", "loading", "loaded"],
}
},
"type": "ORDER_MODIFICATION_ERROR"
}
