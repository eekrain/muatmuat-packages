import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverStatus } from "./components/DriverStatus";
import { OrderLegends } from "./components/OrderLegends";

const OrderSummaryScreen = () => {
  const navigation = useResponsiveNavigation();

  return (
    <FormResponsiveLayout
      title={{
        label: "Ringkasan Status Pesanan",
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <OrderLegends />
        <DriverStatus />
      </div>
    </FormResponsiveLayout>
  );
};
export default OrderSummaryScreen;
