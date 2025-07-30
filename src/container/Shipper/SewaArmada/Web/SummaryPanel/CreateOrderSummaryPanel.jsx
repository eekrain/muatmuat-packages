import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Card from "@/components/Card/Card";
import { ModalOpsiPembayaran } from "@/components/Modal/ModalOpsiPembayaran";
import FleetOrderConfirmationModal from "@/container/Shipper/SewaArmada/Web/FleetOrderConfirmationModal/FleetOrderConfirmationModal";
import { VoucherContainer } from "@/container/Shipper/Voucher/Voucher";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { fetcherMuatrans } from "@/lib/axios";
import { normalizeFleetOrder } from "@/lib/normalizers/sewaarmada";
import { cn } from "@/lib/utils";
import { useTokenStore } from "@/store/AuthStore/tokenStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg">
    <span>{message}</span>
    <button onClick={onClose} className="font-bold text-white">
      ×
    </button>
  </div>
);

export const CreateOrderSummaryPanel = ({
  settingsTime,
  paymentMethods,
  calculatedPrice,
}) => {
  // Ambil token yang valid dari auth store
  const authToken = useTokenStore((state) => state.token);
  const token = authToken ? `Bearer ${authToken}` : null;

  const MOCK_EMPTY = false;
  const useMockData = false; // Flag untuk menggunakan mock data - ubah ke false untuk menggunakan API real

  // Enhanced debugging
  console.log("🔧 CreateOrderSummaryPanel Debug Info:", {
    useMockData,
    hasValidToken: !!token,
    tokenPreview: `${token?.substring(0, 20)}...` || "No token",
    timestamp: new Date().toISOString(),
  });

  // Simplified voucher state - most logic moved to VoucherContainer
  const [toastMessage, setToastMessage] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [showVoucherSuccess, setShowVoucherSuccess] = useState(false);

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
  const baseOrderAmount = calculatedPrice?.totalPrice || 950000;
  const adminFee = 10000;
  const taxAmount = isBusinessEntity ? 21300 : 0;

  const baseTotal = baseOrderAmount + adminFee + taxAmount;
  const [currentTotal, setCurrentTotal] = useState(baseTotal);
  const [showInfoPopup, setShowInfoPopup] = useState(null);

  // Get selected voucher from store
  const selectedVoucherId = formValues.voucherId;

  // Handler for voucher selection - simplified version
  const handleVoucherSelect = (voucher) => {
    console.log("🎯 Voucher selected:", voucher);

    // Set voucher ID in form
    setField("voucherId", voucher.id);

    // Calculate discount
    const discount = calculateDiscountAmount(voucher, baseOrderAmount);
    setVoucherDiscount(discount);

    // Show success toast
    setToastMessage(`Voucher ${voucher.code} berhasil diterapkan!`);
    setShowVoucherSuccess(true);
    setTimeout(() => setToastMessage(""), 3000);
    setTimeout(() => setShowVoucherSuccess(false), 5000);
  };

  // Initialize VoucherContainer
  const voucherContainer = VoucherContainer({
    selectedVoucher: null,
    selectedVoucherId,
    baseOrderAmount,
    onVoucherSelect: handleVoucherSelect,
    useMockData,
  });

  // Get selected voucher details for display
  const selectedVoucherDetails = voucherContainer.voucherList?.find(
    (v) => v.id === selectedVoucherId
  );

  console.log("🔍 Voucher Debug:", {
    selectedVoucherId,
    selectedVoucherDetails,
    voucherListLength: voucherContainer.voucherList?.length || 0,
    voucherDiscount,
  });

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
      ...(selectedVoucherDetails
        ? [
            {
              title: "Diskon Voucher",
              items: [
                {
                  label: `Voucher (${selectedVoucherDetails.code})`,
                  price: calculatedPrice.voucher || voucherDiscount,
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
  }, [
    calculatedPrice,
    truckTypeId,
    truckCount,
    selectedVoucherDetails,
    voucherDiscount,
  ]);

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
    if (selectedVoucherId) {
      const discount = calculateDiscountAmount(
        {
          id: selectedVoucherId,
          code: "VOUCHER_CODE",
          discountAmount: 0,
          discountPercentage: 0,
          minOrderAmount: 0,
          quota: 0,
          validFrom: "2023-01-01",
          validTo: "2023-12-31",
          usage: { globalPercentage: 0 },
        }, // Mock data for selectedVoucher
        baseOrderAmount
      );
      setCurrentTotal(baseOrderAmount - discount);
      setVoucherDiscount(discount);
    } else {
      setCurrentTotal(baseOrderAmount);
      setVoucherDiscount(0);
    }
  }, [selectedVoucherId, baseOrderAmount]);

  // Update voucher discount when selectedVoucher changes (enhanced from new logic)
  useEffect(() => {
    if (selectedVoucherId) {
      const discount = calculateDiscountAmount(
        {
          id: selectedVoucherId,
          code: "VOUCHER_CODE",
          discountAmount: 0,
          discountPercentage: 0,
          minOrderAmount: 0,
          quota: 0,
          validFrom: "2023-01-01",
          validTo: "2023-12-31",
          usage: { globalPercentage: 0 },
        }, // Mock data for selectedVoucher
        baseTotal
      );
      setVoucherDiscount(discount);
    } else {
      setVoucherDiscount(0);
    }
  }, [selectedVoucherId, baseTotal]);

  // Update current total when base amounts change
  useEffect(() => {
    const newTotal = baseTotal - voucherDiscount;
    setCurrentTotal(newTotal);
  }, [baseTotal, voucherDiscount]);

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

    // Debug: Log the complete order data being sent to API
    console.log("🚀 API Request Debug:", {
      orderFleetData,
      cargoPhotos: orderFleetData.cargoPhotos,
      photoCount: orderFleetData.cargoPhotos?.length || 0,
      hasPhotos:
        orderFleetData.cargoPhotos?.some((photo) => photo !== null) || false,
    });

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

      if (response.data.Message.Code === 200) {
        // alert("Hore Berhasil Sewa Armada :)");
        // Handle sukses - bisa redirect ke detail pesanan
        const fleet = await fetcherMuatrans.post(
          `/v1/orders/${response.data.Data.orderId}/blast-to-fleet`,
          {
            headers: { Authorization: token },
          }
        );
        router.push(
          `/daftarpesanan/detailpesanan/${response.data.Data.orderId}`
        );
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
      <Card className="sticky top-[124px] flex w-[338px] flex-col gap-0 rounded-xl border-none bg-white shadow-muat">
        <div className="flex flex-col gap-y-6 px-5 py-6">
          <h3 className="text-base font-bold leading-[19.2px] text-neutral-900">
            Ringkasan Transaksi
          </h3>
          <div className="scrollbar-custombadanusaha mr-[-12px] flex max-h-[263px] flex-col gap-y-6 overflow-y-auto pr-2">
            <button
              onClick={() => voucherContainer.openVoucherPopup()}
              className="mb-px flex w-full items-center justify-between rounded-md border border-blue-600 bg-primary-50 px-4 py-3 text-sm text-blue-700 hover:bg-blue-50"
            >
              <div className="flex items-center gap-2">
                {selectedVoucherId ? (
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
            {selectedVoucherDetails && (
              <div
                className={`hidden items-center justify-between rounded-md border px-3 py-2 transition-all duration-500 ${
                  showVoucherSuccess
                    ? "scale-105 transform border-green-400 bg-green-100 shadow-md"
                    : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-green-800">
                    {selectedVoucherDetails.code}
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
            {priceSummary.length > 0 ? (
              <>
                <span className="text-sm font-semibold leading-[16.8px] text-neutral-900">
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
                          "text-sm font-semibold leading-[16.8px] text-neutral-900"
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
                              "text-xs font-medium leading-[14.4px] text-neutral-600"
                            }
                          >
                            {label}
                          </span>
                          <span
                            className={`text-xs font-medium leading-[14.4px] ${isDiscountSection ? "text-[#EE4343]" : "text-neutral-900"}`}
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
                  <span className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                    Sub Total
                  </span>
                  <span className="text-sm font-semibold leading-[16.8px] text-neutral-900">
                    {calculatedPrice
                      ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                      : "Rp0"}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-y-6 rounded-b-xl px-5",
            priceSummary.length > 0 ? "py-6 shadow-muat" : "pb-6"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              {calculatedPrice
                ? `Rp${calculatedPrice.totalPrice.toLocaleString("id-ID")}`
                : "Rp0"}
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

      {/* MODAL PILIH VOUCHER - menggunakan VoucherContainer */}
      {voucherContainer.VoucherModal}

      {/* POPUP INFO VOUCHER */}
      {showInfoPopup && <div className="voucher-popup">Info Voucher Popup</div>}

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
