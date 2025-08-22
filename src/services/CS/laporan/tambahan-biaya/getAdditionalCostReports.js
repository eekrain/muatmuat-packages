import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = false;

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    success: true,
    Data: {
      reports: [
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
        {
          id: "report-uuid",
          order_id: "order-uuid",
          order_code: "MT-2025-001",
          order_status: "MENUNGGU PELUNASAN",
          shipper: {
            id: "shipper-uuid",
            name: "PT Shipper Example",
            type: "user02",
            phone: "081234567890",
            logo: "https://cdn.muattrans.com/logos/shipper.jpg",
          },
          transporter: [
            {
              id: "transporter-uuid",
              name: "PT Transporter ABC",
              fleet_count: 2,
              phone: "081987654321",
              location: "Jakarta Selatan, DKI Jakarta",
            },
          ],
          additional_cost_amount: 500000,
          bill_date: "2025-01-15T10:30:00Z",
          days_unpaid: 5,
          pickup_locations: ["Tangerang", "Bekasi"],
          delivery_locations: ["Surabaya", "Malang"],
          has_multiple_locations: true,
          last_contacted_by: "CS John Doe",
          last_contacted_at: "2025-01-20T14:30:00Z",
          total_contacts: 3,
        },
      ],
      pagination: {
        current_page: 1,
        total_pages: 5,
        total_items: 50,
        items_per_page: 10,
        has_next: true,
        has_prev: false,
      },
    },
    message: "Active additional cost reports retrieved successfully",
  },
};

// Fetcher function for additional cost reports
export const getAdditionalCostReports = async (url) => {
  let result;
  if (useMockData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    result = mockAPIResult;
  } else {
    result = await fetcherMuatrans.get(url);
  }
  return {
    reports: result?.data?.Data.reports || [],
    pagination: result?.data?.Data.pagination || {},
  };
};

// SWR hook for additional cost reports
export const useGetAdditionalCostReports = (queryString) =>
  useSWR(
    `v1/cs/additional-cost-reports?${queryString}`,
    getAdditionalCostReports
  );
