"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import { useGetDriverDetail } from "@/services/Transporter/manajemen-driver/getDriverDetail";

import { Alert } from "@/components/Alert/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import PageTitle from "@/components/PageTitle/PageTitle";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const DetailRow = ({
  label,
  children,
  isLink = false,
  hasBorderBottom = false,
}) => (
  <div
    className={cn(
      "flex h-full w-full flex-row items-center justify-between pb-4 pt-4 first:pt-0 last:pb-0",
      hasBorderBottom && "border-b-[0.5px] border-neutral-600"
    )}
  >
    <p className="text-xs font-medium text-neutral-700">{label}</p>
    <div className={cn("text-sm font-semibold", isLink && "text-success-400")}>
      {children}
    </div>
  </div>
);

const Page = () => {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const { data: driverData, error, isLoading } = useGetDriverDetail(uuid);

  // Dynamic breadcrumb based on "from" parameter
  const getBreadcrumbData = () => {
    const base = [
      {
        name: t(
          "DriverDetailPage.breadcrumbManajemenDriver",
          {},
          "Manajemen Driver"
        ),
        href: "/manajemen-driver",
      },
    ];

    // Add intermediate breadcrumb based on where user came from
    if (from === "active") {
      base.push({
        name: t("DriverDetailPage.breadcrumbDriverAktif", {}, "Driver Aktif"),
        href: "/manajemen-driver?tab=active",
      });
    } else if (from === "inactive") {
      base.push({
        name: t(
          "DriverDetailPage.breadcrumbDriverNonaktif",
          {},
          "Driver Nonaktif"
        ),
        href: "/manajemen-driver?tab=inactive",
      });
    } else if (from === "process") {
      base.push({
        name: t(
          "DriverDetailPage.breadcrumbProsesPendaftaran",
          {},
          "Proses Pendaftaran"
        ),
        href: "/manajemen-driver?tab=process",
      });
    } else if (from === "archive") {
      base.push({
        name: t("DriverDetailPage.breadcrumbArsip", {}, "Arsip"),
        href: "/manajemen-driver?tab=archive",
      });
    } else if (from === "expired") {
      base.push({
        name: t(
          "DriverDetailPage.breadcrumbPerluPembaruanSIM",
          {},
          "Perlu Pembaruan SIM"
        ),
        href: "/manajemen-driver/expired",
      });
    }

    // Add current page
    base.push({
      name: t("DriverDetailPage.breadcrumbDetailDriver", {}, "Detail Driver"),
    });

    return base;
  };

  const breadCrumbData = getBreadcrumbData();

  const formatPhoneNumber = (phone) => {
    if (!phone) return "-";
    // Format phone number to 0821 2089 91231
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{5})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(date, "d MMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  if (isLoading)
    return (
      <div>
        {t("DriverDetailPage.loading", {}, "Loading driver details...")}
      </div>
    );
  if (error)
    return (
      <div>
        {t(
          "DriverDetailPage.errorLoadData",
          {},
          "Failed to load data. Please try again."
        )}
      </div>
    );

  if (!driverData)
    return (
      <div>
        {t("DriverDetailPage.noDriverData", {}, "No driver data found.")}
      </div>
    );

  // Build document rows
  const documentRows = [];

  // KTP
  const ktpDoc = driverData.documents?.find(
    (doc) => doc.documentType === "KTP"
  );
  if (ktpDoc) {
    documentRows.push(
      <DetailRow
        key="ktp-doc"
        label={t("DriverDetailPage.labelFotoKTP", {}, "Foto KTP")}
        isLink
      >
        <Link
          href={ktpDoc.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {ktpDoc.documentName}
        </Link>
      </DetailRow>
    );
  }

  // SIM B2 Umum
  documentRows.push(
    <DetailRow
      key="sim-expiry"
      label={t("DriverDetailPage.labelMasaSIMB2", {}, "Masa SIM B2 Umum")}
    >
      {formatDate(driverData.simExpiryDate)}
    </DetailRow>
  );

  const simDoc = driverData.documents?.find(
    (doc) => doc.documentType === "SIM_B2_UMUM"
  );
  if (simDoc) {
    documentRows.push(
      <DetailRow
        key="sim-doc"
        label={t("DriverDetailPage.labelFotoSIMB2", {}, "Foto SIM B2 Umum")}
        isLink
      >
        <Link
          href={simDoc.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {simDoc.documentName}
        </Link>
      </DetailRow>
    );
  }

  // Driver Photo
  if (driverData.profileImage) {
    documentRows.push(
      <DetailRow
        key="driver-photo"
        label={t("DriverDetailPage.labelFotoDriver", {}, "Foto Driver")}
      >
        <LightboxProvider
          images={[driverData.profileImage]}
          title={t("DriverDetailPage.titleFotoDriver", {}, "Foto Driver")}
          variant="square"
        >
          <LightboxPreview
            image={driverData.profileImage}
            alt={t("DriverDetailPage.altFotoDriver", {}, "Foto Driver")}
            index={0}
            className="aspect-square object-cover"
          />
        </LightboxProvider>
      </DetailRow>
    );
  }

  // Check if SIM is expiring soon
  const isSimExpiringSoon = () => {
    if (!driverData.simExpiryDate) return false;
    const expiryDate = new Date(driverData.simExpiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <div className="flex flex-col gap-4 pb-11 pt-6">
      <BreadCrumb data={breadCrumbData} />
      <PageTitle className="mb-0">
        {t("DriverDetailPage.titleDetailDriver", {}, "Detail Driver")}
      </PageTitle>

      {/* Warning Alert for expiring SIM */}
      {isSimExpiringSoon() && (
        <Alert size="big" variant="warning">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium">
              {t(
                "DriverDetailPage.alertSIMExpiringSoon",
                {},
                "Harap segera lakukan perpanjangan SIM untuk menghindari kendala operasional."
              )}
            </p>
          </div>
        </Alert>
      )}

      {/* Reject Alert */}
      {driverData.rejectReason && (
        <Alert size="big" variant="error">
          <div className="flex flex-col gap-1">
            <h1 className="text-xs font-bold">
              {t(
                "DriverDetailPage.alertVerificationRejectedTitle",
                {},
                "Verifikasi Data Driver Anda Ditolak!"
              )}
            </h1>
            <p className="text-xs font-medium">
              {t(
                "DriverDetailPage.alertVerificationRejectedReason",
                {},
                "Alasan verifikasi ditolak: {reason}",
                { reason: driverData.rejectReason }
              )}
            </p>
          </div>
        </Alert>
      )}

      <Card className="rounded-2xl border-none shadow-muat">
        <CardContent className="space-y-5 !p-6">
          {/* Driver Basic Info */}
          <div>
            <DetailRow
              hasBorderBottom={false}
              label={t("DriverDetailPage.labelNamaLengkap", {}, "Nama Lengkap")}
            >
              {driverData.name || "-"}
            </DetailRow>
            <DetailRow
              hasBorderBottom={false}
              label={t("DriverDetailPage.labelNoWhatsapp", {}, "No. Whatsapp")}
            >
              {formatPhoneNumber(driverData.phoneNumber)}
            </DetailRow>
          </div>

          {/* Documents Section */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="rounded-t-md bg-primary-50 px-6 hover:no-underline">
              <h3 className="font-semibold">
                {t(
                  "DriverDetailPage.sectionFileDanFotoDriver",
                  {},
                  "File dan Foto Driver"
                )}
              </h3>
              <IconComponent
                src="/icons/chevron-down.svg"
                className="h-5 w-5 transition-transform duration-300"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4">
                {documentRows.map((row, index) =>
                  React.cloneElement(row, {
                    hasBorderBottom: index < documentRows.length - 1,
                  })
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
