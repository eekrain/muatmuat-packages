import Badge from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";

/**
 * A reusable row component for displaying information with an icon.
 * @param {{ iconSrc: string, children: React.ReactNode }} props
 */
const InfoRow = ({ iconSrc, children }) => (
  <div className="flex items-center gap-2 self-stretch">
    <IconComponent
      src={iconSrc}
      width={16}
      height={16}
      className="flex-shrink-0 text-[#461B02]"
    />
    <div className="flex-1 text-xs font-medium leading-tight text-black">
      {children}
    </div>
  </div>
);

/**
 * Component to display document status overview
 * @param {{
 * documentStatus: {
 *   overallStatus: string,
 *   isPrepared: boolean,
 *   isShipped: boolean,
 *   isReceived: boolean,
 *   preparedAt: string,
 *   shippedAt: string,
 *   receivedAt: string
 * }
 * }} props
 */
export const DocumentStatusOverview = ({ documentStatus }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      PREPARED: { text: "Disiapkan", variant: "warning" },
      SHIPPING: { text: "Dalam Pengiriman", variant: "info" },
      RECEIVED: { text: "Diterima", variant: "success" },
    };

    const config = statusConfig[status] || { text: status, variant: "default" };
    return <Badge text={config.text} variant={config.variant} />;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="box-border flex w-full max-w-[564px] flex-col items-start gap-4 rounded-xl border border-neutral-400 bg-white px-4 py-5">
      <div className="flex items-center justify-between self-stretch">
        <h3 className="text-sm font-bold text-neutral-900">Status Dokumen</h3>
        {getStatusBadge(documentStatus.overallStatus)}
      </div>

      <div className="flex flex-col gap-3 self-stretch">
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${documentStatus.isPrepared ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-xs font-medium">Disiapkan</span>
          <span className="ml-auto text-xs text-gray-500">
            {formatDateTime(documentStatus.preparedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${documentStatus.isShipped ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-xs font-medium">Dikirim</span>
          <span className="ml-auto text-xs text-gray-500">
            {formatDateTime(documentStatus.shippedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${documentStatus.isReceived ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-xs font-medium">Diterima</span>
          <span className="ml-auto text-xs text-gray-500">
            {formatDateTime(documentStatus.receivedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Component to display shipment details
 * @param {{
 * shipment: {
 *   trackingNumber: string,
 *   courier: string,
 *   status: string,
 *   sentAt: string,
 *   notes: string,
 *   receipt: object,
 *   photos: array
 * }
 * }} props
 */
export const ShipmentDetailCard = ({ shipment }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="box-border flex w-full max-w-[564px] flex-col items-start gap-4 rounded-xl border border-neutral-400 bg-white px-4 py-5">
      <h3 className="text-sm font-bold text-neutral-900">Detail Pengiriman</h3>

      <div className="flex flex-col items-start gap-2 self-stretch">
        <InfoRow iconSrc="/icons/package16.svg">
          Nomor Resi :
          <span className="text-xs font-semibold">
            {shipment.trackingNumber}
          </span>
        </InfoRow>

        <InfoRow iconSrc="/icons/transporter16.svg">
          Kurir :
          <span className="text-xs font-semibold">{shipment.courier}</span>
        </InfoRow>

        <InfoRow iconSrc="/icons/check-circle16.svg">
          Status :
          <span className="text-xs font-semibold">{shipment.status}</span>
        </InfoRow>

        <InfoRow iconSrc="/icons/calendar16.svg">
          Tanggal Kirim :
          <span className="text-xs font-semibold">
            {formatDateTime(shipment.sentAt)}
          </span>
        </InfoRow>

        {shipment.notes && (
          <InfoRow iconSrc="/icons/note16.svg">
            Catatan :
            <span className="text-xs font-medium">{shipment.notes}</span>
          </InfoRow>
        )}
      </div>

      {shipment.receipt && (
        <>
          <hr className="w-full border-gray-200" />
          <div className="flex flex-col items-start gap-2 self-stretch">
            <h4 className="text-xs font-bold text-neutral-900">
              Informasi Tanda Terima
            </h4>

            <InfoRow iconSrc="/icons/document16.svg">
              Nomor Tanda Terima :
              <span className="text-xs font-semibold">
                {shipment.receipt.receiptNumber}
              </span>
            </InfoRow>

            <InfoRow iconSrc="/icons/calendar16.svg">
              Estimasi Pengiriman :
              <span className="text-xs font-semibold">
                {new Date(
                  shipment.receipt.estimatedDeliveryDate
                ).toLocaleDateString("id-ID")}
              </span>
            </InfoRow>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Component to display additional service information
 * @param {{
 * additionalService: {
 *   serviceName: string,
 *   serviceFee: number,
 *   deliveryAddress: string,
 *   specialInstructions: string
 * }
 * }} props
 */
export const AdditionalServiceCard = ({ additionalService }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="box-border flex w-full max-w-[564px] flex-col items-start gap-4 rounded-xl border border-neutral-400 bg-white px-4 py-5">
      <h3 className="text-sm font-bold text-neutral-900">Layanan Tambahan</h3>

      <div className="flex flex-col items-start gap-2 self-stretch">
        <InfoRow iconSrc="/icons/service-plus.svg">
          Nama Layanan :
          <span className="text-xs font-semibold">
            {additionalService.serviceName}
          </span>
        </InfoRow>

        <InfoRow iconSrc="/icons/money16.svg">
          Biaya Layanan :
          <span className="text-xs font-semibold">
            {formatCurrency(additionalService.serviceFee)}
          </span>
        </InfoRow>

        <InfoRow iconSrc="/icons/location14.svg">
          Alamat Pengiriman :
          <span className="text-xs font-medium">
            {additionalService.deliveryAddress}
          </span>
        </InfoRow>

        {additionalService.specialInstructions && (
          <InfoRow iconSrc="/icons/note16.svg">
            Instruksi Khusus :
            <span className="text-xs font-medium">
              {additionalService.specialInstructions}
            </span>
          </InfoRow>
        )}
      </div>
    </div>
  );
};
