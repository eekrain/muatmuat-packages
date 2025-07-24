"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ImageUploaderResponsive from "@/components/ImageUploader/ImageUploaderResponsive";
import TextArea from "@/components/TextArea/TextArea";
import {
  TimelineContainer,
  TimelineContentAddress,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import NoDeliveryOrder from "@/container/Shipper/SewaArmada/Responsive/InformasiPesanan/NoDeliveryOrder";
import OrderSummarySection from "@/container/Shipper/SewaArmada/Responsive/InformasiPesanan/OrderSummarySection";
import usePrevious from "@/hooks/use-previous";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { useVouchers } from "@/hooks/useVoucher";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";
import { mockValidateVoucher } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransValidateVoucher } from "@/services/Shipper/voucher/muatTransVoucherService";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const InformasiPesananScreen = ({ paymentMethods }) => {
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();

  /* voucher state and logic - from HomeScreen */
  const token = "Bearer your_token_here";
  const MOCK_EMPTY = false;
  const useMockData = false; // Flag untuk menggunakan mock data - ubah ke false untuk menggunakan API real

  // Gunakan hook voucher untuk mendapatkan data
  let {
    vouchers: voucherList,
    loading,
    error,
    refetch,
  } = useVouchers(token, useMockData, MOCK_EMPTY);

  // Add missing variables for voucher functionality
  const baseOrderAmount = 950000; // Same as transactionData.biayaPesanJasaAngkut
  const adminFee = 10000;
  const taxAmount = 0; // Will be calculated based on business entity
  const baseTotal = baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false); // Bottomsheet Voucher
  const [
    isInformasiMuatanBottomsheetOpen,
    setIsInformasiMuatanBottomsheetOpen,
  ] = useState(false); // Bottomsheet informasi muatan periksa pesanan kamu
  const [
    isOrderConfirmationBottomsheetOpen,
    setIsOrderConfirmationBottomsheetOpen,
  ] = useState(false); // Bottomsheet periksa pesanan kamu
  const [isLocationBottomsheetOpen, setIsLocationBottomsheetOpen] =
    useState(false);
  const [locationType, setLocationType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [validationErrors, setValidationErrors] = useState({});
  const [validatingVoucher, setValidatingVoucher] = useState(null);
  /* end voucher state */
  // Get state from Zustand store
  const { formValues, formErrors } = useSewaArmadaStore();
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    informasiMuatan,
    truckCount,
    cargoPhotos,
    cargoDescription,
    businessEntity,
    paymentMethodId,
    // deliveryOrder,
  } = formValues;
  console.log("lokasi", lokasiBongkar, lokasiMuat);
  const { isBusinessEntity, name, taxId } = businessEntity;

  // Get actions from Zustand store
  const { setField, setCargoPhotos, validateSecondForm } =
    useSewaArmadaActions();

  // Voucher useEffect hooks and calculations
  useEffect(() => {
    console.log("andyzxc");
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

  useEffect(() => {
    if (selectedVoucher && selectedVoucher.isValid) {
      const discount = calculateDiscountAmount(selectedVoucher, baseTotal);
      setVoucherDiscount(discount);
    } else {
      setVoucherDiscount(0);
    }
  }, [selectedVoucher, baseTotal]);

  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      // Reset search when bottomsheet opens
      setSearchQuery("");
      // Set temp selected voucher to current selected voucher when opening
      setTempSelectedVoucher(selectedVoucher);
    }
  }, [isBottomsheetOpen, previousIsBottomsheetOpen, selectedVoucher]);

  // Function to calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher || !total) return 0;

    // Handle different discount types (support both formats for consistency)
    if (
      voucher.discountType === "PERCENTAGE" ||
      voucher.discountType === "percentage"
    ) {
      const discountAmount = (total * voucher.discountPercentage) / 100;
      return Math.min(
        discountAmount,
        voucher.maxDiscountAmount || discountAmount
      );
    } else if (
      voucher.discountType === "FIXED_AMOUNT" ||
      voucher.discountType === "fixed"
    ) {
      return voucher.discountAmount;
    }

    return voucher.discountAmount || 0;
  };

  // Handle voucher selection with validation (when user actually selects voucher)
  const handleConfirmVoucherSelection = async (voucher) => {
    await handleVoucherSelect(voucher);
  };

  // Apply selected voucher (confirm selection when closing the bottomsheet)
  const handleVoucherSelect = async (voucher) => {
    try {
      // Clear previous validation errors for all vouchers
      setValidationErrors({});
      setValidatingVoucher(voucher.id); // Show loading state

      // Client-side validation first
      const clientValidation = validateVoucherClientSide(voucher, baseTotal);
      if (!clientValidation.isValid) {
        setValidationErrors({
          [voucher.id]: clientValidation.errorMessage,
        });
        return;
      }

      // Server-side validation if client validation passes
      const validationResult = useMockData
        ? await mockValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseTotal,
          })
        : await muatTransValidateVoucher({
            voucherId: voucher.id,
            totalAmount: baseTotal,
            token: token,
          });

      if (validationResult.isValid) {
        // Voucher is valid, proceed with selection
        const validatedVoucher = {
          ...voucher,
          isValid: true,
          validationResult: validationResult,
        };

        setTempSelectedVoucher(validatedVoucher);
        // Langsung apply voucher jika validasi berhasil
        setSelectedVoucher(validatedVoucher);
        setIsBottomsheetOpen(false);
      } else {
        // Voucher is invalid, show server error
        setValidationErrors({
          [voucher.id]:
            validationResult.validationMessages?.join(", ") ||
            "Voucher tidak valid",
        });
      }
    } catch (err) {
      console.error("Error validating voucher:", err);
      setValidationErrors({
        [voucher.id]: err.message || "Gagal memvalidasi voucher",
      });
    } finally {
      setValidatingVoucher(null); // Hide loading state
    }
  };

  // Apply voucher (confirm selection)
  const handleApplyVoucher = () => {
    if (tempSelectedVoucher) {
      setSelectedVoucher(tempSelectedVoucher);
      setIsBottomsheetOpen(false);
    } else {
      setSelectedVoucher(null);
      setIsBottomsheetOpen(false);
    }
  };

  // Remove voucher
  const handleRemoveVoucher = () => {
    setSelectedVoucher(null);
    setTempSelectedVoucher(null);
    setVoucherDiscount(0);
  };

  // Filter voucherList based on search query
  const filteredVouchers =
    voucherList?.filter((voucher) =>
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  // Event handlers
  const handleImageUpload = (index, img) => setCargoPhotos(index, img);

  const handleToggleCheckbox = (checked) => {
    setField("businessEntity", {
      isBusinessEntity: checked,
      name: "",
      taxId: "",
    });
  };

  const handleValidateInformasiPesanan = () => {
    if (validateSecondForm()) {
      setIsOrderConfirmationBottomsheetOpen(true);
    }
  };

  const handleCreateOrder = () => {
    alert("buat logic buat pesan armada");
  };

  const selectedOpsiPembayaran = useShallowMemo(
    () =>
      paymentMethodId
        ? paymentMethods
            .flatMap((channel) => channel.methods || [])
            .find((method) => method.id === paymentMethodId)
        : null,
    [paymentMethodId, paymentMethods]
  );

  return (
    <FormResponsiveLayout
      title={{
        label: t("titleInformasiPesanan"), // Informasi Pesanan
      }}
    >
      <div className="mb-[118px] flex flex-col gap-y-2 bg-neutral-200">
        {/* Warning Banner */}
        <div className="flex items-center gap-2.5 rounded-md bg-warning-100 p-3">
          <IconComponent
            src="/icons/warning20.svg"
            width={20}
            height={20}
            className="icon-fill-secondary-400"
          />
          <div className="flex flex-1 items-center gap-1">
            <p className="text-xs font-medium leading-[14.4px] text-neutral-900">
              {t("messageWarningPreparation")}
            </p>
          </div>
        </div>

        {/* Info Jasa Angkut */}
        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-5">
          {/* Image Container */}
          <div className="relative size-[68px] overflow-hidden rounded-xl border border-neutral-400">
            <ImageComponent
              className="w-full"
              src="/img/recommended1.png"
              width={68}
              height={68}
            />
            <button
              className="absolute right-2 top-2 flex size-[20px] items-center justify-center rounded-3xl bg-neutral-50"
              onClick={() => {}}
            >
              <IconComponent
                src="/icons/fullscreen12.svg"
                width={12}
                height={12}
              />
            </button>
          </div>

          {/* Info Text */}
          <div className="flex flex-1 flex-col gap-3">
            <h3 className="text-sm font-semibold leading-[15.4px] text-neutral-900">
              Box - Colt Diesel Engkel
            </h3>
            <p className="text-sm font-medium leading-[15.4px] text-neutral-900">
              {t("labelKebutuhanUnit", { unit: 1 })}
            </p>
            <p className="text-sm font-medium leading-[15.4px] text-neutral-900">
              {t("labelEstimasiJarak", { distance: 178, unit: "km" })}
            </p>
          </div>
        </div>

        {/* Form Lampiran Foto */}
        <div className="flex flex-col gap-6 bg-neutral-50 p-4">
          <div className="flex flex-col gap-y-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              {t("labelLampiranFotoMuatan")}
            </h2>

            {/* Grid Upload Foto */}
            <div className="flex flex-wrap gap-3">
              {[...Array(4)].map((_, key) => (
                <Fragment key={key}>
                  <ImageUploaderResponsive
                    onChange={(value) => handleImageUpload(key, value)}
                    uploadText={
                      key === 0
                        ? t("labelFotoUtama")
                        : `${t("labelFoto")} ${key}`
                    }
                    maxSize={10}
                    className="!size-[72px]"
                    value={cargoPhotos[key]}
                    isNull={formErrors.cargoPhotos}
                    index={key}
                  />
                </Fragment>
              ))}
            </div>

            {formErrors.cargoPhotos && (
              <p className="text-xs font-medium leading-[14.4px] text-error-400">
                {t(formErrors.cargoPhotos)}
              </p>
            )}

            <p className="text-xs font-medium leading-[14.4px] text-neutral-600">
              {t("messageMaxUploadFotoMuatan")}
            </p>
          </div>

          {/* Form Deskripsi */}
          <div className="flex flex-col gap-y-4">
            <div className="flex items-start gap-1">
              <span className="text-sm font-semibold text-neutral-900">
                {t("labelDeskripsiMuatan")}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full">
                <TextArea
                  name="cargoDescription"
                  maxLength={500}
                  hasCharCount
                  supportiveText={{
                    title: formErrors.cargoDescription,
                  }}
                  resize="none"
                  placeholder={t("placeholderDeskripsiMuatan")}
                  value={cargoDescription}
                  onChange={({ target: { name, value } }) =>
                    setField(name, value)
                  }
                  status={formErrors.cargoDescription ? "error" : ""}
                />
              </div>
            </div>
          </div>

          {/* No. Delivery Order */}
          <NoDeliveryOrder />
        </div>

        {/* Badan Usaha Pemesan - Updated Section */}
        <div className="flex flex-col gap-y-4 bg-neutral-50 p-4">
          {/* Header */}
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-bold leading-[15.4px] text-neutral-900">
              {t("titleBadanUsahaPemesan")}
            </h2>
            <span className="text-xxs font-semibold leading-[10px] text-neutral-900">
              {t("labelOpsional")}
            </span>
            <InfoBottomsheet title={t("titleBadanUsahaPemesan")}>
              <p className="text-center text-sm font-medium leading-[15.4px] text-neutral-900">
                {t("messagePPh23Info")}
              </p>
            </InfoBottomsheet>
          </div>

          {/* Checkbox */}
          <Checkbox
            label={t("checkboxBadanUsahaPemesan")}
            checked={isBusinessEntity}
            onChange={({ checked }) => handleToggleCheckbox(checked)}
          />

          {/* Form Fields - Only show when checkbox is checked */}
          {isBusinessEntity && (
            <div className="mt-2 flex flex-col gap-y-4">
              {/* Field Nama Badan Usaha */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                  {t("labelNamaBadanUsaha")}
                </label>
                <Input
                  name="name"
                  placeholder={t("placeholderNamaBadanUsaha")}
                  value={name}
                  onChange={({ target: { name, value } }) =>
                    setField("businessEntity", {
                      ...businessEntity,
                      [name]: value,
                    })
                  }
                  errorMessage={formErrors?.businessEntity?.name}
                />
              </div>

              {/* Field Nomor NPWP */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                  {t("labelNomorNPWP")}
                </label>
                <Input
                  name="taxId"
                  placeholder={t("placeholderNomorNPWP")}
                  value={taxId}
                  onChange={({ target: { name, value } }) =>
                    setField("businessEntity", {
                      ...businessEntity,
                      [name]: value,
                    })
                  }
                  errorMessage={formErrors?.businessEntity?.taxId}
                />
              </div>
            </div>
          )}
        </div>

        {/* Opsi Pembayaran */}
        <div className="flex flex-col gap-y-3 bg-neutral-50 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              {t("titleOpsiPembayaran")}
            </h2>
            <button
              className="text-sm font-semibold text-primary-700"
              onClick={() => navigation.push("/OpsiPembayaran")}
            >
              {t("buttonPilih")}
            </button>
          </div>
          {selectedOpsiPembayaran ? (
            <div className="flex items-center gap-x-2">
              <Image
                width={24}
                height={24}
                src={selectedOpsiPembayaran.icon}
                alt="Example image"
              />
              <span className="text-xs font-semibold leading-[13.2px] text-neutral-900">
                {selectedOpsiPembayaran.name}
              </span>
            </div>
          ) : null}
          {formErrors?.paymentMethodId ? (
            <span className="text-xs font-medium leading-[13.2px] text-error-400">
              {formErrors.paymentMethodId}
            </span>
          ) : null}
        </div>

        {/* Ringkasan Transaksi */}
        <div className="flex flex-col gap-y-6 bg-neutral-50 p-4">
          <h1 className="text-sm font-semibold text-neutral-900">
            {t("titleRingkasanTransaksi")}
          </h1>

          {/* Detail Biaya Container */}
          <div className="flex flex-col gap-6 border-b border-neutral-400 pb-6">
            {/* Biaya Pesan Jasa Angkut */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleBiayaPesanJasaAngkut")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="flex-1 text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelNominalPesanJasaAngkut")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  Rp950.000
                </span>
              </div>
            </div>

            {/* Biaya Asuransi */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleBiayaAsuransiBarang")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelNominalPremiAsuransi")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  Rp10.000
                </span>
              </div>
            </div>

            {/* Biaya Layanan Tambahan */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleBiayaLayananTambahan")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                    {t("labelNominalKirimBuktiFisik")}
                  </span>
                  <button className="text-left text-xs font-semibold leading-[13.2px] text-primary-700">
                    {t("buttonLihatDetailPengirimanDokumen")}
                  </button>
                </div>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  Rp35.000
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelNominalBantuanTambahan")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  Rp100.000
                </span>
              </div>
            </div>

            {/* Diskon Voucher */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleDiskonVoucher")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                {selectedVoucher && voucherDiscount > 0 ? (
                  <>
                    <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                      {t("labelVoucherCode", { code: selectedVoucher.code })}
                    </span>
                    <span className="text-right text-xs font-medium leading-[14.4px] text-error-400">
                      -{formatCurrency(voucherDiscount)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                      -
                    </span>
                    <span className="text-right text-xs font-medium leading-[14.4px] text-error-400">
                      -
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Biaya Lainnya Container */}
          <div className="flex flex-col gap-6 border-b border-neutral-400 pb-6">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleBiayaLainnya")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelAdminLayanan")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  Rp10.000
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelPajak")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  {isBusinessEntity ? formatCurrency(21300) : "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Total Biaya */}
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm font-semibold leading-[16.8px] text-neutral-900">
              {t("titleTotalBiaya")}
            </span>
            <span className="text-right text-sm font-semibold leading-[15.4px] text-neutral-900">
              {formatCurrency(
                baseOrderAmount +
                  10000 + // Biaya Asuransi
                  35000 + // Biaya Layanan Tambahan 1
                  100000 + // Biaya Layanan Tambahan 2
                  10000 + // Admin Layanan
                  (isBusinessEntity ? 21300 : 0) - // Pajak
                  voucherDiscount // Diskon Voucher
              )}
            </span>
          </div>
        </div>
      </div>

      <ResponsiveFooter className="flex flex-col gap-y-2.5">
        <button
          className="flex h-[44px] items-center justify-between rounded-md bg-primary-50 px-4"
          onClick={() => setIsBottomsheetOpen(true)}
        >
          <div className="flex items-center gap-x-3">
            {selectedVoucher ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-neutral-50">
                ✓
              </div>
            ) : (
              <IconComponent src="/icons/voucher24.svg" size="medium" />
            )}
            <span className="text-sm font-semibold leading-[15.4px] text-primary-700">
              {selectedVoucher
                ? t("messageVoucherUsed")
                : t("messageVoucherHemat")}
            </span>
          </div>
          <IconComponent src="/icons/chevron-right24.svg" size="medium" />
        </button>
        <BottomSheet
          open={isOrderConfirmationBottomsheetOpen}
          onOpenChange={setIsOrderConfirmationBottomsheetOpen}
        >
          <Button
            variant="muatparts-primary"
            className="h-10"
            onClick={handleValidateInformasiPesanan}
            type="button"
          >
            {t("buttonLanjut")}
          </Button>
          <BottomSheetContent>
            <BottomSheetHeader>
              {t("titlePeriksaPesananAnda")}
            </BottomSheetHeader>
            <div className="flex max-h-[calc(75vh_-_54px)] w-full flex-col gap-y-4 overflow-y-auto bg-white px-4 py-6">
              {/* Waktu Muat */}
              <OrderSummarySection className="gap-y-4 font-semibold text-neutral-900">
                <h4 className="text-sm leading-[15.4px]">
                  {t("labelWaktuMuat")}
                </h4>
                <span className="text-xs leading-[13.2px]">{`${formatDate(loadTimeStart)}${showRangeOption ? ` s/d ${formatDate(loadTimeEnd)}` : ""}`}</span>
              </OrderSummarySection>
              <OrderSummarySection className="gap-y-4 text-neutral-900">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold leading-[15.4px]">
                    {t("labelRute")}
                  </h4>
                  <span className="text-xs font-medium leading-[13.2px]">
                    {"Estimasi 178 km"}
                  </span>
                </div>
                <TimelineContainer>
                  <TimelineItem
                    variant="bullet"
                    totalLength={2}
                    index={0}
                    activeIndex={0}
                  >
                    <TimelineContentWithButtonDate
                      title={lokasiMuat?.[0]?.dataLokasi.location.name || ""}
                      withButton={
                        lokasiMuat && lokasiMuat.length > 1
                          ? {
                              label: "Lihat Lokasi Muat Lainnya",
                              onClick: () => {
                                setLocationType("muat");
                                setIsLocationBottomsheetOpen(true);
                              },
                            }
                          : undefined
                      }
                    />
                  </TimelineItem>

                  <TimelineItem
                    variant="bullet"
                    totalLength={2}
                    index={1}
                    activeIndex={0}
                  >
                    <TimelineContentWithButtonDate
                      className="pb-0"
                      title={lokasiBongkar?.[0]?.dataLokasi.location.name || ""}
                      withButton={
                        lokasiBongkar && lokasiBongkar.length > 1
                          ? {
                              label: "Lihat Lokasi Bongkar Lainnya",
                              onClick: () => {
                                setLocationType("bongkar");
                                setIsLocationBottomsheetOpen(true);
                              },
                            }
                          : undefined
                      }
                    />
                  </TimelineItem>
                </TimelineContainer>
              </OrderSummarySection>
              <OrderSummarySection className="gap-y-3 text-neutral-900">
                <h4 className="text-sm font-semibold leading-[15.4px]">
                  {t("titleInformasiArmada")}
                </h4>
                <div className="flex items-center gap-x-3">
                  <div className="size-[68px] overflow-hidden rounded-xl border border-neutral-400">
                    <ImageComponent
                      className="w-full"
                      src="/img/recommended1.png"
                      width={68}
                      height={68}
                    />
                  </div>
                  <div className="flex flex-col gap-y-3">
                    <span className="text-sm font-semibold leading-[15.4px]">
                      Box - Colt Diesel Engkel
                    </span>
                    <span className="text-sm font-medium leading-[15.4px]">
                      {`Kebutuhan : ${truckCount} Unit`}
                    </span>
                  </div>
                </div>
              </OrderSummarySection>
              <OrderSummarySection className="gap-y-4 text-neutral-900">
                <h4 className="text-sm font-semibold leading-[15.4px]">
                  {t("titleInformasiMuatan")}
                </h4>
                <div className="flex flex-col gap-y-3">
                  {informasiMuatan.slice(0, 2).map((item, key) => (
                    <div className="flex items-center gap-x-2" key={key}>
                      <IconComponent src="/icons/muatan16.svg" />
                      <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                        {`${item.namaMuatan.label} `}
                        <span className="text-neutral-600">{`(${item.beratMuatan.berat.toLocaleString("id-ID")} ${item.beratMuatan.unit})`}</span>
                      </span>
                    </div>
                  ))}
                  {informasiMuatan.length > 2 ? (
                    <div className="ml-6 flex items-center">
                      <BottomSheet
                        open={isInformasiMuatanBottomsheetOpen}
                        onOpenChange={setIsInformasiMuatanBottomsheetOpen}
                      >
                        <BottomSheetTrigger asChild>
                          <button
                            className="text-xs font-semibold leading-[13.2px] text-primary-700"
                            onClick={() =>
                              setIsInformasiMuatanBottomsheetOpen(true)
                            }
                          >
                            {t("buttonLihatMuatanLainnya")}
                          </button>
                        </BottomSheetTrigger>
                        <BottomSheetContent>
                          <BottomSheetHeader>
                            {t("titleInformasiMuatan")}
                          </BottomSheetHeader>
                          <div className="flex flex-col gap-y-4 px-4 py-6">
                            {informasiMuatan.map((item, key) => (
                              <div
                                className="flex items-center gap-x-2"
                                key={key}
                              >
                                <IconComponent src="/icons/muatan16.svg" />
                                <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                                  {`${item.namaMuatan.label} `}
                                  <span className="text-neutral-600">{`(${item.beratMuatan.berat.toLocaleString("id-ID")} ${item.beratMuatan.unit})`}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </BottomSheetContent>
                      </BottomSheet>
                    </div>
                  ) : null}
                </div>
              </OrderSummarySection>
              <div className="text-xs font-medium leading-[13.2px] text-neutral-900">
                {t("messageSyaratKetentuan")}
                <span className="font-semibold text-primary-700">
                  {t("labelSyaratKetentuan")}
                </span>
              </div>
              <Button
                variant="muatparts-primary"
                className="h-10"
                onClick={handleCreateOrder}
                type="button"
              >
                {t("buttonPesanSekarang")}
              </Button>
            </div>
          </BottomSheetContent>
        </BottomSheet>
      </ResponsiveFooter>

      {/* Voucher BottomSheet */}
      <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
        <BottomSheetContent
          className={
            "animate-slideUp fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-neutral-50 shadow-2xl"
          }
        >
          <BottomSheetHeader>{t("titlePilihVoucher")}</BottomSheetHeader>
          <div className="flex h-[577px] w-full flex-col gap-4 overflow-y-auto bg-neutral-50 px-4 py-6">
            {/* Search bar */}
            <div className="relative flex items-center rounded-md border border-neutral-400">
              <div className="absolute left-3">
                <IconComponent src="/icons/search16.svg" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("placeholderCariKodeVoucher")}
                className="h-10 w-full rounded-md bg-transparent pl-10 pr-3 text-sm outline-none"
                disabled={
                  loading || error || !voucherList || voucherList.length === 0
                }
              />
              {searchQuery && (
                <button
                  className="absolute right-3"
                  onClick={() => setSearchQuery("")}
                >
                  <IconComponent src="/icons/close.svg" />
                </button>
              )}
            </div>

            {/* Voucher selection note */}
            <p className="text-xs font-medium text-neutral-600">
              {t("messageHanyaSatuVoucher")}
            </p>

            {/* Voucher list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm font-medium text-neutral-600">
                    {t("messageMemuatVoucher")}
                  </span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-8 text-red-500">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <span className="mb-2 text-center text-sm font-medium">
                    {error}
                  </span>
                  <button
                    onClick={refetch}
                    className="text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    {t("buttonCobaLagi")}
                  </button>
                </div>
              ) : searchQuery && filteredVouchers.length === 0 ? (
                <VoucherSearchEmpty />
              ) : voucherList?.length === 0 ? (
                <VoucherEmptyState />
              ) : (
                <div className="space-y-3">
                  {filteredVouchers.map((v) => (
                    <VoucherCard
                      key={v.id}
                      title={v.code}
                      discountInfo={v.description}
                      discountAmount={v.discountAmount}
                      discountPercentage={v.discountPercentage}
                      discountType={v.discountType}
                      minTransaksi={v.minOrderAmount}
                      kuota={v.quota}
                      usagePercentage={v.usage?.globalPercentage || 0}
                      isOutOfStock={v.isOutOfStock || false}
                      startDate={formatShortDate(v.validFrom)}
                      endDate={formatDate(v.validTo)}
                      isActive={tempSelectedVoucher?.id === v.id}
                      onSelect={() => handleConfirmVoucherSelection(v)}
                      validationError={validationErrors[v.id]}
                      isValidating={validatingVoucher === v.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Apply button */}
            <div className="sticky bottom-0 flex items-center bg-neutral-50 pt-4">
              <Button
                variant="muatparts-primary"
                className="flex-1"
                onClick={handleApplyVoucher}
              >
                {tempSelectedVoucher ? t("buttonTerapkan") : t("buttonLewati")}
              </Button>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Bottomsheet Lokasi Muat dan Lokasi Bongkar */}
      <BottomSheet
        open={isLocationBottomsheetOpen}
        onOpenChange={setIsLocationBottomsheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>
            {locationType === "muat"
              ? t("titleLokasiMuat")
              : t("titleLokasiBongkar")}
          </BottomSheetHeader>
          <div className="flex flex-col gap-y-4 px-4 py-6">
            <TimelineContainer>
              {(locationType === "muat" ? lokasiMuat : lokasiBongkar).map(
                (item, key) => (
                  <Fragment key={key}>
                    <TimelineItem
                      variant={
                        locationType === "muat" ? "number-muat" : "number-muat"
                      }
                      totalLength={
                        (locationType === "muat" ? lokasiMuat : lokasiBongkar)
                          .length
                      }
                      index={key}
                      activeIndex={0}
                    >
                      <TimelineContentAddress
                        title={item?.dataLokasi?.location?.name || ""}
                      />
                    </TimelineItem>
                  </Fragment>
                )
              )}
            </TimelineContainer>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </FormResponsiveLayout>
  );
};

export default InformasiPesananScreen;
