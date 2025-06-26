"use client";

import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Pagination from "@/components/Pagination/Pagination";
import MuatBongkarModal from "@/container/DetailPesanan/Web/RingkasanPesanan/MuatBongkarModal";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const DaftarPesananWeb = () => {
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
  const [isDocumentReceivedModalOpen, setIsDocumentReceivedModalOpen] =
    useState(false);
  const [isReorderFleetModalOpen, setIsReorderFleetModalOpen] = useState(false);
  const [isLokasiMuatBongkarModalOpen, setIsLokasiMuatBongkarModalOpen] =
    useState(false);

  const tabs = [
    { id: "Semua", label: "Semua" },
    { id: "Pembayaran", label: "Menunggu Pembayaran (5)" },
    { id: "Pelunasan", label: "Menunggu Pelunasan (5)" },
    { id: "Dokumen", label: "Proses Pengiriman Dokumen (5)" },
  ];

  const pesananData = [
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

  const dummyLokasiMuatBongkarData = [
    {
      fullAddress:
        "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
      // isPickup: true,
      index: 0,
      isBullet: true,
    },
    // {
    //   fullAddress:
    //     "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
    //   isPickup: true,
    //   index: 0,
    // },
    // {
    //   fullAddress:
    //     "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
    //   isPickup: true,
    //   index: 1,
    // },
    {
      fullAddress:
        "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
      isPickup: false,
      index: 0,
    },
    {
      fullAddress:
        "Jl. Diponegoro No. 45, Gunungsari, Kecamatan Gubeng, Surabaya",
      isPickup: false,
      index: 1,
    },
  ];

  const handleChangeQueryParams = (field, value) =>
    setQueryParams((prevState) => ({ ...prevState, [field]: value }));

  const handleReceiveDocument = () => {
    // Hit API /base_url/v1/orders/{orderId}/document-received
    alert("Hit API /base_url/v1/orders/{orderId}/document-received");
    setIsDocumentReceivedModalOpen(false);
    toast.success("Pesanan berhasil diselesaikan");
  };

  const handleReorderFleet = (id) => {
    if (id) {
      alert("Pesan ulang");
    } else {
      alert("Pesan Baru");
    }
    setIsReorderFleetModalOpen(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleChangeQueryParams("search", tempSearch);
    }
  };

  const handleClearSearch = () => {
    handleChangeQueryParams("search", "");
    setTempSearch("");
  };

  // Generic function to handle sorting for any column
  const handleSort = (columnName) => {
    // If sort is empty or not the current column, set to current column and order to desc
    if (queryParams.sort !== columnName) {
      handleChangeQueryParams("sort", columnName);
      handleChangeQueryParams("order", "desc");
    }
    // If sort is the current column and order is desc, change to asc
    else if (queryParams.sort === columnName && queryParams.order === "desc") {
      handleChangeQueryParams("order", "asc");
    }
    // If sort is the current column and order is asc, reset sort and order
    else {
      handleChangeQueryParams("sort", "");
      handleChangeQueryParams("order", "");
    }
  };

  // Handlers for specific columns
  const handleKodePesananSort = () => handleSort("invoice");
  const handleTanggalMuatSort = () => handleSort("loadTimeStart");

  // Function to get the appropriate sort icon based on current sort state
  const getSortIcon = (columnName) => {
    if (queryParams.sort === columnName) {
      return queryParams.order === "desc"
        ? "/icons/sort-descending16.svg"
        : "/icons/sort-ascending16.svg";
    }
    return "/icons/sorting16.svg";
  };

  const hasOrders = pesananData.length > 0;

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

          {/* Filter dan Search */}
          <Card className="shadow-muat mt-6 h-auto w-[1232px] border-none">
            <CardContent className="p-0">
              {/* Table Filter */}
              <div className="flex items-center justify-between p-6 pt-5">
                <div className="flex items-center gap-x-3">
                  <Input
                    className="gap-0"
                    appearance={{ containerClassName: "w-[262px]" }}
                    placeholder="Cari Pesanan"
                    icon={{
                      left: "/icons/search16.svg",
                      right: tempSearch ? (
                        <IconComponent
                          src="/icons/silang16.svg"
                          onClick={handleClearSearch}
                        />
                      ) : null,
                    }}
                    value={tempSearch}
                    onChange={({ target: { value } }) => setTempSearch(value)}
                    onKeyUp={handleSearch}
                  />
                  {/* <Button
                  variant="muattrans-primary-secondary"
                  className="w-[104px]"
                  iconRight="/icons/filter16.svg"
                >
                  Filter
                </Button> */}
                </div>
                <div className="flex items-center gap-x-3">
                  <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                    Tampilkan:
                  </span>
                  {tabs.map((tab, key) => (
                    <div
                      key={key}
                      onClick={() => handleChangeQueryParams("status", tab.id)}
                      className={cn(
                        "cursor-pointer rounded-full px-3 py-[6px] text-[10px] font-semibold",
                        queryParams.status === tab.id
                          ? "border border-primary-700 bg-[#E2F2FF] text-primary-700"
                          : "bg-[#F1F1F1] text-neutral-900"
                      )}
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Component with proper structure */}
              {hasOrders ? (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-y border-neutral-400 text-[12px] font-bold leading-[14.4px] text-neutral-600">
                        <th className="w-[156px] px-6 py-5 text-left">
                          <div className="flex items-center gap-x-2">
                            <span>Kode Pesanan</span>
                            <IconComponent
                              src={getSortIcon("invoice")}
                              onClick={handleKodePesananSort}
                              className={
                                queryParams.sort === "invoice"
                                  ? "icon-blue"
                                  : ""
                              }
                            />
                          </div>
                        </th>
                        <th className="w-[156px] py-5 pl-0 pr-6 text-left">
                          <div className="flex items-center gap-x-2">
                            <span>Tanggal Muat</span>
                            <IconComponent
                              src={getSortIcon("loadTimeStart")}
                              onClick={handleTanggalMuatSort}
                              className={
                                queryParams.sort === "loadTimeStart"
                                  ? "icon-blue"
                                  : ""
                              }
                            />
                          </div>
                        </th>
                        <th className="w-[156px] py-5 pl-0 pr-6 text-left">
                          Lokasi
                        </th>
                        <th className="w-[200px] py-5 pl-0 pr-6 text-left">
                          Armada
                        </th>
                        <th className="w-[232px] py-5 pl-0 pr-6 text-left">
                          Status
                        </th>
                        <th className="w-[174px] py-5 pl-0 pr-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pesananData.map((pesanan, key) => (
                        <Fragment key={key}>
                          {/* Main row - conditional border based on whether it has a warning */}
                          <tr
                            className={
                              !pesanan.hasWarning
                                ? "border-b border-neutral-400"
                                : "border-b-0"
                            }
                          >
                            {/* Kode Pesanan */}
                            <td className="w-[156px] px-6 pb-4 pt-5 align-top">
                              <span className="text-[12px] font-medium text-neutral-900">
                                {pesanan.id}
                              </span>
                            </td>

                            {/* Tanggal Muat */}
                            <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                              <span className="text-[12px] font-medium text-neutral-900">
                                {pesanan.tanggalMuat}
                              </span>
                            </td>

                            {/* Lokasi */}
                            <td className="w-[156px] pb-4 pl-0 pr-6 pt-5 align-top">
                              <div className="relative flex flex-col gap-3">
                                <div className="absolute bottom-0 left-2 top-5 h-[30px] w-0 border-l-[1.5px] border-dashed border-neutral-400"></div>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC217]">
                                    <div className="h-[6px] w-[6px] rounded-full bg-[#461B02]"></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-neutral-900">
                                    {pesanan.lokasi[0].nama}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#461B02]">
                                    <div className="h-[6px] w-[6px] rounded-full bg-white"></div>
                                  </div>
                                  <span className="text-[10px] font-semibold text-neutral-900">
                                    {pesanan.lokasi[1].nama}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    setIsLokasiMuatBongkarModalOpen(true)
                                  }
                                  className="text-[12px] font-medium text-primary-700"
                                >
                                  Lihat Lokasi Lainnya
                                </button>
                              </div>
                            </td>

                            {/* Armada */}
                            <td className="w-[200px] pb-4 pl-0 pr-6 pt-5 align-top">
                              <div className="flex gap-2">
                                <div className="h-12 w-12 overflow-hidden rounded bg-neutral-50">
                                  <ImageComponent
                                    src={pesanan.armada.image}
                                    width={48}
                                    height={48}
                                    alt="Truck image"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-[12px] font-bold text-neutral-900">
                                    {pesanan.armada.nama}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-medium text-neutral-600">
                                      Carrier :
                                    </span>
                                    <span className="text-[10px] font-medium text-neutral-900">
                                      {pesanan.armada.carrier}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <IconComponent
                                        src="/icons/truck16.svg"
                                        width={14}
                                        height={14}
                                        className="text-[#461B02]"
                                      />
                                      <span className="text-[10px] font-medium text-neutral-900">
                                        {pesanan.armada.unit} Unit
                                      </span>
                                    </div>
                                    <div className="h-[2px] w-[2px] rounded-full bg-neutral-600"></div>
                                    <div className="flex items-center gap-1">
                                      <IconComponent
                                        src="/icons/weight16.svg"
                                        width={14}
                                        height={14}
                                        className="text-[#461B02]"
                                      />
                                      <span className="text-[10px] font-medium text-neutral-900">
                                        {pesanan.armada.kapasitas}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="w-[232px] pb-4 pl-0 pr-6 pt-5 align-top">
                              <BadgeStatusPesanan
                                variant={
                                  pesanan.status === "Menunggu Pembayaran"
                                    ? "warning"
                                    : "info"
                                }
                                className="w-fit"
                              >
                                {pesanan.status}
                              </BadgeStatusPesanan>
                            </td>

                            {/* Action Button */}
                            <td className="w-[174px] pb-4 pl-0 pr-6 pt-5 align-top">
                              <div className="flex flex-col gap-y-3">
                                {/* Conditional button based on status */}
                                {pesanan.status === "Menunggu Pembayaran" ? (
                                  <Button
                                    variant="muatparts-primary"
                                    className="w-full"
                                    onClick={() => {
                                      setIsReorderFleetModalOpen(true);
                                    }}
                                  >
                                    Pesan Ulang
                                  </Button>
                                ) : pesanan.status ===
                                  "Proses Pengiriman Dokumen" ? (
                                  <Button
                                    onClick={() => {
                                      setIsDocumentReceivedModalOpen(true);
                                    }}
                                    variant="muatparts-primary"
                                    className="w-full"
                                  >
                                    Selesaikan Pesanan
                                  </Button>
                                ) : (
                                  <Button
                                    variant="muatparts-primary"
                                    className="w-full"
                                  >
                                    Beri Ulasan
                                  </Button>
                                )}
                                <Button
                                  variant="muatparts-primary-secondary"
                                  className="w-full"
                                >
                                  Detail
                                </Button>
                              </div>
                            </td>
                          </tr>

                          {/* Conditional Alert Row - Only shown if the pesanan has a warning */}
                          {pesanan.hasWarning && (
                            <tr className="border-b border-neutral-400">
                              <td colSpan={6} className="px-6 pb-4">
                                <div className="flex h-12 items-center gap-x-3 rounded-xl bg-secondary-100 px-4">
                                  <IconComponent
                                    className="icon-stroke-warning-900"
                                    src="/icons/warning24.svg"
                                    size="medium"
                                  />
                                  <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
                                    {"Lakukan pembayaran sebelum "}
                                    <span className="font-bold">
                                      {pesanan.alertMessage}
                                    </span>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex min-h-[358px] w-full justify-center pb-6">
                  <div className="flex flex-col items-center justify-center gap-y-3">
                    <DataNotFound
                      className="gap-y-3"
                      textClass="text-[#868686] leading-[19.2px] w-[289px]"
                      title="Oops, daftar pesananmu masih kosong "
                      width={96}
                      height={77}
                    />
                    <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                      Mulai buat pesanan sekarang untuk kebutuhan pengiriman
                      kamu
                    </span>
                    <Button
                      className="max-w-[135px]"
                      variant="muatparts-primary"
                      onClick={() => router.push("/sewaarmada")}
                      type="button"
                    >
                      Buat Pesanan
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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

      {/* Modal Konfirmasi Dokumen Diterima */}
      <ConfirmationModal
        isOpen={isDocumentReceivedModalOpen}
        setIsOpen={setIsDocumentReceivedModalOpen}
        title={{
          text: "Informasi",
        }}
        description={{
          text: 'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.',
        }}
        cancel={{
          text: "Belum",
        }}
        confirm={{
          text: "Sudah",
          onClick: handleReceiveDocument,
        }}
      />

      {/* Modal Pesan Ulang */}
      <ConfirmationModal
        isOpen={isReorderFleetModalOpen}
        setIsOpen={setIsReorderFleetModalOpen}
        description={{
          text: "Apakah kamu ingin menyalin pesanan ini untuk digunakan kembali atau membuat pesanan baru dengan detail yang berbeda?",
          className: "leading-[16.8px]",
        }}
        cancel={{
          text: "Pesan Baru",
          onClick: () => handleReorderFleet(),
        }}
        confirm={{
          text: "Pesan Ulang",
          onClick: () => handleReorderFleet(1),
        }}
      />

      {/* Modal Lokasi Muat dan Bongkar */}
      <MuatBongkarModal
        isOpen={isLokasiMuatBongkarModalOpen}
        setIsOpen={setIsLokasiMuatBongkarModalOpen}
        data={dummyLokasiMuatBongkarData}
        title="Lokasi"
      />
    </>
  );
};

export default DaftarPesananWeb;
