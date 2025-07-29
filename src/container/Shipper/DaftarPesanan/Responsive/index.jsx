import { Fragment } from "react";

import { TagBubble } from "@/components/Badge/TagBubble";
import IconComponent from "@/components/IconComponent/IconComponent";
import SearchBarResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/SearchBarResponsiveLayout";
import { cn } from "@/lib/utils";

import OrderItem from "./components/OrderItem";

const DaftarPesananResponsive = ({ orders }) => {
  console.log("orders", orders);

  return (
    <SearchBarResponsiveLayout placeholder="Cari Pesanan">
      <div className="flex min-h-[calc(100vh_-_62px)] flex-col gap-y-2 bg-neutral-200 text-neutral-900">
        {/* Filter */}
        <div className="scrollbar-hide flex items-center gap-x-1 overflow-x-auto border-b border-b-neutral-400 bg-neutral-50 py-5 pl-4">
          <button
            className={cn(
              "flex h-[30px] items-center gap-x-2 rounded-3xl border border-neutral-200 bg-neutral-200 px-3"
            )}
          >
            <span className="text-sm font-medium leading-[1.1]">Filter</span>
            <IconComponent src="/icons/filter14.svg" width={14} height={14} />
          </button>
          <div className="flex items-center gap-x-1 pr-4">
            <TagBubble>Semua</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
            <TagBubble>Menunggu Pembayaran</TagBubble>
          </div>
        </div>
        {/* List Pesanan */}
        {orders.map((order, key) => {
          return (
            <Fragment key={key}>
              <OrderItem {...order} />
            </Fragment>
          );
        })}
      </div>
    </SearchBarResponsiveLayout>
  );
};

export default DaftarPesananResponsive;
