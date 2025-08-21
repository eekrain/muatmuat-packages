import PropTypes from "prop-types";

import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// --- Function to get legality items from transporter data ---
const getLegalityItems = (transporter) => {
  // Use data from transporter prop with fallback to hardcoded data
  return [
    { type: "status", label: "NIB" },
    {
      type: "number",
      label: "No. NIB",
      value: transporter?.businessLicenseNumber || "9120000792674",
    },
    { type: "status", label: "NPWP Perusahaan" },
    {
      type: "number",
      label: "No. NPWP Perusahaan",
      value: transporter?.taxId || "0925429434070004",
    },
    { type: "status", label: "KTP Pendaftar/Pemegang Akun" },
    {
      type: "number",
      label: "No. KTP Pendaftar/Pemegang Akun",
      value: transporter?.ktpNumber || "01679765443368363",
    },
    { type: "status", label: "Cover Akta Pendirian" },
    { type: "status", label: "SK Kemenkumham dari Akta Pendirian" },
    { type: "status", label: "Cover Akta Perubahan" },
    { type: "status", label: "SK Kemenkumham dari Akta Perubahan" },
    { type: "status", label: "Sertifikat Standar" },
  ];
};

/**
 * A reusable row component for displaying a single legality item.
 */
const LegalityRow = ({ label, value, type, isStriped }) => {
  return (
    <div
      className={cn(
        // Container utama tetap flex row untuk menjaga tampilan
        "flex items-center justify-start px-6 py-4",
        isStriped && "bg-neutral-100"
      )}
    >
      {/* Kolom pertama untuk label */}
      <div className="w-1/3">
        <span className="text-sm font-medium text-neutral-600">{label}</span>
      </div>

      {/* Kolom kedua untuk value atau status */}
      <div className="w-2/3">
        {type === "status" ? (
          <div className="flex items-center gap-2">
            <IconComponent
              src="/icons/verified-green.svg"
              alt="Verified"
              width={16}
              height={16}
            />
            <span className="text-sm font-semibold text-green-600">
              Terverifikasi
            </span>
          </div>
        ) : (
          <span className="text-sm font-semibold text-neutral-900">
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * The main component that displays the company's legality information.
 */
const CompanyLegality = ({ transporter }) => {
  const legalityItems = getLegalityItems(transporter);

  return (
    <Card className="max-h-fit border-neutral-400 bg-white p-0">
      <div className="border-b border-neutral-200 px-6 py-4">
        <h2 className="text-xl font-bold text-neutral-900">
          Legalitas Perusahaan
        </h2>
      </div>
      <div className="divide-y divide-neutral-200">
        {legalityItems.map((item, index) => (
          <LegalityRow
            key={`${item.label}-${index}`}
            label={item.label}
            value={item.value}
            type={item.type}
            // Stripped pattern: baris genap (0, 2, 4, dst) mendapat background
            isStriped={index % 2 === 0}
          />
        ))}
      </div>
    </Card>
  );
};

CompanyLegality.propTypes = {
  transporter: PropTypes.object,
};

export default CompanyLegality;
