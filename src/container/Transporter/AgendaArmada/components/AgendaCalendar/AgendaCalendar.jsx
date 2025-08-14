import { AgendaLineItem } from "./AgendaLineItem";
import { CalendarHeader1 } from "./CalendarHeader1";
import { CalendarHeader2 } from "./CalendarHeader2";

// const cardItemsData = [
//   {
//     statusCode: "bertugas",
//     driverName: "Ahmad Maulana",
//     currentLocation: "Rest Area KM 50",
//     estimation: "est. 30km (1jam 30menit)",
//     distanceRemaining: 121,
//     dataMuat: {
//       title: "Lokasi Muat",
//       subtitle: "Kota Surabaya, Kec. Tegalsari",
//     },
//     dataBongkar: {
//       title: "Lokasi Bongkar",
//       subtitle: "Kab. Malang, Kec. Singosari",
//     },
//     scheduled: 2,
//     additional: 1,
//     position: 0,
//   },
//   {
//     statusCode: "selesai",
//     driverName: "Budi Santoso",
//     currentLocation: "Pelabuhan Tanjung Priok",
//     estimation: "est. 5km (20 menit)",
//     distanceRemaining: 5,
//     dataMuat: {
//       title: "Gudang Utama",
//       subtitle: "Jakarta Utara",
//     },
//     dataBongkar: {
//       title: "Pabrik Tekstil",
//       subtitle: "Bandung Barat",
//     },
//     scheduled: 1,
//     additional: 1,
//     position: 1,
//   },
//   {
//     statusCode: "nonaktif",
//     driverName: "Siti Rahmawati",
//     currentLocation: "Garasi Pool Kendaraan",
//     estimation: "Tidak aktif",
//     distanceRemaining: 0,
//     dataMuat: {
//       title: "Depo Kontainer",
//       subtitle: "Tanjung Perak, Surabaya",
//     },
//     dataBongkar: {
//       title: "Pusat Distribusi",
//       subtitle: "Banjarmasin",
//     },
//     scheduled: 0,
//     additional: 1,
//     position: 2,
//   },
//   {
//     statusCode: "menunggu_jam_muat",
//     driverName: "Hendra Wijaya",
//     currentLocation: "Terminal Peti Kemas",
//     estimation: "est. 10km (45 menit)",
//     distanceRemaining: 10,
//     dataMuat: {
//       title: "Gudang Logistik",
//       subtitle: "Kota Semarang",
//     },
//     dataBongkar: {
//       title: "Kios Pasar Induk",
//       subtitle: "Kota Solo",
//     },
//     scheduled: 3,
//     additional: 2,
//     position: 3,
//   },
//   {
//     statusCode: "scheduled",
//     driverName: "Dewi Lestari",
//     currentLocation: "Rest Area KM 102",
//     estimation: "est. 45km (2 jam)",
//     distanceRemaining: 45,
//     dataMuat: {
//       title: "Pabrik Minuman",
//       subtitle: "Kota Bogor",
//     },
//     dataBongkar: {
//       title: "Supermarket Pusat",
//       subtitle: "Cikarang",
//     },
//     scheduled: 1,
//     additional: 2,
//     position: 4,
//   },
// ];

const mockData = [
  {
    plateNumber: "L 1000 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "bertugas",
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
        position: -2,
      },
    ],
  },
  {
    plateNumber: "L 1001 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "selesai",
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
        position: 2,
      },
    ],
  },

  {
    plateNumber: "L 1002 EKA",
    truckType: "Colt Diesel Engkel - Box",
    rowData: [
      {
        statusCode: "menunggu_jam_muat",
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
        position: 1,
      },
    ],
  },
];

export const AgendaCalendar = ({ data = mockData }) => {
  return (
    <div className="w-full rounded-xl bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <CalendarHeader1 />
      <CalendarHeader2 />

      <div className="w-full divide-y">
        {data.map((item, index) => (
          <AgendaLineItem key={index} armada={item} />
        ))}
      </div>
    </div>
  );
};
