import Card, { CardContent } from "@/components/Card/Card";

import CardRiwayatPerubahan from "./components/CardRiwayatPerubahan";
import RiwayatPerubahanHeader from "./components/RiwayatPerubahanHeader";

const RiwayatPerubahan = ({ dataOrderDetail }) => {
  return (
    <Card className="rounded-xl border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        <RiwayatPerubahanHeader />
        <CardRiwayatPerubahan dataOrderDetail={dataOrderDetail} />
      </CardContent>
    </Card>
  );
};

export default RiwayatPerubahan;
