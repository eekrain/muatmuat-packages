import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
// import { formatDate } from "@/lib/utils/dateFormat";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Select } from "@/components/Select";
import { ChangeFleetTypeEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";

import CardDetail from "./CardDetail";
import { getDynamicDates } from "./getDynamicDates";
import { useDateNavigator } from "./use-date-navigator";

const statusStyles = {
  TERSEDIA: "bg-success-50 text-success-400",
  NON_AKTIF: "bg-neutral-200 text-neutral-600",
  BERTUGAS: "bg-primary-50 text-primary-700",
  MENUNGGU: "bg-warning-100 text-warning-900",
};

const availableFleets = [
  {
    id: "1",
    licensePlate: "L 9812 AX",
    truckType: "Tractor Head 6 x 4",
    status: "Tersedia",
    statusKey: "TERSEDIA",
  },
  {
    id: "2",
    licensePlate: "L 2431 AX",
    truckType: "Tractor Head 6 x 4",
    status: "Tersedia",
    statusKey: "TERSEDIA",
  },
  {
    id: "3",
    licensePlate: "L 1239 CAM",
    truckType: "Tractor Head 6 x 4",
    status: "Non Aktif",
    statusKey: "NON_AKTIF",
  },
  {
    id: "4",
    licensePlate: "L 1211 SA",
    truckType: "Tractor Head 6 x 4",
    status: "Bertugas",
    statusKey: "BERTUGAS",
  },
  {
    id: "5",
    licensePlate: "P 3134 GM",
    truckType: "Tractor Head 6 x 4",
    status: "Menunggu",
    statusKey: "MENUNGGU",
  },
];

const conflictingSchedules = [
  {
    // First schedule: starts at day 1, ends at day 3 (middle)
    id: 1,
    agendaStatus: "BERTUGAS",
    firstDestinationName: "Jakarta Pusat",
    lastDestinationName: "Bandung",
    scheduled: 2, // 3 days duration
    additional: 1,
    position: 0, // starts at first column
    estimatedTotalDistanceKm: 150,
    hasSosIssue: false,
    driverName: "John Doe",
    licensePlate: "B 1234 ABC",
  },
  {
    // Second schedule: starts at day 3 (middle), ends at day 5
    id: 2,
    agendaStatus: "DIJADWALKAN",
    firstDestinationName: "Surabaya",
    lastDestinationName: "Malang",
    scheduled: 2, // 3 days duration
    additional: 1,
    position: 2, // starts at third column (middle)
    estimatedTotalDistanceKm: 90,
    hasSosIssue: false,
    driverName: "Jane Smith",
    licensePlate: "L 9812 AX",
  },
];
const ChangeFleet = ({ cardData }) => {
  const { dateRange } = useDateNavigator();

  // Mock fleet data - replace with actual data from API

  const [selectedFleet, setSelectedFleet] = useState(
    availableFleets[0]?.id || ""
  );

  const [searchValue, setSearchValue] = useState("");

  const [dateOffset, setDateOffset] = useState(0);
  const scheduleContainerWidth = 860;
  const scheduledDays = cardData?.scheduled || 1;
  const days = cardData?.additional || 0;

  // Dummy data for conflicting schedules

  // Calculate dates based on dateRange.start and cardData.position
  const DATES = getDynamicDates(
    dateRange.start,
    cardData?.position || 0,
    dateOffset
  );
  const cellWidth = scheduleContainerWidth / DATES.length;

  // Calculate if there's overflow
  const totalDays = scheduledDays + days;
  const hasOverflow = totalDays > 5;
  const maxOffset = Math.max(0, totalDays - 5);

  // Auto-follow the last estimate when days change
  useEffect(() => {
    if (hasOverflow) {
      // Set dateOffset to show the last estimate date
      setDateOffset(maxOffset);
    } else {
      // Reset to start when no overflow
      setDateOffset(0);
    }
  }, [days, hasOverflow, maxOffset]);

  // Navigation handlers
  const canNavigateLeft = dateOffset > 0;
  const canNavigateRight = dateOffset < maxOffset;

  const handleNavigateLeft = () => {
    if (canNavigateLeft) {
      setDateOffset(dateOffset - 1);
    }
  };

  const handleNavigateRight = () => {
    if (canNavigateRight) {
      setDateOffset(dateOffset + 1);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="font-bold text-neutral-900">Jadwal Bermasalah</div>
        <div className="text-center text-sm font-medium text-neutral-900">
          <div>Terdapat masalah pada agenda armada atau driver kamu.</div>
          <div>Atur ulang pesanan agar masalah terselesaikan.</div>
        </div>
      </div>
      <div className="flex items-center gap-8 border-neutral-200">
        <div className="mb-6 text-sm font-medium text-neutral-600">
          Pilih Armada
        </div>
        <div className="space-y-2.5">
          <div className="">
            <Select.Root
              value={selectedFleet}
              onValueChange={setSelectedFleet}
              onSearch={setSearchValue}
            >
              <Select.Trigger
                placeholder="L 9812 AX - Tractor Head 6 x 4"
                className="w-[264px]"
              >
                <Select.Value>
                  {selectedFleet &&
                    (() => {
                      const selected = availableFleets.find(
                        (f) => f.id === selectedFleet
                      );
                      return selected
                        ? `${selected.licensePlate} - ${selected.truckType}`
                        : "";
                    })()}
                </Select.Value>
              </Select.Trigger>
              <Select.Content
                searchable
                searchPlaceholder="Cari No. Polisi"
                className="w-[264px]"
              >
                {availableFleets?.filter((fleet) =>
                  `${fleet.licensePlate} - ${fleet.truckType}`
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                ).length > 0 ? (
                  availableFleets
                    ?.filter((fleet) =>
                      `${fleet.licensePlate} - ${fleet.truckType}`
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((fleet) => {
                      const isSelected = selectedFleet === fleet.id;
                      return (
                        <Select.Item
                          key={fleet.id}
                          value={fleet.id}
                          className="h-8 py-3 text-xs"
                          textValue={`${fleet.licensePlate} - ${fleet.truckType}`}
                        >
                          <div className="flex w-full items-center justify-between gap-2">
                            <div className="flex flex-col">
                              <span
                                className={`line-clamp-1 text-xs text-neutral-900 ${isSelected ? "font-semibold" : "font-medium"}`}
                              >
                                {fleet.licensePlate} - {fleet.truckType}
                              </span>
                            </div>
                            {!isSelected && (
                              <span
                                className={`flex h-6 min-w-[78px] max-w-[78px] items-center justify-center rounded-md text-xs font-semibold ${statusStyles[fleet.statusKey]}`}
                              >
                                {ChangeFleetTypeEnum[fleet.statusKey] ||
                                  fleet.status}
                              </span>
                            )}
                          </div>
                        </Select.Item>
                      );
                    })
                ) : (
                  <Select.Empty>Data Tidak Ditemukan</Select.Empty>
                )}
              </Select.Content>
            </Select.Root>
          </div>
          <Checkbox label="Tampilkan Armada Serupa" />
        </div>
      </div>
      <div
        className="relative overflow-hidden rounded-md border border-neutral-400"
        style={{ width: `${scheduleContainerWidth}px` }}
      >
        <div className="grid h-14 grid-cols-5 items-center text-center">
          {DATES.map((date, index) => (
            <div
              key={date}
              className={`flex h-full items-center justify-center text-sm font-semibold ${
                index < DATES.length - 1 ? "border-neutral-200" : ""
              } ${index === 2 ? "border-b border-primary-700 bg-red-50 text-error-400" : "border-b text-neutral-900"}`}
            >
              {date}
            </div>
          ))}
        </div>
        <div className="absolute top-3 flex w-full items-center justify-between gap-4 px-2">
          <div className="flex justify-start">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateLeft}
                disabled={!canNavigateLeft}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-left16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
          <div className="flex justify-end">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateRight}
                disabled={!canNavigateRight}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-right16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        </div>
        <div className="relative grid h-[68px] grid-cols-5 overflow-visible border-r">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-full ${
                i === 2 ? "bg-red-50" : "border-r border-neutral-200"
              }`}
            ></div>
          ))}
          {/* First conflicting schedule: Day 1-3 */}
          <CardDetail
            key={`conflict-card-1`}
            cellWidth={cellWidth}
            statusCode={conflictingSchedules[0].agendaStatus}
            firstDestinationName={conflictingSchedules[0].firstDestinationName}
            lastDestinationName={conflictingSchedules[0].lastDestinationName}
            scheduled={conflictingSchedules[0].scheduled}
            additional={conflictingSchedules[0].additional}
            position={conflictingSchedules[0].position}
            distanceRemaining={conflictingSchedules[0].estimatedTotalDistanceKm}
            hasSosIssue={conflictingSchedules[0].hasSosIssue}
          />
        </div>
        <div className="relative grid h-[68px] grid-cols-5 overflow-visible border-r">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-full ${
                i === 2 ? "bg-red-50" : "border-r border-neutral-200"
              }`}
            ></div>
          ))}
          {/* Second conflicting schedule: Day 3-5 */}
          <CardDetail
            key={`conflict-card-2`}
            cellWidth={cellWidth}
            statusCode={conflictingSchedules[1].agendaStatus}
            firstDestinationName={conflictingSchedules[1].firstDestinationName}
            lastDestinationName={conflictingSchedules[1].lastDestinationName}
            scheduled={conflictingSchedules[1].scheduled}
            additional={conflictingSchedules[1].additional}
            position={conflictingSchedules[1].position}
            distanceRemaining={conflictingSchedules[1].estimatedTotalDistanceKm}
            hasSosIssue={conflictingSchedules[1].hasSosIssue}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="w-[112px]" disabled={!selectedFleet}>
          Simpan
        </Button>
      </div>
    </div>
  );
};

export default ChangeFleet;
