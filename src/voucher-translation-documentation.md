# Dokumentasi Terjemahan UI Komponen Voucher

## Overview

Dokumentasi ini berisi terjemahan lengkap untuk semua komponen Voucher dalam sistem MuaTrans Shipper, mengikuti struktur yang sesuai dengan `ui-translation-guide.md`.

## Struktur Terjemahan

Format: `[Class] [Form] [Value ID] [Value EN] [Label] [Value CN]`

## Tabel Terjemahan Voucher

### VoucherCard Component

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
```

### VoucherInfoPopup Component

```
voucher	voucherInfoPopup	hingga	up to	labelUpTo	高达
voucher	voucherInfoPopup	Kuota Voucher Telah Terpakai	Voucher Quota Used	descQuotaUsed	优惠券配额已使用
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
```

### VoucherEmptyState Component

```
voucher	voucherEmptyState	Belum Ada Voucher	No Vouchers Available	titleNoVouchers	暂无优惠券
```

### VoucherSearchEmpty Component

```
voucher	voucherSearchEmpty	Keyword Tidak Ditemukan	Keyword Not Found	titleKeywordNotFound	关键词未找到
```

### VoucherContainer/Modal Components

```
voucher	voucherModal	Pilih Voucher	Select Voucher	titleSelectVoucher	选择优惠券
voucher	voucherModal	Hanya bisa dipilih 1 Voucher	Only 1 Voucher can be selected	descOneVoucherOnly	只能选择1张优惠券
voucher	voucherModal	1 Voucher Terpakai	1 Voucher Applied	statusOneVoucherApplied	已使用1张优惠券
voucher	voucherModal	Gagal memuat daftar voucher	Failed to load voucher list	errorLoadVouchers	加载优惠券列表失败
voucher	voucherModal	Gagal memvalidasi voucher	Failed to validate voucher	errorValidateVoucher	验证优惠券失败
voucher	voucherModal	Voucher tidak valid	Voucher is not valid	errorInvalidVoucher	优惠券无效
voucher	voucherModal	Kode voucher telah habis	Voucher code is exhausted	errorVoucherExhausted	优惠券代码已用完
```

### Additional Voucher Related Terms

```
voucher	general	Cari kode voucher	Search voucher code	placeholderSearchVoucher	搜索优惠券代码
voucher	general	Belum Ada Voucher	No Vouchers Yet	messageNoVouchersYet	还没有优惠券
voucher	general	Loading voucher...	Loading voucher...	messageLoadingVoucher	加载优惠券中...
voucher	general	Gagal load voucher	Failed to load voucher	errorLoadVoucher	加载优惠券失败
voucher	general	Tutup	Close	buttonClose	关闭
voucher	general	Terapkan	Apply	buttonApply	应用
voucher	general	Lewati	Skip	buttonSkip	跳过
voucher	general	Lanjut	Continue	buttonContinue	继续
voucher	general	rb	k	labelThousand	千
```

## Implementasi dalam Komponen

### 1. Import useTranslation Hook

```jsx
import { useTranslation } from "@/hooks/use-translation";
```

### 2. Gunakan dalam Komponen

```jsx
const { t } = useTranslation();

// Contoh penggunaan:
<span>{t('labelDiscount')}</span>
<button>{t('buttonUse')}</button>
<h3>{t('titleTermsAndConditions')}</h3>
```

### 3. Untuk teks dengan parameter

```jsx
// Untuk teks seperti "Kuota Voucher Telah Terpakai 85%"
<span>{t('descQuotaUsed')} {usagePercentage}%</span>

// Atau jika menggunakan parameter dalam terjemahan:
// Terjemahan: "Kuota Voucher Telah Terpakai {percentage}%"
<span>{t('descQuotaUsed', { percentage: usagePercentage })}</span>
```

## Label Naming Convention

### Prefix Berdasarkan Tipe Element:

- **button**: Untuk tombol (`buttonUse`, `buttonApply`)
- **title**: Untuk judul/header (`titleSelectVoucher`)
- **label**: Untuk label form (`labelDiscount`)
- **desc**: Untuk teks deskriptif (`descQuotaUsed`)
- **message**: Untuk pesan status (`messageOutOfStock`)
- **error**: Untuk pesan error (`errorInvalidVoucher`)
- **placeholder**: Untuk placeholder text (`placeholderSearchVoucher`)
- **status**: Untuk status indicator (`statusOneVoucherApplied`)
- **tooltip**: Untuk tooltip text

### Suffix Berdasarkan Konteks:

- Berdasarkan fungsi spesifik (e.g., `buttonUse`, `buttonApply`)
- Berdasarkan status (e.g., `messageExpiringSoon`, `errorInvalidVoucher`)

## Validasi dan Quality Check

- [x] Semua teks UI telah diidentifikasi
- [x] Label unik untuk setiap class
- [x] Format camelCase konsisten
- [x] Tidak ada duplikasi Value ID
- [x] Semua state UI tercakup (success, error, loading)
- [x] Terjemahan kontekstual akurat
- [x] Format tab-separated siap untuk implementasi

## File yang Perlu Diupdate

1. `src/components/Voucher/VoucherCard.jsx`
2. `src/components/Voucher/VoucherInfoPopup.jsx`
3. `src/components/Voucher/VoucherEmptyState.jsx`
4. `src/components/Voucher/VoucherSearchEmpty.jsx`
5. `src/container/Shipper/Voucher/Voucher.jsx`
6. `src/container/Shipper/SewaArmada/Web/SummaryPanel/SummaryPanel.jsx`
7. `src/container/Shipper/SewaArmada/Responsive/InformasiPesanan/InformasiPesananScreen.jsx`

## Catatan Implementasi

1. **Dynamic Content**: Beberapa teks seperti kode voucher, jumlah diskon, dan tanggal tidak perlu diterjemahkan karena bersifat dinamis
2. **Currency Format**: Gunakan utility function yang sudah ada (`idrFormat`) untuk format mata uang
3. **Date Format**: Gunakan utility function yang sudah ada (`formatDate`, `formatShortDate`) untuk format tanggal
4. **Error Messages**: Pesan error dari API mungkin perlu diterjemahkan secara terpisah di backend atau menggunakan mapping error codes
5. **Percentage Display**: Format persentase tetap menggunakan simbol % yang universal

---

_Dokumentasi ini dibuat mengikuti panduan `ui-translation-guide.md` dan siap untuk implementasi dalam sistem terjemahan MuaTrans._
