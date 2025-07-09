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
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useVouchers } from "@/hooks/useVoucher";
import { fetcherMuatrans } from "@/lib/axios";
import { normalizeFleetOrder } from "@/lib/normalizers/sewaarmada";
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

  // Keep the MOCK_EMPTY override logic from old file for backward compatibility
  if (MOCK_EMPTY && !loading && !error) {
    voucherList = [];
  }

  // No need to override voucherList here since hook handles MOCK_EMPTY
  const [validationErrors, setValidationErrors] = useState({});
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showVoucherSuccess, setShowVoucherSuccess] = useState(false);
  const [validatingVoucher, setValidatingVoucher] = useState(null);

  const router = useRouter();

  const orderType = useSewaArmadaStore((state) => state.orderType);
  const formValues = useSewaArmadaStore((state) => state.formValues);
  const { truckTypeId, truckCount, businessEntity, paymentMethodId } =
    formValues;
  const formErrors = useSewaArmadaStore((state) => state.formErrors);

  const isBusinessEntity = businessEntity.isBusinessEntity;

  const { setField, validateForm } = useSewaArmadaActions();

  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);

  // Use baseOrderAmount from old file (950000 instead of 5000000)
  const baseOrderAmount = 950000;
  const adminFee = 10000;
  const taxAmount = isBusinessEntity ? 21300 : 0;

  const baseTotal = baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [showInfoPopup, setShowInfoPopup] = useState(null);

  const selectedVoucher = useShallowMemo(() => {
    if (!formValues.voucherId || voucherList.length === 0) {
      return null;
    }
    return voucherList.find((v) => v.id === formValues.voucherId) || null;
  }, [formValues.voucherId, voucherList]);

  // Keep priceSummary logic from old file with useShallowMemo
  const priceSummary = useShallowMemo(() => {
    if (!calculatedPrice || !truckTypeId) {
      return [];
    }
    return [
      {
        title: "Biaya Pesan Jasa Angkut",
        items: [
          {
            label: `Nominal Pesan Jasa Angkut (${truckCount} Unit)`,
            price: calculatedPrice.transportFee,
          },
        ],
      },
      {
        title: "Biaya Asuransi Barang",
        items: [
          {
            label: "Nominal Premi Asuransi (1 Unit)",
            price: calculatedPrice.insuranceFee,
          },
        ],
      },
      ...(calculatedPrice.additionalServiceFee.length > 0
        ? [
            {
              title: "Biaya Layanan Tambahan",
              items: calculatedPrice.additionalServiceFee.map((item) => ({
                label: item.name,
                price: item.totalCost,
              })),
            },
          ]
        : []),
      ...(selectedVoucher
        ? [
            {
              title: "Diskon Voucher",
              items: [
                {
                  label: `Voucher (${selectedVoucher.code})`,
                  price: calculatedPrice.voucher,
                },
              ],
            },
          ]
        : []),
      {
        title: "Biaya Lainnya",
        items: [
          {
            label: "Admin Layanan",
            price: calculatedPrice.adminFee,
          },
          {
            label: "Pajak",
            price: calculatedPrice.taxAmount,
          },
        ],
      },
    ];
  }, [calculatedPrice, truckTypeId, truckCount, selectedVoucher]);

  // Also create detailPesanan structure for new logic integration
  // const detailPesanan = [
  //   {
  //     title: "Detail Pesanan",
  //     items: [
  //       {
  //         label: "Biaya Transport",
  //         cost: baseOrderAmount,
  //       },
  //       {
  //         label: "Admin Layanan",
  //         cost: adminFee,
  //       },
  //       // Conditional item using spread operator
  //       ...(isBusinessEntity
  //         ? [
  //             {
  //               label: "Pajak",
  //               cost: taxAmount,
  //             },
  //           ]
  //         : []),
  //       // Voucher discount
  //       ...(selectedVoucher && voucherDiscount > 0
  //         ? [
  //             {
  //               label: `Diskon Voucher (${selectedVoucher.code})`,
  //               cost: -voucherDiscount,
  //               isDiscount: true,
  //             },
  //           ]
  //         : []),
  //     ],
  //   },
  // ];

  // Calculate total when voucher or base amounts change (from old file logic)
  useEffect(() => {
    if (selectedVoucher) {
      const discount = calculateDiscountAmount(
        selectedVoucher,
        baseOrderAmount
      );
      setCurrentTotal(baseOrderAmount - discount);
      setVoucherDiscount(discount);
    } else {
      setCurrentTotal(baseOrderAmount);
      setVoucherDiscount(0);
    }
  }, [selectedVoucher, baseOrderAmount]);

  // Update voucher discount when selectedVoucher changes (enhanced from new logic)
  useEffect(() => {
    if (selectedVoucher && selectedVoucher.isValid) {
      const discount = calculateDiscountAmount(selectedVoucher, baseTotal);
      setVoucherDiscount(discount);
    } else {
      setVoucherDiscount(0);
    }
  }, [selectedVoucher, baseTotal]);

  // Update current total when base amounts change
  useEffect(() => {
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

  const filteredVouchers = voucherList.filter(
    (v) =>
      v.code?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Function to calculate discount amount based on voucher type (from old file)
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher) return 0;

    // Handle different discount types from old file logic
    if (voucher.discountPercentage !== null) {
      const pct = parseFloat(voucher.discountPercentage) || 0;
      return total * (pct / 100);
    } else {
      // Use the fixed discountAmount key directly
      return parseFloat(voucher.discountAmount) || 0;
    }
  };

  const handleVoucherSelect = async (voucher) => {
    try {
      // Clear previous validation errors for all vouchers
      setValidationErrors({});
      setValidatingVoucher(voucher.id);

      // Client-side validation first (from new logic)
      const clientValidation = validateVoucherClientSide(
        voucher,
        baseOrderAmount
      );
      if (!clientValidation.isValid) {
        setValidationErrors({
          [voucher.id]: clientValidation.errorMessage,
        });
        return;
      }

      // Server-side validation using fetcherMuatrans (from old file) or service functions (new)
      let validationResult;

      if (useMockData) {
        // Use mock service for testing
        validationResult = await mockValidateVoucher({
          voucherId: voucher.id,
          totalAmount: baseOrderAmount,
        });
      } else {
        // Try new service function first, fallback to direct fetcherMuatrans
        try {
          validationResult = await muatTransValidateVoucher({
            voucherId: voucher.id,
            totalAmount: calculatedPrice?.totalPrice ?? baseOrderAmount,
            token: token,
          });
        } catch (serviceError) {
          // Fallback to direct fetcherMuatrans call (from old file)
          const res = await fetcherMuatrans.post(
            "/v1/orders/vouchers/validate",
            {
              voucherId: voucher.id,
              totalAmount: calculatedPrice?.totalPrice ?? baseOrderAmount,
            },
            {
              headers: { Authorization: token },
            }
          );

          validationResult = {
            isValid: res.data.Data.isValid !== false,
            validationMessages: res.data.Data.validationMessages,
            finalAmount: res.data.Data.finalAmount,
          };
        }
      }

      if (validationResult.isValid) {
        // Voucher is valid, proceed with selection
        const discountValue = calculateDiscountAmount(voucher, baseOrderAmount);

        // Use finalAmount from API if available, otherwise calculate manually
        if (validationResult.finalAmount) {
          setCurrentTotal(validationResult.finalAmount);
        }

        const validatedVoucher = {
          ...voucher,
          isValid: true,
          validationResult: validationResult,
          discountAmount: discountValue, // This will hold the FINAL numerical discount value
        };

        setField("voucherId", validatedVoucher.id);
        setShowVoucherPopup(false);

        // Show success toast and highlight (from new logic)
        setToastMessage(`Voucher ${voucher.code} berhasil diterapkan!`);
        setShowVoucherSuccess(true);
        setTimeout(() => setToastMessage(""), 3000);
        setTimeout(() => setShowVoucherSuccess(false), 5000);
      } else {
        // Voucher is invalid, show server error with new error messages
        const validationMessage =
          validationResult.validationMessages?.join(", ") ||
          "Voucher tidak valid";

        setValidationErrors({
          [voucher.id]: validationMessage,
        });
        setField("voucherId", null); // Clear voucher selection
      }
    } catch (err) {
      console.error("Error validating voucher:", err);
      setField("voucherId", null); // Clear voucher selection

      // Enhanced error handling from old file with new error messages
      let errorMessage = "Gagal memvalidasi voucher";

      if (err.response && err.response.data && err.response.data.Data) {
        const errorData = err.response.data.Data;
        const validationMessage =
          errorData.validationMessages || "Voucher tidak valid";

        // Use new error message format instead of label codes
        if (validationMessage === "labelAlertVoucherMTExpired") {
          errorMessage = "Voucher sudah tidak berlaku";
        } else if (validationMessage === "labelAlertVoucherMTMinimumOrder") {
          errorMessage = `Minimal Transaksi Rp ${voucher.minOrderAmount?.toLocaleString("id-ID") || "0"}`;
        } else if (validationMessage === "labelAlertVoucherMTKuotaHabis") {
          errorMessage = "Kuota voucher sudah habis";
        } else {
          errorMessage = validationMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setValidationErrors({
        [voucher.id]: errorMessage,
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

  const handleOrderFleet = async () => {
    // Enhanced sample order data from old file
    const orderFleetData = normalizeFleetOrder(
      orderType,
      formValues,
      calculatedPrice
    );

    // Validate order data before sending
    // const result = validateOrderData(orderFleetData);
    // console.log("Validation result:", result);
    console.log("Order data with voucher:", orderFleetData);

    // Show validation errors if any
    // if (result.length > 0) {
    //   const errorMessages = result.map((err) => err.message).join("\n");
    //   alert(`Validation errors:\n${errorMessages}`);
    //   setIsModalConfirmationOpen(false);
    //   return;
    // }

    try {
      // Panggil API untuk membuat pesanan using fetcherMuatrans
      const response = await fetcherMuatrans.post(
        "/v1/orders/create",
        orderFleetData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.Message.Code == 200) {
        // alert("Hore Berhasil Sewa Armada :)");
        // Handle sukses - bisa redirect ke detail pesanan
        router.push(
          `/daftarpesanan/detailpesanan/${response.data.Data.orderId}`
        );
      } else {
        alert("Validation error from server");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Enhanced error handling
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.Message?.Text || "Unknown error"}`);
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
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
                    setField("voucherId", null);
                    setVoucherDiscount(0);
                    setShowVoucherSuccess(false);
                  }}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              </div>
            )}

            {/* Detail Pesanan - Integrated from old file logic */}
            {
              priceSummary.length > 0 ? (
                <>
                  <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                    Detail Pesanan
                  </span>
                  {priceSummary.map(({ title, items }, key) => {
                    const isDiscountSection = title
                      .toLowerCase()
                      .includes("diskon");
                    return (
                      <div className="flex flex-col gap-y-3" key={key}>
                        <span
                          className={
                            "text-[14px] font-semibold leading-[16.8px] text-neutral-900"
                          }
                        >
                          {title}
                        </span>
                        {items.map(({ label, price }, itemKey) => (
                          <div
                            className={
                              "flex items-center justify-between text-neutral-900"
                            }
                            key={itemKey}
                          >
                            <span
                              className={
                                "text-[12px] font-medium leading-[14.4px] text-neutral-600"
                              }
                            >
                              {label}
                            </span>
                            <span
                              className={`text-[12px] font-medium leading-[14.4px] ${isDiscountSection ? "text-[#EE4343]" : "text-neutral-900"}`}
                            >
                              {isDiscountSection ? "-" : ""}Rp
                              {price.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                      Sub Total
                    </span>
                    <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                      {
                        calculatedPrice
                          ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                          : "Rp0"
                        // `Rp${currentTotal.toLocaleString("id-ID")}`
                      }
                    </span>
                  </div>
                </>
              ) : null
              // (
              //   // Fallback to detailPesanan structure when no calculatedPrice
              //   detailPesanan.map(({ title, items }, key) => (
              //     <div className="flex flex-col gap-y-3" key={key}>
              //       <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              //         {title}
              //       </span>
              //       {items.map(({ label, cost, isDiscount }, itemKey) => (
              //         <div
              //           className="flex items-center justify-between"
              //           key={itemKey}
              //         >
              //           <span
              //             className={`text-[12px] font-medium leading-[14.4px] ${isDiscount ? "text-[#EE4343]" : "text-neutral-600"}`}
              //           >
              //             {label}
              //           </span>
              //           <span
              //             className={`text-[12px] font-medium leading-[14.4px] ${isDiscount ? "text-[#EE4343]" : "text-neutral-900"}`}
              //           >
              //             {isDiscount ? "-" : ""}Rp
              //             {Math.abs(cost).toLocaleString("id-ID")}
              //           </span>
              //         </div>
              //       ))}
              //       <div className="flex items-center justify-between">
              //         <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              //           Sub Total
              //         </span>
              //         <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
              //           {calculatedPrice
              //             ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
              //             : `Rp${currentTotal.toLocaleString("id-ID")}`}
              //         </span>
              //       </div>
              //     </div>
              //   ))
              // )
            }
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-y-6 rounded-b-xl px-5",
            priceSummary.length > 0 /*|| detailPesanan.length > 0*/
              ? "shadow-muat py-6"
              : "pb-6"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              {
                calculatedPrice
                  ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                  : "Rp0"
                // `Rp${currentTotal.toLocaleString("id-ID")}`
              }
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
              disabled={loading || error || filteredVouchers.length === 0}
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
