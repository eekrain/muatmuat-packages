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

const TransporterContainer = ({ onPageChange, onPerPageChange, count }) => {
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
      companyName: "PT Trans Nusantara",
      email: "contact@transnusantara.com",
      phone: "+62 815-3456-7890",
      pic: "Ahmad Yani",
      totalFleet: 25,
      activeFleet: 20,
      totalDrivers: 30,
      status: "Active",
      registeredDate: "2024-01-08",
    },
    {
      id: "2",
      companyName: "CV Logistik Sejahtera",
      email: "info@logistiksejahtera.co.id",
      phone: "+62 816-2345-6789",
      pic: "Budi Santoso",
      totalFleet: 15,
      activeFleet: 12,
      totalDrivers: 18,
      status: "Active",
      registeredDate: "2024-01-03",
    },
    {
      id: "3",
      companyName: "UD Express Mandiri",
      email: "express@mandiri.com",
      phone: "+62 817-3456-7890",
      pic: "Charlie Tan",
      totalFleet: 8,
      activeFleet: 5,
      totalDrivers: 10,
      status: "Suspended",
      registeredDate: "2023-12-15",
    },
    {
      id: "4",
      companyName: "PT Cargo Prima",
      email: "cargo@prima.id",
      phone: "+62 818-4567-8901",
      pic: "Diana Putri",
      totalFleet: 0,
      activeFleet: 0,
      totalDrivers: 0,
      status: "Inactive",
      registeredDate: "2023-11-20",
    },
  ];

  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Suspended") variant = "warning";
    if (status === "Inactive") variant = "danger";
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
      key: "fleet",
      header: "Fleet Info",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-medium">
            {row.activeFleet}/{row.totalFleet} Active
          </div>
          <div className="text-xxs text-neutral-600">
            {row.totalDrivers} Drivers
          </div>
        </div>
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
              View Fleet
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>
              View Drivers
            </SimpleDropdownItem>
            {row.status === "Active" && (
              <SimpleDropdownItem onClick={() => {}}>
                Suspend
              </SimpleDropdownItem>
            )}
            {row.status === "Suspended" && (
              <SimpleDropdownItem onClick={() => {}}>
                Activate
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
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
        { key: "fleetSize", label: "Fleet Size" },
      ],
      data: {
        status: [
          { id: "active", label: "Active" },
          { id: "suspended", label: "Suspended" },
          { id: "inactive", label: "Inactive" },
        ],
        fleetSize: [
          { id: "0", label: "No Fleet" },
          { id: "1-10", label: "1-10 Vehicles" },
          { id: "11-25", label: "11-25 Vehicles" },
          { id: "25+", label: "25+ Vehicles" },
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
        totalCountLabel="Transporters"
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

export default TransporterContainer;
