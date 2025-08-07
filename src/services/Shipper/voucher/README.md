# 🎫 Implementasi API Voucher

## 📋 Deskripsi

Implementasi API voucher yang terintegrasi dengan sistem MuaTrans untuk mendapatkan dan memvalidasi voucher yang tersedia untuk pengguna.

## 🗂️ Struktur File

```
src/services/voucher/
├── muatTransVoucherService.js    # Service API voucher
├── README.md                     # Dokumentasi ini
└── VoucherUsageExample.jsx       # Contoh penggunaan
```

## 🔧 API Service Functions

### `muatTransGetAvailableVouchers()`

Mendapatkan daftar voucher yang tersedia untuk pengguna.

**Endpoint:** `GET /v1/orders/vouchers`

**Return:**

```javascript
[
  {
    id: "550e8400-e29b-41d4-a716-446655440070",
    code: "DISKON50K",
    name: "Diskon 50 Ribu",
    description: "Potongan Rp 50.000 untuk transaksi minimal Rp 1.000.000",
    discountAmount: 50000,
    minOrderAmount: 300000,
    maxDiscountAmount: 100000,
    validFrom: "2023-01-01T00:00:00Z",
    validTo: "2023-12-31T23:59:59Z",
    termsAndConditions: "...",
  },
];
```

### `muatTransValidateVoucher({ voucherId, totalAmount })`

Memvalidasi kode voucher yang dimasukkan pengguna.

**Endpoint:** `POST /v1/orders/vouchers/validate`

**Parameters:**

- `voucherId` (string): ID voucher yang akan divalidasi
- `totalAmount` (number): Total amount pesanan

**Return:**

```javascript
{
  voucherId: "550e8400-e29b-41d4-a716-446655440000",
  code: "MUAT100",
  isValid: true,
  validationMessages: []
}
```

## 🎨 Komponen VoucherContainer

### Props

- `selectedVoucher` (object): Voucher yang sedang dipilih
- `baseOrderAmount` (number): Total amount pesanan sebelum diskon
- `onVoucherSelect` (function): Callback saat voucher dipilih

### Return Object

```javascript
{
  VoucherModal: JSX.Element,           // Modal komponen voucher
  openVoucherPopup: Function,          // Fungsi untuk membuka popup
  calculateDiscountAmount: Function,   // Fungsi menghitung diskon
  voucherList: Array,                  // Daftar voucher
  loading: Boolean,                    // Status loading
  error: String,                       // Error message
  selectedVoucher: Object              // Voucher yang dipilih
}
```

## 💡 Contoh Penggunaan

### 1. Penggunaan Dasar

```jsx
import { VoucherContainer } from "@/container/Voucher/Voucher";

const MyComponent = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [baseOrderAmount] = useState(1000000);

  const voucherContainer = VoucherContainer({
    selectedVoucher,
    baseOrderAmount,
    onVoucherSelect: (voucher) => {
      setSelectedVoucher(voucher);
    },
  });

  return (
    <div>
      {/* Tombol untuk membuka popup voucher */}
      <button onClick={voucherContainer.openVoucherPopup}>Pilih Voucher</button>

      {/* Render modal */}
      {voucherContainer.VoucherModal}
    </div>
  );
};
```

### 2. Menghitung Diskon

```jsx
const discountAmount = selectedVoucher
  ? voucherContainer.calculateDiscountAmount(selectedVoucher, baseOrderAmount)
  : 0;

const finalAmount = baseOrderAmount - discountAmount;
```

### 3. Menampilkan Status Loading dan Error

```jsx
{
  voucherContainer.loading && <div>Memuat voucher...</div>;
}

{
  voucherContainer.error && <div>Error: {voucherContainer.error}</div>;
}
```

## 🔒 Autentikasi

Service ini menggunakan `fetcherMuatrans` yang sudah dikonfigurasi dengan:

- Bearer token otomatis dari `useTokenStore`
- Refresh token handling
- Error handling untuk 401/403

## 🎯 Fitur

- ✅ Fetch voucher otomatis saat komponen dimuat
- ✅ Validasi voucher real-time
- ✅ Search dan filter voucher
- ✅ Handling loading dan error states
- ✅ Kalkulasi diskon otomatis
- ✅ UI responsive dengan modal

## 📝 Catatan

- Voucher hanya bisa dipilih satu pada satu waktu
- Validasi voucher dilakukan sebelum selection
- Error handling ditampilkan per voucher
- Komponen menggunakan Tailwind CSS untuk styling

## 🚀 Pengembangan Lebih Lanjut

1. **Integrasi dengan Form Pembayaran**

   - Tambahkan ke komponen checkout/payment
   - Simpan voucher di state management global

2. **Fitur Tambahan**

   - Bookmark voucher favorit
   - Notifikasi voucher akan expired
   - History penggunaan voucher

3. **Performance**
   - Implement caching untuk voucher list
   - Lazy loading untuk voucher images
   - Debounce untuk search functionality

# Voucher API Integration

Dokumentasi untuk integrasi API voucher dalam aplikasi Muattrans Shipper.

## Overview

Sistem voucher terintegrasi dengan API backend untuk:

- Mendapatkan daftar voucher yang tersedia
- Memvalidasi voucher yang dipilih pengguna
- Menerapkan diskon pada transaksi
- **NEW**: Simulasi race condition untuk testing concurrent usage

## API Endpoints

### 1. Get Available Vouchers

**Endpoint:** `GET /v1/orders/vouchers`
**Headers:** `Authorization: Bearer {token}`

**Response:**

```json
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
        "discountType": "nominal" || "percentage",
        "minOrderAmount": 300000,
        "maxDiscountAmount": 100000,
        "validFrom": "2024-01-01T00:00:00Z",
        "validTo": "2025-12-31T23:59:59Z",
        "termsAndConditions": "Terms and conditions text"
      }
    ]
  },
  "type": "AVAILABLE_VOUCHERS"
}
```

### 2. Validate Voucher

**Endpoint:** `POST /v1/orders/vouchers/validate`
**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Request Body:**

```json
{
  "voucherId": "550e8400-e29b-41d4-a716-446655440000",
  "totalAmount": 3102000
}
```

**Response:**

```json
{
  "Message": {
    "Code": 200,
    "Text": "Voucher valid"
  },
  "Data": {
    "voucherId": "550e8400-e29b-41d4-a716-446655440000",
    "code": "MUAT100",
    "isValid": true,
    "validationMessages": []
  },
  "type": "VOUCHER_VALIDATION"
}
```

## Services

### `muatTransVoucherService.js`

Service untuk integrasi API voucher real.

**Functions:**

- `muatTransGetAvailableVouchers(token)` - Mendapatkan daftar voucher
- `muatTransValidateVoucher({voucherId, totalAmount, token})` - Memvalidasi voucher

**Error Handling:**

- 401: Unauthorized - Token tidak valid
- 403: Forbidden - Akses ditolak
- 404: Voucher tidak ditemukan
- 400: Validasi gagal
- 500+: Server error

### `mockVoucherService.js`

Service untuk testing dengan data mock.

**Functions:**

- `mockGetAvailableVouchers()` - Mendapatkan daftar voucher mock
- `mockValidateVoucher({voucherId, totalAmount})` - Memvalidasi voucher mock

**NEW - Race Condition Simulation:**

- Voucher khusus untuk testing concurrent access: `FLASH25K`, `VIRAL30`, `HOKI88`
- Voucher terlihat available di client tapi gagal di server
- Error message: "Kode voucher telah habis"

## Hook

### `useVoucher.js`

Hook untuk menggunakan voucher dengan state management.

**Usage:**

```javascript
const { vouchers, loading, error, refetch } = useVouchers(
  token,
  useMockData,
  mockEmpty
);
```

**Parameters:**

- `token` (string): Bearer token untuk autentikasi
- `useMockData` (boolean): Flag untuk menggunakan mock data
- `mockEmpty` (boolean): Flag untuk mengembalikan empty array tanpa API call

**Returns:**

- `vouchers` (array): Daftar voucher yang tersedia
- `loading` (boolean): Status loading
- `error` (string): Error message jika ada
- `refetch` (function): Function untuk refresh data

## Components

### Responsive Components

- `HomeScreen.jsx` - Halaman utama dengan voucher selection
- `VoucherCard.jsx` - Komponen card voucher
- `VoucherEmptyState.jsx` - State kosong
- `VoucherSearchEmpty.jsx` - State pencarian kosong

### Web Components

- `SummaryPanel.jsx` - Panel ringkasan dengan voucher
- `Voucher.jsx` - Container voucher

## Features

### 1. Voucher Selection

- Tampilkan daftar voucher yang tersedia
- Filter voucher berdasarkan kode
- Validasi voucher real-time
- Error handling untuk validasi gagal

### 2. Loading States

- Spinner loading saat fetch data
- Loading state saat validasi voucher
- Error state dengan tombol retry

### 3. Error Handling

- Network error handling
- Server error handling
- Validation error display
- User-friendly error messages

### 4. Discount Calculation

- Support percentage dan fixed amount discount
- Respect maximum discount limits
- Real-time total calculation

### 5. **NEW - Expired Warning**

- Alert merah untuk voucher yang akan expired dalam 3 hari
- Menggunakan utility function `isVoucherExpiringSoon()`
- Tampil di bawah VoucherCard

### 6. **NEW - Race Condition Simulation**

**Purpose**: Testing concurrent voucher usage scenarios

**Vouchers for Testing**:

- `FLASH25K` - Flash Sale 25K (Rp 25.000 off, min Rp 100.000)
- `VIRAL30` - Viral 30% (30% off max Rp 150.000, min Rp 200.000)
- `HOKI88` - Hoki 88K (Rp 88.000 off, min Rp 500.000)

**Behavior**:

- ✅ **Client-side**: Voucher terlihat available (`isOutOfStock: false`)
- ✅ **Client-side**: Usage percentage tinggi (95%+) - visual indicator hampir habis
- ✅ **Client-side**: Pass semua validasi (minimum amount, stock, expiry)
- ❌ **Server-side**: Gagal validasi dengan error "Kode voucher telah habis"

**Use Cases**:

- Multiple users mencoba menggunakan voucher bersamaan
- Voucher dengan kuota terbatas yang cepat habis
- Testing user experience saat voucher habis di server

## Validation Flow

### Client-Side Validation (First Layer)

```javascript
validateVoucherClientSide(voucher, orderAmount);
```

**Checks**:

- ✅ Minimum order amount
- ✅ Stock availability (`isOutOfStock`)
- ✅ Expiry date validation
- ✅ Voucher existence

**Error Messages**:

- "Minimal Transaksi Rp X.XXX.XXX" (Indonesian currency format)
- "Kuota voucher sudah habis"
- "Voucher sudah berakhir"
- "Voucher belum dapat digunakan"

### Server-Side Validation (Second Layer)

```javascript
muatTransValidateVoucher({ voucherId, totalAmount, token });
```

**Additional Checks**:

- Real-time stock verification
- Account-specific restrictions
- Business rules validation
- **Race condition detection**

**NEW Error Messages**:

- "Kode voucher telah habis" (for race condition)

## Configuration

### Switching Between Mock and Real API

**Development/Testing:**

```javascript
const useMockData = false; // Gunakan mock data
const mockEmpty = false; // Voucher list dengan data
```

**Production:**

```javascript
const useMockData = false; // Gunakan API real
const mockEmpty = false; // Fetch data dari API
```

**Testing Empty State:**

```javascript
const useMockData = false; // Bisa mock atau real API
const mockEmpty = true; // Simulate empty voucher list tanpa API call
```

**Testing Race Condition:**

```javascript
const useMockData = false; // Gunakan mock data
// Try menggunakan voucher: FLASH25K, VIRAL30, atau HOKI88
```

### Token Management

Token harus berupa Bearer token yang valid:

```javascript
const token = "Bearer your_actual_token_here";
```

## Usage Examples

### Basic Usage

```javascript
import { useVouchers } from "@/hooks/useVoucher";

const MyComponent = () => {
  const { vouchers, loading, error } = useVouchers(token, false);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {vouchers.map((voucher) => (
        <VoucherCard key={voucher.id} {...voucher} />
      ))}
    </div>
  );
};
```

### Voucher Validation

```javascript
import { muatTransValidateVoucher } from "@/services/voucher/muatTransVoucherService";

const validateVoucher = async (voucherId, totalAmount) => {
  try {
    const result = await muatTransValidateVoucher({
      voucherId,
      totalAmount,
      token: "Bearer your_token",
    });

    if (result.isValid) {
      // Apply voucher
    } else {
      // Show validation errors
      console.log(result.validationMessages);
    }
  } catch (error) {
    // Handle error
    console.error(error.message);
  }
};
```

### **NEW - Race Condition Testing**

```javascript
// Set order amount yang memenuhi minimum untuk race condition vouchers
const orderAmount = 500000; // Rp 500.000

// Try menggunakan salah satu race condition vouchers
const raceConditionVouchers = ["FLASH25K", "VIRAL30", "HOKI88"];

// Expected behavior:
// 1. Client validation ✅ Pass
// 2. Server validation ❌ "Kode voucher telah habis"
// 3. Error ditampilkan di UI dengan border merah
```

## Best Practices

1. **Token Management**: Pastikan token selalu valid dan terupdate
2. **Error Handling**: Selalu handle error dengan user-friendly message
3. **Loading States**: Tampilkan loading state untuk UX yang baik
4. **Validation**: Validasi voucher sebelum apply ke transaksi
5. **Testing**: Gunakan mock data untuk development dan testing
6. **Performance**: Implementasi caching jika diperlukan
7. **NEW - Race Condition**: Test concurrent access dengan race condition vouchers

## Troubleshooting

### Common Issues

1. **Token Expired**: Refresh token dan coba lagi
2. **Network Error**: Periksa koneksi internet
3. **Validation Failed**: Periksa minimum order amount
4. **Server Error**: Coba lagi nanti atau hubungi support
5. **NEW - Race Condition**: Voucher habis saat validasi server-side

### Debug Tips

- Periksa console untuk error logs
- Gunakan mock data untuk isolasi masalah
- Validasi format request/response
- Periksa network tab di browser developer tools
- **NEW**: Test race condition dengan voucher FLASH25K, VIRAL30, HOKI88

## Testing Scenarios

### Regular Vouchers

| Voucher            | Min Order  | Expected Result         |
| ------------------ | ---------- | ----------------------- |
| DISKON50K          | Rp 300.000 | Client validation error |
| DISKONPENGGUNABARU | Rp 50.000  | ✅ Valid                |
| HEMAT20            | Rp 50.000  | ✅ Valid                |
| GRATIS10K          | Rp 50.000  | Client-side "habis"     |
| MURAH15            | Rp 25.000  | ✅ Valid                |

### **NEW - Race Condition Vouchers**

| Voucher  | Min Order  | Client Check | Server Check                  |
| -------- | ---------- | ------------ | ----------------------------- |
| FLASH25K | Rp 100.000 | ✅ Pass      | ❌ "Kode voucher telah habis" |
| VIRAL30  | Rp 200.000 | ✅ Pass      | ❌ "Kode voucher telah habis" |
| HOKI88   | Rp 500.000 | ✅ Pass      | ❌ "Kode voucher telah habis" |

### Expired Warning

- Voucher dengan `validTo` dalam 3 hari: Tampil warning ⚠️
- Voucher dengan `validTo` > 3 hari: Tidak ada warning
