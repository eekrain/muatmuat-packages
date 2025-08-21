import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { StatusArmadaTypeEnum } from "@/lib/constants/Transporter/agendaArmada/agenda.enum";

const useMockData = true; // Set to false to use real API

// Mock API result for development/testing
export const mockAPIResult = {
  data: {
    Message: {
      Code: 200,
      Text: "Detail jadwal berhasil dimuat",
    },
    Data: {
      id: "uuid", // [dbt_mt_agenda_schedule.id]
      orderCode: "ORD-001", // [dbt_mt_order.orderCode]
      agendaStatus: StatusArmadaTypeEnum.BERTUGAS, // [dbt_mt_agenda_schedule.agendaStatus]
      fleet: {
        licensePlate: "B1234ABC", // [dbm_mt_fleet.licensePlate]
        truckTypeName: "Box Truck", // [dbt_mt_order.truckTypeName]
        currentLocation: {
          name: "Jakarta", // [dbt_mt_agenda_schedule.currentLocationName]
          latitude: -6.2088, // [dbt_mt_fleet_tracking.currentLatitude]
          longitude: 106.8456, // [dbt_mt_fleet_tracking.currentLongitude]
          estimatedNextDestinationDistance: 30, // jarak dari next destinasi
          estimatedNextDestinationTime: 30, // waktu tempuh ke next destinasi (menit)
        },
      },
      cargo: [
        {
          name: "Besi", // [dbt_mt_cargo.name]
          quantity: 10, // [dbt_mt_cargo.quantity]
          unit: "pcs", // [dbt_mt_cargo.unit]
        },
        {
          name: "Besi", // [dbt_mt_cargo.name]
          quantity: 10, // [dbt_mt_cargo.quantity]
          unit: "pcs", // [dbt_mt_cargo.unit]
        },
        {
          name: "Besi", // [dbt_mt_cargo.name]
          quantity: 10, // [dbt_mt_cargo.quantity]
          unit: "pcs", // [dbt_mt_cargo.unit]
        },
        {
          name: "Besi", // [dbt_mt_cargo.name]
          quantity: 10, // [dbt_mt_cargo.quantity]
          unit: "pcs", // [dbt_mt_cargo.unit]
        },
        {
          name: "Besi", // [dbt_mt_cargo.name]
          quantity: 10, // [dbt_mt_cargo.quantity]
          unit: "pcs", // [dbt_mt_cargo.unit]
        },
      ],
      driver: {
        name: "John Doe", // [dbt_mt_drivers.name]
        phoneNumber: "+6281234567890", // [dbt_mt_drivers.phoneNumber]
      },
      schedule: {
        scheduledStartTime: "2024-04-01T08:00:00Z", // [dbt_mt_agenda_schedule.scheduledStartTime]
        scheduledEndTime: "2024-04-01T17:00:00Z", // [dbt_mt_agenda_schedule.scheduledEndTime]
        actualStartTime: "2024-04-01T08:15:00Z", // [dbt_mt_agenda_schedule.actualStartTime]
        estimatedArrival: "2024-04-01T16:30:00Z", // [dbt_mt_fleet_tracking.estimatedArrival]
      },
      route: {
        unloadingName: "Jakarta", // [dbt_mt_agenda_schedule.unloadingName]
        loadingName: "Surabaya", // [dbt_mt_agenda_schedule.loadingName]
        estimatedDistanceKm: 121.5, // [dbt_mt_agenda_schedule.estimatedDistanceKm]
        // "estimatedDurationMinutes": 480 // [dbt_mt_agenda_schedule.estimatedDurationMinutes]
        // "routeProgressPercent": 65.5, // [dbt_mt_fleet_tracking.routeProgressPercent]
        // "remainingDistanceKm": 42.3 // [dbt_mt_fleet_tracking.remainingDistanceKm]
      },
      issues: {
        hasSosIssue: true, // [dbt_mt_agenda_schedule.hasSosIssue]
        sosMessage: "Mogok",
        hasUrgentIssue: false, // [dbt_mt_agenda_schedule.hasUrgentIssue]
        isConflicted: false, // [dbt_mt_agenda_schedule.isConflicted]
      },
      tracking: {
        speedKmh: 65.0, // [dbt_mt_fleet_tracking.speedKmh]
        isOnRoute: true, // [dbt_mt_fleet_tracking.isOnRoute]
        lastUpdateReceived: "2024-04-01T10:30:00Z", // [dbt_mt_fleet_tracking.lastUpdateReceived]
      },
    },
    Type: "GET_SCHEDULE_DETAILS",
  },
};

export const getAgendaScheduleDetail = async ({ driverId }) => {
  if (useMockData) {
    // Return mock data for development
    return mockAPIResult.data;
  }

  const result = await fetcherMuatrans.get(
    `v1/transporter/agenda-schedules/${driverId}/details`
  );
  return result.data;
};

export const useGetAgendaScheduleDetail = (driverId) =>
  useSWR(`agenda-schedules-detail/${driverId}`, getAgendaScheduleDetail);
