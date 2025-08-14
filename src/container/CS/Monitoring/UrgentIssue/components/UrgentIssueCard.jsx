import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import { useFlexibleCountdown } from "@/hooks/use-countdown";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { useUpdateUrgentIssueStatus } from "@/services/CS/monitoring/urgent-issue/getUrgentIssues";

import CheckBoxGroup from "./CheckboxGroup";
import ModalUbahTransporter from "./ModalUbahTransporter";

export const UrgentIssueCard = ({
  data,
  statusTab,
  isDetailOpen,
  onToggleDetail,
}) => {
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
  }
  if (status?.toLowerCase() === "completed" || statusTab === "selesai") {
    statusDisplay = "selesai";
    buttonLabel = "Selesai";
  }

  const router = useRouter();
  const [showDetail, setShowDetail] = useState(false);
  const [isConfirmProccess, setIsConfirmProccess] = useState(false);
  const [isConfirmCompleted, setIsConfirmCompleted] = useState(false);
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [modalUbahTransporter, setModalUbahTransporter] = useState(false);
  const [showGroupSection, setShowGroupSection] = useState(false);

  // state untuk memicu update status
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
    router.push(`/daftarpesanan/detailpesanan/${orderId}`);
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

  const isCountDown = true;

  const { formatted, isNegative } = useFlexibleCountdown(
    new Date("2025-08-14T11:20:00"), // start time
    360 // durasi 6 menit (dalam detik)
  );

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
              Laporan Urgent Issue Melewati Batas Waktu
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
              alt="Logo Transporter"
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
                label="Tampilan Grup"
                checked={showGroupSection}
                onChange={(e) => setShowGroupSection(e.checked)}
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setShowHubungiModal(true)}
            variant="muattrans-primary"
          >
            Hubungi
          </Button>
        </div>
        <div className="border-b border-neutral-400 p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {statusDisplay !== "selesai" && (
                <NotificationDot
                  size="md"
                  color={status === "PROCESSING" ? "orange" : "red"}
                />
              )}
              <span className="text-xs font-bold text-neutral-900">
                {typeName}
              </span>
            </div>
            {isCountDown && (
              <BadgeStatus
                variant={isNegative ? "outlineWarning" : "outlineSecondary"}
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
              {vehiclePlateNumber || "-"}
            </span>{" "}
            {description ||
              "sudah harus sampai di lokasi muat dalam waktu 30 menit. Segera konfirmasi kepada driver untuk memperbarui status."}
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
                onClick={() => setModalUbahTransporter(true)}
                variant="muatparts-error-secondary"
              >
                Ubah Transporter
              </Button>
            </div>
          )}
        </div>
        {showGroupSection && (
          <>
            <div className="border-b border-neutral-400 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusDisplay !== "selesai" && (
                    <NotificationDot
                      size="md"
                      color={status === "PROCESSING" ? "orange" : "red"}
                    />
                  )}
                  <span className="text-xs font-bold text-neutral-900">
                    {typeName}
                  </span>
                </div>
                {isCountDown && (
                  <BadgeStatus
                    variant={isNegative ? "outlineWarning" : "outlineSecondary"}
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
                  {vehiclePlateNumber || "-"}
                </span>{" "}
                {description ||
                  "sudah harus sampai di lokasi muat dalam waktu 30 menit. Segera konfirmasi kepada driver untuk memperbarui status."}
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
                      if (statusDisplay === "baru") {
                        setIsConfirmProccess(true);
                      } else if (statusDisplay === "diproses") {
                        setIsConfirmCompleted(true);
                      }
                    }}
                    variant="muattrans-primary-secondary"
                  >
                    Ubah Transporter
                  </Button>
                </div>
              )}
            </div>
            <div className="border-b border-neutral-400 p-4 md:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {statusDisplay !== "selesai" && (
                    <NotificationDot
                      size="md"
                      color={status === "PROCESSING" ? "orange" : "red"}
                    />
                  )}
                  <span className="text-xs font-bold text-neutral-900">
                    {typeName}
                  </span>
                </div>
                {isCountDown && (
                  <BadgeStatus
                    variant={isNegative ? "outlineWarning" : "outlineSecondary"}
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
                  {vehiclePlateNumber || "-"}
                </span>{" "}
                {description ||
                  "sudah harus sampai di lokasi muat dalam waktu 30 menit. Segera konfirmasi kepada driver untuk memperbarui status."}
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
                      if (statusDisplay === "baru") {
                        setIsConfirmProccess(true);
                      } else if (statusDisplay === "diproses") {
                        setIsConfirmCompleted(true);
                      }
                    }}
                    variant="muattrans-primary-secondary"
                  >
                    Ubah Transporter
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        <ConfirmationModal
          isOpen={isConfirmCompleted}
          setIsOpen={setIsConfirmCompleted}
          appear
          description={{
            text: (
              <span className="leading-tight">
                Apakah kamu yakin ingin menyelesaikan urgent issue pesanan{" "}
                {orderCode}?
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
                Apakah kamu yakin ingin memproses urgent issue pesanan{" "}
                {orderCode}?
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

        {/* <Modal
          open={hubungiModalOpen === "contact"}
          onOpenChange={setHubungiModalOpen}
        >
          <ModalContent className="w-modal-big" type="muattrans">
            <ModalHeader
              size="small"
              onClose={() => setHubungiModalOpen(null)}
            />
            <div className="space-y-2 px-6 pb-6 pt-9 text-center">
              <p className="text-sm font-bold text-black">
                Anda Ingin Menghubungi Via
              </p>
              <p className="text-xs font-semibold leading-tight text-[#868686]">
                Anda dapat memilih menghubungi melalui pilihan berikut
              </p>
            </div>
            <div
              className="mx-auto mb-9 flex w-max cursor-pointer items-center justify-start gap-4 rounded-md border border-[#EBEBEB] px-6 py-4 text-left"
              onClick={() => setShowHubungiModal(true)}
            >
              <IconComponent
                src="/icons/call20.svg"
                width={24}
                height={24}
                className="mr-2 inline-block text-primary-700"
              />
              <div>
                <p className="text-sm font-semibold text-primary-700">
                  No. Telepon/Whatsapp
                </p>
                <p className="text-xs font-medium text-[#868686]">
                  Anda langsung terhubung dengan Whatsapp
                </p>
              </div>
            </div>
          </ModalContent>
        </Modal> */}

        {/* HubungiModal integration */}
        <HubungiModal
          isOpen={showHubungiModal}
          onClose={() => setShowHubungiModal(false)}
          transporterData={null} // TODO: pass actual transporter data if available
        />

        <ModalUbahTransporter
          open={modalUbahTransporter}
          onClose={() => setModalUbahTransporter(false)}
        />
      </div>
    </>
  );
};
