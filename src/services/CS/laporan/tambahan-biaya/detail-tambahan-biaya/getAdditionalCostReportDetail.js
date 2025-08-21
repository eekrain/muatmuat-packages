import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { OrderTypeEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { ORDER_STATUS } from "@/utils/CS/orderStatus";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      report: {
        id: "report-uuid",
        order: {
          code: "MT-2025-001",
          status: ORDER_STATUS.COMPLETED,
          fleet_count: 3,
          model: OrderTypeEnum.SCHEDULED,
        },
        shipper: {
          id: "shipper-uuid",
          type: "user02",
          company_name: "PT Shipper Example",
          logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          phone: "081234567890",
          location: "Jakarta Selatan, DKI Jakarta",
        },
        transporters: [
          {
            id: "transporter-uuid",
            name: "PT Transporter ABC",
            logo: "https://cdn.muattrans.com/logos/transporter.jpg",
            fleet_count: 2,
            phone: "081987654321",
            location: "Tangerang, Banten",
          },
        ],
        contact_summary: {
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
          days_unpaid: 5,
        },
        cost_breakdown: {
          waiting_time_cost: 200000,
          overload_cost: 150000,
          admin_fee: 50000,
          tax_amount: 100000,
          total_amount: 500000,
        },
        payment_deadline: "2025-02-15T23:59:59Z",
      },
    },
  },
};

// Fetcher function for additional cost report detail
export const getAdditionalCostReportDetail = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return result?.data?.Data?.report || {};
};

// SWR hook for additional cost report detail
export const useGetAdditionalCostReportDetail = (id) =>
  useSWR(
    `/v1/cs/additional-cost-reports/${id}/detail`,
    getAdditionalCostReportDetail
  );
