import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// --- Mock Data ---
const legalityItems = [
  { type: "status", label: "NIB" },
  { type: "number", label: "No. NIB", value: "9120000792674" },
  { type: "status", label: "NPWP Perusahaan" },
  { type: "number", label: "No. NPWP Perusahaan", value: "0925429434070004" },
  { type: "status", label: "KTP Pendaftar/Pemegang Akun" },
  {
    type: "number",
    label: "No. KTP Pendaftar/Pemegang Akun",
    value: "01679765443368363",
  },
  { type: "status", label: "Cover Akta Pendirian" },
  { type: "status", label: "SK Kemenkumham dari Akta Pendirian" },
  { type: "status", label: "Cover Akta Perubahan" },
  { type: "status", label: "SK Kemenkumham dari Akta Perubahan" },
  { type: "status", label: "Sertifikat Standar" },
];

/**
 * A reusable row component for displaying a single legality item.
 */
const LegalityRow = ({ label, value, type, isStriped }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4",
        isStriped && "bg-neutral-100" // Background abu-abu untuk baris bergantian
      )}
    >
      <span className="text-sm font-medium text-neutral-600">{label}</span>

      {type === "status" ? (
        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/check-circle-green.svg"
            alt="Verified"
            width={16}
            height={16}
          />
          <span className="text-sm font-semibold text-green-600">
            Terverifikasi
          </span>
        </div>
      ) : (
        <span className="text-sm font-semibold text-neutral-900">{value}</span>
      )}
    </div>
  );
};

/**
 * The main component that displays the company's legality information.
 */
const CompanyLegality = () => {
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

export default CompanyLegality;
