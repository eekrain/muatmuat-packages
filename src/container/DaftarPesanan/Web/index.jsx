"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import NeedConfirmationWarning from "@/components/NeedConfirmationWarning/NeedConfirmationWarning";
import Pagination from "@/components/Pagination/Pagination";
import PesananTable from "@/components/Table/PesananTable";

const DaftarPesananWeb = ({
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  countByStatus,
  isOrdersLoading,
}) => {
  const [tempSearch, setTempSearch] = useState("");

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

          {/* Notification if confirmation needed */}
          {true ? <NeedConfirmationWarning /> : null}

          <PesananTable
            queryParams={queryParams}
            onChangeQueryParams={onChangeQueryParams}
            tempSearch={tempSearch}
            setTempSearch={setTempSearch}
            orders={orders}
            isOrdersLoading={isOrdersLoading}
            hasOrders={hasOrders}
            countByStatus={countByStatus}
          />

          {/* Pagination */}
          {hasOrders ? (
            <div className="mt-4 flex items-center justify-between">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                perPage={pagination.itemsPerPage}
                onPageChange={(value) => onChangeQueryParams("page", value)}
                onPerPageChange={(value) => onChangeQueryParams("limit", value)}
              />
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default DaftarPesananWeb;
