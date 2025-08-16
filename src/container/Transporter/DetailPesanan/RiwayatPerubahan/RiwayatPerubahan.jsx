import Card, { CardContent } from "@/components/Card/Card";

import CardRiwayatPerubahan from "./components/CardRiwayatPerubahan";
import RiwayatPerubahanHeader from "./components/RiwayatPerubahanHeader";

const RiwayatPerubahan = ({ dataOrderDetail }) => {
  return (
    <Card className="border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        <RiwayatPerubahanHeader />
        <CardRiwayatPerubahan shipmentData={dataOrderDetail} />
      </CardContent>
    </Card>
  );
};

export default RiwayatPerubahan;
