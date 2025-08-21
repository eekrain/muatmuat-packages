import { useParams } from "next/navigation";
import { useMemo } from "react";

import { AlertMultiline } from "@/components/Alert/AlertMultiline";
import { useGetOrderAlertsCS } from "@/services/CS/monitoring/detail-pesanan-cs/getOrderAlertCS";

export const Alert = () => {
  const params = useParams();
  const { data } = useGetOrderAlertsCS(params.orderId);

  const alertItems = useMemo(
    () =>
      data?.map((item) => {
        if (item?.type === "TRANSPORTER_CANCEL_ORDER") {
          return {
            label: item?.label,
            button: {
              onClick: () => alert("anjay"),
              label: "Lihat Alasan Pembatalan",
            },
          };
        }
        if (item?.type === "TRANSPORTER_CHANGE_ARMADA") {
          return {
            label: item?.label,
            button: {
              onClick: () => alert("anjay"),
              label: "Lihat Perubahan",
            },
          };
        }

        return { label: item?.label };
      }) || [],
    [data]
  );

  return (
    <div className="">
      <AlertMultiline items={alertItems} className="mt-6" />

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};
