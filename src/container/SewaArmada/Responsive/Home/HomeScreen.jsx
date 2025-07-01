import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { Shield, Truck } from "lucide-react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import { TimelineField } from "@/components/Timeline/timeline-field";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import usePrevious from "@/hooks/use-previous";
import { useSWRHook } from "@/hooks/use-swr";
import { useVouchers } from "@/hooks/useVoucher";
import DefaultResponsiveLayout from "@/layout/ResponsiveLayout/DefaultResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";
import { useLocationFormStore } from "@/store/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

import { BannerCarousel } from "../../../../components/BannerCarousel/BannerCarousel";
import { ModalFirstTimer } from "./ModalFirstTimer";
import WaktuMuatBottomsheet from "./WaktuMuat/WaktuMuat";

const SewaArmadaHomeScreen = () => {
  const navigation = useResponsiveNavigation();
  const { formValues } = useSewaArmadaStore();
  const { addLokasi, removeLokasi } = useSewaArmadaActions();

  const isShowCostDetail = true; // nanti pakek usestate

  const handleEditInformasiMuatan = () => {
    navigation.push("/InformasiMuatan");
  };

  const handleEditLayananTambahan = () => {
    navigation.push("/LayananTambahan");
  };
  console.log("hihi", isShowCostDetail);

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
  let { vouchers: voucherList, loading, error } = useVouchers(token);
  const MOCK_EMPTY = false;

  if (MOCK_EMPTY && !loading && !error) {
    voucherList = [];
  }
  const [isBottomsheetOpen, setIsBottomsheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // Added this to store the final selected voucher
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetOpen);
  const [validationErrors, setValidationErrors] = useState({});
  useEffect(() => {
    if (isBottomsheetOpen && !previousIsBottomsheetOpen) {
      // Reset search when bottomsheet opens
      setSearchQuery("");
      // Set temp selected voucher to current selected voucher when opening
      setTempSelectedVoucher(selectedVoucher);
    }
  }, [isBottomsheetOpen, previousIsBottomsheetOpen, selectedVoucher]);

  // Handle voucher selection (temporary selection in the bottomsheet)
  const handleSelectVoucher = (voucher) => {
    setTempSelectedVoucher(
      voucher.id === tempSelectedVoucher?.id ? null : voucher
    );
  };

  // Apply selected voucher (confirm selection when closing the bottomsheet)
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
        // labelAlertVoucherMTExpired
        // labelAlertVoucherMTMinimumOrder
        // labelAlertVoucherMTKuotaHabis
        if (validationMessage == "labelAlertVoucherMTExpired") {
          console.log("err expired");
          validationMessage = "labelAlertVoucherMTExpired";
        } else if (validationMessage == "labelAlertVoucherMTMinimumOrder") {
          console.log("err order");
          validationMessage = `Minimal Transaksi ${idrFormat(voucher.minOrderAmount)}
          `;
        } else if (validationMessage == "labelAlertVoucherMTKuotaHabis") {
          console.log("err qty");
          validationMessage = "labelAlertVoucherMTKuotaHabis";
        }

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
  // Filter voucherList based on search query
  const filteredVouchers =
    voucherList?.filter((voucher) =>
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  useEffect(() => {
    console.log("voucherList:", voucherList);
  }, [voucherList]);
  /* end voucher */
  return (
    <DefaultResponsiveLayout mode="default">
      <div
        className={`w-full bg-neutral-100 ${isShowCostDetail ? "mb-[100px]" : ""}`}
      >
        <BannerCarousel banners={banners} showControls={false} />

        {/* Brand Section */}
        <div className="my-2 flex h-[61px] w-full items-center justify-between gap-[29px] bg-white px-4 py-3">
          <div className="flex-1">
            <h2 className="text-[16px] font-semibold leading-[17.6px] text-[#461B02]">
              Ayo kirim muatan kamu dengan muatrans!
            </h2>
          </div>
          <div className="flex w-[123px] flex-col items-end gap-1">
            <img
              src="/icons/muattrans.svg"
              alt="muatrans"
              className="h-4 w-20"
            />
            {/* <div className="flex h-4 w-20 items-center justify-center rounded bg-gradient-to-r from-blue-600 to-yellow-500 text-xs font-bold text-white">
              muatrans
            </div> */}
            <p className="text-right text-[10px] font-semibold leading-[10px] text-[#461B02]">
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
            <TimelineField
              variant="muat"
              className="flex-1"
              values={
                formValues.lokasiMuat?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiMuat", null)}
              onDeleteLocation={(index) => removeLokasi("lokasiMuat", index)}
              onEditLocation={(index) => {
                const params = {
                  formMode: "muat",
                  allSelectedLocations: formValues.lokasiMuat,
                  defaultValues: formValues.lokasiMuat[index],
                  index,
                };
                navigation.push("/PencarianLokasi", {
                  config: {
                    ...params,
                    afterLocationSelected: () => {
                      navigation.push("/FormLokasiBongkarMuat", {
                        config: {
                          ...params,
                        },
                        layout: {
                          title: "Lokasi Muat",
                        },
                      });
                    },
                    validateLokasiOnSelect: (selectedAddress) => {
                      const error = validateLokasiOnSelect(
                        "muat",
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
                    title: "Cari Lokasi Muat",
                  },
                });
              }}
            />
          </FormContainer>
          {/* Lokasi Bongkar Field */}
          <FormContainer>
            <FormLabel required>Lokasi Bongkar</FormLabel>
            <TimelineField
              variant="bongkar"
              className="flex-1"
              values={
                formValues.lokasiBongkar?.map(
                  (item) => item?.dataLokasi?.location || null
                ) || []
              }
              onAddLocation={() => addLokasi("lokasiBongkar", null)}
              onDeleteLocation={(index) => removeLokasi("lokasiBongkar", index)}
              onEditLocation={(index) => {
                const params = {
                  formMode: "bongkar",
                  allSelectedLocations: formValues.lokasiBongkar,
                  defaultValues: formValues.lokasiBongkar[index],
                  index,
                };
                navigation.push("/PencarianLokasi", {
                  config: {
                    ...params,
                    afterLocationSelected: () => {
                      navigation.push("/FormLokasiBongkarMuat", {
                        config: {
                          ...params,
                        },
                        layout: {
                          title: "Lokasi Bongkar",
                        },
                      });
                    },
                    validateLokasiOnSelect: (selectedAddress) => {
                      const error = validateLokasiOnSelect(
                        "bongkar",
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
                    title: "Cari Lokasi Bongkar",
                  },
                });
              }}
            />
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
                <span className="max-w-[256px] truncate text-[14px] font-semibold leading-[15.4px]">
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
          <FormContainer>
            <FormLabel required>Jenis Armada</FormLabel>
            <div className="space-y-2">
              {/* Pilih Jenis Carrier */}
              <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-200 px-3 py-2">
                <Truck className="h-4 w-4 text-neutral-600" />
                <span className="flex-1 text-[14px] font-semibold text-neutral-600">
                  Pilih Jenis Carrier
                </span>
                <svg
                  className="h-4 w-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Pilih Jenis Truk */}
              <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-200 px-3 py-2">
                <Truck className="h-4 w-4 text-neutral-600" />
                <span className="flex-1 text-[14px] font-semibold text-neutral-600">
                  Pilih Jenis Truk
                </span>
                <svg
                  className="h-4 w-4 text-neutral-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </FormContainer>

          {/* Asuransi Barang Field */}
          <FormContainer>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                  Asuransi Barang
                </span>
                <span className="text-[10px] font-semibold text-neutral-900">
                  (Opsional)
                </span>
              </div>
              <span className="cursor-pointer text-[12px] font-semibold text-primary-700">
                Ubah Asuransi
              </span>
            </div>
            <div className="flex h-8 w-full items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2">
              <Shield className="h-4 w-4 text-neutral-700" />
              <span className="flex-1 text-[14px] font-semibold text-neutral-900">
                Gratis perlindungan hingga Rp10.000.000
              </span>
            </div>
          </FormContainer>

          {/* Layanan Tambahan Field */}
          <FormContainer>
            <FormLabel required={false}>Layanan Tambahan</FormLabel>
            <button
              className={
                "flex h-8 items-center justify-between rounded-md border border-neutral-600 bg-neutral-50 px-3"
              }
              onClick={handleEditLayananTambahan}
            >
              <div className="flex items-center gap-x-2">
                <IconComponent src="/icons/muatan16.svg" />
                <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-600">
                  Layanan Tambahan
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          </FormContainer>
        </div>
      </div>
      {/*
  <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
          Total Biaya
        </span>
        <span className="text-[14px] font-bold leading-[15.4px] text-neutral-900">
          Rp1.123.233
        </span>
      </div>
            <Button
        variant="muatparts-primary-secondary"
        className="flex-1"
        onClick={() => {}}
        type="button"
      >
        Lihat Detail Biaya
      </Button>
      
  */}

      {isShowCostDetail ? (
        <ResponsiveFooter className="z-[1000] flex flex-col gap-y-4">
          {/* Total Biaya section with integrated voucher */}
          <div className="flex w-full flex-col rounded bg-primary-50">
            {/* Voucher section inside Total Biaya div - conditionally rendered based on bottomsheet state */}
            {!isBottomsheetOpen && (
              <div
                className="flex cursor-pointer items-center justify-between p-[12px]"
                onClick={() => setIsBottomsheetOpen(true)}
              >
                <div className="flex items-center">
                  <Image
                    src="/img/iconVoucher2.png"
                    alt="Voucher"
                    width={25}
                    height={25}
                  />
                  <span className="ml-[12px] text-sm font-medium text-blue-600">
                    Makin hemat pakai voucher
                  </span>
                  <Image
                    src="/icons/right-arrow-voucher.png"
                    width={18}
                    height={18}
                    alt="right-arrow"
                  />
                </div>
              </div>
            )}
          </div>

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
        <BottomSheetContent>
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
                className="h-10 w-full rounded-md bg-transparent pl-10 pr-3 text-[14px] outline-none"
                disabled={!voucherList || voucherList.length === 0}
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
            <p className="text-[12px] font-medium text-neutral-600">
              Hanya bisa dipilih 1 Voucher
            </p>

            {/* Voucher list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-[14px] font-medium text-neutral-600">
                    Memuat voucher...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <span className="text-[14px] font-medium">
                    Gagal memuat voucher.
                  </span>
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
                      usagePercentage={v.usage["globalPercentage"] || 0}
                      isOutOfStock={v.isOutOfStock || false}
                      startDate={formatShortDate(v.validFrom)}
                      endDate={formatDate(v.validTo)}
                      isActive={selectedVoucher?.id === v.id}
                      onSelect={() => handleVoucherSelect(v)}
                      validationError={validationErrors[v.id]}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Apply button */}
          </div>
        </BottomSheetContent>
      </BottomSheet>

      {/* Display selected voucher if any */}
      {selectedVoucher && (
        <div className="mt-2 rounded-md bg-blue-50 p-2 text-sm">
          <div className="font-medium">Voucher applied:</div>
          <div>{selectedVoucher.code}</div>
          <div>
            Discount: Rp{selectedVoucher.discountAmount?.toLocaleString()}
          </div>
        </div>
      )}

      <ModalFirstTimer />
    </DefaultResponsiveLayout>
  );
};
export default SewaArmadaHomeScreen;
