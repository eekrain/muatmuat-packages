// referensi : https://www.figma.com/design/qVy9QwWNBWov4ZLrogzLiG/-Transporter---Monitoring-Alternate---Web?node-id=827-101729&t=NgdDLUIPMZQKBhuh-4
import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

import AlertProsesCariArmada from "./components/AlertProsesCariArmada";
import AlertResponPerubahan from "./components/AlertResponPerubahan";

const DetailPesananHeader = ({ dataOrderDetail, activeTab }) => {
  // Nanti disesuaikan Lagi
  const pathname = usePathname();

  const segments = pathname.replace(/\/+$/, "").split("/");
  const root = `/${segments[1] || ""}`;
  const isMonitoring = root === "/monitoring";
  const router = useRouter();
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
          ].includes(dataOrderDetail?.orderStatus) ? (
            <Button
              variant="muattrans-primary-secondary"
              iconLeft="/icons/download16.svg"
              onClick={() => {}}
            >
              Unduh DO
            </Button>
          ) : null}
          {[
            // Referensi: LDN-333
            // Harusnya Ada Case Button "unduh Batalkan" Pesanan tidak muncul untuk SCHEDULED_FLEET. referensi :
            ORDER_STATUS.SCHEDULED_FLEET,
            // Referensi: LDN-334
            ORDER_STATUS.NEED_ASSIGN_FLEET,
            // Referensi: LDN-336
            ORDER_STATUS.NEED_CONFIRMATION_READY,
            // Referensi: LDN-337
            // ORDER_STATUS.NEED_CHANGE_RESPONSE,
          ].includes(dataOrderDetail?.orderStatus) &&
            dataOrderDetail?.orderStatus !== ORDER_STATUS.HEADING_TO_LOADING &&
            dataOrderDetail?.orderStatus !==
              ORDER_STATUS.DOCUMENT_PREPARATION &&
            dataOrderDetail?.orderStatus !== ORDER_STATUS.DOCUMENT_DELIVERY &&
            dataOrderDetail?.orderStatus !== ORDER_STATUS.COMPLETED &&
            dataOrderDetail?.orderStatus !==
              ORDER_STATUS.CANCELLED_BY_TRANSPORTER &&
            dataOrderDetail?.orderStatus !==
              ORDER_STATUS.CANCELLED_BY_SHIPPER &&
            dataOrderDetail?.orderStatus !==
              ORDER_STATUS.CANCELLED_BY_SYSTEM && (
              <Button variant="muatparts-error-secondary" onClick={() => {}}>
                Batalkan Pesanan
              </Button>
            )}
        </div>
      </div>

      {dataOrderDetail?.orderStatus === ORDER_STATUS.NEED_CHANGE_RESPONSE && (
        <AlertResponPerubahan />
      )}

      {/* Referensi: LDN-12.2 */}
      {/* kondisi muncul masih perlu disesuaikan */}
      {dataOrderDetail?.orderStatus === ORDER_STATUS.WAITING_CHANGE_FLEET && (
        <AlertProsesCariArmada />
      )}
    </div>
  );
};

export default DetailPesananHeader;
