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
    <main className="flex justify-center px-10 py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col">
        <BreadCrumb className="mb-0" data={breadcrumbData} />
        <div className="mt-6 flex h-8 items-center gap-x-3">
          <IconComponent
            onClick={() => router.back()}
            src="/icons/arrow-left24.svg"
            size="medium"
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
