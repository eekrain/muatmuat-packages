import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { OrderStatusSummary } from "./components/OrderStatusSummary";

const RingkasanStatusPesananScreen = ({ dataStatusPesanan }) => {
  const navigation = useResponsiveNavigation();

  return (
    <FormResponsiveLayout
      title={{
        label: "Ringkasan Status Pesanan",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 bg-neutral-200">
        <OrderStatusSummary dataStatusPesanan={dataStatusPesanan} />
      </div>
    </FormResponsiveLayout>
  );
};
export default RingkasanStatusPesananScreen;
