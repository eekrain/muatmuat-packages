"use client";

import { useState } from "react";

import { formatDate } from "@/lib/utils/dateFormat";

import { AgendaCalendar } from "./components/AgendaCalendar/AgendaCalendar";
import RefreshButton from "./components/ButtonRefresh";

const AgendaArmadaDriverPage = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  return (
    <div className="flex flex-col gap-4 pt-6">
      {/* Header section */}
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-black">Agenda Armada & Driver</h1>

        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-black">
            Terakhir di update: {formatDate(lastUpdated)}
          </p>

          <RefreshButton />
        </div>
      </div>
      {/* Content section */}
      {/* <AgendaNotFound /> */}
      <AgendaCalendar />
    </div>
  );
};

export default AgendaArmadaDriverPage;
