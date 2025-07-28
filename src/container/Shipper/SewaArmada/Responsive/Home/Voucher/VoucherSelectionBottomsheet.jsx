import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import VoucherCard from "@/components/Voucher/VoucherCard";
import VoucherEmptyState from "@/components/Voucher/VoucherEmptyState";
import VoucherSearchEmpty from "@/components/Voucher/VoucherSearchEmpty";
import { formatDate, formatShortDate } from "@/lib/utils/dateFormat";

export const VoucherSelectionBottomsheet = ({
  isOpen,
  onOpenChange,
  voucherList,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  filteredVouchers,
  tempSelectedVoucher,
  validationErrors,
  validatingVoucher,
  onConfirmVoucherSelection,
  onApplyVoucher,
  refetch,
}) => {
  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
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
                    onSelect={() => onConfirmVoucherSelection(v)}
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
              onClick={onApplyVoucher}
            >
              {tempSelectedVoucher ? "Terapkan" : "Lewati"}
            </Button>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
