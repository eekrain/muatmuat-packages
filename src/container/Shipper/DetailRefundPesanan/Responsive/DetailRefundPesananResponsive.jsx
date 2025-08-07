import DetailPengembalianDana from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/DetailPengembalianDana";
import Legend from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/Legend";
import RefundStatusTimeline from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/RefundStatusTimeline";
import RekeningPengembalianDana from "@/container/Shipper/DetailRefundPesanan/Responsive/sections/RekeningPengembalianDana";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";

const DetailRefundPesananResponsive = ({
  refundData,
  waitingTimeData = [],
}) => {
  // Extract data from API response
  const bank = refundData?.bankAccount;
  const breakdown = refundData?.refundBreakdown;

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Refund",
      }}
    >
      <div className="flex flex-col gap-y-2 bg-neutral-200">
        <Legend />
        <RefundStatusTimeline refundData={refundData} />
        <RekeningPengembalianDana bank={bank} />
        <DetailPengembalianDana
          breakdown={breakdown}
          waitingTimeData={waitingTimeData}
        />
      </div>
    </FormResponsiveLayout>
  );
};

export default DetailRefundPesananResponsive;
