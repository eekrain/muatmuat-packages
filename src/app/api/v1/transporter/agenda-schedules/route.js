import { NextResponse } from "next/server";

import { MOCK_DATABASE, driverNames } from "./data";

// This is the Next.js API Route Handler
export async function GET(request) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 750));

  // Parse query parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Helper function to clean parameters
  const cleanParam = (value) => {
    if (!value || value === "undefined" || value === "null") return undefined;
    return value;
  };

  const params = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    view_type: searchParams.get("view_type") || "armada",
    search: cleanParam(searchParams.get("search")),
    agenda_status: cleanParam(searchParams.get("agenda_status"))
      ?.split(",")
      .filter(Boolean),
    schedule_date_from: cleanParam(searchParams.get("schedule_date_from")),
    schedule_date_to: cleanParam(searchParams.get("schedule_date_to")),
  };

  const {
    page,
    limit,
    view_type,
    search,
    agenda_status,
    schedule_date_from,
    schedule_date_to,
  } = params;

  console.log("🗓️ API Request:", {
    page,
    limit,
    view_type,
    search,
    agenda_status,
    schedule_date_from,
    schedule_date_to,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Select the correct dataset from our mock database
  let results = [...(MOCK_DATABASE[view_type] || MOCK_DATABASE.armada)];

  console.log("📊 Initial data:", {
    totalItems: results.length,
    firstItemStructure: results[0] ? Object.keys(results[0]) : "No items",
    hasSchedules: results.length > 0 ? results[0].schedule?.length : 0,
  });

  // Always ensure we have date filters - if not provided, use current date range
  const today = new Date();
  const defaultStartDate = schedule_date_from
    ? new Date(schedule_date_from)
    : today;
  const defaultEndDate = schedule_date_to
    ? new Date(schedule_date_to)
    : new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from today

  // Update all schedules to have dates within the requested range
  results = results.map((item) => {
    // Generate a random date within the requested range for this schedule
    const randomTime =
      defaultStartDate.getTime() +
      Math.random() * (defaultEndDate.getTime() - defaultStartDate.getTime());
    const scheduleDate = new Date(randomTime);
    const scheduleDateStr = scheduleDate.toISOString().split("T")[0];

    return {
      ...item,
      start_date: scheduleDateStr, // Add start_date property expected by frontend
      schedule: item.schedule.map((task) => {
        return {
          ...task,
          scheduleDate: scheduleDate.toISOString(),
          scheduleEndDate: scheduleDate.toISOString(),
          additionalUnloadTimeStart: scheduleDate.toISOString(),
          additionalUnloadTimeEnd: scheduleDate.toISOString(),
          scheduledStartTime: scheduleDate.toISOString(),
          scheduledEndTime: scheduleDate.toISOString(),
        };
      }),
    };
  });

  // --- Perform dynamic filtering and processing ---
  if (search && search.trim().length > 0) {
    results = results.filter((item) => {
      const searchLower = search.toLowerCase();
      if (view_type === "driver") {
        return item.driverName?.toLowerCase().includes(searchLower);
      }
      return item.licensePlate?.toLowerCase().includes(searchLower);
    });
  }

  if (agenda_status && agenda_status.length > 0) {
    results = results
      .map((item) => ({
        ...item,
        schedule: item.schedule.filter((task) =>
          agenda_status.includes(task.agendaStatus)
        ),
      }))
      .filter((item) => item.schedule.length > 0);
  }

  const countPerDay = [0, 0, 0, 0, 0];
  const countConflictedPerDay = [false, false, false, false, false];
  results.forEach((item) => {
    item.schedule.forEach((task) => {
      const duration = (task.scheduled || 0) + (task.additional || 0);
      const startPosition = task.position;
      const endPosition = startPosition + duration - 1;
      for (let i = startPosition; i <= endPosition; i++) {
        if (i >= 0 && i < 5) {
          countPerDay[i]++;
          if (task.isConflicted) {
            countConflictedPerDay[i] = true;
          }
        }
      }
    });
  });

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limit);
  const baseSchedules = results.slice((page - 1) * limit, page * limit);

  console.log("📋 Final processing:", {
    totalItems,
    totalPages,
    currentPage: page,
    baseSchedulesLength: baseSchedules.length,
    firstBaseSchedule: baseSchedules[0]
      ? {
          licensePlate: baseSchedules[0].licensePlate,
          hasStartDate: !!baseSchedules[0].start_date,
          scheduleCount: baseSchedules[0].schedule?.length || 0,
        }
      : "No base schedules",
  });

  // Only add placeholders if we have fewer than 4 real items AND we're on the last page
  // This ensures we always prioritize showing real data
  const minRows = 4;
  const isLastPage = page >= totalPages;
  const shouldAddPlaceholders =
    isLastPage && baseSchedules.length > 0 && baseSchedules.length < minRows;

  // For debugging: let's not add any placeholders if we have real data
  const placeholderCount = 0; // Temporarily disable placeholders to see real data

  const placeholderStructure = {
    licensePlate: null,
    truck: null,
    driver: null,
    phone: null,
    email: null,
    schedule: [],
    isPlaceholder: true,
    start_date: schedule_date_from || new Date().toISOString().split("T")[0], // Add start_date to placeholders too
  };
  const placeholders = Array.from(
    { length: placeholderCount },
    () => ({ ...placeholderStructure }) // Use spread to create new objects
  );
  const paginatedSchedules = [...baseSchedules, ...placeholders];

  const responseData = {
    Message: {
      Code: 200,
      Text: "Data agenda berhasil dimuat",
    },
    Data: {
      schedules: paginatedSchedules,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      summary: {
        totalArmada: totalItems,
        totalDriver: driverNames.length,
        statusCounts: {},
        countPerDay,
        countConflictedPerDay,
      },
      lastUpdated: new Date().toISOString(),
    },
    Type: "GET_AGENDA_SCHEDULES",
  };

  // Return the data as a JSON response
  return NextResponse.json(responseData);
}
