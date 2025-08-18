import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { useUpdateUrgentIssueStatus } from "@/services/Transporter/monitoring/getUrgentIssues";

export const UrgentIssueCardTransporter = ({
  data,
  statusTab,
  isDetailOpen,
  onToggleDetail,
}) => {
  const { t } = useTranslation();
  const {
    id,
    typeName,
    detectedAt,
    vehiclePlateNumber,
    description,
    orderCode,
    status,
    completedAt,
    orderId,
  } = data || {};

  let statusDisplay = "baru";
  let buttonLabel = "Proses";
  if (status?.toLowerCase() === "processing" || statusTab === "proses") {
    statusDisplay = "diproses";
    buttonLabel = "Selesai";
  } else if (status?.toLowerCase() === "completed" || statusTab === "selesai") {
    statusDisplay = "selesai";
    buttonLabel = "Selesai";
  } else {
    buttonLabel = "Proses";
  }

  const router = useRouter();
  const [showDetail, setShowDetail] = useState(false);
  const [isConfirmProccess, setIsConfirmProccess] = useState(false);
  const [isConfirmCompleted, setIsConfirmCompleted] = useState(false); // state untuk memicu update status

  const [updateParams, setUpdateParams] = useState({ id: null, body: null });

  const { message, isLoading, isError } = useUpdateUrgentIssueStatus(
    updateParams.id,
    updateParams.body
  );

  useEffect(() => {
    if (!updateParams.id || !updateParams.body) return;
    console.log("message;", message);

    if (message?.Code === 200) {
      toast.success(
        `Urgent issue pesanan ${orderCode} berhasil ${
          updateParams.body.status === "PROCESSING"
            ? "diproses"
            : "diselesaikan"
        }`
      );
    } else if (isError) {
      toast.error(
        `Urgent issue pesanan ${orderCode} gagal ${
          updateParams.body.status === "PROCESSING"
            ? "diproses"
            : "diselesaikan"
        }`
      );
    }
  }, [message, isError, updateParams, orderCode]);

  const handleClickOrder = (orderId) => {
    router.push(`/monitoring/${orderId}/detail-pesanan?urgent-issue`);
  };

  const handleConfirmStatus = (status) => {
    setUpdateParams({
      id,
      body: {
        status,
        timestamp: new Date().toISOString(),
        notes:
          status === "PROCESSING"
            ? t(
                "UrgentIssueCardTransporter.noteProcessing",
                {},
                "Urgent issue sedang ditangani"
              )
            : t(
                "UrgentIssueCardTransporter.noteCompleted",
                {},
                "Urgent issue sudah selesai"
              ),
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
    toast.success(
      t(
        "UrgentIssueCardTransporter.toastVehicleClick",
        {},
        "Testing click vehicle"
      )
    );
    alert(
      t(
        "UrgentIssueCardTransporter.alertVehicleClick",
        {},
        "Testing click vehicle"
      )
    );
  };

  return (
    <div className="rounded-lg border border-neutral-400 bg-white p-4 md:p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {statusDisplay !== "selesai" && (
            <NotificationDot
              size="md"
              color={status === "PROCESSING" ? "orange" : "red"}
            />
          )}
          <span className="text-xs font-bold text-neutral-900">{typeName}</span>
        </div>
        <span className="ml-2 whitespace-nowrap text-xs font-medium text-neutral-500">
          {formatDate(detectedAt)}
        </span>
      </div>
      <div className="mt-2 text-xs font-medium leading-[20px] text-neutral-600">
        {(() => {
          // Get translation string, but replace vehiclePlateNumber with styled span
          const desc =
            description ||
            "sudah harus sampai di lokasi muat dalam waktu 30 menit. Segera konfirmasi kepada driver untuk memperbarui status.";
          // If translation returns a string, split and replace plate number
          const plate = vehiclePlateNumber || "-";
          // Try to find and replace only the plate number
          const text = t(
            "UrgentIssueCardTransporter.vehicleDescription",
            {
              vehiclePlateNumber: plate,
              description: desc,
            },
            `Armada ${plate} ${desc}`
          );
          // Replace only the first occurrence of plate number with styled span
          // const parts = text.split(plate);
          return (
            <>
              Armada
              <span
                className="cursor-pointer text-primary-800"
                onClick={handleClickVehiclePlateNumber}
              >
                {plate}
              </span>
              {description}
            </>
          );
        })()}
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
              "UrgentIssueCardTransporter.buttonViewDetail",
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
            {t("UrgentIssueCardTransporter.statusCompleted", {}, "Selesai")}
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
                  {t(
                    "UrgentIssueCardTransporter.labelOrderNumber",
                    {},
                    "No. Pesanan"
                  )}
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
                    "UrgentIssueCardTransporter.labelReportDate",
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
                  "UrgentIssueCardTransporter.labelDateProcessed",
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
              {t("UrgentIssueCardTransporter.buttonHide", {}, "Sembunyikan")}
              <IconComponent
                src="/icons/chevron-up.svg"
                alt="chevron up"
                width={16}
                height={16}
                className="text-primary-700"
              />
            </button>
            <BadgeStatus variant="success" className="w-max text-xs">
              {t("UrgentIssueCardTransporter.statusCompleted", {}, "Selesai")}
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
                {t(
                  "UrgentIssueCardTransporter.labelOrderNumber",
                  {},
                  "No. Pesanan"
                )}
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
              if (statusDisplay === "baru") {
                setIsConfirmProccess(true);
              } else if (statusDisplay === "diproses") {
                setIsConfirmCompleted(true);
              }
            }}
            className="mt-2 h-[32px] min-w-[112px] rounded-full bg-muat-trans-primary-400 px-6 py-3 text-sm font-semibold text-muat-trans-secondary-900"
          >
            {t(
              statusDisplay === "diproses"
                ? "UrgentIssueCardTransporter.buttonComplete"
                : "UrgentIssueCardTransporter.buttonProcess",
              {},
              buttonLabel
            )}
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmCompleted}
        setIsOpen={setIsConfirmCompleted}
        appear
        description={{
          text: (
            <span className="leading-tight">
              {t(
                "UrgentIssueCardTransporter.modalDescriptionComplete",
                { orderCode },
                `Apakah kamu yakin ingin menyelesaikan urgent issue pesanan ${orderCode}?`
              )}
            </span>
          ),
        }}
        cancel={{
          text: t("UrgentIssueCardTransporter.buttonCancel", {}, "Tidak"),
          onClick: () => setIsConfirmCompleted(false),
          classname: "!w-[112px]",
        }}
        confirm={{
          text: t("UrgentIssueCardTransporter.buttonConfirm", {}, "Ya"),
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
                "UrgentIssueCardTransporter.modalDescriptionProcess",
                { orderCode },
                `Apakah kamu yakin ingin memproses urgent issue pesanan ${orderCode}?`
              )}
            </span>
          ),
        }}
        cancel={{
          text: t("UrgentIssueCardTransporter.buttonCancel", {}, "Tidak"),
          onClick: () => setIsConfirmProccess(false),
          classname: "!w-[112px]",
        }}
        confirm={{
          text: t("UrgentIssueCardTransporter.buttonConfirm", {}, "Ya"),
          onClick: () => handleConfirmProccess(),
          classname: "!w-[112px]",
        }}
      />
    </div>
  );
};
