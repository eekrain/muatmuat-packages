"use client";

import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import PageTitle from "@/components/PageTitle/PageTitle";
import DataPerusahaan from "@/container/CS/User/Tambah/Web/DataPerusahaan/DataPerusahaan";
import { cn } from "@/lib/utils";

const checklistItemsData = [
  {
    title: "Data Perusahaan",
  },
  {
    title: "Kelengkapan Legalitas",
  },
  {
    title: "Kontak PIC",
  },
];

const breadcrumbData = [
  { name: "Daftar User", href: "/user" },
  { name: "Transporter", href: "/user/transporter" },
  { name: "Tambah Transporter" }, // Aktif karena tidak ada href
];

const ICON = {
  finished: (
    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-green-500 bg-white">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9"
          cy="9"
          r="8"
          stroke="#22C55E"
          strokeWidth="2"
          fill="#fff"
        />
        <path
          d="M6 9.5L8 11.5L12 7.5"
          stroke="#22C55E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  ),
  incomplete: (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="9"
          cy="9"
          r="8"
          stroke="#D1D5DB"
          strokeWidth="2"
          fill="#F3F4F6"
        />
        <path
          d="M6.5 6.5L11.5 11.5M11.5 6.5L6.5 11.5"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  ),
};

const PencilIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 3.5L16.5 6.5M3 17L7.5 16.5L16 8C16.1989 7.80109 16.3084 7.53436 16.3084 7.26763C16.3084 7.0009 16.1989 6.73417 16 6.53526L13.4647 4C13.2658 3.80109 12.9991 3.69157 12.7324 3.69157C12.4656 3.69157 12.1989 3.80109 12 4L3.5 12.5L3 17Z"
      stroke="#A3A3A3"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChecklistItem = ({ title, status, active, isLast, onClick }) => (
  <div
    className={cn(
      "group relative flex w-[308px] cursor-pointer items-center rounded-[2px] transition-colors duration-200",
      active ? "bg-[#FFFBEB]" : "bg-white hover:bg-[#f7f7f7] focus:bg-[#FFFBEB]"
    )}
    style={{ minWidth: 308, minHeight: 54, height: 54 }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
  >
    {/* Garis kuning di kiri, tampil jika active */}
    {active && (
      <div
        className={cn(
          "absolute -left-5 top-1/2 h-0 w-[42px] -translate-y-1/2 rotate-[-90deg] rounded-[12px] border-t-[12px] border-[#FFC217]"
        )}
      ></div>
    )}
    <div className="w-full pl-5 pr-5">
      <div
        className={cn(
          "flex h-[54px] min-h-[54px] items-center gap-5",
          !isLast && "border-b border-[#E5E7EB]"
        )}
      >
        {/* Icon status */}
        {ICON[status]}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              // Ganti 'text-md' jika sudah extend, default Tailwind tidak ada 14px
              // 'text-md' ||
              "truncate text-sm font-semibold leading-[120%] text-black"
            )}
          >
            {title}
          </div>
          <div
            className={cn(
              "mt-0.5 text-sm font-medium leading-[120%]",
              status === "finished" ? "text-green-500" : "text-[#EE4343]"
            )}
          >
            {status === "finished" ? "Data lengkap" : "Data belum lengkap"}
          </div>
        </div>
        {/* Icon pencil jika finished */}
        {status === "finished" && (
          <span className="ml-2">
            <PencilIcon />
          </span>
        )}
      </div>
    </div>
  </div>
);

const Page = () => {
  // Status: "finished" | "incomplete"
  const [itemsStatus, setItemsStatus] = useState([
    "finished",
    "incomplete",
    "incomplete",
  ]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Handler klik item
  const handleItemClick = (idx) => {
    if (itemsStatus[idx] === "incomplete") {
      // Cek apakah ada item incomplete sebelum idx
      const firstIncompleteIdx = itemsStatus.findIndex(
        (s, i) => s === "incomplete" && i < idx
      );
      if (firstIncompleteIdx !== -1) {
        setActiveIdx(firstIncompleteIdx);
        return;
      }
    }
    setActiveIdx(idx);
  };

  return (
    <div className="px-10">
      <BreadCrumb className={"mb-4 mt-6"} data={breadcrumbData} />
      <PageTitle>Tambah Transporter</PageTitle>
      <div className="flex w-full items-start gap-6 pb-8">
        <Card className={"border-none p-6"}>
          <DataPerusahaan />
        </Card>
        <Card
          className={"mt-5 w-max overflow-hidden rounded-xl border-none pt-6"}
        >
          <div className="space-y-0">
            {checklistItemsData.map((item, idx) => (
              <ChecklistItem
                key={item.title}
                title={item.title}
                status={itemsStatus[idx]}
                active={activeIdx === idx}
                isLast={idx === checklistItemsData.length - 1}
                onClick={() => handleItemClick(idx)}
              />
            ))}
            <div className="px-5 pb-5 pt-4">
              <button
                className="w-full cursor-not-allowed rounded-lg bg-gray-100 py-2 text-base font-semibold text-gray-400"
                disabled
              >
                Tambahkan Transporter
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
