"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
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

const ICON = {
  finished: (
    <IconComponent
      src="/icons/check-icon.svg"
      alt="Check Icon"
      width={28}
      height={28}
      className="text-green-500"
    />
  ),
  incomplete: (
    <IconComponent
      src="/icons/cross-circle.svg"
      alt="Cross Circle Icon"
      width={28}
      height={28}
      className="text-slate-400"
    />
  ),
};

const ChecklistItem = ({ title, status, active, isLast, onClick }) => (
  <div
    className={cn(
      "group relative flex w-[308px] cursor-pointer items-center overflow-x-hidden rounded-[2px] transition-colors duration-200",
      active ? "bg-[#FFFBEB]" : "bg-white hover:bg-[#f7f7f7] focus:bg-[#FFFBEB]"
    )}
    style={{ minWidth: 308, minHeight: 54, height: 54 }}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
  >
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
            <IconComponent
              src="/icons/edit-icon.svg"
              alt="Edit Icon"
              width={20}
              height={20}
              className="text-gray-400 hover:text-gray-500"
            />
          </span>
        )}
      </div>
    </div>
  </div>
);

export const TabRegister = ({ activeIdx, setActiveIdx, itemsStatus }) => {
  const isAllFinished =
    itemsStatus[0] === "finished" &&
    itemsStatus[1] === "finished" &&
    itemsStatus[2] === "finished";
  return (
    <div className="space-y-0">
      {checklistItemsData.map((item, idx) => (
        <ChecklistItem
          key={item.title}
          title={item.title}
          status={itemsStatus[idx]}
          active={activeIdx === idx}
          isLast={idx === checklistItemsData.length - 1}
          onClick={() => setActiveIdx(idx)}
        />
      ))}
      <div className="px-5 pb-5 pt-4">
        <button
          className={cn(
            "w-full rounded-3xl py-2 text-sm font-semibold disabled:cursor-not-allowed",
            isAllFinished
              ? "bg-muat-trans-primary-400 text-muat-trans-secondary-900"
              : "bg-neutral-200 text-neutral-600"
          )}
          disabled={!isAllFinished}
        >
          Tambahkan Transporter
        </button>
      </div>
    </div>
  );
};
