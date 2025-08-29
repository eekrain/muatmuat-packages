# 🎫 Panduan Implementasi Multi Bahasa Komponen Voucher MuaTrans

## 📋 Overview

Dokumentasi ini menjelaskan implementasi lengkap sistem multi bahasa (Indonesia, English, Chinese) untuk semua komponen Voucher dalam aplikasi MuaTrans Shipper menggunakan Next.js dan sistem terjemahan yang sudah ada.

## ✅ Status Implementasi

- [x] **VoucherCard.jsx** - Implementasi lengkap dengan useTranslation
- [x] **VoucherInfoPopup.jsx** - Implementasi lengkap dengan useTranslation
- [x] **VoucherEmptyState.jsx** - Implementasi lengkap dengan useTranslation
- [x] **VoucherSearchEmpty.jsx** - Implementasi lengkap dengan useTranslation
- [x] **VoucherContainer (Voucher.jsx)** - Implementasi lengkap dengan useTranslation
- [x] **VoucherPopup.jsx** - Implementasi lengkap dengan useTranslation
- [x] **Dokumentasi terjemahan lengkap** - Format sesuai ui-translation-guide.md

## 🗂️ Struktur File yang Diupdate

```
src/
├── components/Voucher/
│   ├── VoucherCard.jsx ✅ (Updated)
│   ├── VoucherInfoPopup.jsx ✅ (Updated)
│   ├── VoucherEmptyState.jsx ✅ (Updated)
│   ├── VoucherSearchEmpty.jsx ✅ (Updated)
│   └── VoucherPopup.jsx ✅ (Updated)
├── container/Shipper/Voucher/
│   └── Voucher.jsx ✅ (Updated)
├── voucher-translation-documentation.md ✅ (New)
├── voucher-implementation-example.jsx ✅ (New)
└── voucher-multilang-implementation-guide.md ✅ (This file)
```

## 📊 Tabel Terjemahan Lengkap

### Format Input untuk Backend/CMS

Format tab-separated sesuai ui-translation-guide.md:

```
voucher	voucherCard	Diskon	Discount	labelDiscount	折扣
voucher	voucherCard	Min. Transaksi	Min. Transaction	labelMinTransaction	最低交易
voucher	voucherCard	Kuota	Quota	labelQuota	配额
voucher	voucherCard	Kuota Voucher Telah Terpakai	Voucher Quota Used	descQuotaUsed	优惠券配额已使用
voucher	voucherCard	Validasi...	Validating...	buttonValidating	验证中...
voucher	voucherCard	Dipakai	Applied	buttonApplied	已使用
voucher	voucherCard	Pakai	Use	buttonUse	使用
voucher	voucherCard	Kuota Voucher sudah habis	Voucher quota is exhausted	messageOutOfStock	优惠券配额已用完
voucher	voucherCard	Voucher akan berakhir dalam 3 hari	Voucher will expire in 3 days	messageExpiringSoon	优惠券将在3天内过期
voucher	voucherInfoPopup	hingga	up to	labelUpTo	高达
voucher	voucherInfoPopup	Berlaku hingga	Valid until	labelValidUntil	有效期至
voucher	voucherInfoPopup	Minimum transaksi	Minimum transaction	labelMinimumTransaction	最低交易
voucher	voucherInfoPopup	Syarat Dan Ketentuan	Terms and Conditions	titleTermsAndConditions	条款和条件
voucher	voucherInfoPopup	Cara Pemakaian	How to Use	titleHowToUse	使用方法
voucher	voucherInfoPopup	Kembali	Back	buttonBack	返回
voucher	voucherInfoPopup	Maksimal berlaku untuk transaksi dengan	Maximum applicable for transactions with	descMaxApplicable	最高适用于交易
voucher	voucherInfoPopup	Minimum belanja	Minimum purchase	descMinPurchase	最低购买
voucher	voucherInfoPopup	Pembayaran yang berlaku: BCA Virtual Account	Applicable payment: BCA Virtual Account	descPaymentMethod	适用付款方式：BCA虚拟账户
voucher	voucherInfoPopup	1 promo berlaku untuk 2 kali transaksi selama periode promo	1 promo valid for 2 transactions during promo period	descPromoLimit	1个促销活动在促销期间有效2次交易
voucher	voucherInfoPopup	Promo tidak dapat digabungkan dengan promo lain	Promo cannot be combined with other promos	descPromoNotCombinable	促销活动不能与其他促销活动合并
voucher	voucherInfoPopup	Promo berlaku di aplikasi Muatparts berbasis iOS dan/atau Android versi terbaru	Promo valid on Muatparts iOS and/or Android app latest version	descAppCompatibility	促销活动适用于最新版本的iOS和/或Android Muatparts应用程序
voucher	voucherInfoPopup	Masukkan kode Voucher Kamu dan pilih Voucher	Enter your Voucher code and select Voucher	descUsageInstruction	输入您的优惠券代码并选择优惠券
voucher	voucherEmptyState	Belum Ada Voucher	No Vouchers Available	titleNoVouchers	暂无优惠券
voucher	voucherSearchEmpty	Keyword Tidak Ditemukan	Keyword Not Found	titleKeywordNotFound	关键词未找到
voucher	voucherModal	Pilih Voucher	Select Voucher	titleSelectVoucher	选择优惠券
voucher	voucherModal	Hanya bisa dipilih 1 Voucher	Only 1 Voucher can be selected	descOneVoucherOnly	只能选择1张优惠券
voucher	voucherModal	1 Voucher Terpakai	1 Voucher Applied	statusOneVoucherApplied	已使用1张优惠券
voucher	voucherModal	Gagal memuat daftar voucher	Failed to load voucher list	errorLoadVouchers	加载优惠券列表失败
voucher	voucherModal	Gagal memvalidasi voucher	Failed to validate voucher	errorValidateVoucher	验证优惠券失败
voucher	voucherModal	Voucher tidak valid	Voucher is not valid	errorInvalidVoucher	优惠券无效
voucher	voucherModal	Kode voucher telah habis	Voucher code is exhausted	errorVoucherExhausted	优惠券代码已用完
voucher	general	Cari kode voucher	Search voucher code	placeholderSearchVoucher	搜索优惠券代码
voucher	general	Loading voucher...	Loading voucher...	messageLoadingVoucher	加载优惠券中...
voucher	general	Gagal load voucher	Failed to load voucher	errorLoadVoucher	加载优惠券失败
voucher	general	Tutup	Close	buttonClose	关闭
voucher	general	Terapkan	Apply	buttonApply	应用
voucher	general	Lewati	Skip	buttonSkip	跳过
voucher	general	Lanjut	Continue	buttonContinue	继续
voucher	general	rb	k	labelThousand	千
```

## 🔧 Implementasi Teknis

### 1. Import useTranslation Hook

Semua komponen telah diupdate dengan import yang diperlukan:

```jsx
import { useTranslation } from "@/hooks/use-translation";

const MyVoucherComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("titleSelectVoucher")}</h1>
      <button>{t("buttonUse")}</button>
    </div>
  );
};
```

### 2. Pattern Penggunaan Terjemahan

#### Teks Statis

```jsx
// Sebelum
<span>Kuota Voucher Telah Terpakai</span>

// Sesudah
<span>{t('descQuotaUsed')}</span>
```

#### Teks dengan Parameter Dinamis

```jsx
// Sebelum
<span>Kuota Voucher Telah Terpakai {usagePercentage}%</span>

// Sesudah
<span>{t('descQuotaUsed')} {usagePercentage}%</span>

// Atau dengan parameter interpolation (jika didukung)
<span>{t('descQuotaUsedWithPercentage', { percentage: usagePercentage })}</span>
```

#### Conditional Text

```jsx
// Sebelum
{
  isValidating ? "Validasi..." : isActive ? "Dipakai" : "Pakai";
}

// Sesudah
{
  isValidating
    ? t("buttonValidating")
    : isActive
      ? t("buttonApplied")
      : t("buttonUse");
}
```

### 3. Error Handling dengan Terjemahan

```jsx
// VoucherContainer.jsx
try {
  const vouchers = await muatTransGetAvailableVouchers();
  setVoucherList(vouchers);
} catch (err) {
  setError(t("errorLoadVouchers")); // Menggunakan terjemahan
  console.error("Error fetching vouchers:", err);
}
```

### 4. Array dan Object dengan Terjemahan

```jsx
// VoucherCard.jsx - termsAndConditions array
const voucherData = {
  // ...
  termsAndConditions: [
    `${t("descMaxApplicable")} ${discountText}`,
    `${t("descMinPurchase")} ${idrFormat(minTransaksi)}`,
    t("descPaymentMethod"),
    t("descPromoLimit"),
    t("descPromoNotCombinable"),
    t("descAppCompatibility"),
  ],
  usageInstructions: [t("descUsageInstruction")],
};
```

## 🎨 Contoh Implementasi Lengkap

### Basic Usage

```jsx
import { VoucherContainer } from "@/container/Shipper/Voucher/Voucher";

import { useTranslation } from "@/hooks/use-translation";

const MyOrderPage = () => {
  const { t } = useTranslation();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [orderAmount] = useState(950000);

  const { VoucherModal, openVoucherPopup, calculateDiscountAmount } =
    VoucherContainer({
      selectedVoucher,
      baseOrderAmount: orderAmount,
      onVoucherSelect: setSelectedVoucher,
      useMockData: false,
    });

  return (
    <div>
      <h1>{t("titleSelectVoucher")}</h1>

      {selectedVoucher ? (
        <div className="rounded bg-green-50 p-3">
          <span>
            {t("statusOneVoucherApplied")}: {selectedVoucher.code}
          </span>
        </div>
      ) : (
        <button onClick={openVoucherPopup} className="btn-primary">
          {t("titleSelectVoucher")}
        </button>
      )}

      {VoucherModal}
    </div>
  );
};
```

### Advanced Usage dengan Form Integration

```jsx
import { useForm } from "react-hook-form";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [orderAmount] = useState(750000);

  const { VoucherModal, openVoucherPopup, calculateDiscountAmount } =
    VoucherContainer({
      selectedVoucher,
      baseOrderAmount: orderAmount,
      onVoucherSelect: setSelectedVoucher,
    });

  const discount = selectedVoucher
    ? calculateDiscountAmount(selectedVoucher, orderAmount)
    : 0;
  const finalAmount = orderAmount - discount;

  const onSubmit = (data) => {
    const orderData = {
      ...data,
      voucher: selectedVoucher,
      originalAmount: orderAmount,
      discount,
      finalAmount,
    };

    // Submit to API
    console.log("Order submitted:", orderData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Other form fields */}

      {/* Voucher Section */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Voucher {t("labelOptional")}
        </label>

        {selectedVoucher ? (
          <div className="flex items-center justify-between rounded bg-blue-50 p-3">
            <span>
              {selectedVoucher.code} (-Rp {discount.toLocaleString("id-ID")})
            </span>
            <button
              type="button"
              onClick={() => setSelectedVoucher(null)}
              className="text-red-600"
            >
              {t("buttonRemove")}
            </button>
          </div>
        ) : (
          <button type="button" onClick={openVoucherPopup}>
            + {t("titleSelectVoucher")}
          </button>
        )}
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span>{t("labelSubtotal")}:</span>
          <span>Rp {orderAmount.toLocaleString("id-ID")}</span>
        </div>

        {selectedVoucher && (
          <div className="flex justify-between text-green-600">
            <span>{t("labelDiscount")}:</span>
            <span>-Rp {discount.toLocaleString("id-ID")}</span>
          </div>
        )}

        <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
          <span>{t("labelTotal")}:</span>
          <span>Rp {finalAmount.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <button type="submit" className="btn-primary mt-4 w-full">
        {t("buttonPlaceOrder")}
      </button>

      {VoucherModal}
    </form>
  );
};
```

## 📱 Responsive Considerations

Implementasi ini compatible dengan semua breakpoint yang sudah ada:

- **Mobile**: Bottomsheet modal untuk voucher selection
- **Desktop**: Standard modal untuk voucher selection
- **Tablet**: Adaptif berdasarkan ukuran layar

## 🔄 Data Flow Diagram

```mermaid
graph TD
    A[User Action] --> B{Select Voucher?}
    B -->|Yes| C[Open VoucherModal]
    C --> D[Load Vouchers with t()]
    D --> E[Display Voucher List]
    E --> F[User Selects Voucher]
    F --> G[Validate Voucher]
    G --> H{Valid?}
    H -->|Yes| I[Apply Voucher]
    H -->|No| J[Show Error with t()]
    I --> K[Update UI with t()]
    J --> E
    B -->|No| L[Continue without Voucher]
```

## ⚡ Performance Optimizations

1. **Lazy Loading**: Komponen voucher hanya dimuat saat diperlukan
2. **Memoization**: Translation values di-cache oleh useTranslation hook
3. **Conditional Rendering**: Modal hanya render saat `showVoucherPopup` true
4. **Efficient Updates**: State updates yang minimal untuk re-render

## 🐛 Error Handling

### Client-side Validation Errors

```jsx
// Error messages sudah diterjemahkan
const validationErrors = {
  [voucher.id]: t("errorInvalidVoucher"),
};
```

### API Error Handling

```jsx
try {
  const result = await muatTransValidateVoucher({...});
  // Success handling
} catch (error) {
  setValidationErrors({
    [voucher.id]: t('errorValidateVoucher')
  });
}
```

### Network Error Handling

```jsx
try {
  const vouchers = await muatTransGetAvailableVouchers();
  setVoucherList(vouchers);
} catch (err) {
  setError(t("errorLoadVouchers"));
}
```

## 🧪 Testing Guidelines

### Unit Testing

```jsx
import { render, screen } from "@testing-library/react";

import VoucherCard from "@/components/Voucher/VoucherCard";

import { TranslationProvider } from "@/hooks/use-translation";

test("renders voucher card with translated text", () => {
  render(
    <TranslationProvider>
      <VoucherCard
        title="DISKON50"
        discountInfo="50% discount"
        minTransaksi={100000}
        onSelect={jest.fn()}
      />
    </TranslationProvider>
  );

  expect(screen.getByText("Min. Transaction")).toBeInTheDocument();
  expect(screen.getByText("Use")).toBeInTheDocument();
});
```

### Integration Testing

```jsx
test("voucher selection flow with translations", async () => {
  const mockOnSelect = jest.fn();

  render(
    <TranslationProvider>
      <VoucherContainer
        selectedVoucher={null}
        baseOrderAmount={500000}
        onVoucherSelect={mockOnSelect}
        useMockData={true}
      />
    </TranslationProvider>
  );

  // Test translated modal title appears
  fireEvent.click(screen.getByText("Select Voucher"));
  expect(screen.getByText("Select Voucher")).toBeInTheDocument();

  // Test voucher selection
  fireEvent.click(screen.getByText("Use"));
  expect(mockOnSelect).toHaveBeenCalled();
});
```

## 📈 Maintenance & Updates

### Adding New Translations

1. Update tabel terjemahan di dokumentasi ini
2. Input ke sistem backend/CMS sesuai format tab-separated
3. Test di environment dev dengan berbagai bahasa
4. Deploy ke production

### Modifying Existing Translations

1. Update entry yang sesuai di sistem backend
2. Refresh cache translation (jika ada)
3. Verify perubahan di semua komponen yang menggunakan

### Adding New Voucher Features

1. Identifikasi teks baru yang perlu diterjemahkan
2. Follow naming convention yang sudah ada
3. Update dokumentasi terjemahan
4. Implement dengan useTranslation hook

## ✅ Quality Checklist

- [x] Semua komponen menggunakan useTranslation hook
- [x] Tidak ada hardcoded Indonesian text
- [x] Label naming mengikuti camelCase convention
- [x] Error messages diterjemahkan
- [x] Loading states diterjemahkan
- [x] Empty states diterjemahkan
- [x] Modal titles dan buttons diterjemahkan
- [x] Form labels dan placeholders diterjemahkan
- [x] Success/confirmation messages diterjemahkan
- [x] Tooltips dan helper text diterjemahkan

## 🚀 Deployment Notes

1. **Development**: Gunakan `useMockData: true` untuk testing
2. **Staging**: Test dengan real API dan berbagai bahasa
3. **Production**: Ensure semua translations sudah di-publish di backend
4. **Rollback Plan**: Keep backup of original components jika diperlukan

---

**Dokumentasi ini dibuat untuk memastikan implementasi multi bahasa yang konsisten dan maintainable pada semua komponen Voucher dalam aplikasi MuaTrans Shipper.**
