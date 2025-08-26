import DataEmpty from "@/components/DataEmpty/DataEmpty";
import Loading from "@/components/Loading/LoadingStatic";
import { useGetDocumentStatus } from "@/services/CS/monitoring/detail-pesanan-cs/getDocumentStatus";

import {
  AdditionalServiceCard,
  DocumentStatusOverview,
  ShipmentDetailCard,
} from "./DocumentStatusCard";

/**
 * Tab component for displaying document status information
 * @param {{
 * orderId: string
 * }} props
 */
export const TabStatusDokumen = ({ orderId }) => {
  const {
    data: documentData,
    isLoading,
    error,
    mutate,
  } = useGetDocumentStatus(
    orderId,
    {},
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const handleRefresh = () => {
    mutate();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <DataEmpty
          title="Gagal memuat data"
          description="Terjadi kesalahan saat memuat status dokumen"
          buttonText="Coba Lagi"
          onButtonClick={handleRefresh}
        />
      </div>
    );
  }

  if (!documentData || Object.keys(documentData).length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <DataEmpty
          title="Tidak ada data status dokumen"
          description="Status dokumen untuk pesanan ini belum tersedia"
          buttonText="Refresh"
          onButtonClick={handleRefresh}
        />
      </div>
    );
  }

  const { documentStatus, shipments = [], additionalService } = documentData;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Document Status Overview */}
      {documentStatus && (
        <DocumentStatusOverview documentStatus={documentStatus} />
      )}

      {/* Shipment Details */}
      {shipments.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-neutral-900">
            Riwayat Pengiriman ({shipments.length})
          </h2>
          {shipments.map((shipment, index) => (
            <ShipmentDetailCard
              key={shipment.shipmentId || index}
              shipment={shipment}
            />
          ))}
        </div>
      )}

      {/* Additional Service */}
      {additionalService && (
        <AdditionalServiceCard additionalService={additionalService} />
      )}

      {/* Refresh Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleRefresh}
          className="rounded-lg bg-blue-50 px-6 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};
