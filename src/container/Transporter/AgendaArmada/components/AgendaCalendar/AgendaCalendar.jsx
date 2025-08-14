import { AgendaRowItem } from "./AgendaRowItem";
import { CalendarHeader1 } from "./CalendarHeader1";
import { CalendarHeader2 } from "./CalendarHeader2";

const mockData = [
  {
    plateNumber: "L 1000 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "BERTUGAS",
        driverName: "Ahmad Maulana",
        currentLocation: "Rest Area KM 50",
        estimation: "est. 30km (1jam 30menit)",
        distanceRemaining: 121,
        dataMuat: {
          title: "Lokasi Muat",
          subtitle: "Kota Surabaya, Kec. Tegalsari",
        },
        dataBongkar: {
          title: "Lokasi Bongkar",
          subtitle: "Kab. Malang, Kec. Singosari",
        },
        scheduled: 1,
        additional: 0,
        position: 0,
        hasSosIssue: false,
      },
    ],
  },
  {
    plateNumber: "L 1000 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "BERTUGAS",
        driverName: "Ahmad Maulana",
        currentLocation: "Rest Area KM 50",
        estimation: "est. 30km (1jam 30menit)",
        distanceRemaining: 121,
        dataMuat: {
          title: "Lokasi Muat",
          subtitle: "Kota Surabaya, Kec. Tegalsari",
        },
        dataBongkar: {
          title: "Lokasi Bongkar",
          subtitle: "Kab. Malang, Kec. Singosari",
        },
        scheduled: 2,
        additional: 1,
        position: 0,
        hasSosIssue: true,
      },
    ],
  },
  {
    plateNumber: "L 1001 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "PENGIRIMAN_SELESAI",
        driverName: "Siti Rahmawati",
        currentLocation: "Garasi Pool Kendaraan",
        estimation: null,
        distanceRemaining: 0,
        dataMuat: {
          title: "Depo Kontainer",
          subtitle: "Tanjung Perak, Surabaya",
        },
        dataBongkar: {
          title: "Pusat Distribusi",
          subtitle: "Banjarmasin",
        },
        scheduled: 2,
        additional: 1,
        position: 0,
        hasSosIssue: false,
      },
    ],
  },

  {
    plateNumber: "L 1001 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "NON_AKTIF",
        driverName: "Siti Rahmawati",
        currentLocation: "Garasi Pool Kendaraan",
        estimation: null,
        distanceRemaining: 0,
        dataMuat: null,
        dataBongkar: null,
        scheduled: 2,
        additional: 0,
        position: 0,
        hasSosIssue: false,
      },
    ],
  },
  {
    plateNumber: "L 1002 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "MENUNGGU_JAM_MUAT",
        driverName: "Budi Santoso",
        currentLocation: "Pelabuhan Tanjung Priok",
        estimation: "est. 5km (20 menit)",
        distanceRemaining: 5,
        dataMuat: {
          title: "Gudang Utama",
          subtitle: "Jakarta Utara",
        },
        dataBongkar: {
          title: "Pabrik Tekstil",
          subtitle: "Bandung Barat",
        },
        scheduled: 2,
        additional: 1,
        position: 0,
        hasSosIssue: false,
      },
    ],
  },
  {
    plateNumber: "L 1002 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "DIJADWALKAN",
        driverName: "Budi Santoso",
        currentLocation: "Pelabuhan Tanjung Priok",
        estimation: "est. 5km (20 menit)",
        distanceRemaining: 5,
        dataMuat: {
          title: "Gudang Utama",
          subtitle: "Jakarta Utara",
        },
        dataBongkar: {
          title: "Pabrik Tekstil",
          subtitle: "Bandung Barat",
        },
        scheduled: 2,
        additional: 1,
        position: 0,
        hasSosIssue: false,
      },
    ],
  },
];

export const AgendaCalendar = ({ data = mockData }) => {
  return (
    <div className="w-full rounded-xl bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <CalendarHeader1 />
      <CalendarHeader2 />

      <div className="max-h-[calc(100dvh-295px)] pr-0.5">
        <div className="max-h-[calc(100dvh-295px)] w-full divide-y overflow-y-auto overflow-x-hidden">
          {data.map((item, index) => (
            <AgendaRowItem key={index} armada={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
