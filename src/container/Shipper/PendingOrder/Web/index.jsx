import { useRouter } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import PesananTable from "@/components/Table/PesananTable";

const PendingOrderWeb = ({
  queryParams,
  onChangeQueryParams,
  lastFilterField,
  orders,
  title,
}) => {
  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    { name: title },
  ];

  const router = useRouter();

  const [tempSearch, setTempSearch] = useState("");

  const hasFilteredOrders = orders.length > 0;

  return (
    <main className="flex justify-center">
      <div className="mx-auto flex max-w-[1280px] flex-1 flex-col px-6 py-8">
        <BreadCrumb className="mb-0" data={breadcrumbData} />
        <div className="mt-6 flex h-8 items-center gap-x-3">
          <IconComponent
            onClick={() => router.back()}
            src="/icons/arrow-left24.svg"
            size="medium"
            className="text-primary-700"
          />
          <h1 className="text-xl font-bold leading-[24px] text-neutral-900">
            {title}
          </h1>
        </div>
        <PesananTable
          queryParams={queryParams}
          onChangeQueryParams={onChangeQueryParams}
          lastFilterField={lastFilterField}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          orders={orders}
          hasFilteredOrders={hasFilteredOrders}
          searchOnly={true}
        />
      </div>
    </main>
  );
};

export default PendingOrderWeb;
