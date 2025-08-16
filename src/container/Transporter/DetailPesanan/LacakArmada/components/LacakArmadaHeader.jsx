"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import Search from "@/components/Search/Search";

function LacakArmadaHeader({ sosUnit = 2, activeCount = 6, historyCount = 0 }) {
  const [activeTab, setActiveTab] = useState("aktif");
  const isSOS = false;

  return (
    <div className="flex w-full items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-neutral-900">Lacak Armada</h2>

        {/* SOS Badge */}
        {isSOS && (
          <>
            <div className="flex items-center gap-2">
              <div className="inline-flex h-6 items-center justify-center rounded-md bg-red-500 px-3 text-xs font-semibold text-white">
                SOS : {sosUnit} Unit
              </div>
              <a href="#" className="text-sm font-medium text-blue-600">
                Lihat SOS
              </a>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                  activeTab === "aktif"
                    ? "min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                    : "min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
                }`}
                onClick={() => setActiveTab("aktif")}
              >
                Aktif ({activeCount})
              </button>

              <button
                className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                  activeTab === "riwayat"
                    ? "min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                    : "min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
                }`}
                onClick={() => setActiveTab("riwayat")}
              >
                Riwayat ({historyCount})
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Button>Lihat Posisi Armada</Button>
        <Search
          className="w-[260px]"
          placeholder="Cari No. Polisi / Nama Driver"
        />
      </div>
    </div>
  );
}

export default LacakArmadaHeader;
