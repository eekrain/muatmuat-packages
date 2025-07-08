import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherPopup from "@/components/Voucher/VoucherPopup";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import FleetOrderConfirmationModal from "@/container/SewaArmada/Web/FleetOrderConfirmationModal/FleetOrderConfirmationModal";
import { useVouchers } from "@/hooks/useVoucher";
import { fetcherMuatrans } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { validateVoucherClientSide } from "@/lib/utils/voucherValidation";
import { mockValidateVoucher } from "@/services/voucher/mockVoucherService";
import { muatTransValidateVoucher } from "@/services/voucher/muatTransVoucherService";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg">
    <span>{message}</span>
    <button onClick={onClose} className="font-bold text-white">
      ×
    </button>
  </div>
);

export const SummaryPanel = ({
  settingsTime,
  paymentMethods,
  calculatedPrice,
}) => {
  // Voucher related state and hooks
  const token = "Bearer your_token_here";
  const MOCK_EMPTY = false;
  const useMockData = false; // Flag untuk menggunakan mock data - ubah ke false untuk menggunakan API real

  let {
    vouchers: voucherList,
    loading,
    error,
    refetch,
  } = useVouchers(token, useMockData, MOCK_EMPTY); // Pass MOCK_EMPTY to hook

  // No need to override voucherList here since hook handles MOCK_EMPTY
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showVoucherSuccess, setShowVoucherSuccess] = useState(false);
  const [validatingVoucher, setValidatingVoucher] = useState(null);

  const router = useRouter();

  const orderType = useSewaArmadaStore((state) => state.orderType);
  const {
    cargoTypeId,
    cargoCategoryId,
    isHalalLogistics,
    cargoDescription,
    carrierId,
    truckTypeId,
    truckCount,
    additionalServices,
    deliveryOrderNumbers,
    businessEntity,
    paymentMethodId,
  } = useSewaArmadaStore((state) => state.formValues);
  const formErrors = useSewaArmadaStore((state) => state.formErrors);

  const isBusinessEntity = businessEntity.isBusinessEntity;

  const { setField, validateForm } = useSewaArmadaActions();

  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  const baseOrderAmount = 5000000; // 5 juta untuk transport fee
  const adminFee = 10000;
  const taxAmount = isBusinessEntity ? 21300 : 0;

  const baseTotal = baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [showInfoPopup, setShowInfoPopup] = useState(null);

  // Calculate total when voucher or base amounts change
  useEffect(() => {
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

  // Update voucher discount when selectedVoucher changes
  useEffect(() => {
    if (selectedVoucher && selectedVoucher.isValid) {
      const discount = calculateDiscountAmount(selectedVoucher, baseTotal);
      console.log("testdiscount", discount);
      setVoucherDiscount(discount);
    } else {
      setVoucherDiscount(0);
    }
  }, [selectedVoucher, baseTotal]);

  const detailPesanan = [
    {
      title: "Detail Pesanan",
      items: [
        {
          label: "Biaya Transport",
          cost: baseOrderAmount,
        },
        {
          label: "Admin Layanan",
          cost: adminFee,
        },
        // Conditional item using spread operator
        ...(isBusinessEntity
          ? [
              {
                label: "Pajak",
                cost: taxAmount,
              },
            ]
          : []),
        // Voucher discount
        ...(selectedVoucher && voucherDiscount > 0
          ? [
              {
                label: `Diskon Voucher (${selectedVoucher.code})`,
                cost: -voucherDiscount,
                isDiscount: true,
              },
            ]
          : []),
      ],
    },
  ];

  const filteredVouchers = voucherList.filter(
    (v) =>
      v.code?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Function to calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher || !total) return 0;

    // Handle different discount types (support both formats for consistency)
    if (
      voucher.discountType === "PERCENTAGE" ||
      voucher.discountType === "percentage"
    ) {
      const discountAmount = (total * voucher.discountPercentage) / 100;
      console.log("total", total, "discountamount", discountAmount);
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

  const handleVoucherSelect = async (voucher) => {
    console.log("here", voucher);
    try {
      // Clear previous validation errors for all vouchers
      setValidationErrors({});
      setValidatingVoucher(voucher.id);

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

      console.log("validationResult", validationResult);

      if (validationResult.isValid) {
        // Voucher is valid, proceed with selection
        const validatedVoucher = {
          ...voucher,
          isValid: true,
          validationResult: validationResult,
        };

        setSelectedVoucher(validatedVoucher);
        setShowVoucherPopup(false);

        // Show success toast and highlight
        setToastMessage(`Voucher ${voucher.code} berhasil diterapkan!`);
        setShowVoucherSuccess(true);
        setTimeout(() => setToastMessage(""), 3000);
        setTimeout(() => setShowVoucherSuccess(false), 5000); // Remove highlight after 5 seconds
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
      setValidatingVoucher(null);
    }
  };

  const handleSelectPaymentMethod = (paymentMethodId) => {
    setField("paymentMethodId", paymentMethodId);
  };

  const handleValidateFleetOrder = () => {
    console.log("formErrors", formErrors);
    const isValidForm = validateForm(settingsTime);
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  const validateOrderData = (orderData) => {
    const errors = [];

    // Basic validations
    if (!orderData.loadTimeStart) {
      errors.push({
        field: "loadTimeStart",
        message: "Waktu muat tidak boleh kosong",
      });
    }

    if (!orderData.loadTimeEnd) {
      errors.push({
        field: "loadTimeEnd",
        message: "Waktu muat akhir tidak boleh kosong",
      });
    }

    // Check for pickup and dropoff locations
    const pickupLocations = orderData.locations.filter(
      (loc) => loc.locationType === "PICKUP"
    );
    const dropoffLocations = orderData.locations.filter(
      (loc) => loc.locationType === "DROPOFF"
    );

    if (pickupLocations.length === 0 || dropoffLocations.length === 0) {
      errors.push({
        field: "locations",
        message: "Minimal harus ada 1 lokasi pickup dan 1 lokasi dropoff",
      });
    }

    // Check for cargos
    if (!orderData.cargos || orderData.cargos.length === 0) {
      errors.push({
        field: "cargos",
        message: "Minimal harus ada 1 muatan",
      });
    } else {
      orderData.cargos.forEach((cargo, index) => {
        if (!cargo.weight || cargo.weight <= 0) {
          errors.push({
            field: `cargos.${index}.weight`,
            message: "Berat muatan harus lebih dari 0",
          });
        }
      });
    }

    // Check for payment method
    if (!orderData.paymentMethodId) {
      errors.push({
        field: "paymentMethodId",
        message: "Metode pembayaran wajib dipilih",
      });
    }

    return errors;
  };

  const handleOrderFleet = () => {
    const sampleOrderData = {
      orderType,
      loadTimeStart: "2025-06-26T09:00:00Z",
      loadTimeEnd: "2025-07-27T09:00:00Z",
      locations: [
        {
          locationType: "PICKUP",
          sequence: 1,
          fullAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
          detailAddress: "Gedung ABC Lantai 5",
          latitude: -6.2088,
          longitude: 106.8456,
          district: "Tanah Abang",
          districtId: 2,
          city: "Jakarta Pusat",
          cityId: 213,
          province: "DKI Jakarta",
          provinceId: 35,
          postalCode: "10270",
          picName: "Budi Santoso",
          picPhoneNumber: "081234567890",
        },
        {
          locationType: "DROPOFF",
          sequence: 1,
          fullAddress: "Jl. Gatot Subroto No. 456, Jakarta Selatan",
          detailAddress: "Lobby Utama",
          latitude: -6.25,
          longitude: 106.83,
          district: "Setiabudi",
          districtId: 2,
          city: "Jakarta Pusat",
          cityId: 213,
          province: "DKI Jakarta",
          provinceId: 35,
          postalCode: "12930",
          picName: "Sari Dewi",
          picPhoneNumber: "081234567891",
        },
      ],
      cargos: [
        {
          cargoNameId: "550e8400-e29b-41d4-a716-446655440030",
          customName: "Laptop dan Printer",
          weight: 500.0,
          weightUnit: "kg",
          dimensions: {
            length: 2.0,
            width: 1.5,
            height: 1.0,
            dimensionUnit: "m",
          },
          sequence: 1,
        },
      ],
      cargoTypeId,
      cargoCategoryId,
      cargoPhotos: [
        "https://storage.muatrans.com/cargos/photo-123456.jpg",
        "https://storage.muatrans.com/cargos/photo-123457.jpg",
      ],
      cargoDescription: "Elektronik dan peralatan kantor",
      isHalalLogistics,
      carrierId,
      truckTypeId,
      truckCount: 2,
      estimatedDistance: 75.5,
      estimatedTime: 120,
      additionalServices,
      deliveryOrderNumbers,
      businessEntity,
      voucherId: selectedVoucher?.id || "",
      paymentMethodId,
      pricing: {
        transportFee: baseOrderAmount,
        insuranceFee: 0,
        additionalServiceFee: 0,
        voucherDiscount: voucherDiscount,
        adminFee: adminFee,
        taxAmount: taxAmount,
        totalPrice: currentTotal,
      },
    };

    const result = validateOrderData(sampleOrderData);
    console.log("Validation result:", result);
    console.log("Order data with voucher:", sampleOrderData);

    try {
      // Panggil API untuk membuat pesanan
      const response = fetcherMuatrans.post(
        "/v1/orders/create",
        sampleOrderData,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data.Message.Code == 200) {
        alert("Hore Berhasil Sewa Armada :)");
      } else {
        alert("Validation err");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }

    setIsModalConfirmationOpen(false);
  };

  return (
    <>
      <Card className="shadow-muat flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 py-6">
          <h3 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Ringkasan Transaksi
          </h3>
          <div className="scrollbar-custombadanusaha mr-[-12px] flex max-h-[263px] flex-col gap-y-6 overflow-y-auto pr-2">
            <button
              onClick={() => setShowVoucherPopup(true)}
              className="flex w-full items-center justify-between rounded-md border border-blue-600 bg-primary-50 px-4 py-3 text-sm text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                {selectedVoucher ? (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      1
                    </div>
                    <span>1 Voucher Terpakai</span>
                  </>
                ) : (
                  <>
                    <Image
                      src="/img/iconVoucher2.png"
                      alt="Voucher"
                      width={25}
                      height={25}
                    />
                    <span>Makin hemat pakai voucher</span>
                  </>
                )}
              </div>
              <Image
                src="/icons/right-arrow-voucher.png"
                width={18}
                height={18}
                alt="right-arrow"
              />
            </button>

            {/* Selected Voucher Info */}
            {selectedVoucher && (
              <div
                className={`hidden items-center justify-between rounded-md border px-3 py-2 transition-all duration-500 ${
                  showVoucherSuccess
                    ? "scale-105 transform border-green-400 bg-green-100 shadow-md"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-800">
                    {selectedVoucher.code}
                  </span>
                  <span className="text-xs text-green-600">
                    Hemat Rp {voucherDiscount.toLocaleString("id-ID")}
                  </span>
                  {showVoucherSuccess && (
                    <span className="animate-pulse text-xs font-semibold text-green-700">
                      ✅ Berhasil diterapkan!
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedVoucher(null);
                    setVoucherDiscount(0);
                    setShowVoucherSuccess(false);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            )}

            {/* Detail Pesanan */}
            {detailPesanan.map(({ title, items }, key) => (
              <div className="flex flex-col gap-y-3" key={key}>
                <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                  {title}
                </span>
                {items.map(({ label, cost, isDiscount }, itemKey) => (
                  <div
                    className="flex items-center justify-between"
                    key={itemKey}
                  >
                    <span
                      className={`text-[12px] font-medium leading-[14.4px] ${isDiscount ? "text-green-600" : "text-neutral-600"}`}
                    >
                      {label}
                    </span>
                    <span
                      className={`text-[12px] font-medium leading-[14.4px] ${isDiscount ? "text-green-600" : "text-neutral-900"}`}
                    >
                      {isDiscount ? "-" : ""}Rp
                      {Math.abs(cost).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                    Sub Total
                  </span>
                  <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                    Rp{currentTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-y-6 rounded-b-xl px-5",
            detailPesanan.length > 0 ? "shadow-muat py-6" : "pb-6"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              Rp{currentTotal.toLocaleString("id-ID")}
            </span>
          </div>
          {truckTypeId && (
            <ModalOpsiPembayaran
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={paymentMethodId}
              onSelectedPaymentMethodId={handleSelectPaymentMethod}
              onProceedPayment={handleValidateFleetOrder}
            />
          )}
        </div>
      </Card>

      {/* MODAL PILIH VOUCHER */}
      <Modal open={showVoucherPopup} onOpenChange={setShowVoucherPopup}>
        <ModalContent className="max-h-[80vh] min-h-fit w-[386px] rounded-xl bg-white px-6 py-6 shadow-2xl">
          <button
            onClick={() => setShowVoucherPopup(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          ></button>

          <h2 className="mb-4 text-center text-base font-semibold">
            Pilih Voucher
          </h2>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <IconComponent src="/icons/search.svg" width={20} height={20} />
            </div>
            <input
              disabled={loading || error || voucherList.length === 0}
              type="text"
              placeholder="Cari Kode Voucher"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-[32px] w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3 pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-500">Memuat voucher...</span>
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
            ) : searchKeyword.length > 0 && filteredVouchers.length === 0 ? (
              <VoucherSearchEmpty />
            ) : filteredVouchers.length === 0 ? (
              <VoucherEmptyState />
            ) : (
              <>
                <p className="mb-4 text-xs text-gray-500">
                  Hanya bisa dipilih 1 Voucher
                </p>
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
                    isActive={selectedVoucher?.id === v.id}
                    onSelect={() => handleVoucherSelect(v)}
                    validationError={validationErrors[v.id]}
                    isValidating={validatingVoucher === v.id}
                  />
                ))}
              </>
            )}
          </div>
        </ModalContent>
      </Modal>

      {/* POPUP INFO VOUCHER */}
      {showInfoPopup && (
        <VoucherPopup
          open={showVoucherPopup}
          onOpenChange={setShowVoucherPopup}
          closeOnOutsideClick={true}
        />
      )}

      <FleetOrderConfirmationModal
        isOpen={isModalConfirmationOpen}
        setIsOpen={setIsModalConfirmationOpen}
        onOrderFleet={handleOrderFleet}
      />

      {/* TOAST */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </>
  );
};
