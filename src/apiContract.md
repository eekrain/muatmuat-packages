## **5.3 Mendapatkan Voucher Tersedia**

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
}
