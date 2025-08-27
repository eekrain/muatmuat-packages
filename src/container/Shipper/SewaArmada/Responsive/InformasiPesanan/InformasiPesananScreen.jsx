"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { mockValidateVoucher } from "@/services/Shipper/voucher/mockVoucherService";
import { muatTransValidateVoucher } from "@/services/Shipper/voucher/muatTransVoucherService";

import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageUploaderResponsive from "@/components/ImageUploader/ImageUploaderResponsive";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import TextArea from "@/components/TextArea/TextArea";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";

import WaitingSettlementModal from "@/container/Shipper/SewaArmada/Responsive/Home/WaitingSettemenetModal";
import NoDeliveryOrder from "@/container/Shipper/SewaArmada/Responsive/InformasiPesanan/NoDeliveryOrder";

import { usePrevious } from "@/hooks/use-previous";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { useVouchers } from "@/hooks/useVoucher";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeFleetOrder } from "@/lib/normalizers/sewaarmada";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useTokenStore } from "@/store/AuthStore/tokenStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";
import { useWaitingSettlementModalAction } from "@/store/Shipper/forms/waitingSettlementModalStore";

import OrderConfirmationBottomSheet from "./OrderConfirmationBottomSheet";

const InformasiPesananScreen = ({
  carriers,
  trucks,
  paymentMethods,
  calculatedPrice,
  settlementAlertInfo,
}) => {
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const authToken = useTokenStore((state) => state.accessToken);
  const router = useRouter();
  const { setIsOpen } = useWaitingSettlementModalAction();

  // Alert items logic similar to HomeScreen
  const alertItems = useShallowMemo(() => {
    if (!settlementAlertInfo) return [];

    const listPesananUrl = [
      "/daftarpesanan/pesananmenunggupembayaran",
      "/daftarpesanan/pesananmenunggupelunasan",
      "/daftarpesanan/butuhkonfirmasianda",
      "/daftarpesanan/butuhkonfirmasianda",
    ];

    const alertItemsResult = settlementAlertInfo
      .map((item, key) => {
        if (!item.orderId || item.orderId.length === 0) {
          return null;
        }
        if (key === 1) {
          return {
            label: item.alertText,
            onClick: () => setIsOpen(true),
          };
        }
        return {
          label: item.alertText,
          onClick: () =>
            router.push(
              item.orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                : listPesananUrl[key]
            ),
        };
      })
      .filter(Boolean);

    // Check if there are any confirmation alerts (alerts that need user action)
    const hasConfirmationAlerts = alertItemsResult.length > 0;

    // Add warning banner as an alert item if confirmation alerts are present
    if (hasConfirmationAlerts) {
      alertItemsResult.push({
        label: "messageWarningPreparation", // Use translation key
        isWarningBanner: true, // Flag to identify this as warning banner
      });
    }

    return alertItemsResult;
  }, [settlementAlertInfo, router, setIsOpen]);

  /* voucher state and logic - from HomeScreen */
  const token = `Bearer ${authToken}` || null;
  const MOCK_EMPTY = false;
  const useMockData = false; // Flag untuk menggunakan mock data - ubah ke false untuk menggunakan API real

  // Gunakan hook voucher untuk mendapatkan data
  const {
    vouchers: voucherList,
    loading,
    error,
    refetch,
  } = useVouchers(token, useMockData, MOCK_EMPTY);

  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false); // Bottomsheet Voucher

  const [
    isOrderConfirmationBottomsheetOpen,
    setOrderConfirmationBottomsheetOpen,
  ] = useState(false); // Bottomsheet periksa pesanan kamu

  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [validationErrors, setValidationErrors] = useState({});
  const [validatingVoucher, setValidatingVoucher] = useState(null);
  /* end voucher state */

  // Get state from Zustand store
  const { formValues, formErrors, orderType } = useSewaArmadaStore();
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    informasiMuatan,
    cargoPhotos,
    cargoDescription,
    carrierId,
    truckTypeId,
    truckCount,
    distance,
    distanceUnit,
    businessEntity,
    paymentMethodId,
    // deliveryOrder,
  } = formValues;
  const { isBusinessEntity, name, taxId } = businessEntity;

  // Add missing variables for voucher functionality (after isBusinessEntity is available)
  const baseOrderAmount = calculatedPrice?.transportFee || 950000; // Same as transactionData.biayaPesanJasaAngkut
  const adminFee = calculatedPrice?.adminFee || 10000;
  const taxAmount =
    calculatedPrice?.taxAmount || (isBusinessEntity ? 21300 : 0); // Will be calculated based on business entity
  const baseTotal =
    calculatedPrice?.totalPrice || baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Get actions from Zustand store
  const { setField, setCargoPhotos, validateSecondForm } =
    useSewaArmadaActions();

  // Enhanced truck and carrier selection with better error handling
  const selectedCarrier = useShallowMemo(() => {
    if (!carriers || !carrierId) {
      console.log("❌ Missing carriers data or carrierId:", {
        carriers: !!carriers,
        carrierId,
      });
      return null;
    }
    const allCarriers = [
      ...(carriers.recommendedCarriers || []),
      ...(carriers.nonRecommendedCarriers || []),
    ];
    const carrier = allCarriers.find((c) => c.carrierId === carrierId);
    if (!carrier) {
      console.log("❌ Carrier not found:", {
        carrierId,
        availableIds: allCarriers.map((c) => c.carrierId),
      });
    }
    return carrier;
  }, [carriers, carrierId]);

  const selectedTruck = useShallowMemo(() => {
    if (!trucks || !truckTypeId) {
      console.log("❌ Missing trucks data or truckTypeId:", {
        trucks: !!trucks,
        truckTypeId,
      });
      return null;
    }
    const allTrucks = [
      ...(trucks.recommendedTrucks || []),
      ...(trucks.nonRecommendedTrucks || []),
    ];
    const truck = allTrucks.find((t) => t.truckTypeId === truckTypeId);
    if (!truck) {
      console.log("❌ Truck not found:", {
        truckTypeId,
        availableIds: allTrucks.map((t) => t.truckTypeId),
      });
    }
    return truck;
  }, [trucks, truckTypeId]);

  const selectedOpsiPembayaran = useShallowMemo(
    () =>
      paymentMethodId
        ? paymentMethods
            .flatMap((channel) => channel.methods || [])
            .find((method) => method.id === paymentMethodId)
        : null,
    [paymentMethodId, paymentMethods]
  );

  // Debug useEffect for truck selection
  useEffect(() => {
    console.log("🚀 Form Values Debug:", {
      carrierId,
      truckTypeId,
      truckCount,
      distance,
      distanceUnit,
    });
    console.log("📦 Available Data:", {
      carriers: carriers ? "loaded" : "not loaded",
      trucks: trucks ? "loaded" : "not loaded",
      carriersCount: carriers
        ? (carriers.recommendedCarriers?.length || 0) +
          (carriers.nonRecommendedCarriers?.length || 0)
        : 0,
      trucksCount: trucks
        ? (trucks.recommendedTrucks?.length || 0) +
          (trucks.nonRecommendedTrucks?.length || 0)
        : 0,
    });
    console.log("✅ Selected Items:", {
      selectedCarrier: selectedCarrier ? selectedCarrier.name : "not found",
      selectedTruck: selectedTruck ? selectedTruck.name : "not found",
    });
  }, [
    carrierId,
    truckTypeId,
    carriers,
    trucks,
    selectedCarrier,
    selectedTruck,
  ]);

  // Voucher useEffect hooks and calculations
  useEffect(() => {
    // Calculate final total with voucher discount, ensure it's not negative
    const newTotal = Math.max(0, baseTotal - voucherDiscount);
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount, calculatedPrice]);

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
      setOrderConfirmationBottomsheetOpen(true);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setOrderConfirmationBottomsheetOpen(false);

      if (!token) {
        alert("Token tidak ditemukan");
        return;
      }

      // Prepare voucher data for payload
      const voucherData = {
        voucher: voucherDiscount, // Include voucher discount amount
        // Include other calculated price fields
        totalPrice: currentTotal, // Final total after voucher discount
        transportFee: calculatedPrice?.transportFee,
        adminFee: calculatedPrice?.adminFee,
        taxAmount: calculatedPrice?.taxAmount,
        insuranceFee: calculatedPrice?.insuranceFee,
        additionalServiceFee: calculatedPrice?.additionalServiceFee,
      };

      // Update formValues with selected voucher ID if voucher is selected
      const updatedFormValues = {
        ...formValues,
        voucherId: selectedVoucher?.id || null, // Include voucher ID in payload
      };

      console.log("🚀 Creating order with voucher data:", {
        voucherId: selectedVoucher?.id,
        voucherCode: selectedVoucher?.code,
        voucherDiscount: voucherDiscount,
        originalTotal: baseTotal,
        finalTotal: currentTotal,
      });

      const orderFleetData = normalizeFleetOrder(
        orderType || "INSTANT",
        updatedFormValues,
        voucherData // Pass voucher-adjusted pricing data
      );

      console.log("📦 Order payload:", orderFleetData);

      const response = await fetcherMuatrans.post(
        "/v1/orders/create",
        orderFleetData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.Message.Code === 200) {
        const orderData = response.data.Data;
        console.log("✅ Order created successfully:", orderData);
        router.push(`/daftarpesanan/detailpesanan/${orderData.orderId}`);
      } else {
        console.error("❌ Order creation failed:", response.data);
        alert(
          `Gagal membuat pesanan: ${response.data.Message.Text || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("❌ Error creating order:", error);
      alert(
        `Error: ${error.response?.data?.Message?.Text || error.message || "Unknown error"}`
      );
    }
  };

  console.log("selectedCarrier", selectedCarrier, selectedTruck);

  return (
    <FormResponsiveLayout
      title={{
        label: t("titleInformasiPesanan"), // Informasi Pesanan
      }}
    >
      <div className="mb-[118px] flex flex-col gap-y-2 bg-neutral-200">
        {/* Alert Multiline Responsive - Same as in HomeScreen */}
        <AlertMultilineResponsive items={alertItems} className="w-full" />

        {/* Info Jasa Angkut */}
        <div className="flex items-center gap-3 bg-neutral-50 px-4 py-5">
          {/* Image Container */}
          <LightboxProvider
            image={
              selectedTruck?.image ||
              selectedCarrier?.image ||
              "/img/recommended1.png"
            }
          >
            <LightboxPreview
              image={
                selectedTruck?.image ||
                selectedCarrier?.image ||
                "/img/recommended1.png"
              }
              alt={selectedTruck?.name || selectedCarrier?.name || "truck"}
              className="object-contain"
            />
          </LightboxProvider>

          {/* Info Text */}
          <div className="flex flex-1 flex-col gap-3">
            {selectedCarrier && selectedTruck ? (
              <>
                <h3 className="text-sm font-semibold leading-[15.4px] text-neutral-900">
                  {`${selectedCarrier.name} - ${selectedTruck.name}`}
                </h3>
                <p className="text-sm font-medium leading-[15.4px] text-neutral-900">
                  {t("labelKebutuhanUnit", { unit: truckCount })}
                </p>
                <p className="text-sm font-medium leading-[15.4px] text-neutral-900">
                  {distance && distanceUnit
                    ? t("labelEstimasiJarak", { distance, unit: distanceUnit })
                    : "Menghitung estimasi jarak..."}
                </p>
                {/* Add truck capacity if available */}
                {selectedTruck?.capacity && (
                  <p className="text-xs font-medium leading-[13.2px] text-neutral-600">
                    Kapasitas: {selectedTruck.capacity}
                  </p>
                )}
                {/* Add truck specifications if available */}
                {selectedTruck?.specifications && (
                  <p className="text-xs font-medium leading-[13.2px] text-neutral-600">
                    {selectedTruck.specifications}
                  </p>
                )}
              </>
            ) : carrierId || truckTypeId ? (
              // Loading state
              <>
                <div className="h-4 animate-pulse rounded bg-neutral-300"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-300"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-300"></div>
              </>
            ) : (
              // No selection state
              <>
                <h3 className="text-sm font-semibold leading-[15.4px] text-neutral-500">
                  Belum ada armada dipilih
                </h3>
                <p className="text-sm font-medium leading-[15.4px] text-neutral-500">
                  Silakan pilih armada terlebih dahulu
                </p>
              </>
            )}
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
                <span
                  className="w-[180px] break-after-right text-xs font-medium leading-[14.4px] text-neutral-600"
                  dangerouslySetInnerHTML={{
                    __html: t("labelNominalPesanJasaAngkut").replace(
                      " (",
                      "<br/>("
                    ),
                  }}
                />
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  {calculatedPrice?.transportFee
                    ? `Rp${calculatedPrice.transportFee.toLocaleString("id-ID")}`
                    : "Rp950.000"}
                </span>
              </div>
            </div>

            {/* Biaya Asuransi */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleBiayaAsuransiBarang")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                <span
                  className="text-xs font-medium leading-[14.4px] text-neutral-600"
                  dangerouslySetInnerHTML={{
                    __html: t("labelNominalPremiAsuransi").replace(
                      " (",
                      "<br/>("
                    ),
                  }}
                />
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  {calculatedPrice?.insuranceFee
                    ? `Rp${calculatedPrice.insuranceFee.toLocaleString("id-ID")}`
                    : "Rp10.000"}
                </span>
              </div>
            </div>

            {/* Biaya Layanan Tambahan */}
            {calculatedPrice?.additionalServiceFee?.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                  {t("titleBiayaLayananTambahan")}
                </h3>
                {calculatedPrice.additionalServiceFee.map((service, index) => (
                  <div
                    className="flex items-start justify-between gap-3"
                    key={index}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                        {service.name}
                      </span>
                      {service.name.includes("Kirim Bukti Fisik") && (
                        <button className="text-left text-xs font-semibold leading-[13.2px] text-primary-700">
                          {t("buttonLihatDetailPengirimanDokumen")}
                        </button>
                      )}
                    </div>
                    <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                      Rp{service.totalCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Diskon Voucher */}
            <div className="flex flex-col gap-y-4">
              <h3 className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                {t("titleDiskonVoucher")}
              </h3>
              <div className="flex items-start justify-between gap-3">
                {(selectedVoucher && voucherDiscount > 0) ||
                (calculatedPrice?.voucher && calculatedPrice.voucher > 0) ? (
                  <>
                    <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                      {selectedVoucher?.code
                        ? t("labelVoucherCode", { code: selectedVoucher.code })
                        : "Voucher Discount"}
                    </span>
                    <span className="text-right text-xs font-medium leading-[14.4px] text-error-400">
                      -
                      {formatCurrency(
                        voucherDiscount || calculatedPrice?.voucher || 0
                      )}
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
                  {calculatedPrice?.adminFee
                    ? `Rp${calculatedPrice.adminFee.toLocaleString("id-ID")}`
                    : "Rp10.000"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs font-medium leading-[14.4px] text-neutral-600">
                  {t("labelPajak")}
                </span>
                <span className="text-right text-xs font-medium leading-[14.4px] text-neutral-900">
                  {calculatedPrice?.taxAmount
                    ? `Rp${calculatedPrice.taxAmount.toLocaleString("id-ID")}`
                    : isBusinessEntity
                      ? formatCurrency(21300)
                      : "-"}
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
              {`Rp${currentTotal.toLocaleString("id-ID")}`}
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
        <OrderConfirmationBottomSheet
          isOpen={isOrderConfirmationBottomsheetOpen}
          setOpen={setOrderConfirmationBottomsheetOpen}
          onValidateInformasiPesanan={handleValidateInformasiPesanan}
          onCreateOrder={handleCreateOrder}
          selectedCarrier={selectedCarrier}
          selectedTruck={selectedTruck}
        />
      </ResponsiveFooter>

      {/* Voucher BottomSheet */}
      <BottomSheet open={isBottomsheetOpen} onOpenChange={setIsBottomsheetOpen}>
        <BottomSheetContent>
          <BottomSheetHeader>
            <BottomSheetClose />
            <BottomSheetTitle>{t("titlePilihVoucher")}</BottomSheetTitle>
          </BottomSheetHeader>
          <div className="flex h-[577px] w-full flex-col gap-4 overflow-y-auto bg-neutral-50 px-4">
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
          </div>

          {/* Apply button */}
          <div className="sticky bottom-0 flex items-center rounded-t-[10px] bg-neutral-50 px-4 py-3 shadow-responsive-footer">
            <Button
              variant="muatparts-primary"
              className="flex-1"
              onClick={handleApplyVoucher}
            >
              {tempSelectedVoucher ? t("buttonTerapkan") : t("buttonLewati")}
            </Button>
          </div>
        </BottomSheetContent>
      </BottomSheet>
      <WaitingSettlementModal />
    </FormResponsiveLayout>
  );
};

export default InformasiPesananScreen;
