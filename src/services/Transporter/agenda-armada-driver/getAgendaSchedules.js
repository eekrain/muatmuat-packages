import useSWRInfinite from "swr/infinite";

import {
  STATUS_CODES,
  driverNames,
  locations,
  truckTypes,
} from "./getAgendaSchedules.data";

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const generatePlateNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = Array.from(
    { length: 3 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");
  return `L ${getRandomInt(1000, 9999)} ${randomLetters}`;
};

// --- Updated Data Generator ---
const generateMockRowData = () => {
  const statusCode = getRandomElement(STATUS_CODES);
  const positionPattern = getRandomElement([
    "fully_in_view",
    "starts_before",
    "ends_after",
  ]);
  let position, scheduled;
  const additional = getRandomInt(0, 1);

  switch (positionPattern) {
    case "starts_before": {
      // With max duration 4 (3 sched + 1 add), earliest start is pos -3.
      position = getRandomInt(-3, -1);
      const minScheduled = 1 - position - additional;
      const maxScheduledByView = 5 - position - additional;
      // Enforce the new rule: scheduled value cannot be more than 3
      const finalMaxScheduled = Math.min(maxScheduledByView, 3);
      scheduled = getRandomInt(minScheduled, finalMaxScheduled);
      break;
    }
    case "ends_after": {
      // With max duration 4, earliest start to guarantee ending after is pos 2.
      position = getRandomInt(2, 4);
      const minScheduled = 6 - position - additional;
      // Enforce the new rule: scheduled value cannot be more than 3
      scheduled = getRandomInt(Math.max(1, minScheduled), 3);
      break;
    }
    case "fully_in_view":
    default: {
      position = getRandomInt(0, 4);
      const maxScheduledByView = Math.max(1, 5 - position - additional);
      // Enforce the new rule: scheduled value cannot be more than 3
      const finalMaxScheduled = Math.min(maxScheduledByView, 3);
      scheduled = getRandomInt(1, finalMaxScheduled);
      break;
    }
  }

  const isInactive = statusCode === "NON_AKTIF";
  const isFinished = statusCode === "PENGIRIMAN_SELESAI";

  return {
    statusCode,
    position,
    scheduled,
    additional,
    driverName: getRandomElement(driverNames),
    hasSosIssue: statusCode === "BERTUGAS" && Math.random() < 0.5,
    currentLocation: isInactive
      ? "Garasi Pool Kendaraan"
      : getRandomElement(locations),
    estimation:
      isInactive || isFinished
        ? null
        : `est. ${getRandomInt(5, 50)}km (${getRandomInt(1, 2)}jam ${getRandomInt(10, 59)}menit)`,
    distanceRemaining: isFinished || isInactive ? 0 : getRandomInt(1, 200),
    dataMuat: isInactive
      ? null
      : { title: "Lokasi Muat", subtitle: getRandomElement(locations) },
    dataBongkar: isInactive
      ? null
      : { title: "Lokasi Bongkar", subtitle: getRandomElement(locations) },
  };
};

// Generate different datasets for different date ranges
const generateDatasetForDateRange = (startDate, endDate) => {
  // Create a simple hash from the date range to ensure different but consistent data
  const dateString = `${startDate}-${endDate}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use hash to determine dataset characteristics
  const baseSize = 45;
  const variance = (Math.abs(hash) % 20) - 10; // -10 to +9 variance
  const datasetSize = Math.max(15, Math.min(75, baseSize + variance));

  // Generate data with modified randomness based on hash
  const dataset = [];
  for (let i = 0; i < datasetSize; i++) {
    // Create pseudo-random values based on hash and index
    const localSeed = Math.abs(hash + i * 1000);
    const pseudoRandom1 = (localSeed % 1000) / 1000;
    const pseudoRandom2 = ((localSeed * 7) % 1000) / 1000;
    const pseudoRandom3 = ((localSeed * 13) % 1000) / 1000;

    // Mix real randomness with pseudo-randomness for variety
    const mixedRandom1 = (Math.random() + pseudoRandom1) / 2;
    const mixedRandom2 = (Math.random() + pseudoRandom2) / 2;
    const mixedRandom3 = (Math.random() + pseudoRandom3) / 2;

    // Generate variations in the data
    const statusOptions = STATUS_CODES;
    const statusIndex = Math.floor(mixedRandom1 * statusOptions.length);
    const locationIndex = Math.floor(mixedRandom2 * locations.length);
    const driverIndex = Math.floor(mixedRandom3 * driverNames.length);

    dataset.push({
      plateNumber: generatePlateNumber(),
      truckType: getRandomElement(truckTypes),
      rowData: [
        {
          ...generateMockRowData(),
          statusCode: statusOptions[statusIndex],
          currentLocation:
            statusOptions[statusIndex] === "NON_AKTIF"
              ? "Garasi Pool Kendaraan"
              : locations[locationIndex],
          driverName: driverNames[driverIndex],
        },
      ],
    });
  }

  return dataset;
};

const FULL_MOCK_DATASET = Array.from({ length: 45 }, () => ({
  plateNumber: generatePlateNumber(),
  truckType: getRandomElement(truckTypes),
  rowData: [generateMockRowData()],
}));

// --- The "Backend" Logic ---
const runMockApiLogic = (params) => {
  const {
    page = 1,
    limit = 10,
    agenda_status,
    search,
    schedule_date_from,
    schedule_date_to,
  } = params;

  // Generate different data based on date range if provided
  let results;
  if (schedule_date_from || schedule_date_to) {
    const startDateKey = schedule_date_from || "default-start";
    const endDateKey = schedule_date_to || "default-end";
    results = [...generateDatasetForDateRange(startDateKey, endDateKey)];
  } else {
    results = [...FULL_MOCK_DATASET];
  }

  if (search) {
    results = results.filter(
      (item) =>
        item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.rowData[0].driverName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (agenda_status && agenda_status.length > 0) {
    results = results.filter((item) =>
      agenda_status.includes(item.rowData[0].statusCode)
    );
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limit);
  const paginatedSchedules = results.slice((page - 1) * limit, page * limit);

  return {
    Message: { Code: 200, Text: "Data agenda berhasil dimuat" },
    Data: {
      schedules: paginatedSchedules,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
      summary: { totalArmada: totalItems, totalDriver: 42, statusCounts: {} },
      lastUpdated: new Date().toISOString(),
    },
    Type: "GET_AGENDA_SCHEDULES",
  };
};

// --- The Fetcher ---
export const getAgendaSchedules = async (key) => {
  const [, params] = key;
  await new Promise((resolve) => setTimeout(resolve, 750));
  // const probability = Math.random();
  // if (probability < 0.2) throw new Error("Mock API error for testing purposes");
  return runMockApiLogic(params);
};

// --- The Hook ---
export const useGetAgendaSchedules = ({
  limit = 10,
  view_type = "armada",
  agenda_status = [],
  search,
  schedule_date_from,
  schedule_date_to,
}) => {
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.Data.schedules.length)
        return null;
      if (
        previousPageData &&
        previousPageData.Data.pagination.currentPage >=
          previousPageData.Data.pagination.totalPages
      )
        return null;

      const page = pageIndex + 1;
      const params = {
        page,
        limit,
        view_type,
        agenda_status: agenda_status.length > 0 ? agenda_status : undefined,
        search: search || undefined,
        schedule_date_from: schedule_date_from
          ? schedule_date_from.toISOString().split("T")[0]
          : undefined,
        schedule_date_to: schedule_date_to
          ? schedule_date_to.toISOString().split("T")[0]
          : undefined,
      };
      return [`/v1/transporter/agenda-schedules`, params];
    },
    getAgendaSchedules
  );

  const schedules = data ? data.flatMap((page) => page?.Data?.schedules) : [];
  // const schedules = [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.Data.schedules.length === 0;

  const pagination = data?.[data.length - 1]?.Data.pagination;
  const isReachingEnd =
    isEmpty || (pagination && pagination.currentPage >= pagination.totalPages);

  return {
    schedules,
    data,
    error,
    isLoadingInitialData,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    isValidating,
    mutate,
  };
};
