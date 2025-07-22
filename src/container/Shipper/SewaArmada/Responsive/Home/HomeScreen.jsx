"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import TimelineField from "@/components/Timeline/timeline-field";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import usePrevious from "@/hooks/use-previous";
import { useSWRHook } from "@/hooks/use-swr";
import { useVouchers } from "@/hooks/useVoucher";
import DefaultResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/DefaultResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";
import { mockValidateVoucher } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransValidateVoucher } from "@/services/Shipper/voucher/muatTransVoucherService";
import { useInformasiMuatanStore } from "@/store/Shipper/forms/informasiMuatanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

import { BannerCarousel } from "../../../../../components/BannerCarousel/BannerCarousel";
import { JenisArmadaField } from "./JenisArmadaField";
import { ModalFirstTimer } from "./ModalFirstTimer";
import WaktuMuatBottomsheet from "./WaktuMuat/WaktuMuat";

const SewaArmadaHomeScreen = ({ carriers, trucks }) => {
  const navigation = useResponsiveNavigation();
  const { formValues } = useSewaArmadaStore();
  const { addLokasi, removeLokasi } = useSewaArmadaActions();
  const { setField: setInformasiMuatanField } = useInformasiMuatanStore();
  const isShowCostDetail = true; // nanti pakek usestate
  const isShowRecommendedTruckButton = true; // nanti pakek logic

  const handleEditInformasiMuatan = () => {
    setInformasiMuatanField("cargoTypeId", formValues.cargoTypeId);
    setInformasiMuatanField("cargoCategoryId", formValues.cargoCategoryId);
    setInformasiMuatanField("isHalalLogistics", formValues.isHalalLogistics);
    if (formValues.informasiMuatan.length > 0) {
      setInformasiMuatanField("informasiMuatan", formValues.informasiMuatan);
    }
    navigation.push("/InformasiMuatan");
  };

  const handleEditLayananTambahan = () => {
    navigation.push("/LayananTambahan");
  };

  const validateLokasiOnSelect = useLocationFormStore(
    (s) => s.validateLokasiOnSelect
  );

  const { data: dataBanner } = useSWRHook("v1/orders/banner-ads");
  const banners = useMemo(() => {
    const data = dataBanner?.Data?.banners;
    if (!data) return [];
    return data?.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrlApp,
      altText: "Banner Muatrans",
      linkUrl: item.link,
    }));
  }, [dataBanner]);

  /* voucher */
  const token = "Bearer your_token_here";
  const MOCK_EMPTY = false;
  const useMockData = true; // Flag untuk menggunakan mock data - ubah ke false untuk menggunakan API real

  // Gunakan hook voucher untuk mendapatkan data
  let {
    vouchers: voucherList,
    loading,
    error,
    refetch,
  } = useVouchers(token, useMockData, MOCK_EMPTY); // Pass MOCK_EMPTY to hook

  // No need to override voucherList here since hook handles MOCK_EMPTY

  // Add missing variables for voucher functionality
  const baseOrderAmount = 5000000; // 5 juta untuk transport fee
  const adminFee = 10000;
  const taxAmount = 21300; // Business entity tax
  const baseTotal = baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const [
    isRecommendedTruckBottomsheetOpen,
    setRecommendedTruckBottomsheetOpen,
  ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Added this to store the final selected voucher
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [validationErrors, setValidationErrors] = useState({});
  const [showTransactionSummary, setShowTransactionSummary] = useState(false);
  const [validatingVoucher, setValidatingVoucher] = useState(null); // Track which voucher is being validated

  // Data dummy untuk ringkasan transaksi sesuai screenshot
  const transactionData = {
    biayaPesanJasaAngkut: 950000,
    biayaAsuransiBarang: 10000,
    biayaLayananTambahan: 35000,
    nominalBantuanTambahan: 100000,
    adminLayanan: 10000,
    pajak: -21300, // Pajak negatif sesuai screenshot
  };

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

  const finalTotal =
    transactionData.biayaPesanJasaAngkut +
    transactionData.biayaAsuransiBarang +
    transactionData.biayaLayananTambahan +
    transactionData.nominalBantuanTambahan +
    transactionData.adminLayanan +
    transactionData.pajak -
    voucherDiscount;

  // Update total when voucher discount changes
  useEffect(() => {
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

  // Calculate discount when voucher changes
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

  // Handle voucher selection (temporary selection in the bottomsheet for UI only)
  const handleSelectVoucher = (voucher) => {
    // Hanya untuk UI selection, tidak melakukan validasi
    setTempSelectedVoucher(
      voucher.id === tempSelectedVoucher?.id ? null : voucher
    );
  };

  // Handle voucher selection with validation (when user actually selects voucher)
  const handleConfirmVoucherSelection = async (voucher) => {
    // This function is now called from VoucherCard onSelect for actual selection
    await handleVoucherSelect(voucher);
  };

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
        toast.success(`Voucher ${voucher.code} berhasil diterapkan!`);
        // Otomatis tampilkan ringkasan transaksi
        setTimeout(() => {
          setShowTransactionSummary(true);
        }, 500);
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
      toast.success(`Voucher ${tempSelectedVoucher.code} berhasil diterapkan!`);
      // Otomatis tampilkan ringkasan transaksi setelah voucher diterapkan
      setTimeout(() => {
        setShowTransactionSummary(true);
      }, 500); // Delay sedikit untuk smooth transition
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
    setShowTransactionSummary(false);
    toast.success("Voucher berhasil dihapus");
  };

  // Show transaction summary
  const handleShowTransactionSummary = () => {
    if (selectedVoucher) {
      setShowTransactionSummary(true);
    } else {
      setIsBottomsheetOpen(true);
    }
  };

  // Filter voucherList based on search query
  const filteredVouchers =
    voucherList?.filter((voucher) =>
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  useEffect(() => {
    console.log("voucherList:", voucherList);
  }, [voucherList]);
  /* end voucher */

  const handleEditLokasi = ({ formMode, index }) => {
    const field = {
      muat: "lokasiMuat",
      bongkar: "lokasiBongkar",
    };
    const defaultValues = formValues[field[formMode]][index];
    const params = {
      formMode,
      allSelectedLocations: formValues[field[formMode]],
      index,
    };

    const navigateToForm = async (defaultValues) => {
      navigation.push("/FormLokasiBongkarMuat", {
        config: {
          ...params,
          defaultValues,
        },
        layout: {
          title: formMode === "bongkar" ? "Lokasi Bongkar" : "Lokasi Muat",
        },
      });
    };

    if (defaultValues) {
      navigateToForm(defaultValues);
    } else {
      navigation.push("/PencarianLokasi", {
        config: {
          ...params,
          afterLocationSelected: async () => {
            // delay 500ms untuk menunggu data lokasi terisi
            await new Promise((resolve) => setTimeout(resolve, 500));
            const defaultValues = useLocationFormStore.getState().formValues;
            navigateToForm(defaultValues);
          },
          validateLokasiOnSelect: (selectedAddress) => {
            const error = validateLokasiOnSelect(
              formMode,
              index,
              selectedAddress
            );

            if (error) {
              toast.error(error);
              throw new Error(error);
            }
          },
        },
        layout: {
          title:
            formMode === "bongkar" ? "Cari Lokasi Bongkar" : "Cari Lokasi Muat",
        },
      });
    }
  };

  return (
    <DefaultResponsiveLayout mode="default">
      <div
        className={cn(
          "w-full bg-neutral-100",
          isShowCostDetail
            ? isShowRecommendedTruckButton
              ? "mb-[116px]"
              : "mb-[56px]"
            : ""
        )}
      >
        <BannerCarousel banners={banners} showControls={false} />

        {/* Brand Section */}
        <div className="my-2 flex h-[61px] w-full items-center justify-between gap-[29px] bg-white px-4 py-3">
          <div className="flex-1">
            <h2 className="text-base font-semibold leading-[17.6px] text-[#461B02]">
              Ayo kirim muatan kamu dengan muatrans!
            </h2>
          </div>
          <div className="flex w-[123px] flex-col items-end gap-1">
            <img
              src="/icons/muattrans.svg"
              alt="muatrans"
              className="h-4 w-20"
            />
            <p className="text-right text-xxs font-semibold leading-[10px] text-[#461B02]">
              Cargo Land Transportation Company
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-y-6 bg-white px-4 py-5">
          {/* Waktu Muat Field */}
          <FormContainer>
            <FormLabel required>Waktu Muat</FormLabel>
            <WaktuMuatBottomsheet />
          </FormContainer>

          {/* Lokasi Muat Field */}
          <FormContainer>
            <FormLabel required>Lokasi Muat</FormLabel>
            <TimelineField.Root
              variant="muat"
              className="flex-1"
              values={
                formValues.lokasiMuat?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiMuat", null)}
              onEditLocation={(index) =>
                handleEditLokasi({ formMode: "muat", index })
              }
            >
              {(formValues.lokasiMuat || []).map((item, index) => (
                <TimelineField.Item index={index} key={index}>
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiMuat", index)}
                  />
                </TimelineField.Item>
              ))}
              <TimelineField.AddButton />
            </TimelineField.Root>
          </FormContainer>
          {/* Lokasi Bongkar Field */}
          <FormContainer>
            <FormLabel required>Lokasi Bongkar</FormLabel>
            <TimelineField.Root
              variant="bongkar"
              className="flex-1"
              values={
                formValues.lokasiBongkar?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiBongkar", null)}
              onEditLocation={(index) =>
                handleEditLokasi({ formMode: "bongkar", index })
              }
            >
              {(formValues.lokasiBongkar || []).map((item, index) => (
                <TimelineField.Item index={index} key={index}>
                  <TimelineField.RemoveButton
                    onClick={() => removeLokasi("lokasiBongkar", index)}
                  />
                </TimelineField.Item>
              ))}
              <TimelineField.AddButton />
            </TimelineField.Root>
          </FormContainer>

          {/* Informasi Muatan Field */}
          <FormContainer>
            <FormLabel required>Informasi Muatan</FormLabel>
            <button
              className={
                "flex h-8 w-full items-center justify-between gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
              }
              onClick={handleEditInformasiMuatan}
            >
              <div className="flex items-center gap-x-2">
                <IconComponent src="/icons/muatan16.svg" />
                <span className="max-w-[256px] truncate text-sm font-semibold leading-[15.4px]">
                  {formValues.informasiMuatan.length === 0 ? (
                    <span className="text-neutral-600">Masukkan Muatan</span>
                  ) : (
                    <span className="text-neutral-900">
                      {formValues.informasiMuatan
                        .map((item) => item.namaMuatan.label)
                        .join(", ")}
                    </span>
                  )}
                </span>
              </div>
              <div className="size-[16px]">
                <IconComponent src="/icons/chevron-right.svg" />
              </div>
            </button>
          </FormContainer>

          {/* Jenis Armada Field */}
          <JenisArmadaField carriers={carriers} trucks={trucks} />

          {/* Asuransi Barang Field */}
          {/* Belum ada dihide dulu */}
          {/* <FormContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                  Asuransi Barang
                </span>
                <span className="text-xxs font-semibold text-neutral-900">
                  (Opsional)
                </span>
              </div>
              <span className="cursor-pointer text-xs font-semibold text-primary-700">
                Ubah Asuransi
              </span>
            </div>
            <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2">
              <Shield className="h-4 w-4 text-neutral-700" />
              <span className="flex-1 text-sm font-semibold text-neutral-900">
                Gratis perlindungan hingga Rp10.000.000
              </span>
            </div>
          </FormContainer> */}

          {/* Layanan Tambahan Field */}
          <FormContainer>
            <FormLabel optional>Layanan Tambahan</FormLabel>
            <button
              className={
                "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
              }
              onClick={handleEditLayananTambahan}
            >
              <div className="flex items-center gap-x-2">
                <IconComponent src="/icons/layanan-tambahan.svg" />
                <span className="text-sm font-semibold leading-[15.4px] text-neutral-600">
                  Pilih Layanan Tambahan
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          </FormContainer>
        </div>
      </div>

      {isShowCostDetail ? (
        <ResponsiveFooter className="flex flex-col gap-y-4">
          {/* Pakai rekomendasi */}
          {isShowRecommendedTruckButton ? (
            <button
              className="flex items-center rounded-md bg-primary-50 px-4 py-2"
              onClick={() => setRecommendedTruckBottomsheetOpen(true)}
            >
              <IconComponent
                src="/icons/recommended-truck-mobile.svg"
                width={28}
                height={28}
              />
              <div className="ml-3 mr-4 flex-1 text-left text-xs font-semibold leading-[1.1] text-neutral-900">
                Pakai rekomendasi bisa hemat Rp200.000
              </div>
              <IconComponent src="/icons/chevron-right24.svg" size="medium" />
            </button>
          ) : null}

          {/* Total Biaya section with integrated voucher */}
          {/* Voucher section inside Total Biaya div - conditionally rendered based on bottomsheet state */}
          {/* Show voucher discount if selected */}
          {selectedVoucher && (
            <div className="flex w-full flex-col rounded bg-primary-50">
              <div
                className="flex cursor-pointer items-center justify-between rounded-lg bg-blue-50 p-3 transition-colors hover:bg-blue-100"
                onClick={() => setIsBottomsheetOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    ✓
                  </div>
                  <span className="text-xs font-medium text-blue-900">
                    1 Voucher Terpakai
                  </span>
                </div>
                <Image
                  src="/icons/right-arrow-voucher.png"
                  width={18}
                  height={18}
                  alt="right-arrow"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-x-2">
            <Button
              variant="muatparts-primary"
              className="flex-1"
              onClick={() => navigation.push("/InformasiPesanan")}
              type="button"
            >
              Lanjut
            </Button>
          </div>
        </ResponsiveFooter>
      ) : null}

      <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
        <BottomSheetContent
          className={
            "animate-slideUp fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl"
          }
        >
          <BottomSheetHeader>Pilih Voucher</BottomSheetHeader>
          <div className="flex h-[577px] w-full flex-col gap-4 overflow-y-auto bg-white px-4 py-6">
            {/* Search bar */}
            <div className="relative flex items-center rounded-md border border-neutral-400">
              <div className="absolute left-3">
                <IconComponent src="/icons/search16.svg" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Kode Voucher"
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
              Hanya bisa dipilih 1 Voucher
            </p>

            {/* Voucher list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-sm font-medium text-neutral-600">
                    Memuat voucher...
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
                    Coba Lagi
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
            <div className="sticky bottom-0 flex items-center bg-white pt-4">
              <Button
                variant="muatparts-primary"
                className="flex-1"
                onClick={handleApplyVoucher}
              >
                {tempSelectedVoucher ? "Terapkan" : "Lewati"}
              </Button>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Transaction Summary BottomSheet */}
      <BottomSheet
        open={showTransactionSummary}
        onOpenChange={setShowTransactionSummary}
      >
        <BottomSheetContent
          className={
            "animate-slideUp fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl"
          }
        >
          <BottomSheetHeader>Ringkasan Transaksi</BottomSheetHeader>
          <div className="flex h-[577px] w-full flex-col gap-4 overflow-y-auto bg-white px-4 py-6">
            {/* Biaya Pesan Jasa Angkut */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Biaya Pesan Jasa Angkut
              </h3>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">
                  Nominal Pesan Jasa Angkut
                  <br />
                  (1 Unit)
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {formatCurrency(transactionData.biayaPesanJasaAngkut)}
                </span>
              </div>
            </div>

            {/* Biaya Asuransi Barang */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Biaya Asuransi Barang
              </h3>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">
                  Nominal Premi Asuransi (1 Unit)
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {formatCurrency(transactionData.biayaAsuransiBarang)}
                </span>
              </div>
            </div>

            {/* Biaya Layanan Tambahan */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Biaya Layanan Tambahan
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">
                    Nominal Kirim Bukti Fisik
                    <br />
                    Penerimaan Barang
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(transactionData.biayaLayananTambahan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <button className="text-left text-xs text-blue-600 hover:text-blue-800">
                    Lihat Detail Pengiriman Dokumen
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">
                    Nominal Bantuan Tambahan
                  </span>
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(transactionData.nominalBantuanTambahan)}
                  </span>
                </div>
              </div>
            </div>

            {/* Diskon Voucher */}
            {selectedVoucher && voucherDiscount > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Diskon
                  </h3>
                  <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800">
                    Voucher
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-blue-600">
                    Voucher
                    <br />({selectedVoucher.code})
                  </span>
                  <span className="text-xs font-medium text-red-600">
                    -{formatCurrency(voucherDiscount)}
                  </span>
                </div>
              </div>
            )}

            {/* Biaya Lainnya */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Biaya Lainnya
              </h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Admin Layanan</span>
                  <span className="text-xs font-medium text-gray-900">
                    {formatCurrency(transactionData.adminLayanan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600">Pajak</span>
                  <span className="text-xs font-medium text-red-600">
                    {formatCurrency(transactionData.pajak)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Biaya */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  Total Biaya
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {/* Status Voucher */}
            {selectedVoucher && (
              <div className="mt-4">
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-blue-900">
                      1 Voucher Terpakai
                    </span>
                  </div>
                  <IconComponent
                    src="/icons/arrow-right.svg"
                    width={12}
                    height={12}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="sticky bottom-0 bg-white pt-4">
              <Button
                variant="muatparts-primary"
                className="w-full"
                onClick={() => {
                  setShowTransactionSummary(false);
                  navigation.push("/InformasiPesanan");
                }}
              >
                Lanjut
              </Button>
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Bottomsheet Rekomendasi Truk */}
      <BottomSheet
        open={isRecommendedTruckBottomsheetOpen}
        onOpenChange={setRecommendedTruckBottomsheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>Rekomendasi Kami</BottomSheetHeader>
          <div className="flex flex-col gap-y-6 px-4 pb-6 pt-7">
            <div className="flex items-center gap-x-2.5 rounded-md bg-warning-100 p-2">
              <div className="size-[20px]">
                <IconComponent
                  className="text-secondary-400"
                  src="icons/warning20.svg"
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-xs font-medium leading-[1.1] text-neutral-900">
                Pastikan lokasi muat dan bongkar dapat dijangkau truk
                rekomendasi kami untuk kelancaran proses
              </p>
            </div>
            <div className="flex gap-x-3">
              <LightboxProvider
                className="size-[68px]"
                title=""
                image="/img/recommended1.png"
              >
                <LightboxPreview image="/img/recommended1.png" alt="" />
              </LightboxProvider>
              <div className="flex flex-col gap-y-3">
                <div className="flex h-[27px] items-center">
                  <h3 className="text-sm font-bold leading-[1.1] text-neutral-900">
                    Colt Diesel Engkel
                  </h3>
                </div>
                <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                  Rp950.000
                </span>
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/jenis-truck/scale.svg"
                    className="size-6 text-amber-900"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-[13.2px] text-black">
                      Estimasi Kapasitas
                    </span>
                    <span className="text-xs font-bold leading-[13.2px] text-black">
                      2,5 Ton
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/jenis-truck/dimension.svg"
                    className="size-6 text-amber-900"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold leading-[13.2px] text-black">
                      {"Estimasi Dimensi (p x l x t)"}
                    </span>
                    <span className="text-xs font-bold leading-[13.2px] text-black">
                      {"3,0 m x 1,7 m x 1,6 m"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="muatparts-primary"
              className="w-full"
              onClick={() => {
                toast.success("Jenis armada telah berhasil diubah");
                setRecommendedTruckBottomsheetOpen(false);
              }}
            >
              Terapkan
            </Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>

      <ModalFirstTimer />
    </DefaultResponsiveLayout>
  );
};
export default SewaArmadaHomeScreen;
