export const sosDetailsData = {
  "123e4567-e89b-12d3-a456-426614174000": {
    "456e7890-e89b-12d3-a456-426614174001": {
      sosDetail: {
        sosId: "456e7890-e89b-12d3-a456-426614174001",
        description: "Ban pecah di jalan tol, memerlukan bantuan segera",
        sosTime: "2025-08-05T14:30:00Z",
        status: "RESOLVED",
        resolution: "Bantuan teknis telah diberikan, ban sudah diganti",
        resolvedAt: "2025-08-05T16:15:00Z",
        location: {
          latitude: -6.2088,
          longitude: 106.8456,
          address: "Jalan Tol Jakarta-Cikampek KM 15, Jakarta Timur",
          isLocationAccurate: true,
        },
        category: {
          categoryId: "cat-123-456",
          categoryCode: "VEHICLE_BREAKDOWN",
          categoryName: "Kerusakan Kendaraan",
          priorityLevel: "HIGH",
          iconUrl: "https://example.com/icons/vehicle-breakdown.png",
          colorCode: "#FF6B6B",
        },
        fleetInfo: {
          fleetId: "fleet-789-012",
          licensePlate: "B 1234 XYZ",
          driverName: "Ahmad Sudrajat",
          driverPhone: "+62812345678901",
        },
        transporterInfo: {
          transporterId: "trans-345-678",
          companyName: "PT Angkutan Jaya",
          phoneNumber: "+62215551234",
        },
        photoEvidence: [
          {
            photoId: "photo-001-abc",
            photoUrl: "https://example.com/photos/sos-evidence-1.jpg",
            description: "Kondisi ban yang pecah",
            uploadedAt: "2025-08-05T14:45:00Z",
          },
          {
            photoId: "photo-002-def",
            photoUrl: "https://example.com/photos/sos-evidence-2.jpg",
            description: "Lokasi kejadian dari sisi jalan",
            uploadedAt: "2025-08-05T14:50:00Z",
          },
        ],
        timeline: [
          {
            timestamp: "2025-08-05T14:30:00Z",
            event: "SOS Dilaporkan",
            description: "Driver melaporkan kondisi SOS",
            status: "OPEN",
          },
          {
            timestamp: "2025-08-05T14:35:00Z",
            event: "Tim Respons Dihubungi",
            description: "Operator CS menghubungi tim respons darurat",
            status: "IN_PROGRESS",
          },
          {
            timestamp: "2025-08-05T15:20:00Z",
            event: "Tim Bantuan Tiba",
            description: "Tim bantuan teknis tiba di lokasi",
            status: "IN_PROGRESS",
          },
          {
            timestamp: "2025-08-05T16:15:00Z",
            event: "Masalah Teratasi",
            description:
              "Ban sudah diganti, kendaraan siap melanjutkan perjalanan",
            status: "RESOLVED",
          },
        ],
      },
    },
    "789e0123-e89b-12d3-a456-426614174002": {
      sosDetail: {
        sosId: "789e0123-e89b-12d3-a456-426614174002",
        description: "Mesin overheating, asap keluar dari kap mesin",
        sosTime: "2025-08-05T10:15:00Z",
        status: "OPEN",
        resolution: null,
        resolvedAt: null,
        location: {
          latitude: -6.3751,
          longitude: 106.865,
          address: "Jalan Raya Bogor KM 25, Depok",
          isLocationAccurate: true,
        },
        category: {
          categoryId: "cat-456-789",
          categoryCode: "ENGINE_PROBLEM",
          categoryName: "Masalah Mesin",
          priorityLevel: "CRITICAL",
          iconUrl: "https://example.com/icons/engine-problem.png",
          colorCode: "#DC143C",
        },
        fleetInfo: {
          fleetId: "fleet-012-345",
          licensePlate: "B 5678 ABC",
          driverName: "Budi Santoso",
          driverPhone: "+62812345678902",
        },
        transporterInfo: {
          transporterId: "trans-678-901",
          companyName: "CV Transportasi Mandiri",
          phoneNumber: "+62215551235",
        },
        photoEvidence: [
          {
            photoId: "photo-003-ghi",
            photoUrl: "https://example.com/photos/sos-evidence-3.jpg",
            description: "Asap keluar dari kap mesin",
            uploadedAt: "2025-08-05T10:20:00Z",
          },
        ],
        timeline: [
          {
            timestamp: "2025-08-05T10:15:00Z",
            event: "SOS Dilaporkan",
            description: "Driver melaporkan mesin overheating",
            status: "OPEN",
          },
          {
            timestamp: "2025-08-05T10:18:00Z",
            event: "Konfirmasi Diterima",
            description: "Operator CS mengkonfirmasi penerimaan laporan",
            status: "OPEN",
          },
        ],
      },
    },
  },
  "234e5678-e89b-12d3-a456-426614174003": {
    "101e1213-e89b-12d3-a456-426614174004": {
      sosDetail: {
        sosId: "101e1213-e89b-12d3-a456-426614174004",
        description: "Kecelakaan ringan dengan kendaraan lain",
        sosTime: "2025-08-04T16:45:00Z",
        status: "RESOLVED",
        resolution:
          "Proses klaim asuransi telah dimulai, kendaraan dibawa ke bengkel",
        resolvedAt: "2025-08-04T19:30:00Z",
        location: {
          latitude: -6.1754,
          longitude: 106.8272,
          address: "Jalan Sudirman, Jakarta Selatan",
          isLocationAccurate: true,
        },
        category: {
          categoryId: "cat-789-012",
          categoryCode: "ACCIDENT",
          categoryName: "Kecelakaan",
          priorityLevel: "CRITICAL",
          iconUrl: "https://example.com/icons/accident.png",
          colorCode: "#8B0000",
        },
        fleetInfo: {
          fleetId: "fleet-678-901",
          licensePlate: "B 9012 DEF",
          driverName: "Siti Nurhaliza",
          driverPhone: "+62812345678903",
        },
        transporterInfo: {
          transporterId: "trans-901-234",
          companyName: "PT Logistik Prima",
          phoneNumber: "+62215551236",
        },
        photoEvidence: [
          {
            photoId: "photo-004-jkl",
            photoUrl: "https://example.com/photos/sos-evidence-4.jpg",
            description: "Kondisi kendaraan setelah kecelakaan",
            uploadedAt: "2025-08-04T16:50:00Z",
          },
          {
            photoId: "photo-005-mno",
            photoUrl: "https://example.com/photos/sos-evidence-5.jpg",
            description: "Posisi kendaraan di lokasi kejadian",
            uploadedAt: "2025-08-04T16:52:00Z",
          },
        ],
        timeline: [
          {
            timestamp: "2025-08-04T16:45:00Z",
            event: "SOS Dilaporkan",
            description: "Driver melaporkan kecelakaan ringan",
            status: "OPEN",
          },
          {
            timestamp: "2025-08-04T17:00:00Z",
            event: "Polisi Dihubungi",
            description: "Operator CS menghubungi polisi untuk laporan",
            status: "IN_PROGRESS",
          },
          {
            timestamp: "2025-08-04T18:15:00Z",
            event: "Derek Tiba",
            description: "Kendaraan derek tiba untuk mengangkut kendaraan",
            status: "IN_PROGRESS",
          },
          {
            timestamp: "2025-08-04T19:30:00Z",
            event: "Kendaraan Dibawa ke Bengkel",
            description: "Kendaraan sudah dibawa ke bengkel untuk perbaikan",
            status: "RESOLVED",
          },
        ],
      },
    },
  },
};

export const successShell = {
  Message: {
    Code: 200,
    Text: "Detail SOS berhasil diambil",
  },
  Data: {},
  Type: "SOS_DETAIL_SUCCESS",
};

export const notFoundResponse = {
  Message: {
    Code: 404,
    Text: "Detail SOS tidak ditemukan",
  },
  Type: "SOS_DETAIL_NOT_FOUND",
};

export const serverErrorResponse = {
  Message: {
    Code: 500,
    Text: "Terjadi kesalahan server",
  },
  Type: "SOS_DETAIL_ERROR",
};
