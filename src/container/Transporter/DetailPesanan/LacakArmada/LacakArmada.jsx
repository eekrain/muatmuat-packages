import Card, { CardContent } from "@/components/Card/Card";

import CardLacakArmada from "./components/CardLacakArmada";
import LacakArmadaHeader from "./components/LacakArmadaHeader";

const LacakArmada = ({ dataOrderDetail }) => {
  return (
    <Card className="border-none">
      <CardContent className="flex flex-col gap-y-6 p-6">
        <LacakArmadaHeader />
        <CardLacakArmada shipmentData={dataOrderDetail} />
      </CardContent>
    </Card>
  );
};

export default LacakArmada;
