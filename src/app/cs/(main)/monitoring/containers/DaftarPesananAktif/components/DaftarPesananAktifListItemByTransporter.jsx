"use client";

import { useState } from "react";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

import OrderInformation from "./OrderInformation";

// A detailed component to render a single order row within the expanded shipper view.
const DetailedOrderItem = ({
  row,
  onActionClick,
  onViewFleetStatus,
  isOpen,
  onToggleDropdown,
  isLast,
}) => {
  // OrderInformation component will render these UI fields; just
  // forward the row and callbacks.
  // actions will be resolved inside OrderInformation when needed

  return (
    <div
      className={cn(
        "flex w-full flex-row items-start gap-3 py-4",
        !isLast && "border-b border-neutral-300"
      )}
    >
      <OrderInformation
        row={row}
        isOpen={isOpen}
        onToggleDropdown={onToggleDropdown}
        onActionClick={onActionClick}
        onViewFleetStatus={onViewFleetStatus}
        className="border-none !p-0"
      />
    </div>
  );
};

// Component for the collapsible shipper group.
const ShipperGroupItem = ({
  shipperData,
  onActionClick,
  onViewFleetStatus,
  openDropdowns,
  onToggleDropdown,
  onHubungi,
}) => {
  const [isOpen, setIsOpen] = useState(true); // Default to open

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-400">
      {/* Shipper Header */}
      <div className="">
        <div
          className="flex cursor-pointer items-center gap-3 p-3"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-xs font-medium text-neutral-600">
            Shipper :
          </span>
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <Avatar
              src={shipperData.logoUrl || "/img/placeholder-logo.png"}
              name={shipperData.shipperName}
              className="size-2 text-xs"
              size={24}
            />
            {/* <Image
              src={shipperData.logoUrl || "/img/placeholder-logo.png"}
              alt={shipperData.name}
              width={24}
              height={24}
              className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
            /> */}
            <span className="truncate text-xs font-semibold text-black">
              {shipperData.shipperName}
            </span>
          </div>
          <div className="flex flex-shrink-0 items-center gap-4">
            <Button
              variant="link"
              onClick={(e) => {
                e.stopPropagation();
                onHubungi?.({
                  showInitialChoice: false,
                  transporterContacts: [],
                  driverContacts: [],
                  contacts: [
                    {
                      name: shipperData.shipperName,
                      role: "",
                      phone: shipperData.phoneNumber || "",
                    },
                  ],
                });
              }}
              className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
              iconLeft={
                <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
              }
            >
              Hubungi
            </Button>
            <IconComponent
              src="/icons/chevron-down.svg"
              className={cn(
                "h-4 w-4 text-neutral-700 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {/* Expanded Content: List of Orders */}
      {isOpen && (
        <div className="border-t border-neutral-400 px-3">
          {shipperData.orders.map((order, index) => (
            <DetailedOrderItem
              key={order.orderId || order.id}
              row={order}
              isLast={index === shipperData.orders.length - 1}
              onActionClick={onActionClick}
              onViewFleetStatus={onViewFleetStatus}
              isOpen={Boolean(openDropdowns?.[order.orderId || order.id])}
              onToggleDropdown={onToggleDropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main component for the "View by Transporter" list item.
const DaftarPesananAktifListItemByTransporter = ({
  transporterData,
  onActionClick,
  onViewFleetStatus,
  openDropdowns,
  onToggleDropdown,
  onHubungi,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen((prev) => !prev);
  return (
    <div className="flex flex-col border-t border-neutral-300 bg-white">
      {/* Transporter Header */}
      <div
        className="flex cursor-pointer items-center gap-4 bg-neutral-100 px-4 py-3"
        onClick={onToggle}
      >
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 text-xs font-medium text-neutral-600">
            Transporter :
          </span>
          <Avatar
            size={24}
            src={transporterData.logoUrl || "/img/placeholder-logo.png"}
            name={transporterData.transporterName}
          />
          <span className="truncate text-xs font-semibold text-black">
            {transporterData.transporterName}
          </span>
          {transporterData.hasUrgent && (
            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-error-400" />
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-4">
          <Button
            variant="link"
            onClick={(e) => {
              e.stopPropagation();
              onHubungi?.({
                showInitialChoice: false,
                transporterContacts: [
                  {
                    name: transporterData.transporterName,
                    role: "",
                    phone: transporterData.phoneNumber || "",
                  },
                ],
                driverContacts: [],
                contacts: [],
              });
            }}
            className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
            iconLeft={
              <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
            }
          >
            Hubungi
          </Button>
          <div className="h-6 w-px bg-neutral-300" />
          <IconComponent
            src="/icons/chevron-down.svg"
            className={cn(
              "h-4 w-4 text-neutral-700 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded Content: List of Shippers */}
      {isOpen && (
        <div className="p-4 pt-4">
          <div className="flex flex-col gap-3">
            {transporterData.shippers.map((shipper) => (
              <ShipperGroupItem
                key={shipper.id}
                shipperData={shipper}
                onActionClick={onActionClick}
                onViewFleetStatus={onViewFleetStatus}
                openDropdowns={openDropdowns}
                onToggleDropdown={onToggleDropdown}
                onHubungi={onHubungi}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarPesananAktifListItemByTransporter;
