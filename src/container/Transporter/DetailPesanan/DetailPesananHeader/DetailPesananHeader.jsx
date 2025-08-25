// referensi : https://www.figma.com/design/qVy9QwWNBWov4ZLrogzLiG/-Transporter---Monitoring-Alternate---Web?node-id=827-101729&t=NgdDLUIPMZQKBhuh-4
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cancelOrder } from "@/services/Transporter/daftar-pesanan/detail-pesanan/cancelOrder";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

import AlertProsesCariArmada from "./components/AlertProsesCariArmada";
import AlertResponPerubahan from "./components/AlertResponPerubahan";

// import { Modal, ModalContent, ModalHeader } from "@/components/Modal";
// import { ModalFooter } from "@/components/Modal/Modal";

const DetailPesananHeader = ({ dataOrderDetail, activeTab }) => {
  // Nanti disesuaikan Lagi
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isCancelling, setIsCancelling] = useState(false);
  // const [showCancelModal, setShowCancelModal] = useState(false);

  const segments = pathname.replace(/\/+$/, "").split("/");
  const root = `/${segments[1] || ""}`;
  const isMonitoring = root === "/monitoring";
  const router = useRouter();

  const handleCancelOrder = async () => {
    if (!dataOrderDetail?.orderId) {
      toast.error("Order ID tidak ditemukan");
      return;
    }

    setIsCancelling(true);
    // setShowCancelModal(false);

    try {
      const result = await cancelOrder(dataOrderDetail.orderId, {
        reason: "Dibatalkan oleh transporter",
      });

      if (result.success) {
        const invoiceNumber =
          dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
        toast.success(`Berhasil membatalkan pesanan ${invoiceNumber}`);

        // Refresh the page or redirect
        router.refresh();
      } else {
        toast.error(result.message || "Gagal membatalkan pesanan");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Terjadi kesalahan saat membatalkan pesanan");
    } finally {
      setIsCancelling(false);
    }
  };

  // const openCancelModal = () => {
  //   setShowCancelModal(true);
  // };

  // const closeCancelModal = () => {
  //   setShowCancelModal(false);
  // };

  // Calculate fleet replacement data
  const calculateFleetReplacementData = () => {
    const fleets = dataOrderDetail?.fleets || [];
    const totalFleets = fleets.length;

    // Count fleets that need replacement (those with fleetChangeStatus of PENDING, APPROVED, or COMPLETED)
    const fleetsNeedingReplacement = fleets.filter(
      (fleet) =>
        fleet.fleetChangeStatus &&
        ["PENDING", "APPROVED", "COMPLETED"].includes(fleet.fleetChangeStatus)
    ).length;

    // Count fleets with replacement found (those with APPROVED or COMPLETED status)
    const fleetsWithReplacementFound = fleets.filter(
      (fleet) =>
        fleet.fleetChangeStatus &&
        ["APPROVED", "COMPLETED"].includes(fleet.fleetChangeStatus)
    ).length;

    return {
      totalFleets,
      fleetsNeedingReplacement:
        fleetsNeedingReplacement > 0 ? fleetsNeedingReplacement : totalFleets,
      foundCount: fleetsWithReplacementFound,
    };
  };

  const fleetReplacementData = calculateFleetReplacementData();

  return (
    <div>
      <div className="flex h-6 items-center justify-between">
        <div className="flex items-center gap-x-3">
          <IconComponent
            onClick={() => router.back()}
            src="/icons/arrow-left24.svg"
            size="medium"
            className="text-primary-700"
          />
          <h1 className="text-xl font-bold text-neutral-900">Detail Pesanan</h1>
        </div>
        <div className="flex items-center gap-x-3">
          {[
            // Referensi: LDN-351
            // Harusnya Ada Case Button "unduh DO" tidak muncul untuk SCHEDULED_FLEET. Reference : LDZ-11.7
            ORDER_STATUS.SCHEDULED_FLEET,
            // Referensi: LDN-334
            ORDER_STATUS.NEED_ASSIGN_FLEET,
            // Referensi: LDN-336
            ORDER_STATUS.NEED_CONFIRMATION_READY,
            // Referensi: LDN-337
            ORDER_STATUS.NEED_CHANGE_RESPONSE,
            // Referensi: LDN-92
            ORDER_STATUS.LOADING,
            // Referensi : LDZ
            ORDER_STATUS.UNLOADING,
            // Referensi: LDG-7
            ORDER_STATUS.COMPLETED,
            ORDER_STATUS.HEADING_TO_LOADING,
            ORDER_STATUS.DOCUMENT_PREPARATION,
            ORDER_STATUS.DOCUMENT_DELIVERY,
            ORDER_STATUS.CONFIRMED,
          ].includes(dataOrderDetail?.orderStatus) ? (
            <Button
              variant="muattrans-primary-secondary"
              iconLeft="/icons/download16.svg"
              onClick={() => {}}
            >
              Unduh DO
            </Button>
          ) : null}
          {dataOrderDetail?.isCancellable && (
            <Button
              variant="muatparts-error-secondary"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              loading={isCancelling}
            >
              {isCancelling ? "Membatalkan..." : "Batalkan Pesanan"}
            </Button>
          )}
        </div>
      </div>

      {dataOrderDetail?.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
        <AlertResponPerubahan />
      )}

      {/* Referensi: LDN-12.2 */}
      {/* Referensi: LDN-29.1 */}
      {/* kondisi muncul masih perlu disesuaikan */}
      {dataOrderDetail?.orderStatus === ORDER_STATUS.CHANGE_FLEET && (
        <AlertProsesCariArmada
          fleetFound={true}
          fleetsNeedingReplacement={
            fleetReplacementData.fleetsNeedingReplacement
          }
          foundCount={fleetReplacementData.foundCount}
        />
      )}

      {/* Cancel Order Confirmation Modal */}
      {/* <Modal open={showCancelModal} onOpenChange={closeCancelModal}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold text-neutral-900">
              Konfirmasi Pembatalan Pesanan
            </h2>
          </ModalHeader>
          <div>
            <p className="text-sm text-neutral-600">
              Apakah Anda yakin ingin membatalkan pesanan{" "}
              <span className="font-semibold">
                {dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode}
              </span>
              ?
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div> {/* Tidak sesuai desain karena tidak ada desainnya, jadi kalau kamu dapat task ini tinggal sesuaikan saja*/}
      {/* <ModalFooter>
            <Button
              variant="muatparts-neutral-secondary"
              onClick={closeCancelModal}
              disabled={isCancelling}
            >
              Batal
            </Button>
            <Button
              variant="muatparts-error"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              loading={isCancelling}
            >
              {isCancelling ? "Membatalkan..." : "Ya, Batalkan Pesanan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default DetailPesananHeader;
