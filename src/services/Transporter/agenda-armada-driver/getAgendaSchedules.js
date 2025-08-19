import xior from "xior";

const useMockData = true;

/**
 * @typedef {Object} Estimation
 * @property {string} currentLocation - Nama lokasi terakhir armada berada.
 * @property {number} nextDistance - Jarak ke destinasi berikutnya (km).
 * @property {number} nextTime - Perkiraan waktu tempuh ke destinasi berikutnya (menit).
 */

/**
 * @typedef {Object} ScheduleItem
 * @property {string} id - ID unik schedule.
 * @property {string} orderID - ID pesanan terkait schedule.
 * @property {string} fleetID - ID armada (fleet) yang ditugaskan.
 * @property {string} driverID - ID pengemudi yang ditugaskan.
 * @property {string} scheduleDate - Tanggal mulai schedule (ISO string).
 * @property {string} scheduleEndDate - Tanggal selesai schedule (ISO string).
 * @property {string} additionalUnloadTimeStart - Tambahan waktu bongkar mulai (ISO string).
 * @property {string} additionalUnloadTimeEnd - Tambahan waktu bongkar selesai (ISO string).
 * @property {string} scheduledStartTime - Waktu mulai penjadwalan (ISO string).
 * @property {string} scheduledEndTime - Waktu selesai penjadwalan (ISO string).
 * @property {string} agendaStatus - Status agenda (misalnya: "BERTUGAS").
 * @property {number} position - Urutan schedule dalam daftar.
 * @property {number} scheduled - Jumlah tugas utama.
 * @property {number} additional - Jumlah tugas tambahan.
 * @property {boolean} hasSosIssue - Apakah armada memiliki masalah SOS.
 * @property {boolean} isConflicted - Apakah jadwal bertabrakan.
 * @property {Estimation} estimation - Estimasi jarak & waktu perjalanan.
 * @property {string} firstDestinationName - Nama tujuan pertama.
 * @property {number} estimatedTotalDistanceKm - Estimasi total jarak perjalanan (km).
 * @property {string} lastDestinationName - Nama tujuan terakhir.
 * @property {string|null} driverName - Nama pengemudi, bisa null.
 * @property {string|null} licensePlate - Nomor polisi kendaraan, bisa null.
 * @property {string|null} truckType - Jenis truk, bisa null.
 */

/**
 * @typedef {Object} Schedule
 * @property {string} licensePlate - Nomor polisi kendaraan.
 * @property {string} truckType - Jenis truk.
 * @property {string|null} driverName - Nama pengemudi.
 * @property {string|null} driverPhone - Nomor telepon pengemudi.
 * @property {string|null} driverEmail - Email pengemudi.
 * @property {ScheduleItem[]} schedule - Daftar jadwal untuk armada.
 */

/**
 * @typedef {Object} Pagination
 * @property {number} currentPage - Halaman saat ini.
 * @property {number} totalPages - Total halaman tersedia.
 * @property {number} totalItems - Total item data.
 * @property {number} itemsPerPage - Jumlah item per halaman.
 */

/**
 * @typedef {Object} Summary
 * @property {number} totalArmada - Jumlah total armada.
 * @property {number} totalDriver - Jumlah total driver.
 * @property {Object.<string, number>} statusCounts - Jumlah agenda berdasarkan status.
 * @property {number[]} countPerDay - Jumlah agenda per hari.
 * @property {boolean[]} countConflictedPerDay - Status konflik per hari.
 */

/**
 * @typedef {Object} AgendaSchedulesResponse
 * @property {Schedule[]} schedules - Daftar schedule per armada.
 * @property {Pagination} pagination - Data pagination.
 * @property {Summary} summary - Ringkasan statistik.
 * @property {string} lastUpdated - Waktu terakhir data diperbarui (ISO string).
 */

/**
 * Mengambil daftar agenda jadwal armada berdasarkan parameter yang diberikan.
 * @param {Object} params - Parameter pencarian untuk agenda jadwal.
 * @returns {Promise<AgendaSchedulesResponse>} - Daftar agenda jadwal armada.
 */
export const getAgendaSchedules = async (params) => {
  let result;

  if (useMockData) {
    const searchParams = new URLSearchParams(params).toString();
    result = await xior.get(
      `/api/v1/transporter/agenda-schedules?${searchParams}`
    );
  }

  return result.data?.Data;
};
