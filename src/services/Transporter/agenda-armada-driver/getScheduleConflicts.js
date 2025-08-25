import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true; // Set to false to use real API

// Mock API result for development/testing
export const apiResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Data konflik jadwal berhasil dimuat",
    },
    Data: {
      conflicts: [
        {
          id: "uuid", // [dbt_mt_schedule_conflict.id]
          conflictType: "TIME_OVERLAP", // [dbt_mt_schedule_conflict.conflictType]
          resolutionStatus: "PENDING", // [dbt_mt_schedule_conflict.resolutionStatus]
          primarySchedule: {
            agendaStatus: "Bertugas", // [dbt_mt_agenda_schedule.status]
            estimatedDistanceKm: 10, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
            id: "uuid", // [dbt_mt_schedule_conflict.primaryScheduleID]
            orderCode: "ORD-001", // [dbt_mt_order.orderCode]
            fleetLicensePlate: "B1234ABC", // [dbm_mt_fleet.licensePlate]
            driverName: "John Doe", // [dbt_mt_drivers.name]
            unloadingName: "Jakarta", // [dbt_mt_agenda_schedule.unloadingName]
            loadingName: "Surabaya", // [dbt_mt_agenda_schedule.loadingName]
            scheduledTime: "2024-04-01T08:00:00Z", // [dbt_mt_agenda_schedule.scheduledStartTime]
          },
          conflictingSchedule: {
            agendaStatus: "Bertugas", // [dbt_mt_agenda_schedule.status]
            estimatedDistanceKm: 10, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
            id: "uuid", // [dbt_mt_schedule_conflict.conflictingScheduleID]
            orderCode: "ORD-002", // [dbt_mt_order.orderCode]
            fleetLicensePlate: "B1234ABC", // [dbm_mt_fleet.licensePlate]
            driverName: "John Doe", // [dbt_mt_drivers.name]
            unloadingName: "Jakarta", // [dbt_mt_agenda_schedule.unloadingName]
            loadingName: "Surabaya", // [dbt_mt_agenda_schedule.loadingName]
            scheduledTime: "2024-04-01T08:30:00Z", // [dbt_mt_agenda_schedule.scheduledStartTime]
          },
          detectedAt: "2024-04-01T07:45:00Z", // [dbt_mt_schedule_conflict.detectedAt]
        },
      ],
    },
    Type: "GET_SCHEDULE_CONFLICTS",
  },
};

export const fetcherScheduleConflicts = async () => {
  if (useMockData) {
    // Return mock data for development
    return apiResult.data.Data;
  } else {
    const result = await fetcherMuatrans.get(
      `/v1/transporter/agenda-schedules/conflicts`
    );
    return result?.data?.Data || null;
  }
};

export const useGetScheduleConflicts = () =>
  useSWR(`agenda-schedules/conflicts`, fetcherScheduleConflicts);
