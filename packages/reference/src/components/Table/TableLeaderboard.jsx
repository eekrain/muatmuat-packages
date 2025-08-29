// src/app/dashboard/TableLeaderboard.jsx
import React from "react";

import ImageComponent from "@/components/ImageComponent/ImageComponent";

import BadgeLeaderboard from "../Badge/BadgeLeaderboard";

/**
 * Displays a single carrier with its rank, name, and order count.
 */
const CarrierItem = ({ rank, name, orders }) => {
  if (name === "-") {
    return (
      <div className="flex w-[180px] items-center gap-3">
        <BadgeLeaderboard rank={rank} />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-neutral-900">-</p>
          <p className="text-xs text-neutral-500">Jumlah Pesanan : {orders}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-3">
      <div className="flex flex-row gap-4">
        <BadgeLeaderboard rank={rank} />
        <p className="text-sm font-semibold text-neutral-900">{name}</p>
      </div>
      <p className="px-8 text-xs font-medium text-neutral-600">
        Jumlah Pesanan :{" "}
        <a className="text-xs font-medium text-neutral-900">{orders}</a>
      </p>
    </div>
  );
};

/**
 * Renders a full row for the leaderboard table.
 */
const LeaderboardRow = ({ item }) => {
  const { id, fleetType, icon, carriers } = item;

  return (
    <div className="grid w-full grid-cols-[minmax(0,_1fr)_minmax(0,_1.3fr)] items-center border-b border-neutral-400 px-6 py-3 last:border-b-0">
      {/* Left Side: Fleet Info */}
      <div className="mr-6 flex min-h-[40px] items-center gap-x-3 border-r border-neutral-400">
        <div className="relative">
          <ImageComponent
            src={icon}
            alt={fleetType}
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="absolute -bottom-2 left-6">
            <BadgeLeaderboard rank={id} />
          </div>
        </div>
        <p className="text-sm font-semibold text-neutral-900">{fleetType}</p>
      </div>

      {/* Right Side: Top 3 Carriers */}
      <div className="grid grid-cols-3 gap-x-6">
        {carriers.map((carrier) => (
          <CarrierItem
            key={carrier.rank}
            rank={carrier.rank}
            name={carrier.name}
            orders={carrier.orders}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main Table component that receives data and maps it to rows.
 */
const TableLeaderboard = ({ data }) => {
  return (
    <div className="h-full w-full">
      {/* Table Header */}
      <div className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1.3fr)] border-b border-t border-neutral-400 px-5 py-3">
        <div className="mr-6 flex min-h-[28.24px] items-center justify-start border-r border-neutral-400">
          <h2 className="text-sm font-semibold text-neutral-700">
            Jenis Armada
          </h2>
        </div>
        <div className="flex min-h-[28.24px] items-center justify-start">
          <h2 className="text-sm font-semibold text-neutral-700">
            Top 3 Carrier
          </h2>
        </div>
      </div>

      {/* Table Body */}
      <div>
        {/* 1. Map over the data prop */}
        {data.map((item) => (
          // 2. Adapt the API data structure to match what LeaderboardRow expects
          <LeaderboardRow
            key={item.rank}
            item={{
              id: item.rank,
              fleetType: item.fleetType,
              icon: item.logo,
              carriers: item.topCarriers.map((carrier) => ({
                rank: carrier.rank,
                name: carrier.carrierType,
                orders: carrier.orderCount,
              })),
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TableLeaderboard;
