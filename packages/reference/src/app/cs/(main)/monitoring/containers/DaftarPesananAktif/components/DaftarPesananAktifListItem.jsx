"use client";

// ...existing code...
import Avatar from "@/components/Avatar";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

import OrderInformation from "./OrderInformation";

// ...existing code...

const DaftarPesananAktifListItem = ({
  row,
  isOpen,
  onToggleDropdown,
  onActionClick,
  onViewFleetStatus: _onViewFleetStatus,
  onHubungi,
}) => {
  // Only derive the small fields needed by the header. All other order
  // presentation is delegated to the reusable <OrderInformation /> component.
  const transporterName =
    row.transporterInfo?.transporterName || row.transporterName || "";
  const shipperName = row.shipperInfo?.shipperName || row.shipperName || "";

  return (
    <div className="relative z-0 -mt-px flex h-40 w-full flex-col items-start border-b border-neutral-400 bg-white">
      {/* Header Section */}
      <div className="flex w-full flex-row items-center justify-between border-t border-neutral-400 bg-neutral-100 py-3">
        <div className="flex w-full flex-row items-center gap-1">
          {/* Transporter Section */}
          <div className="flex w-full items-center gap-2 border-r border-neutral-400 px-4">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              Transporter :
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-600">
              {/* <span className="text-xs font-bold text-white">S</span> */}
              <Avatar
                src={row.transporterInfo?.image || "/img/placeholder-img.png"}
                name={row.transporterInfo?.transporterName}
                size={24}
              />
            </div>

            <span className="line-clamp-1 flex-grow break-all text-xs font-semibold text-black">
              {transporterName}
            </span>
            <div className="border-l border-neutral-400 py-1 pl-2">
              <Button
                variant="link"
                iconLeft={
                  <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onHubungi?.({
                    showInitialChoice: false,
                    transporterContacts: [
                      {
                        name: row.transporterInfo?.transporterName,
                        role: "",
                        phone: row.transporterInfo?.phoneNumber || "",
                      },
                    ],
                    driverContacts: [],
                    contacts: [],
                  });
                }}
                className="flex items-center gap-1 p-0 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Hubungi
              </Button>
            </div>
          </div>

          {/* Shipper Section */}
          <div className="flex w-full items-center gap-2 border-l border-neutral-400 px-4">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              Shipper :
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
              <Avatar
                src={row.shipperInfo?.image || "/img/placeholder-img.png"}
                name={shipperName}
                size={24}
              />
            </div>
            <span className="line-clamp-1 flex-grow break-all text-xs font-semibold text-black">
              {shipperName}
            </span>
            <div className="border-l border-neutral-400 py-1 pl-2">
              <Button
                variant="link"
                iconLeft={
                  <IconComponent src="/icons/call16.svg" className="h-4 w-4" />
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onHubungi?.({
                    showInitialChoice: false,
                    transporterContacts: [
                      {
                        name: row.shipperInfo?.shipperName,
                        role: "",
                        phone: row.shipperInfo?.phoneNumber || "",
                      },
                    ],
                    driverContacts: [],
                    contacts: [],
                  });
                }}
                className="flex items-center gap-1 p-0 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Hubungi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OrderInformation
        row={row}
        isOpen={isOpen}
        onToggleDropdown={onToggleDropdown}
        onActionClick={onActionClick}
        onViewFleetStatus={_onViewFleetStatus}
        onHubungi={onHubungi}
      />
    </div>
  );
};

export default DaftarPesananAktifListItem;
