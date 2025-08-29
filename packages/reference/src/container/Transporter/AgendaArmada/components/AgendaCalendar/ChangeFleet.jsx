import { useEffect, useMemo, useState } from "react";

import { useGetAlternativeFleetOptions } from "@/services/Transporter/agenda-armada-driver/getAlternativeFleetOptions";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
// import { formatDate } from "@/lib/utils/dateFormat";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Select } from "@/components/Select";

import { useTranslation } from "@/hooks/use-translation";

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

const ChangeFleet = ({
  cardData,
  conflictsData,
  isLoadingConflicts = false,
  conflictingSchedules = [
    {
      // First schedule: starts at day 1, ends at day 3 (middle)
      id: 1,
      fleetID: "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
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
      fleetID: "f1e2d3c4-b5a6-7890-1234-56789abcdef0",
      agendaStatus: "MENUNGGU_JAM_MUAT",
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
  ],
}) => {
  const { t } = useTranslation();
  const { dateRange } = useDateNavigator();
  const [showCompatibleOnly, setShowCompatibleOnly] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [dateOffset, setDateOffset] = useState(0);

  // Use conflicts data from API if available, otherwise use default conflictingSchedules
  const actualConflictingSchedules = useMemo(() => {
    if (conflictsData?.conflicts?.length > 0) {
      // Extract both primary and conflicting schedules from the conflict data
      const schedules = [];
      conflictsData.conflicts.forEach((conflict) => {
        // Add primary schedule
        if (conflict.primarySchedule) {
          schedules.push({
            id: `${conflict.id}-primary`,
            fleetID:
              conflict.primarySchedule.fleetID ||
              conflict.primarySchedule.fleetLicensePlate,
            agendaStatus: conflict.primarySchedule.agendaStatus || "BERTUGAS",
            firstDestinationName:
              conflict.primarySchedule.loadingName || "Unknown",
            lastDestinationName:
              conflict.primarySchedule.unloadingName || "Unknown",
            scheduled: 2, // Default values for display
            additional: 1,
            position: 0,
            estimatedTotalDistanceKm:
              conflict.primarySchedule.estimatedDistanceKm || 0,
            hasSosIssue: false,
            driverName: conflict.primarySchedule.driverName || "Unknown Driver",
            licensePlate:
              conflict.primarySchedule.fleetLicensePlate || "Unknown",
          });
        }
        // Add conflicting schedule
        if (conflict.conflictingSchedule) {
          schedules.push({
            id: `${conflict.id}-conflicting`,
            fleetID:
              conflict.conflictingSchedule.fleetID ||
              conflict.conflictingSchedule.fleetLicensePlate,
            agendaStatus:
              conflict.conflictingSchedule.agendaStatus || "BERTUGAS",
            firstDestinationName:
              conflict.conflictingSchedule.loadingName || "Unknown",
            lastDestinationName:
              conflict.conflictingSchedule.unloadingName || "Unknown",
            scheduled: 2, // Default values for display
            additional: 1,
            position: 2, // Position it in the middle to show conflict
            estimatedTotalDistanceKm:
              conflict.conflictingSchedule.estimatedDistanceKm || 0,
            hasSosIssue: false,
            driverName:
              conflict.conflictingSchedule.driverName || "Unknown Driver",
            licensePlate:
              conflict.conflictingSchedule.fleetLicensePlate || "Unknown",
          });
        }
      });
      return schedules;
    }
    return conflictingSchedules;
  }, [conflictsData, conflictingSchedules]);

  const conflictId = conflictsData?.conflicts?.[0]?.id || "conflict-456"; // Use first conflict ID from API
  const { data: alternativeFleetData } = useGetAlternativeFleetOptions(
    conflictId,
    searchValue
  );
  const availableFleets = (alternativeFleetData?.alternatives || []).map(
    (item) => {
      let statusKey = "TERSEDIA";
      switch (item.availableDriver?.driverStatus) {
        case "Bertugas":
          statusKey = "BERTUGAS";
          break;
        case "Menunggu":
          statusKey = "MENUNGGU";
          break;
        case "Non Aktif":
          statusKey = "NON_AKTIF";
          break;
        default:
          statusKey = "TERSEDIA";
      }
      return {
        id: item.fleetID,
        licensePlate: item.licensePlate,
        truckType: item.truckTypeName,
        status: ChangeFleetTypeEnum[statusKey],
        statusKey,
        driver: item.availableDriver,
        availabilityScore: item.availabilityScore,
        estimatedReadyTime: item.estimatedReadyTime,
        isCompatible: item.isCompatible,
      };
    }
  );

  // Set default selectedFleet when availableFleets is loaded
  useEffect(() => {
    if (!selectedFleet && availableFleets.length > 0) {
      // Try to match the fleetID from the first conflicting schedule
      const defaultFleetId = actualConflictingSchedules[0]?.fleetID;
      const found = availableFleets.find((f) => f.id === defaultFleetId);
      setSelectedFleet(found ? found.id : availableFleets[0].id);
    }
  }, [availableFleets, selectedFleet, actualConflictingSchedules]);

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
        <div className="font-bold text-neutral-900">
          {t("ChangeFleet.problemSchedule", {}, "Jadwal Bermasalah")}
        </div>
        <div className="text-center text-sm font-medium text-neutral-900">
          <div>
            {t(
              "ChangeFleet.problemDescription1",
              {},
              "Terdapat masalah pada agenda armada atau driver kamu."
            )}
          </div>
          <div>
            {t(
              "ChangeFleet.problemDescription2",
              {},
              "Atur ulang pesanan agar masalah terselesaikan."
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8 border-neutral-200">
        <div className="mb-6 text-sm font-medium text-neutral-600">
          {t("ChangeFleet.selectFleet", {}, "Pilih Armada")}
        </div>
        <div className="space-y-2.5">
          <div className="">
            <Select.Root
              value={selectedFleet}
              onValueChange={setSelectedFleet}
              onSearch={setSearchValue}
            >
              <Select.Trigger
                placeholder={t(
                  "ChangeFleet.selectPlaceholder",
                  {},
                  "L 9812 AX - Tractor Head 6 x 4"
                )}
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
                searchPlaceholder={t(
                  "ChangeFleet.searchPlaceholder",
                  {},
                  "Cari No. Polisi"
                )}
                className="w-[264px]"
              >
                {(() => {
                  let filteredFleets = availableFleets.filter((fleet) =>
                    `${fleet.licensePlate} - ${fleet.truckType}`
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  );
                  if (showCompatibleOnly) {
                    filteredFleets = filteredFleets.filter(
                      (fleet) => fleet.isCompatible
                    );
                  }
                  return filteredFleets.length > 0 ? (
                    filteredFleets.map((fleet) => {
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
                                {t(
                                  `ChangeFleet.status.${fleet.statusKey}`,
                                  {},
                                  ChangeFleetTypeEnum[fleet.statusKey] ||
                                    fleet.status
                                )}
                              </span>
                            )}
                          </div>
                        </Select.Item>
                      );
                    })
                  ) : (
                    <Select.Empty>
                      {t(
                        "ChangeFleet.dataNotFound",
                        {},
                        "Data Tidak Ditemukan"
                      )}
                    </Select.Empty>
                  );
                })()}
              </Select.Content>
            </Select.Root>
          </div>
          <Checkbox
            label={t(
              "ChangeFleet.showSimilarFleet",
              {},
              "Tampilkan Armada Serupa"
            )}
            checked={showCompatibleOnly}
            onChange={({ checked }) => setShowCompatibleOnly(checked)}
          />
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
            statusCode={actualConflictingSchedules[0]?.agendaStatus}
            firstDestinationName={
              actualConflictingSchedules[0]?.firstDestinationName
            }
            lastDestinationName={
              actualConflictingSchedules[0]?.lastDestinationName
            }
            scheduled={actualConflictingSchedules[0]?.scheduled}
            additional={actualConflictingSchedules[0]?.additional}
            position={actualConflictingSchedules[0]?.position}
            distanceRemaining={
              actualConflictingSchedules[0]?.estimatedTotalDistanceKm
            }
            hasSosIssue={actualConflictingSchedules[0]?.hasSosIssue}
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
            statusCode={actualConflictingSchedules[1]?.agendaStatus}
            firstDestinationName={
              actualConflictingSchedules[1]?.firstDestinationName
            }
            lastDestinationName={
              actualConflictingSchedules[1]?.lastDestinationName
            }
            scheduled={actualConflictingSchedules[1]?.scheduled}
            additional={actualConflictingSchedules[1]?.additional}
            position={actualConflictingSchedules[1]?.position}
            distanceRemaining={
              actualConflictingSchedules[1]?.estimatedTotalDistanceKm
            }
            hasSosIssue={actualConflictingSchedules[1]?.hasSosIssue}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button className="w-[112px]" disabled={!selectedFleet}>
          {t("ChangeFleet.save", {}, "Simpan")}
        </Button>
      </div>
    </div>
  );
};

export default ChangeFleet;
