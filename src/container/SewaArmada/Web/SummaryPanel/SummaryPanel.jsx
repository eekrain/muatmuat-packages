import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherPopup from "@/components/Voucher/VoucherPopup";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import FleetOrderConfirmationModal from "@/container/SewaArmada/Web/FleetOrderConfirmationModal/FleetOrderConfirmationModal";
import { useSWRHook } from "@/hooks/use-swr";
import { useVouchers } from "@/hooks/useVoucher";
import { fetcherMuatrans, fetcherPayment } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
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

export const SummaryPanel = () => {
  // Fetch payment methods using SWR
  const { data: paymentMethodsResponse } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );

  // Use the API data directly or fall back to an empty array
  const paymentMethods = paymentMethodsResponse?.Data || [];

  // Voucher related state and hooks
  const token = "Bearer your_token_here";
  const { vouchers: voucherList, loading, error } = useVouchers(token);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();

  const jenisTruk = useSewaArmadaStore((state) => state.formValues.jenisTruk);
  const isCompany = useSewaArmadaStore((state) => state.formValues.isCompany);
  const opsiPembayaran = useSewaArmadaStore(
    (state) => state.formValues.opsiPembayaran
  );
  const { setField, validateForm } = useSewaArmadaActions();

  const [isOpsiPembayaranModalOpen, setIsOpsiPembayaranModalOpen] =
    useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
  const [isModalConfirmationOpen, setIsModalConfirmationOpen] = useState(false);
  const baseOrderAmount = 950000;
  const [currentTotal, setCurrentTotal] = useState(0);

  // Method: Using flatMap and reduce
  const detailPesanan = [
    {
      title: "Biaya Lainnya",
      items: [
        {
          label: "Admin Layanan",
          cost: 10000,
        },
        // Conditional item using spread operator
        ...(isCompany
          ? [
              {
                label: "Pajak",
                cost: 21300,
              },
            ]
          : []),
      ],
    },
  ];
  // const totalCost = useMemo(() => {
  //   const detailPesanan = [
  //     {
  //       title: "Biaya Lainnya",
  //       items: [
  //         {
  //           label: "Admin Layanan",
  //           cost: 10000,
  //         },
  //         // Conditional item using spread operator
  //         ...(isCompany
  //           ? [
  //               {
  //                 label: "Pajak",
  //                 cost: 21300,
  //               },
  //             ]
  //           : []),
  //       ],
  //     },
  //   ];
  //   return detailPesanan
  //     .flatMap((section) => section.items)
  //     .reduce((total, item) => total + item.cost, 0);
  // }, [isCompany]);

  useEffect(() => {
    if (selectedVoucher) {
      const discount = calculateDiscountAmount(
        selectedVoucher,
        baseOrderAmount
      );
      setCurrentTotal(baseOrderAmount - discount);
    } else {
      setCurrentTotal(baseOrderAmount);
    }
  }, [selectedVoucher, baseOrderAmount]);

  const filteredVouchers = voucherList.filter(
    (v) =>
      v.code?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // Function to calculate discount amount based on voucher type
  const calculateDiscountAmount = (voucher, total) => {
    if (!voucher) return 0;

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

      const totalAmountForValidation = baseOrderAmount;
      const res = await fetcherMuatrans.post(
        "/v1/orders/vouchers/validate",
        {
          voucherId: voucher.id,
          totalAmount: totalAmountForValidation,
        },
        {
          headers: { Authorization: token },
        }
      );

      const isValid = res.data.Data.isValid;
      if (isValid !== false) {
        // Voucher is valid
        const discountValue = calculateDiscountAmount(
          voucher,
          totalAmountForValidation
        );

        setCurrentTotal(res.data.Data.finalAmount);

        setSelectedVoucher({
          ...voucher,
          discountAmount: discountValue, // This 'discountAmount' will hold the FINAL numerical discount value
        });
        setShowVoucherPopup(false);
      } else {
        // Voucher is invalid
        // Set validation error for this specific voucher
        const validationMessage =
          res.data.Data.validationMessages || "Voucher tidak valid";
        setValidationErrors({
          ...validationErrors,
          [voucher.id]: validationMessage,
        });

        // Keep the popup open so user can see the error
        setSelectedVoucher(null);
      }
    } catch (err) {
      console.log("error116", err);
      setSelectedVoucher(null);

      // Check if we have error response data (400 status code with validation message)
      if (err.response && err.response.data && err.response.data.Data) {
        const errorData = err.response.data.Data;
        const validationMessage =
          errorData.validationMessages || "Voucher tidak valid";

        setValidationErrors({
          ...validationErrors,
          [voucher.id]: validationMessage,
        });
      } else {
        // General error fallback
        setValidationErrors({
          ...validationErrors,
          [voucher.id]: "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    }
  };

  const toggleSection = (categoryKey) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryKey)) {
        newSet.delete(categoryKey);
      } else {
        newSet.add(categoryKey);
      }
      return newSet;
    });
  };

  const handleSelectPaymentMethod = (paymentMethod) => {
    setField("opsiPembayaran", paymentMethod);
    setIsOpsiPembayaranModalOpen(false);
  };

  const handleValidateFleetOrder = () => {
    const isValidForm = validateForm();
    if (isValidForm) {
      setIsModalConfirmationOpen(true);
    }
  };

  const handleOrderFleet = () => {
    alert("Hore Berhasil Sewa Armada :)");
    setIsModalConfirmationOpen(false);
    // ambil order id dari response API create order
    router.push("/daftarpesanan/detailpesanan/1");
  };

  const selectedOpsiPembayaran = opsiPembayaran
    ? paymentMethods
        .flatMap((method) => method.methods || [])
        .find((item) => item.id === opsiPembayaran.id)
    : null;

  return (
    <>
      <Card className="shadow-muat flex w-[338px] flex-col gap-6 rounded-xl border-none bg-white">
        <div className="flex flex-col gap-y-6 px-5 pt-6">
          <h3 className="text-base font-bold text-black">
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
            {/* Nanti ganti dengan kondisi kalo sdh ada detail pesanan */}
            {true ? (
              <>
                <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                  Detail Pesanan
                </span>
                {detailPesanan.map(({ title, items }, key) => (
                  <div className="flex flex-col gap-y-3" key={key}>
                    <span className="text-[14px] font-semibold leading-[16.8px] text-neutral-900">
                      {title}
                    </span>
                    {items.map(({ label, cost }, key) => (
                      <div
                        className="flex items-center justify-between"
                        key={key}
                      >
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                          {label}
                        </span>
                        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                          {`Rp${cost.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>

        <div className="shadow-muat flex flex-col gap-y-6 rounded-b-xl px-5 py-6">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-black">Total</span>
            <span className="text-base font-bold text-black">
              {`Rp${currentTotal.toLocaleString("id-ID")}`}
            </span>
          </div>
          {jenisTruk &&
            (selectedOpsiPembayaran ? (
              <div className="flex flex-col gap-y-4">
                <button
                  className="flex h-8 items-center justify-between rounded-md border border-neutral-600 px-3"
                  onClick={() => setIsOpsiPembayaranModalOpen(true)}
                >
                  <div className="flex items-center gap-x-2">
                    <Image
                      src={selectedOpsiPembayaran.icon}
                      width={16}
                      height={16}
                      className="size-[16px] object-cover"
                      alt={selectedOpsiPembayaran.name}
                    />
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      {selectedOpsiPembayaran.name}
                    </span>
                  </div>
                  <IconComponent src="/icons/chevron-right.svg" />
                </button>
                <Button
                  variant="muatparts-primary"
                  onClick={handleValidateFleetOrder}
                >
                  Lanjut Pembayaran
                </Button>
              </div>
            ) : (
              <Button
                variant="muatparts-primary"
                onClick={() => setIsOpsiPembayaranModalOpen(true)}
              >
                Pilih Opsi Pembayaran
              </Button>
            ))}
        </div>
      </Card>

      {/* MODAL OPSI PEMBAYARAN */}
      <Modal
        open={isOpsiPembayaranModalOpen}
        onOpenChange={setIsOpsiPembayaranModalOpen}
        closeOnOutsideClick={false}
      >
        <ModalContent>
          <div className="flex flex-col gap-y-4 px-6 py-8">
            <div className="flex w-[424px] justify-center">
              <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Opsi Pembayaran
              </h1>
            </div>
            {/* Content Container */}
            <div className="mr-[-16px] flex max-h-[321px] flex-col overflow-y-auto pr-[11px]">
              {/* Section Title */}
              <h2 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                Semua Metode
              </h2>

              {/* Payment Options List */}
              {paymentMethods.map((paymentMethod, categoryKey) => {
                const isExpanded = expandedCategories.has(categoryKey);

                return (
                  <div key={categoryKey}>
                    <div
                      className="flex h-12 w-full cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3"
                      onClick={() => toggleSection(categoryKey)}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={paymentMethod.icon}
                          width={24}
                          height={24}
                          className="size-[24px] object-cover"
                          alt={paymentMethod.category}
                        />
                        <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                          {paymentMethod.category}
                        </span>
                      </div>
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        className={cn(
                          "transition-transform duration-300",
                          isExpanded ? "rotate-180" : "rotate-0"
                        )}
                      />
                    </div>

                    {/* Payment Method Options */}
                    <div
                      className={`w-full overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? "max-h-[calc(100vh_-_124px)] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col pl-8">
                        {paymentMethod.methods.map((option, optionKey) => (
                          <button
                            key={optionKey}
                            className="flex h-12 w-[392px] cursor-pointer items-center justify-between border-b border-neutral-400 px-0 py-3 hover:bg-neutral-50"
                            onClick={() => handleSelectPaymentMethod(option)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded border">
                                <Image
                                  src={option.icon}
                                  width={20}
                                  height={20}
                                  className="size-[20px] object-cover"
                                  alt={option.name}
                                />
                              </div>
                              <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                {option.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalContent>
      </Modal>

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
              type="text"
              placeholder="Cari Kode Voucher"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="h-[32px] w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3 pb-6">
            {loading ? (
              <div className="text-center text-sm text-gray-500">
                Memuat voucher...
              </div>
            ) : error ? (
              <div className="text-center text-sm text-red-500">
                Gagal memuat voucher.
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
                    usagePercentage={v.usage["globalPercentage"] || 0}
                    isOutOfStock={v.isOutOfStock || false}
                    startDate={formatShortDate(v.validFrom)}
                    endDate={formatDate(v.validTo)}
                    isActive={selectedVoucher?.id === v.id}
                    onSelect={() => handleVoucherSelect(v)}
                    validationError={validationErrors[v.id]}
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
