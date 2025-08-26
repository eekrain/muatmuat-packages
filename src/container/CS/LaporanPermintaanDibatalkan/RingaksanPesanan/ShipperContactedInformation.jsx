import Card from "@/components/Card/Card";
import InfoItem from "@/container/CS/DetailTambahanBiaya/components/InfoItem";
import { formatDate } from "@/lib/utils/dateFormat";

const ShipperContactedInformation = ({ contactSummary, order }) => {
  return (
    <Card className="rounded-xl border-none">
      <div className="flex items-center gap-x-3 px-8 py-6">
        <InfoItem
          label="Telah Dihubungi Oleh"
          value={contactSummary.last_contacted_by || "-"}
        />
        <InfoItem
          label="Terakhir Dihubungi"
          value={formatDate(contactSummary.last_contacted_at)}
        />
        <InfoItem
          label="Jumlah Dihubungi"
          value={`${contactSummary.total_contacts || 0} Kali`}
        />
        {order.status === "COMPLETED" ? null : (
          <InfoItem
            label="Lama Belum Dibayarkan"
            value={`${contactSummary.days_unpaid} Hari`}
          />
        )}
      </div>
    </Card>
  );
};

export default ShipperContactedInformation;
