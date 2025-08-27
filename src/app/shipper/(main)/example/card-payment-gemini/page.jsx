"use client";

import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

// --- COMPONENT DEFINITIONS ---

// FIXED: Root is now a simple container. The layout logic is handled by the parent via props.
const Root = ({ children, className }) => (
  <div
    className={cn(
      "flex w-[338px] flex-col overflow-hidden rounded-xl bg-white drop-shadow-[0_4px_11px_rgba(65,65,65,0.25)] filter",
      className
    )}
  >
    {children}
  </div>
);

const Header = ({ children, className }) => (
  <div className={cn("px-5 pb-2 pt-6", className)}>
    <h1
      className={cn(
        "text-base font-bold leading-tight text-neutral-900",
        className
      )}
    >
      {children}
    </h1>
  </div>
);

const Body = ({ children, className }) => (
  <div className={cn("flex-1 overflow-y-auto pl-5 pr-3", className)}>
    <div className="flex flex-col gap-6 py-4 pr-1">{children}</div>
  </div>
);

const CollapsibleSection = ({
  title,
  children,
  className,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={toggleOpen}
        onKeyDown={(e) => e.key === "Enter" && toggleOpen()}
        role="button"
        tabIndex={0}
      >
        <h2 className="text-sm font-semibold leading-tight text-neutral-900">
          {title}
        </h2>
        <IconComponent
          src="/icons/chevron-up.svg"
          className={cn(
            "h-4 w-4 text-neutral-700 transition-transform duration-300",
            !isOpen && "rotate-180"
          )}
          alt="Toggle details visibility"
        />
      </div>
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, className }) => (
  <div className={cn("flex flex-col gap-3", className)}>
    <h2 className="text-sm font-semibold leading-tight text-neutral-900">
      {title}
    </h2>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const LineItem = ({
  label,
  value,
  children,
  variant,
  valueClassName,
  labelClassName,
}) => {
  const valueColorClass =
    variant === "danger" ? "text-error-400" : "text-neutral-900";
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <p
          className={cn(
            "w-full text-xs font-medium text-neutral-600",
            labelClassName
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "whitespace-nowrap text-right text-xs font-medium",
            valueColorClass,
            valueClassName
          )}
        >
          {value}
        </p>
      </div>
      {children}
    </div>
  );
};

const Footer = ({ children, className }) => (
  <div
    className={cn(
      "bg-white p-5 shadow-[0_-4px_11px_rgba(65,65,65,0.08)]",
      className
    )}
  >
    {children}
  </div>
);

const Total = ({ label = "Total", value, className }) => (
  <div className={cn("flex items-center justify-between", className)}>
    <p className="text-base font-bold text-neutral-900">{label}</p>
    <p className="text-base font-bold text-neutral-900">{value}</p>
  </div>
);

const CardPayment = {
  Root,
  Header,
  Body,
  CollapsibleSection,
  Section,
  LineItem,
  Footer,
  Total,
};

// --- EXAMPLE IMPLEMENTATION ---

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "Rp0";
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(absoluteAmount)
    .replace(/\s?IDR/g, "")
    .replace("Rp", "");

  return `${isNegative ? "-" : ""}Rp${formatted}`;
};

export default function PaymentSummaryPage() {
  const data = {
    paymentTime: "06 Jun 2024 19:00 WIB",
    paymentMethod: "BCA Virtual Account",
    transportFee: 950000,
    insuranceFee: 0,
    additionalHelpFee: 105000,
    total: 1077490,
  };

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-100 p-10">
      <div className="flex max-h-[453px] w-fit flex-col rounded-lg bg-[#F1F3F8] p-4">
        {/* FIXED: 
          - PaymentSummary.Root now uses flex-1 to take up available space.
          - min-h-0 is added to prevent its content from breaking the flex layout.
        */}
        <CardPayment.Root className="min-h-0 flex-1">
          <CardPayment.Header>Ringkasan Pembayaran</CardPayment.Header>
          <CardPayment.Body>
            <CardPayment.CollapsibleSection title="Detail Pesanan">
              <CardPayment.LineItem
                label="Waktu Pembayaran"
                value={data.paymentTime}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-neutral-600">
                  Opsi Pembayaran
                </p>
                <div className="flex items-center gap-2">
                  <IconComponent
                    src="/icons/logo-bca.svg"
                    width={16}
                    height={16}
                    alt="BCA Logo"
                  />
                  <span className="text-xs font-medium text-neutral-900">
                    {data.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-6 pt-3">
                <CardPayment.Section title="Biaya Pesan Jasa Angkut">
                  <CardPayment.LineItem
                    label="Nominal Pesan Jasa Angkut (1 Unit)"
                    value={formatCurrency(data.transportFee)}
                    labelClassName="max-w-[180px]"
                  />
                </CardPayment.Section>
                <CardPayment.Section title="Biaya Asuransi Barang">
                  <CardPayment.LineItem
                    label="Nominal Premi Asuransi (1 Unit)"
                    value={formatCurrency(data.insuranceFee)}
                    labelClassName="max-w-[180px]"
                  />
                </CardPayment.Section>
                <CardPayment.Section title="Biaya Layanan Tambahan">
                  <CardPayment.LineItem
                    label="Nominal Bantuan Tambahan"
                    value={formatCurrency(data.additionalHelpFee)}
                  />
                </CardPayment.Section>
              </div>
            </CardPayment.CollapsibleSection>
          </CardPayment.Body>
          <CardPayment.Footer>
            <CardPayment.Total value={formatCurrency(data.total)} />
          </CardPayment.Footer>
        </CardPayment.Root>

        {/* FIXED: 
          - Removed mt-auto and added flex-shrink-0 to ensure buttons have a fixed size.
        */}
        <div className="flex shrink-0 justify-end gap-2 pt-4">
          <button className="h-10 rounded-lg bg-neutral-300 px-6 py-2 text-sm font-bold text-neutral-700">
            Batal
          </button>
          <button className="h-10 rounded-lg bg-primary-700 px-6 py-2 text-sm font-bold text-white">
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
