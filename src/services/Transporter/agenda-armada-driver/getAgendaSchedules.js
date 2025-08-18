import {
  STATUS_CODES,
  driverNames,
  locations,
  randomEmail,
  randomPhoneNumber,
  truckTypes,
} from "./getAgendaSchedules.data";

// Hardcoded license plates and driver names for consistent autocomplete
export const HARDCODED_PLATES = [
  "B 1234 ABC",
  "L 5678 XYZ",
  "D 9999 DEF",
  "W 1111 GHI",
  "F 2222 JKL",
  "B 3333 MNO",
  "L 4444 PQR",
  "D 5555 STU",
];

export const HARDCODED_DRIVERS = [
  "John Doe",
  "Jane Smith",
  "Ahmad Rahman",
  "Siti Nurhaliza",
  "Budi Santoso",
  "Maria Santos",
  "Ridwan Kamil",
  "Dewi Sartika",
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePlateNumber = () => {
  return getRandomElement(HARDCODED_PLATES);
};

const getDriverName = () => {
  return getRandomElement(HARDCODED_DRIVERS);
};

// --- Data Generator for a single task ---
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
      position = getRandomInt(-3, -1);
      const minScheduled = 1 - position - additional;
      const maxScheduledByView = 5 - position - additional;
      const finalMaxScheduled = Math.min(maxScheduledByView, 3);
      scheduled = getRandomInt(minScheduled, finalMaxScheduled);
      break;
    }
    case "ends_after": {
      position = getRandomInt(2, 4);
      const minScheduled = 6 - position - additional;
      scheduled = getRandomInt(Math.max(1, minScheduled), 3);
      break;
    }
    case "fully_in_view":
    default: {
      position = getRandomInt(0, 4);
      const maxScheduledByView = Math.max(1, 5 - position - additional);
      const finalMaxScheduled = Math.min(maxScheduledByView, 3);
      scheduled = getRandomInt(1, finalMaxScheduled);
      break;
    }
  }

  const isInactive = statusCode === "NON_AKTIF";
  const isFinished = statusCode === "PENGIRIMAN_SELESAI";
  const mustHaveLocationData = statusCode === "MENUNGGU_JAM_MUAT";
  const dataMuat =
    isInactive && !mustHaveLocationData
      ? null
      : { title: "Lokasi Muat", subtitle: getRandomElement(locations) };
  const dataBongkar =
    isInactive && !mustHaveLocationData
      ? null
      : { title: "Lokasi Bongkar", subtitle: getRandomElement(locations) };

  return {
    statusCode,
    position,
    scheduled,
    additional,
    hasSosIssue: statusCode === "BERTUGAS" && Math.random() < 0.5,
    currentLocation: isInactive
      ? "Garasi Pool Kendaraan"
      : getRandomElement(locations),
    estimation:
      isInactive || isFinished
        ? null
        : `est. ${getRandomInt(5, 50)}km (${getRandomInt(1, 2)}jam ${getRandomInt(10, 59)}menit)`,
    distanceRemaining: isFinished || isInactive ? 0 : getRandomInt(1, 200),
    dataMuat,
    dataBongkar,
  };
};

// --- START: New Generator for Driver View ---
// Generates a schedule item including plate/truck info
const generateDriverViewScheduleItem = () => ({
  plateNumber: generatePlateNumber(),
  truckType: getRandomElement(truckTypes),
  ...generateMockRowData(),
});

// Generates the full dataset grouped by driver
const generateDriverViewDataset = () => {
  return driverNames.map((driverName) => ({
    driverName: driverName,
    driverEmail: getRandomElement(randomEmail),
    driverPhone: getRandomElement(randomPhoneNumber),
    // Each driver gets 1 to 3 tasks
    schedules: Array.from(
      { length: getRandomInt(1, 3) },
      generateDriverViewScheduleItem
    ),
  }));
};
// --- END: New Generator for Driver View ---

const generateArmadaViewDataset = (size) => {
  return Array.from({ length: size }, () => ({
    plateNumber: generatePlateNumber(),
    truckType: getRandomElement(truckTypes),
    rowData: [{ ...generateMockRowData(), driverName: getDriverName() }],
  }));
};

// --- The "Backend" Logic ---
const runMockApiLogic = (params) => {
  const {
    page = 1,
    limit = 10,
    agenda_status,
    search,
    view_type = "armada",
  } = params;

  let results;

  // --- START: Logic to switch between view types ---
  if (view_type === "driver") {
    results = generateDriverViewDataset();
    if (search) {
      results = results.filter((driver) =>
        driver.driverName.toLowerCase().includes(search.toLowerCase())
      );
    }
  } else {
    // Default to "armada" view
    results = generateArmadaViewDataset(45);
    if (search) {
      results = results.filter(
        (item) =>
          item.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
          item.rowData[0].driverName
            .toLowerCase()
            .includes(search.toLowerCase())
      );
      // Ensure unique plate numbers for armada search
      const seenPlates = new Set();
      results = results.filter((item) => {
        if (seenPlates.has(item.plateNumber)) return false;
        seenPlates.add(item.plateNumber);
        return true;
      });
    }
  }
  // --- END: Logic to switch between view types ---

  if (agenda_status && agenda_status.length > 0) {
    if (view_type === "driver") {
      // Filter the nested schedules for each driver
      results = results
        .map((driver) => ({
          ...driver,
          schedules: driver.schedules.filter((task) =>
            agenda_status.includes(task.statusCode)
          ),
        }))
        .filter((driver) => driver.schedules.length > 0); // Only keep drivers that still have tasks
    } else {
      results = results.filter((item) =>
        agenda_status.includes(item.rowData[0].statusCode)
      );
    }
  }

  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / limit);
  const baseSchedules = results.slice((page - 1) * limit, page * limit);

  const minRows = 4;
  const placeholderCount = Math.max(0, minRows - baseSchedules.length);
  const placeholderStructure =
    view_type === "driver"
      ? {
          driverName: null,
          driverEmail: null,
          driverPhone: null,
          schedules: [],
          isPlaceholder: true,
        }
      : {
          plateNumber: null,
          truckType: null,
          rowData: [],
          isPlaceholder: true,
        };
  const placeholders = Array.from(
    { length: placeholderCount },
    () => placeholderStructure
  );

  const paginatedSchedules = [...baseSchedules, ...placeholders];

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
  return runMockApiLogic(params);
};
