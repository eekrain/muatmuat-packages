import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { getShipperContact } from "@/services/CS/monitoring/urgent-issue/getShipperContact";
import { useUpdateUrgentIssueStatus } from "@/services/CS/monitoring/urgent-issue/getUrgentIssues";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import NotificationDot from "@/components/NotificationDot/NotificationDot";

import { useTranslation } from "@/hooks/use-translation";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";

import CheckBoxGroup from "./CheckboxGroup";
import ModalTransporterMenolakPerubahan from "./ModalTransporterMenolakPerubahan";
import ModalUbahTransporter from "./ModalUbahTransporter";

export const UrgentIssueCard = ({
  data,
  statusTab,
  isDetailOpen,
  onToggleDetail,
  meta,
}) => {
  const {
    id,
    detectedAt,
    vehiclePlateNumber,
    description,
    orderCode,
    status,
    completedAt,
    orderId,
    issue_type,
    countdown,
  } = data || {};

  // =================== ALL HOOKS AT THE TOP ===================
  const { t } = useTranslation();
  const router = useRouter();
  const [isConfirmProccess, setIsConfirmProccess] = useState(false);
  const [isConfirmCompleted, setIsConfirmCompleted] = useState(false);
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [hubungiContacts, setHubungiContacts] = useState(null);
  const [modalUbahTransporter, setModalUbahTransporter] = useState(false);
  const [selectedIssueData, setSelectedIssueData] = useState(null);
  const [showGroupSection, setShowGroupSection] = useState(false);
  const [updateParams, setUpdateParams] = useState({ id: null, body: null });
  const [remainingTime, setRemainingTime] = useState(countdown);
  const [showTransporterMenolakModal, setShowTransporterMenolakModal] =
    useState(false);

  const openTransporterMenolakModal = useCallback(() => {
    setShowTransporterMenolakModal(true);
  }, []);

  const { message, isError } = useUpdateUrgentIssueStatus(
    updateParams.id,
    updateParams.body
  );

  useEffect(() => {
    if (!updateParams.id || !updateParams.body) return;
    if (message?.Code === 200) {
      toast.success(
        `Urgent issue pesanan ${orderCode} berhasil ${
          updateParams.body.status === "PROCESSING"
            ? "diproses"
            : "diselesaikan"
        }`
      );
      setUpdateParams({ id: null, body: null });
    } else if (isError) {
      toast.error(
        `Urgent issue pesanan ${orderCode} gagal ${
          updateParams.body.status === "PROCESSING"
            ? "diproses"
            : "diselesaikan"
        }`
      );
      setUpdateParams({ id: null, body: null });
    }
  }, [message, isError, updateParams, orderCode]);

  useEffect(() => {
    if (!countdown || countdown <= 0) {
      setRemainingTime(0);
      return;
    }
    setRemainingTime(countdown);
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [countdown]);
  // ==========================================================

  // Early return after all hooks are called
  if (typeof t !== "function") {
    return null;
  }

  const isCountDown = true;
  const isNegative =
    Array.isArray(meta?.overdue_issues) && meta.overdue_issues.includes(id);

  let statusDisplay = t("UrgentIssueCard.statusNew", {}, "baru");
  if (status?.toLowerCase() === "processing" || statusTab === "proses") {
    statusDisplay = t("UrgentIssueCard.statusProcessing", {}, "diproses");
  }
  if (status?.toLowerCase() === "completed" || statusTab === "selesai") {
    statusDisplay = t("UrgentIssueCard.statusCompleted", {}, "selesai");
  }

  const handleClickOrder = (orderId) => {
    router.push(`/monitoring/urgent-issue/${orderCode}/detail-pesanan`);
  };

  const handleConfirmStatus = (status) => {
    setUpdateParams({
      id,
      body: {
        status,
        timestamp: new Date().toISOString(),
        notes:
          status === "PROCESSING"
            ? "Urgent issue sedang ditangani"
            : "Urgent issue sudah selesai",
      },
    });

    if (status === "PROCESSING") {
      setIsConfirmProccess(false);
    } else {
      setIsConfirmCompleted(false);
    }
  };

  const handleConfirmProccess = () => handleConfirmStatus("PROCESSING");
  const handleConfirmCompleted = () => handleConfirmStatus("COMPLETED");

  const handleClickVehiclePlateNumber = () => {
    toast.success("Testing click vehicle");
    alert("Testing click vehicle");
  };

  const issues = data?.issues || [];
  const mainIssue = data;
  // Sort groupIssues: overdue issues first
  let groupIssues = issues.slice(1);
  if (Array.isArray(meta?.overdue_issues)) {
    groupIssues = groupIssues.slice().sort((a, b) => {
      const aIsNegative = meta.overdue_issues.includes(a.id);
      const bIsNegative = meta.overdue_issues.includes(b.id);
      if (aIsNegative === bIsNegative) return 0;
      return aIsNegative ? -1 : 1;
    });
  }

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds <= 0) {
      return "00:00";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const formatted = formatTime(remainingTime);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-lg border bg-white",
          isNegative ? "border-error-400" : "border-neutral-400"
        )}
      >
        {isNegative && (
          <div className="flex items-center justify-center gap-2 rounded-t-md bg-error-400 px-2 py-1">
            <IconComponent
              src="/icons/warning.svg"
              alt="warning"
              width={16}
              height={16}
              className="text-error-50"
            />
            <p className="text-xs font-semibold text-error-50">
              {t(
                "UrgentIssueCard.alertExceededTimeLimit",
                {},
                "Laporan Urgent Issue Melewati Batas Waktu"
              )}
            </p>
          </div>
        )}
        <div
          className={cn(
            "flex items-center justify-between gap-2 border-b px-3 py-4",
            isNegative
              ? "border-error-400 bg-error-50"
              : "border-neutral-400 bg-neutral-100"
          )}
        >
          <div className="flex items-center gap-2">
            <img
              src={data?.transporter?.logo || "/img/muatan1.png"}
              alt={t(
                "UrgentIssueCard.imageAltTransporterLogo",
                {},
                "Logo Transporter"
              )}
              className="h-10 w-10 rounded-full border-[1.25px] border-neutral-400 object-cover"
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                {data?.transporter?.name
                  ? data.transporter.name.length > 27
                    ? `${data.transporter.name.slice(0, 27)}...`
                    : data.transporter.name
                  : "-"}
              </p>
              <CheckBoxGroup
                label={t(
                  "UrgentIssueCard.checkboxLabelGroupView",
                  {},
                  "Tampilan Grup"
                )}
                checked={showGroupSection}
                onChange={(e) => setShowGroupSection(e.checked)}
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={async () => {
              const shipperId = data?.transporter?.id || "uuid";
              const contactRes = await getShipperContact(shipperId);
              const contacts = {
                pics: (contactRes.data.picContacts || []).map((pic, idx) => ({
                  name: pic.name,
                  position: pic.position,
                  phoneNumber: pic.phone,
                  Level: idx + 1,
                })),
                emergencyContact: {
                  name: contactRes.data.emergencyContact?.name,
                  position:
                    contactRes.data.emergencyContact?.relationship ||
                    "Emergency Contact",
                  phoneNumber: contactRes.data.emergencyContact?.phone,
                },
                companyContact: contactRes.data.primaryContact?.phone,
              };
              setHubungiContacts(contacts);
              setShowHubungiModal(true);
            }}
            variant="muattrans-primary"
          >
            {t("UrgentIssueCard.buttonContact", {}, "Hubungi")}
          </Button>
        </div>
        <div className="border-b border-neutral-400 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusDisplay !== "selesai" && (
                <NotificationDot
                  size="md"
                  color={
                    statusDisplay === "baru"
                      ? "red"
                      : statusDisplay === "diproses"
                        ? "orange"
                        : "red"
                  }
                />
              )}
              <span className="text-xs font-bold text-neutral-900">
                {issue_type === "FLEET_NOT_READY"
                  ? "Armada Tidak Siap Untuk Muat"
                  : issue_type === "FLEET_NOT_MOVING"
                    ? "Armada Tidak Bergerak Menuju Lokasi"
                    : issue_type === "POTENTIAL_DRIVER_LATE"
                      ? "Potensi Driver Terlambat Muat"
                      : issue_type}
              </span>
            </div>
            {(statusDisplay === "baru" || statusDisplay === "diproses") &&
              isCountDown && (
                <BadgeStatus
                  variant={isNegative ? "outlineWarning" : "outlineSecondary"}
                  className="w-max text-sm font-semibold"
                >
                  {isNegative ? `-${formatted}` : formatted}
                </BadgeStatus>
              )}

            {/* Tampilkan tanggal laporan masuk hanya di bubble selesai */}
            {statusDisplay === "selesai" && (
              <div className="text-xs font-medium text-neutral-600">
                {detectedAt ? formatDate(detectedAt) : "-"}
              </div>
            )}
          </div>
          <div className="mt-2 text-xs font-medium leading-[20px] text-neutral-600">
            {t("UrgentIssueCard.labelFleet", {}, "Armada")}{" "}
            <span
              onClick={() => handleClickVehiclePlateNumber()}
              className="font-medium text-primary-700 hover:cursor-pointer"
            >
              {data?.vehicle?.plate_number || vehiclePlateNumber || "-"}
            </span>{" "}
            {description}
          </div>
          {data?.rejection_count > 0 && (
            <div
              className="mt-1 text-xs font-medium text-primary-700 hover:cursor-pointer"
              onClick={openTransporterMenolakModal}
            >
              {data?.rejection_count} Transporter Menolak Perubahan Armada
            </div>
          )}

          {showTransporterMenolakModal && (
            <ModalTransporterMenolakPerubahan
              // transporter={data?.transporter}
              // detail={data?.detail}
              // latestNote={data?.latestNote}
              onClose={() => setShowTransporterMenolakModal(false)}
            />
          )}

          <div className="my-3 h-px w-full bg-neutral-400" />
          {/* Selesai - Lihat Detail */}
          {statusDisplay === "selesai" && !isDetailOpen && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:cursor-pointer"
                onClick={onToggleDetail}
              >
                Lihat Detail
                <IconComponent
                  src="/icons/chevron-down.svg"
                  alt="chevron up"
                  width={16}
                  height={16}
                  className="text-primary-700"
                />
              </button>
              <BadgeStatus variant="success" className="w-max text-xs">
                Selesai
              </BadgeStatus>
            </div>
          )}
          {/* Selesai - Detail */}
          {statusDisplay === "selesai" && isDetailOpen && (
            <div>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-[140px] items-center gap-2">
                  <IconComponent
                    src="/icons/document.svg"
                    alt="download"
                    width={20}
                    height={20}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-neutral-500">
                      {t("UrgentIssueCard.labelOrderNumber", {}, "No. Pesanan")}
                    </span>
                    <span
                      onClick={() => handleClickOrder(orderId)}
                      className="text-xs font-medium text-primary-700 hover:cursor-pointer"
                    >
                      {orderCode || "-"}
                    </span>
                  </div>
                </div>
                <div className="flex min-w-[170px] items-center gap-2">
                  <IconComponent
                    src="/icons/calendar16.svg"
                    alt="calendar"
                    width={20}
                    height={20}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-neutral-500">
                      {t(
                        "UrgentIssueCard.labelReportReceivedDate",
                        {},
                        "Tanggal Laporan Masuk"
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900">
                        {formatDate(detectedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/calendar16.svg"
                  alt="calendar"
                  width={20}
                  height={20}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-neutral-500">
                    {t(
                      "UrgentIssueCard.labelReportProcessedDate",
                      {},
                      "Tanggal Laporan Diproses"
                    )}
                  </span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {formatDate(completedAt)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:cursor-pointer"
                  onClick={onToggleDetail}
                >
                  {t("UrgentIssueCard.buttonHide", {}, "Sembunyikan")}
                  <IconComponent
                    src="/icons/chevron-up.svg"
                    alt="chevron up"
                    width={16}
                    height={16}
                    className="text-primary-700"
                  />
                </button>
                <BadgeStatus variant="success" className="w-max text-xs">
                  Selesai
                </BadgeStatus>
              </div>
            </div>
          )}
          {/* Baru & Proses */}
          {statusDisplay !== "selesai" && (
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/document.svg"
                  alt="download"
                  width={16}
                  height={16}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-neutral-500">
                    No. Pesanan
                  </span>
                  <span
                    onClick={() => handleClickOrder(orderId)}
                    className="text-xs font-medium text-primary-700 hover:cursor-pointer"
                  >
                    {orderCode || "-"}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setModalUbahTransporter(true);
                  setSelectedIssueData({
                    ...data,
                    selectedVehicleId: data?.vehicle?.id,
                  });
                }}
                variant="muattrans-primary-secondary"
              >
                Ubah Transporter
              </Button>
            </div>
          )}
        </div>
        {showGroupSection && groupIssues.length > 0 && (
          <>
            {groupIssues.map((issue, idx) => (
              <div key={idx} className="border-b border-neutral-400 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {statusDisplay !== "selesai" && (
                      <NotificationDot
                        size="md"
                        color={status === "PROCESSING" ? "orange" : "red"}
                      />
                    )}
                    <span className="text-xs font-bold text-neutral-900">
                      {issue.issue_type === "FLEET_NOT_READY"
                        ? "Armada Tidak Siap Untuk Muat"
                        : issue.issue_type === "FLEET_NOT_MOVING"
                          ? "Armada Tidak Bergerak Menuju Lokasi"
                          : issue.issue_type === "POTENTIAL_DRIVER_LATE"
                            ? "Potensi Driver Terlambat Muat"
                            : issue.issue_type}
                    </span>
                  </div>
                  {isCountDown && (
                    <BadgeStatus
                      variant={
                        isNegative ? "outlineWarning" : "outlineSecondary"
                      }
                      className="w-max text-sm font-semibold"
                    >
                      {isNegative ? `-${formatted}` : formatted}
                    </BadgeStatus>
                  )}
                </div>
                <div className="mt-2 text-xs font-medium leading-[20px] text-neutral-600">
                  Armada{" "}
                  <span
                    onClick={() => handleClickVehiclePlateNumber()}
                    className="font-medium text-primary-700 hover:cursor-pointer"
                  >
                    {issue?.vehicle?.plate_number || "-"}
                  </span>{" "}
                  {issue?.description}
                </div>
                <div className="my-3 h-px w-full bg-neutral-400" />
                {/* Selesai - Lihat Detail */}
                {statusDisplay === "selesai" && !isDetailOpen && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:cursor-pointer"
                      onClick={onToggleDetail}
                    >
                      {t(
                        "UrgentIssueCard.buttonViewDetails",
                        {},
                        "Lihat Detail"
                      )}
                      <IconComponent
                        src="/icons/chevron-down.svg"
                        alt="chevron up"
                        width={16}
                        height={16}
                        className="text-primary-700"
                      />
                    </button>
                    <BadgeStatus variant="success" className="w-max text-xs">
                      Selesai
                    </BadgeStatus>
                  </div>
                )}
                {/* Selesai - Detail */}
                {statusDisplay === "selesai" && isDetailOpen && (
                  <div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex min-w-[140px] items-center gap-2">
                        <IconComponent
                          src="/icons/document.svg"
                          alt="download"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-neutral-500">
                            No. Pesanan
                          </span>
                          <span
                            onClick={() => handleClickOrder(orderId)}
                            className="text-xs font-medium text-primary-700 hover:cursor-pointer"
                          >
                            {orderCode || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex min-w-[170px] items-center gap-2">
                        <IconComponent
                          src="/icons/calendar16.svg"
                          alt="calendar"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium text-neutral-500">
                            Tanggal Laporan Masuk
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-900">
                              {formatDate(detectedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <IconComponent
                        src="/icons/calendar16.svg"
                        alt="calendar"
                        width={20}
                        height={20}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-neutral-500">
                          Tanggal Laporan Diproses
                        </span>
                        <span className="text-xs font-semibold text-neutral-900">
                          {formatDate(completedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:cursor-pointer"
                        onClick={onToggleDetail}
                      >
                        Sembunyikan
                        <IconComponent
                          src="/icons/chevron-up.svg"
                          alt="chevron up"
                          width={16}
                          height={16}
                          className="text-primary-700"
                        />
                      </button>
                      <BadgeStatus variant="success" className="w-max text-xs">
                        Selesai
                      </BadgeStatus>
                    </div>
                  </div>
                )}
                {/* Baru & Proses */}
                {statusDisplay !== "selesai" && (
                  <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent
                        src="/icons/document.svg"
                        alt="download"
                        width={16}
                        height={16}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-neutral-500">
                          No. Pesanan
                        </span>
                        <span
                          onClick={() => handleClickOrder(orderId)}
                          className="text-xs font-medium text-primary-700 hover:cursor-pointer"
                        >
                          {orderCode || "-"}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        console.log("Vehicle ID clicked:", issue?.vehicle?.id);
                        setModalUbahTransporter(true);
                        setSelectedIssueData({
                          ...data,
                          selectedVehicleId: issue?.vehicle?.id, // Ganti dari data?.vehicle?.id ke issue?.vehicle?.id
                        });
                      }}
                      variant="muattrans-primary-secondary"
                    >
                      Ubah Transporter
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <ConfirmationModal
          isOpen={isConfirmCompleted}
          setIsOpen={setIsConfirmCompleted}
          appear
          description={{
            text: (
              <span className="leading-tight">
                {t(
                  "UrgentIssueCard.modalCompleteIssueDescription",
                  { orderCode },
                  "Apakah kamu yakin ingin menyelesaikan urgent issue pesanan {orderCode}?"
                )}
              </span>
            ),
          }}
          cancel={{
            text: "Tidak",
            onClick: () => setIsConfirmCompleted(false),
            classname: "!w-[112px]",
          }}
          confirm={{
            text: "Ya",
            onClick: () => handleConfirmCompleted(),
            classname: "!w-[112px]",
          }}
        />

        <ConfirmationModal
          isOpen={isConfirmProccess}
          setIsOpen={setIsConfirmProccess}
          appear
          description={{
            text: (
              <span className="leading-tight">
                {t(
                  "UrgentIssueCard.modalProcessIssueDescription",
                  { orderCode },
                  "Apakah kamu yakin ingin memproses urgent issue pesanan {orderCode}?"
                )}
              </span>
            ),
          }}
          cancel={{
            text: "Tidak",
            onClick: () => setIsConfirmProccess(false),
            classname: "!w-[112px]",
          }}
          confirm={{
            text: "Ya",
            onClick: () => handleConfirmProccess(),
            classname: "!w-[112px]",
          }}
        />

        {/* HubungiModal integration */}
        <HubungiModal
          isOpen={showHubungiModal}
          onClose={() => setShowHubungiModal(false)}
          contacts={hubungiContacts}
        />

        <ModalUbahTransporter
          open={modalUbahTransporter}
          onClose={() => setModalUbahTransporter(false)}
          issueData={selectedIssueData}
          selectedVehicleId={selectedIssueData?.selectedVehicleId}
        />
      </div>
    </>
  );
};
