<!-- ## **5.3 Mendapatkan Voucher Tersedia**

**Referensi KO & LD:** \- **KO-09** (Instant & Scheduled): Pilih opsi bayar & penggunaan voucher \- **LD References**: \[LD-16\] \- Voucher selection bottomsheet, \[LD-6.3\] \- Voucher validation and discount calculation, \[LD-6.4\] \- Voucher application process

##### _Get Available Vouchers_

**Deskripsi**: Mendapatkan daftar voucher yang tersedia untuk pengguna.

##### **Endpoint**

GET /v1/orders/vouchers

##### **Request Headers**

| Header        | Nilai          | Wajib | Deskripsi                   |
| :------------ | :------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya    | JWT token untuk autentikasi |

##### **Response**

**Success Response (200 OK)**

{
 "Message": {
 "Code": 200,
 "Text": "Success"
 },
 "Data": {
 "vouchers": [
 {
 "id": "550e8400-e29b-41d4-a716-446655440070",
 "code": "DISKON50K",
 "name": "Diskon 50 Ribu",
 "description": "Potongan Rp 50.000 untuk transaksi minimal Rp 1.000.000",
 "discountAmount": 50000,
"discountType":"nominal" || "percentage" ,
"minOrderAmount": 300000,
 "maxDiscountAmount": 100000,
 "validFrom": "2023-01-01T00:00:00Z",
 "validTo": "2023-12-31T23:59:59Z",
 "termsAndConditions": "1. Voucher berlaku untuk semua pengguna\\\\n2. Masa berlaku voucher sampai 31 Desember 2023\\\\n3. Minimum pembelian Rp 300.000"
 }
 \]
 },
 "type": "AVAILABLE_VOUCHERS"
}

## **5.4 Validasi Voucher**

**Referensi KO & LD:** \- **KO-09** (Instant & Scheduled): Pilih opsi bayar & penggunaan voucher \- **LD References**: \[LD-16.8A\] \- Voucher minimum transaction amount validation

##### _Validate Voucher_

**Deskripsi**: Memvalidasi kode voucher yang dimasukkan pengguna.

##### **Endpoint**

POST /v1/orders/vouchers/validate

##### **Request Headers**

| Header        | Nilai            | Wajib | Deskripsi                   |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token}   | Ya    | JWT token untuk autentikasi |
| Content-Type  | application/json | Ya    | Format request body         |

##### **Request Body**

{
 "voucherId": "550e8400-e29b-41d4-a716-446655440000",
 "totalAmount": 3102000
}

##### **Response**

**Success Response (200 OK)**

{
 "Message": {
 "Code": 200,
 "Text": "Voucher valid"
 },
 "Data": {
 "voucherId": "550e8400-e29b-41d4-a716-446655440000",
 "code": "MUAT100",
 "isValid": **true**,
 "validationMessages": \[\]
 },
 "type": "VOUCHER_VALIDATION"
} -->

<!-- ## **1.User Popup Preference**

**Deskripsi**
Mendapatkan preferensi pengguna untuk menampilkan popup informasi
**Endpoint**
GET /v1/user/popup-preference/import-fleet

Parameters
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

**Response**

Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "User popup preference retrieved successfully"
},
"Data": {
"showPopup": true, // [dbm_mt_user.showFirstTimePopup]
"lastUpdated": "2025-01-15T10:30:00Z"
},
"Type": "USER_POPUP_PREFERENCE"
}
Error Response (400 Bad Request)
{
"Message": {
"Code": 400,
"Text": "Invalid request"
},
"Data": {
"errors": [
{
"field": "user",
"message": "User not found"
}
]
},
"Type": "USER_POPUP_PREFERENCE"
}

## **2. Update User Popup Preference**

**Deskripsi**
Memperbarui preferensi pengguna untuk menampilkan popup informasi
**Endpoint**
POST /v1/user/popup-preference/import-fleet

**Parameters**
Request Headers

| Header        | Nilai            | Wajib | Deskripsi                   |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token}   | Ya    | JWT token untuk autentikasi |
| Content-Type  | application/json | Ya    | Format request body         |

Request Body
{
"showPopup": false // [dbm_mt_user.showFirstTimePopup]
}
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "User popup preference updated successfully"
},
"Data": {
"showPopup": false,
"updatedAt": "2025-01-15T10:30:00Z"
},
"Type": "USER_POPUP_PREFERENCE_UPDATE"
} -->

## **3. Download Excel Template**

**Deskripsi**
Mengunduh template Excel untuk tambah armada massal
**Endpoint**
GET /v1/fleet/excel-template

Parameters
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": ""
},
"Data": {
"templateUrl": "urlS3"
}
}
Referensi LD
LD 2 - Tombol Unduh Template Excel

## **4. Bulk Upload Excel**

**Deskripsi**
Mengunggah file Excel untuk tambah armada massal
**Endpoint**
POST /v1/fleet/bulk-upload

Parameters
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |
| Content-Type | multipart/form-data | Ya | Format request body |

Request Body
file: [Excel file] // File Excel maksimal 10MB
Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Excel file uploaded and processed successfully"
},
"Data": {
"bulkImportId": "12345678-1234-1234-1234-123456789012", // [dbt_mt_fleet_bulk_import.id]
"fileName": "data_armada.xlsx", // [dbt_mt_fleet_bulk_import.fileName]
"originalFileName": "Data Armada Januari 2025.xlsx", // [dbt_mt_fleet_bulk_import.originalFileName]
"fileSize": 1024576, // [dbt_mt_fleet_bulk_import.fileSize]
"totalRows": 50, // [dbt_mt_fleet_bulk_import.totalRows]
"processedRows": 45, // [dbt_mt_fleet_bulk_import.processedRows]
"successRows": 40, // [dbt_mt_fleet_bulk_import.successRows]
"failedRows": 5, // [dbt_mt_fleet_bulk_import.failedRows]
"status": "COMPLETED/FAILED", // [dbt_mt_fleet_bulk_import.status]
},
"Type": "BULK_UPLOAD_EXCEL"
}
Error Response (400 Bad Request)
{
"Message": {
"Code": 400,
"Text": "Excel file validation failed"
},
"Data": {
"errors": [
{
"field": "file",
"message": "File format harus .xlsx atau .xls"
}
]
},
"Type": "BULK_UPLOAD_EXCEL"
}

## **5. Get Upload History**

**Deskripsi**
Mendapatkan riwayat unggahan file Excel
**Endpoint**
GET /v1/fleet/upload-history

Parameters
Query Parameters
Request Headers
| Parameter | Tipe Interger | Wajib | Default | Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- | :-------------------------- |
| Page | Integer | Tidak | 1 | Nomor Halaman |
| Limit | Integer | Ya | 10 | Jumlah Item per Halaman |
| Search | String | Tidak | - | Kata Kunci Pencarian |
| Sort | String | Tidak | createdAt | Field Untuk Pengaturan |
| Order | String | Tidak | desc | Arah Pengaturan |

Request Headers
Request Headers
| Header | Nilai | Wajib | Deskripsi |
| :------------ | :--------------- | :---- | :-------------------------- |
| Authorization | Bearer {token} | Ya | JWT token untuk autentikasi |

Response
Success Response (200 OK)
{
"Message": {
"Code": 200,
"Text": "Upload history retrieved successfully"
},
"Data": {
"history": [
{
"id": "12345678-1234-1234-1234-123456789012", // [dbt_mt_fleet_bulk_import.id]
"originalFileName": "Data Armada Januari 2025.xlsx", // [dbt_mt_fleet_bulk_import.originalFileName]
"status": "COMPLETED/FAILED", // [dbt_mt_fleet_bulk_import.status]
"uploadedAt": "2025-01-15T10:30:00Z", // [dbt_mt_fleet_bulk_import.createdAt]
"uploadBy": "Sutris",
"fileReport": "urlS3",
}
],
"pagination": {
"page": 1,
"limit": 10,
"totalItems": 25,
"totalPages": 3,
"hasNext": true,
"hasPrevious": false
}
},
"Type": "UPLOAD_HISTORY"
}
