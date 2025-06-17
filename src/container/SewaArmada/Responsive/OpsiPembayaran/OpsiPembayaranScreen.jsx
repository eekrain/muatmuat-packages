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
        <span className="flex-1 text-[14px] font-semibold leading-[15.4px] text-neutral-900">
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

  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const handlePaymentMethodSelect = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const toggleExpanded = (categoryKey) => {
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

  const handleSaveOpsiPembayaran = () => {
    if (!selectedPaymentMethod) {
      return toast.error("Metode pembayaran wajib dipilih");
    }
    setField("opsiPembayaran", selectedPaymentMethod);
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
        {params.paymentMethods.map((paymentMethod, key) => {
          const isExpanded = expandedCategories.has(key);

          return (
            <div className="flex flex-col items-start gap-3" key={key}>
              {/* Header Section */}
              <div
                className="flex w-full cursor-pointer items-center gap-6 pb-3"
                onClick={() => toggleExpanded(key)}
              >
                <div className="flex flex-1 items-center gap-2">
                  <IconComponent src={paymentMethod.icon} size="medium" />
                  <span className="flex-1 text-[14px] font-bold leading-[15.4px] text-neutral-900">
                    {paymentMethod.title}
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
                  {paymentMethod.options.map((option, optionKey) => (
                    <div
                      className={`${paymentMethod.options.length - 1 === optionKey ? "" : "border-b border-b-neutral-400 pb-3"}`}
                      key={optionKey}
                    >
                      <BankItem
                        bank={option}
                        isSelected={
                          selectedPaymentMethod
                            ? selectedPaymentMethod.id === option.id
                            : false
                        }
                        onSelect={handlePaymentMethodSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
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
