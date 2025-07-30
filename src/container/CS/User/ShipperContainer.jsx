"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";

const ShipperContainer = ({ onPageChange, onPerPageChange, count }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Mock data - replace with actual API call
  const mockData = [
    {
      id: "1",
      companyName: "PT Maju Jaya",
      email: "contact@majujaya.com",
      phone: "+62 812-3456-7890",
      pic: "John Doe",
      totalOrders: 45,
      status: "Active",
      registeredDate: "2024-01-10",
    },
    {
      id: "2",
      companyName: "CV Sentosa Abadi",
      email: "info@sentosaabadi.co.id",
      phone: "+62 813-2345-6789",
      pic: "Jane Smith",
      totalOrders: 23,
      status: "Active",
      registeredDate: "2024-01-05",
    },
    {
      id: "3",
      companyName: "UD Berkah Mandiri",
      email: "berkah@mandiri.com",
      phone: "+62 814-3456-7890",
      pic: "Bob Johnson",
      totalOrders: 0,
      status: "Inactive",
      registeredDate: "2023-12-20",
    },
  ];

  const getStatusBadge = (status) => {
    const variant = status === "Active" ? "success" : "danger";
    return <BadgeStatus variant={variant}>{status}</BadgeStatus>;
  };

  const columns = [
    {
      key: "companyName",
      header: "Company Name",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-bold">{row.companyName}</div>
          <div className="text-xxs font-medium text-neutral-600">
            PIC: {row.pic}
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      width: "280px",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xxs font-semibold">{row.email}</div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: "totalOrders",
      header: "Total Orders",
      render: (row) => (
        <div className="text-xs font-medium">{row.totalOrders}</div>
      ),
    },
    {
      key: "registeredDate",
      header: "Registered Date",
      render: (row) => row.registeredDate,
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "action",
      header: "",
      width: "120px",
      sortable: false,
      render: (row) => (
        <SimpleDropdown>
          <SimpleDropdownTrigger asChild>
            <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-600 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
              <span className="text-xs font-medium leading-tight text-black">
                Action
              </span>
              <ChevronDown className="h-4 w-4 text-neutral-700" />
            </button>
          </SimpleDropdownTrigger>

          <SimpleDropdownContent className="w-[133px]" align="end">
            <SimpleDropdownItem onClick={() => {}}>
              View Orders
            </SimpleDropdownItem>
            {row.status === "Active" && (
              <SimpleDropdownItem onClick={() => {}}>
                Deactivate
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem
              onClick={() => router.push(`/user/shipper/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    const processedFilters = {};

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedFilters[key] = value.map((item) =>
          typeof item === "object" && item.id ? item.id : item
        );
      } else if (typeof value === "object" && value?.id) {
        processedFilters[key] = value.id;
      } else {
        processedFilters[key] = value;
      }
    });

    setFilters(processedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
    onPerPageChange?.(limit);
  };

  const handleSort = (sort, order) => {
    if (sort || order) {
      setSortConfig({ sort, order });
    } else {
      setSortConfig();
    }
  };

  // Filter config for DataTable
  const getFilterConfig = () => {
    return {
      categories: [
        { key: "status", label: "Status" },
        { key: "totalOrders", label: "Order Range" },
      ],
      data: {
        status: [
          { id: "active", label: "Active" },
          { id: "inactive", label: "Inactive" },
        ],
        totalOrders: [
          { id: "0", label: "No Orders" },
          { id: "1-10", label: "1-10 Orders" },
          { id: "11-50", label: "11-50 Orders" },
          { id: "50+", label: "50+ Orders" },
        ],
      },
    };
  };

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={mockData}
        columns={columns}
        searchPlaceholder="Search company name, email, or PIC..."
        totalCountLabel="Shippers"
        currentPage={currentPage}
        totalPages={Math.ceil(mockData.length / perPage)}
        totalItems={count || mockData.length}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={false}
        showPagination
        filterConfig={getFilterConfig()}
      />
    </div>
  );
};

export default ShipperContainer;
