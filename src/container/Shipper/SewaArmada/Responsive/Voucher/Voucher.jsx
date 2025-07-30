import { useEffect, useRef, useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const VoucherBottomSheet = ({
  isBottomsheetVoucherOpen,
  setIsBottomsheetVoucherOpen,
}) => {
  const voucherId = useSewaArmadaStore((state) => state.formValues.voucherId);
  const { setField } = useSewaArmadaActions();
  const previousIsBottomsheetOpen = usePrevious(isBottomsheetVoucherOpen);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] = useState(null);

  // Mock data for vouchers - in a real app, this would come from an API
  const [vouchers] = useState([
    {
      id: "v1",
      code: "DISKONPENGIRIMAN",
      discount: "Diskon 50%, maks. potongan Rp100.000",
      minTransaction: "Min. Transaksi Rp300.000",
      daysLeft: 3,
    },
    {
      id: "v2",
      code: "DISKONPENGIRIMAN",
      discount: "Diskon 50%, maks. potongan Rp100.000",
      minTransaction: "Min. Transaksi Rp300.000",
      daysLeft: 3,
    },
    {
      id: "v3",
      code: "DISKONPENGGUNABARUU",
      discount: "Diskon 50%, maks. potongan Rp100.000",
      minTransaction: "Min. Transaksi Rp300.000",
      daysLeft: 14,
    },
  ]);

  useEffect(() => {
    if (isBottomsheetVoucherOpen && !previousIsBottomsheetOpen) {
      // Reset search and set temporary selected voucher based on store value
      setSearchQuery("");
      setTempSelectedVoucher(vouchers.find((v) => v.id === voucherId) || null);
    }
  }, [
    isBottomsheetVoucherOpen,
    previousIsBottomsheetOpen,
    voucherId,
    vouchers,
  ]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectVoucher = (voucher) => {
    setTempSelectedVoucher(
      voucher.id === tempSelectedVoucher?.id ? null : voucher
    );
  };

  const handleApplyVoucher = () => {
    setField("voucherId", tempSelectedVoucher?.id || null);
    setIsBottomsheetVoucherOpen(false);
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BottomSheet
      open={isBottomsheetVoucherOpen}
      onOpenChange={setIsBottomsheetVoucherOpen}
    >
      <div className="flex flex-col gap-y-3">
        <button
          className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-3"
          onClick={() => setIsBottomsheetVoucherOpen(true)}
        >
          <IconComponent src="/icons/voucher16.svg" />
          <span className="text-sm font-semibold leading-[15.4px]">
            {voucherId ? (
              <span className="text-neutral-900">
                {vouchers.find((v) => v.id === voucherId)?.code ||
                  "Pilih Voucher"}
              </span>
            ) : (
              <span className="text-neutral-600">Pilih Voucher</span>
            )}
          </span>
        </button>
      </div>

      <BottomSheetContent>
        <BottomSheetHeader>Pilih Voucher</BottomSheetHeader>
        <div className="flex h-[380px] w-full flex-col gap-4 overflow-y-auto bg-white px-4 py-6">
          {/* Search field */}
          <div className="relative flex items-center rounded-md border border-neutral-400">
            <div className="absolute left-3">
              <IconComponent src="/icons/search16.svg" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari Kode Voucher"
              className="h-10 w-full rounded-md bg-transparent pl-10 pr-3 text-sm outline-none"
            />
          </div>

          {/* Voucher selection note */}
          <p className="text-xs font-medium text-neutral-600">
            Hanya bisa dipilih 1 Voucher
          </p>

          {/* Voucher list */}
          <div className="flex flex-col gap-y-4">
            {filteredVouchers.length > 0 ? (
              filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="relative rounded-md border border-neutral-400 p-3"
                >
                  <div className="absolute right-0 top-0">
                    <div className="flex h-[18px] items-center rounded-bl-md rounded-tr-md bg-primary-100 px-2">
                      <span className="text-xxs font-medium text-primary-500">
                        {voucher.daysLeft > 3
                          ? `Sisa ${voucher.daysLeft} hari lagi`
                          : `Berakhir ${voucher.daysLeft} hari lagi`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex gap-x-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100">
                        <IconComponent src="/icons/voucher16.svg" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900">
                          {voucher.code}
                        </span>
                        <ul className="mt-1">
                          <li className="flex items-center gap-x-1">
                            <div className="h-1 w-1 rounded-full bg-neutral-900"></div>
                            <span className="text-xs font-medium text-neutral-900">
                              {voucher.discount}
                            </span>
                          </li>
                          <li className="flex items-center gap-x-1">
                            <div className="h-1 w-1 rounded-full bg-neutral-900"></div>
                            <span className="text-xs font-medium text-neutral-900">
                              {voucher.minTransaction}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button
                      className={`h-8 rounded-md px-3 text-xs font-semibold ${
                        tempSelectedVoucher?.id === voucher.id
                          ? "bg-primary-500 text-white"
                          : "border border-primary-500 text-primary-500"
                      }`}
                      onClick={() => handleSelectVoucher(voucher)}
                    >
                      Pakai
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <IconComponent
                  src="/icons/empty-search.svg"
                  className="h-12 w-12"
                />
                <p className="mt-4 text-sm font-medium text-neutral-600">
                  Voucher tidak ditemukan
                </p>
              </div>
            )}
          </div>

          {/* Apply button */}
          <Button
            variant="muatparts-primary"
            className="h-10 max-w-full"
            onClick={handleApplyVoucher}
          >
            Terapkan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default VoucherBottomSheet;
