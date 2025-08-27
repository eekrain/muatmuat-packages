import PropTypes from "prop-types";

import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

// --- Function to get legality items from transporter data ---
const getLegalityItems = (transporter, t) => {
  // Use data from transporter prop with fallback to hardcoded data
  return [
    { type: "status", label: t("CompanyLegality.nib", {}, "NIB") },
    {
      type: "number",
      label: t("CompanyLegality.nibNumber", {}, "No. NIB"),
      value: transporter?.businessLicenseNumber || "9120000792674",
    },
    {
      type: "status",
      label: t("CompanyLegality.companyTaxId", {}, "NPWP Perusahaan"),
    },
    {
      type: "number",
      label: t("CompanyLegality.companyTaxIdNumber", {}, "No. NPWP Perusahaan"),
      value: transporter?.taxId || "0925429434070004",
    },
    {
      type: "status",
      label: t(
        "CompanyLegality.registrantId",
        {},
        "KTP Pendaftar/Pemegang Akun"
      ),
    },
    {
      type: "number",
      label: t(
        "CompanyLegality.registrantIdNumber",
        {},
        "No. KTP Pendaftar/Pemegang Akun"
      ),
      value: transporter?.ktpNumber || "01679765443368363",
    },
    {
      type: "status",
      label: t("CompanyLegality.foundingDeed", {}, "Cover Akta Pendirian"),
    },
    {
      type: "status",
      label: t(
        "CompanyLegality.foundingDecree",
        {},
        "SK Kemenkumham dari Akta Pendirian"
      ),
    },
    {
      type: "status",
      label: t("CompanyLegality.amendmentDeed", {}, "Cover Akta Perubahan"),
    },
    {
      type: "status",
      label: t(
        "CompanyLegality.amendmentDecree",
        {},
        "SK Kemenkumham dari Akta Perubahan"
      ),
    },
    {
      type: "status",
      label: t("CompanyLegality.standardCertificate", {}, "Sertifikat Standar"),
    },
  ];
};

/**
 * A reusable row component for displaying a single legality item.
 */
const LegalityRow = ({ label, value, type, isStriped }) => {
  const { t } = useTranslation();
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
              {t("CompanyLegality.verified", {}, "Terverifikasi")}
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
  const { t } = useTranslation();
  const legalityItems = getLegalityItems(transporter, t);

  return (
    <Card className="max-h-fit border-neutral-400 bg-white p-0">
      <div className="border-b border-neutral-200 px-6 py-4">
        <h2 className="text-xl font-bold text-neutral-900">
          {t("CompanyLegality.title", {}, "Legalitas Perusahaan")}
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
