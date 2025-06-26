"use client";

import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import NeedConfirmationWarning from "@/components/NeedConfirmationWarning/NeedConfirmationWarning";
import Pagination from "@/components/Pagination/Pagination";
import PesananTable from "@/components/Table/PesananTable";

const DaftarPesananWeb = () => {
  const [tempSearch, setTempSearch] = useState("");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "Semua",
    sort: "",
    order: "",
  });

  // Transform state into query string using useMemo
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (queryParams.page && queryParams.page > 0) {
      params.append("page", queryParams.page);
    }
    if (queryParams.limit && queryParams.limit > 0) {
      params.append("limit", queryParams.limit);
    }
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    if (queryParams.status) {
      params.append("status", queryParams.status);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }

    return params.toString();
  }, [queryParams]);
  console.log("query", queryString);

  const orders = [
    {
      id: "INV/MT25AA001",
      tanggalMuat: "24 Sep 2024 12:00 WIB s/d 25 Sep 2024 13:00 WIB",
      lokasi: [
        { type: "muat", nama: "Kota Surabaya, Kec. Tegalsari" },
        { type: "bongkar", nama: "Kab. Malang, Kec. Singosari" },
      ],
      armada: {
        nama: "Colt Diesel Engkel",
        image: "/img/truck.png",
        carrier: "Box",
        unit: 1,
        kapasitas: "2.500 kg",
      },
      status: "Menunggu Pembayaran",
      alertMessage: "", // No warning message
      hasWarning: false, // This row doesn't have a warning
    },
    {
      id: "INV/MT25AA002",
      tanggalMuat: "26 Sep 2024 10:00 WIB s/d 27 Sep 2024 11:00 WIB",
      lokasi: [
        { type: "muat", nama: "Kota Surabaya, Kec. Gubeng" },
        { type: "bongkar", nama: "Kab. Sidoarjo, Kec. Waru" },
      ],
      armada: {
        nama: "Colt Diesel Engkel",
        image: "/img/truck.png",
        carrier: "Box",
        unit: 1,
        kapasitas: "2.500 kg",
      },
      status: "Proses Pengiriman Dokumen",
      alertMessage: "20 Sep 2024 13:00 WIB",
      hasWarning: true, // This row has a warning
    },
  ];

  const handleChangeQueryParams = (field, value) =>
    setQueryParams((prevState) => ({ ...prevState, [field]: value }));

  const hasOrders = orders.length > 0;

  return (
    <>
      <main className="flex justify-center px-10 py-8">
        <div className="mx-auto flex max-w-[1280px] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-bold leading-[120%] text-neutral-900">
              Daftar Pesanan
            </h1>
            <Button
              variant="muattrans-primary-secondary"
              className="w-[202px]"
              iconRight="/icons/chevron-down.svg"
            >
              Semua Periode
            </Button>
          </div>

          {/* Ganti pakek logic kalo ada yg perlu dikonfirmasi dari API /base_url/v1/orders/requiring-confirmation/count */}
          {true ? <NeedConfirmationWarning /> : null}

          <PesananTable
            queryParams={queryParams}
            onChangeQueryParams={handleChangeQueryParams}
            tempSearch={tempSearch}
            setTempSearch={setTempSearch}
            orders={orders}
            hasOrders={hasOrders}
          />

          {/* Pagination */}
          {hasOrders ? (
            <div className="mt-4 flex items-center justify-between">
              <Pagination
                currentPage={queryParams.page}
                totalPages={2}
                perPage={queryParams.limit}
                onPageChange={(value) => handleChangeQueryParams("page", value)}
                onPerPageChange={(value) =>
                  handleChangeQueryParams("limit", value)
                }
              />
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default DaftarPesananWeb;
