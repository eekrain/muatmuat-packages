"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import RadioButton from "@/components/Radio/RadioButton";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useSewaArmadaActions } from "@/store/Shipper/forms/sewaArmadaStore";

// Bank Item Component
const PaymentMethodItem = ({ method, isSelected, onSelect }) => {
  return (
    <div className="flex h-6 items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
          <ImageComponent
            src={method.icon}
            width={20}
            height={20}
            alt={`${method.name} logo`}
            className="object-contain"
          />
        </div>
        <span className="leading-[15.4px] flex-1 text-sm font-semibold text-neutral-900">
          {method.name}
        </span>
      </div>
      <RadioButton
        className="gap-0"
        value={method.id}
        checked={isSelected}
        onClick={({ value }) => onSelect(value)}
      />
    </div>
  );
};

const OpsiPembayaran = ({ paymentMethods }) => {
  const navigation = useResponsiveNavigation();

  const { setField } = useSewaArmadaActions();

  const [expandedCategories, setExpandedCategories] = useState(new Set([0])); // Initialize with first category expanded
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  const handlePaymentMethodSelect = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
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

  const handleSavePaymentMethod = () => {
    if (!selectedPaymentMethodId) {
      return toast.error("Metode pembayaran wajib dipilih");
    }
    setField("paymentMethodId", selectedPaymentMethodId);
    navigation.pop();
  };

  return (
    <FormResponsiveLayout
      title={{
        label: "Pilih Opsi Pembayaran",
      }}
    >
      <div className="flex flex-col gap-y-3 px-4 pt-3">
        {/* Container Utama */}
        {paymentMethods.map((paymentMethod, key) => {
          const isExpanded = expandedCategories.has(key);

          return (
            <div
              className={cn(
                "flex flex-col items-start",
                isExpanded ? "gap-3" : "gap-0"
              )}
              key={key}
            >
              {/* Header Section */}
              <div
                className="flex w-full cursor-pointer items-center gap-6 pb-3"
                onClick={() => toggleExpanded(key)}
              >
                <div className="flex flex-1 items-center gap-2">
                  <IconComponent src={paymentMethod.icon} size="medium" />
                  <span className="leading-[15.4px] flex-1 text-sm font-bold text-neutral-900">
                    {paymentMethod.category}
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
                  {paymentMethod.methods.map((method, key) => (
                    <div
                      className={`${paymentMethod.methods.length - 1 === key ? "" : "border-b border-b-neutral-400 pb-3"}`}
                      key={key}
                    >
                      <PaymentMethodItem
                        method={method}
                        isSelected={
                          selectedPaymentMethodId
                            ? selectedPaymentMethodId === method.id
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
          onClick={handleSavePaymentMethod}
          type="button"
        >
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default OpsiPembayaran;
