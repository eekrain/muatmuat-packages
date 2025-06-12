"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import RadioButton from "@/components/Radio/RadioButton";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useSewaArmadaActions } from "@/store/forms/sewaArmadaStore";

// Bank Item Component
const BankItem = ({ bank, isSelected, onSelect }) => {
  return (
    <div className="flex h-6 items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
          <ImageComponent
            src={bank.icon}
            width={20}
            height={20}
            alt={`${bank.name} logo`}
            className="object-contain"
          />
        </div>
        <span className="flex-1 text-sm font-semibold leading-[15.4px] text-neutral-900">
          {bank.name}
        </span>
      </div>
      <RadioButton
        name="bankSelection"
        value={bank}
        checked={isSelected}
        onClick={({ checked, value }) => onSelect(value)}
      />
    </div>
  );
};

const OpsiPembayaran = () => {
  const params = useResponsiveRouteParams();
  const navigation = useResponsiveNavigation();

  const { setField } = useSewaArmadaActions();

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);

  const handleBankSelect = (bank) => {
    console.log("bank", bank);
    setSelectedBank(bank);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSaveOpsiPembayaran = () => {
    if (!selectedBank) {
      return toast.error("Metode pembayaran wajib dipilih");
    }
    setField("opsiPembayaran", selectedBank);
    navigation.pop();
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Pilih Opsi Pembayaran",
      }}
    >
      <div className="px-4 pt-3">
        {/* Container Utama */}
        <div className="flex flex-col items-start gap-3">
          {/* Header Section */}
          <div
            className="flex w-full cursor-pointer items-center gap-6 pb-3"
            onClick={toggleExpanded}
          >
            <div className="flex flex-1 items-center gap-2">
              <IconComponent
                src="/icons/transfer24.svg"
                width={24}
                height={24}
                className="text-[#461B02]"
              />
              <span className="flex-1 text-sm font-bold leading-[15.4px] text-neutral-900">
                Transfer Virtual Account
              </span>
            </div>
            <IconComponent
              src="/icons/chevron-down.svg"
              width={16}
              height={16}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Bank List Section */}
          <div
            className={`w-full overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "max-h-[calc(100vh_-_124px)] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-3 pl-8">
              {params.bankOptions.map((bank, key) => (
                <div
                  className={`${params.bankOptions.length - 1 === key ? "" : "border-b border-b-neutral-400 pb-3"}`}
                  key={key}
                >
                  <BankItem
                    bank={bank}
                    isSelected={
                      selectedBank ? selectedBank.id === bank.id : false
                    }
                    onSelect={handleBankSelect}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ResponsiveFooter>
        <Button
          variant="muatparts-primary"
          className="h-10 w-full"
          onClick={handleSaveOpsiPembayaran}
          type="button"
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default OpsiPembayaran;
