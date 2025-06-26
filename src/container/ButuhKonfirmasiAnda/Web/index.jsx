import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import PesananTable from "@/components/Table/PesananTable";

const ButuhKonfirmasiAndaWeb = () => {
  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    { name: "Butuh Konfirmasi Anda" },
  ];

  const router = useRouter();

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
    <main className="flex justify-center px-10 py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-y-6">
        <BreadCrumb className="mb-0" data={breadcrumbData} />
        <div className="flex h-8 items-center gap-x-3">
          <IconComponent
            onClick={() => router.back()}
            src="/icons/arrow-left24.svg"
            size="medium"
          />
          <h1 className="text-[20px] font-bold leading-[24px] text-neutral-900">
            Butuh Konfirmasi Anda
          </h1>
        </div>
        <PesananTable
          queryParams={queryParams}
          onChangeQueryParams={handleChangeQueryParams}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          orders={orders}
          hasOrders={hasOrders}
          searchOnly={true}
        />
      </div>
    </main>
  );
};

export default ButuhKonfirmasiAndaWeb;
