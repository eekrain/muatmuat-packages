"use client";

import { useState } from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";

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
      className="text-success-400"
    />
  ),
  incomplete: (
    <IconComponent
      src="/icons/cross-circle.svg"
      alt="Cross Circle Icon"
      width={28}
      height={28}
      className="text-neutral-500"
    />
  ),
};

const ChecklistItem = ({ title, status, active, isLast, onClick }) => (
  <div
    className={cn(
      "group relative flex w-[308px] cursor-pointer items-center overflow-x-hidden rounded-[2px] transition-colors duration-200",
      active
        ? "bg-muat-trans-primary-50"
        : "bg-neutral-50 hover:bg-[#f7f7f7] focus:bg-muat-trans-primary-50"
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
          "absolute -left-5 top-1/2 h-0 w-[42px] -translate-y-1/2 rotate-[-90deg] rounded-[12px] border-t-[12px] border-muat-trans-primary-400"
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
              "truncate text-sm font-semibold leading-[120%] text-black"
            )}
          >
            {title}
          </div>
          <div
            className={cn(
              "mt-0.5 text-sm font-medium leading-[120%]",
              status === "finished" ? "text-success-400" : "text-error-400"
            )}
          >
            {status === "finished" ? "Data lengkap" : "Data belum lengkap"}
          </div>
        </div>
        {status === "finished" && (
          <span className="ml-2">
            <IconComponent
              src="/icons/edit-icon.svg"
              alt="Edit Icon"
              width={20}
              height={20}
              className="text-neutral-700 hover:text-neutral-500"
            />
          </span>
        )}
      </div>
    </div>
  </div>
);

export const TabRegister = ({
  activeIdx,
  setActiveIdx,
  itemsStatus,
  onAddTransporter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextTabIndex, setNextTabIndex] = useState(null);

  // Gunakan optional chaining (?.) untuk keamanan jika itemsStatus belum dimuat
  const isAllFinished =
    itemsStatus?.[0] === "finished" &&
    itemsStatus?.[1] === "finished" &&
    itemsStatus?.[2] === "finished";
  const handleTabClick = (index) => {
    if (index === activeIdx) {
      return;
    }
    const isCurrentSectionFinished = itemsStatus?.[activeIdx] === "finished";

    if (isCurrentSectionFinished) {
      setActiveIdx(index);
    } else {
      setNextTabIndex(index);
      setIsModalOpen(true);
    }
  };

  const handleConfirmSwitch = () => {
    if (nextTabIndex !== null) {
      setActiveIdx(nextTabIndex);
    }
    setIsModalOpen(false);
    setNextTabIndex(null);
  };

  const handleCancelSwitch = () => {
    setIsModalOpen(false);
    setNextTabIndex(null);
  };

  return (
    <>
      <div className="space-y-0">
        {checklistItemsData.map((item, idx) => (
          <ChecklistItem
            key={item.title}
            title={item.title}
            status={itemsStatus?.[idx] ?? "incomplete"}
            active={activeIdx === idx}
            isLast={idx === checklistItemsData.length - 1}
            onClick={() => handleTabClick(idx)}
          />
        ))}
        <div className="px-5 pb-5 pt-4">
          {!isAllFinished ? (
            <InfoTooltip
              side="top"
              className="w-[336px] py-2"
              sideOffset={3}
              trigger={
                <button
                  className={cn(
                    "w-full rounded-3xl py-2 text-sm font-semibold disabled:cursor-not-allowed",
                    "bg-neutral-200 text-neutral-600"
                  )}
                  disabled
                >
                  Tambahkan Transporter
                </button>
              }
            >
              <p className="text-sm">
                Lengkapi dan simpan semua data terlebih dahulu untuk menambahkan
                Transporter
              </p>
            </InfoTooltip>
          ) : (
            <button
              onClick={onAddTransporter}
              className={cn(
                "w-full rounded-3xl py-2 text-sm font-semibold",
                "bg-muat-trans-primary-400 text-muat-trans-secondary-900 transition-colors hover:bg-muat-trans-primary-500"
              )}
            >
              Tambahkan Transporter
            </button>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        description={{
          text: "Data Transporter tidak akan tersimpan kalau kamu meninggalkan halaman ini.",
        }}
        cancel={{
          text: "Batal",
          classname: "w-[112px]",
          onClick: handleCancelSwitch,
        }}
        confirm={{
          text: "Ya",
          classname: "w-[112px]",
          onClick: handleConfirmSwitch,
        }}
      />
    </>
  );
};
