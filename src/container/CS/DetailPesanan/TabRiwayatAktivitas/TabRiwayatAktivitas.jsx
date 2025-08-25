// import { Collapsible, CollapsibleTrigger } from "@/components/Collapsible";
// import IconComponent from "@/components/IconComponent/IconComponent";
import { useMemo } from "react";

import { sub } from "date-fns";

import Button from "@/components/Button/Button";
import CardRiwayatPerubahan from "@/components/Card/CardRiwayatPerubahan";
import IconComponent from "@/components/IconComponent/IconComponent";
import { TabsContent } from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

const activityData = [
  {
    id: "ac56761c-830b-4f69-b655-3d509ecbe381",
    timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action:
      "Telah menerima perubahan detail pesanan yang dibuat <b>PT. Airmas International (Shipper)</b>",
  },
  {
    id: "a7a71c3b-907d-4e5b-aff8-f2b648c2c531",
    timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
    actor: "PT. Airmas International (Shipper)",
    action: "Telah melakukan perubahan pada pesanan",
    changes: {
      title: "Detail Perubahan",
      isCanRepeatBlast: false,
      isCanAssignAnotherTransporter: false,
      isCanReset: false,
      revenueAdjustment: {
        before: 24500000,
        after: 25400000,
      },
      items: {
        changeTime: {
          before: {
            timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
          },
          after: {
            timestamp: sub(new Date(), { days: 1, hours: 10 }).toISOString(),
          },
        },
        changeRoute: {
          before: {
            distance: "178 km",
            pickups: [
              { sequence: 1, fullAddress: "Kota Surabaya, Kec. Tegalsari" },
              { sequence: 2, fullAddress: "Kab. Sidoarjo, Kec. Sedati" },
            ],
            dropoffs: [
              { sequence: 1, fullAddress: "Kab. Malang, Kec. Singosari" },
              { sequence: 2, fullAddress: "Kab. Pasuruan, Kec. Klojen" },
            ],
          },
          after: {
            distance: "182 km",
            pickups: [
              { sequence: 1, fullAddress: "Kota Surabaya, Kec. Wonorejo" },
              { sequence: 2, fullAddress: "Kab. Sidoarjo, Kec. Sedati" },
            ],
            dropoffs: [
              { sequence: 1, fullAddress: "Kab. Malang, Kec. Blimbing" },
              { sequence: 2, fullAddress: "Kab. Pasuruan, Kec. Klojen" },
            ],
          },
        },
      },
    },
  },
  // {
  //   id: "a7a71c3b-907d-4e5b-aff8-f2b648c2c531",
  //   timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
  //   actor: "PT Rajawali Trans Logistic (Transporter)",
  //   action:
  //     "Telah menerima perubahan transporter yang dibuat <b>CS Daffa Toldo (CS muatrans)</b>. Perubahan menunggu konfirmasi <b>Transporter</b> baru dan <b>GM muatrans</b>",
  // },
  // {
  //   id: "0cdfe0a1-55aa-4622-b194-0f945cf895f6",
  //   timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
  //   actor: "PT Rajawali Trans Logistic (Transporter)",
  //   action:
  //     "Telah menerima perubahan transporter yang dibuat <b>CS Daffa Toldo (CS muatrans)</b>. Perubahan menunggu konfirmasi <b>GM muatrans</b>",
  // },
  // {
  //   id: "e8077c38-9dc0-4bdf-97ff-628ecac1f0f5",
  //   timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
  //   actor: "PT Rajawali Trans Logistic (Transporter)",
  //   action:
  //     "Telah menerima perubahan transporter yang dibuat <b>CS Daffa Toldo (CS muatrans)</b>. Perubahan menunggu konfirmasi Transporter Baru",
  // },
  // {
  //   id: "b2e9b9c6-f656-4d3d-aea1-31b319f2c56d",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "PT Rajawali Trans Logistic (Transporter)",
  //   action:
  //     "menolak perubahan transporter yang dibuat oleh <b>CS Daffa Toldo (CS muatrans)</b>",
  //   changes: {
  //     title: "Detail Penolakan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: false,
  //     isCanReset: true,
  //     items: {
  //       canceledByTransporter: {
  //         name: "PT Rajawali Trans Logistic",
  //         picture: "https://picsum.photos/100?random=asdaf213",
  //         unit: 1,
  //         reason:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "60cb241d-3243-4d29-a219-2b34eeacfdee",
  //   timestamp: sub(new Date(), {
  //     days: 2,
  //     hours: 3,
  //     minutes: 15,
  //   }).toISOString(),
  //   actor: "CS Daffa Toldo (CS muatrans)",
  //   action: "Telah melakukan perubahan pada pesanan ini",
  //   changes: {
  //     title: "Detail Perubahan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: false,
  //     isCanReset: false,
  //     items: {
  //       transporter: {
  //         before: [
  //           {
  //             name: "PT Kaltim Jaya Makmur",
  //             picture: "https://picsum.photos/100?random=33",
  //             phone: "021-345-6789",
  //             units: 3,
  //           },
  //         ],
  //         after: [
  //           {
  //             name: "PT. Truk Jaya Abadi",
  //             value: "d1b3e4c5-1f2a-4b3c-8a9d-0e1f2a3b4c5d",
  //             availableUnits: 2,
  //             phone: "031-111-2222",
  //             picture: "https://picsum.photos/100?random=123123",
  //             units: 2,
  //           },
  //         ],
  //         blastCount: 1,
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "2e8c5850-6bf6-43ca-9646-337354ed3e4c",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "PT. Siba Surya (Transporter) ",
  //   action:
  //     "Telah menolak perubahan detail pesanan yang dibuat <b>PT. Airmas International (Shipper)</b>. Tugaskan transporter lain atau blast ulang pesanan!",
  //   changes: {
  //     title: "Detail Penolakan",
  //     isCanRepeatBlast: true,
  //     isCanAssignAnotherTransporter: true,
  //     isCanReset: false,
  //     items: {
  //       canceledByTransporter: {
  //         name: "CV Moga Jaya Selalu",
  //         picture: "https://picsum.photos/100?random=321312",
  //         unit: 1,
  //         reason:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "60cb241d-3243-4d29-a219-2b34eeacfdee",
  //   timestamp: sub(new Date(), {
  //     days: 2,
  //     hours: 3,
  //     minutes: 15,
  //   }).toISOString(),
  //   actor: "PT. Siba Surya (Transporter)",
  //   action: "Telah melakukan perubahan armada pada pesanan",

  //   changes: {
  //     title: "Detail Perubahan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: false,
  //     isCanReset: false,
  //     items: {
  //       driver: {
  //         timestamp: null,
  //         before: {
  //           name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
  //           picture: "https://picsum.photos/200?random=21",
  //         },
  //         after: {
  //           name: "Yoel Gallagher",
  //           picture: "https://picsum.photos/200?random=22",
  //         },
  //       },
  //       armada: {
  //         timestamp: null,
  //         before: {
  //           plate: "AE 1111 LBA",
  //           name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra",
  //           picture: "https://picsum.photos/200?random=23",
  //         },
  //         after: {
  //           plate: "AE 2222 LBA",
  //           name: "Yoel",
  //           picture: "https://picsum.photos/200?random=24",
  //         },
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "60cb241d-3243-4d29-a219-2b34eeacfdee",
  //   timestamp: sub(new Date(), {
  //     days: 2,
  //     hours: 3,
  //     minutes: 15,
  //   }).toISOString(),
  //   actor: "PT. Airmas International (Shipper)",
  //   action: "Telah melakukan perubahan armada pada pesanan",

  //   changes: {
  //     title: "Detail Perubahan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: false,
  //     isCanReset: false,
  //     items: {
  //       driver: {
  //         timestamp: sub(new Date(), {
  //           days: 2,
  //           hours: 3,
  //           minutes: 15,
  //         }).toISOString(),
  //         before: {
  //           name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
  //           picture: "https://picsum.photos/200?random=21",
  //         },
  //         after: {
  //           name: "Yoel Gallagher",
  //           picture: "https://picsum.photos/200?random=22",
  //         },
  //       },
  //       armada: {
  //         timestamp: sub(new Date(), {
  //           days: 2,
  //           hours: 3,
  //           minutes: 15,
  //         }).toISOString(),
  //         before: {
  //           plate: "AE 1111 LBA",
  //           name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra",
  //           picture: "https://picsum.photos/200?random=23",
  //         },
  //         after: {
  //           plate: "AE 2222 LBA",
  //           name: "Yoel",
  //           picture: "https://picsum.photos/200?random=24",
  //         },
  //       },
  //       // transporter: {
  //       //   before: [
  //       //     {
  //       //       name: "PT Kaltim Jaya Makmur",
  //       //       picture: "https://picsum.photos/100?random=33",
  //       //       phone: "021-345-6789",
  //       //       units: 3,
  //       //     },
  //       //   ],
  //       //   after: [
  //       //     {
  //       //       name: "PT. Truk Jaya Abadi",
  //       //       value: "d1b3e4c5-1f2a-4b3c-8a9d-0e1f2a3b4c5d",
  //       //       availableUnits: 2,
  //       //       phone: "031-111-2222",
  //       //       picture: "https://picsum.photos/100?random=123123",
  //       //       units: 2,
  //       //     },
  //       //   ],
  //       //   blastCount: 1,
  //       // },
  //     },
  //   },
  // },
  // {
  //   id: "b2e9b9c6-f656-4d3d-aea1-31b319f2c56d",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "GM muatrans",
  //   action: "Telah menolak permintaan CS muatrans, tugaskan transporter lain",
  //   changes: {
  //     title: "Detail Penolakan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: true,
  //     isCanReset: false,
  //     items: {
  //       gmRejectOrderRequest: {
  //         reason:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "95875ad9-21b4-438b-8502-b869f791bfbe",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "GM muatrans",
  //   action:
  //     "Telah menerima permintaan <b>CS Daffa Toldo (CS muatrans)</b>. Pesanan telah dimasukkan ke daftar permintaan jasa angkut",
  // },
  // {
  //   id: "95875ad9-21b4-438b-8502-b869f791bfbe",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "CS Daffa Toldo (CS muatrans)",
  //   action:
  //     "Telah memasukkan pesanan ke daftar permintaan jasa angkut. Menunggu konfirmasi <b>GM muatrans</b>",
  // },
  // {
  //   id: "2e8c5850-6bf6-43ca-9646-337354ed3e4c",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "CV Moga Jaya Selalu (Transporter)",
  //   action: "Telah menolak pesanan",
  //   changes: {
  //     title: "Detail Penolakan",
  //     isCanRepeatBlast: true,
  //     isCanAssignAnotherTransporter: true,
  //     isCanReset: false,
  //     items: {
  //       canceledByTransporter: {
  //         name: "CV Moga Jaya Selalu",
  //         picture: "https://picsum.photos/100?random=321312",
  //         unit: 1,
  //         reason:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //       },
  //     },
  //   },
  // },
  // {
  //   id: "1623ec54-04bb-4d55-911e-4135dbdebcfd",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "CV Moga Jaya Selalu (Transporter)",
  //   action: "Telah menerima pesanan",
  // },
  // {
  //   id: "d53ced7d-42d9-49b9-a744-6c352a4c9030",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "CS Daffa Toldo (CS muatrans)",
  //   action:
  //     "Telah menugaskan <b>CV Moga Jaya Selalu (Transporter)</b> sebagai pengganti. Menunggu konfirmasi transporter",
  // },
  // {
  //   id: "2e8c5850-6bf6-43ca-9646-337354ed3e4c",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "PT. Siba Surya (Transporter)",
  //   action: "Telah membatalkan pesanan",
  //   changes: null,
  //   // changes: {
  //   //   title: "Detail Pembatalan",
  //   //   isCanRepeatBlast: true,
  //   //   isCanAssignAnotherTransporter: true,
  //   //   isCanReset: false,
  //   //   items: {
  //   //     canceledByTransporter: {
  //   //       name: "PT. Siba Surya",
  //   //       picture: "https://picsum.photos/100?random=321312",
  //   //       unit: 1,
  //   //       reason:
  //   //         "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //   //     },
  //   //   },
  //   // },
  // },
  // {
  //   id: "2e8c5850-6bf6-43ca-9646-337354ed3e4c",
  //   timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
  //   actor: "PT. Airmas International (AIRI) (Shipper)",
  //   action: "Telah membatalkan pesanan",
  //   changes: null,
  //   changes: {
  //     title: "Detail Pembatalan",
  //     isCanRepeatBlast: false,
  //     isCanAssignAnotherTransporter: false,
  //     isCanReset: false,
  //     items: {
  //       canceledByShipper: {
  //         name: "PT. Airmas International (AIRI)",
  //         picture: "https://picsum.photos/100?random=123123",
  //         unit: 1,
  //         reason:
  //           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
  //       },
  //     },
  //   },
  // },
  {
    id: "a817e51d-ecc1-4eef-8ffc-2923679faa2a",
    timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action: "Telah mengkonfirmasi siap pada pesanan",
  },
  {
    id: "f5859b85-b36c-411b-9de9-18dff0f8cd20",
    timestamp: sub(new Date(), {
      days: 2,
      hours: 16,
    }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action: "Telah menugaskan armada pada pesanan",
  },
  {
    id: "b98a942e-e455-40a5-ad1e-388014b43519",
    timestamp: sub(new Date(), { days: 2, hours: 18 }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action: "Telah mengambil pesanan",
  },
  {
    id: "02541aa4-45d8-4ce2-8eb9-102032a8ffc5",
    timestamp: sub(new Date(), { days: 3, hours: 2 }).toISOString(),
    actor: "PT. Airmas International (AIRI) (Shipper)",
    action: "Telah membuat pesanan",
  },
];

export const TabRiwayatAktivitas = () => {
  const { t } = useTranslation();

  return (
    <TabsContent className="flex flex-col gap-y-4" value="riwayat-aktivitas">
      <CardRiwayatPerubahan.Root
        title={t(
          "TabRiwayatAktivitas.titleRiwayatAktivitas",
          {},
          "Riwayat Aktivitas"
        )}
      >
        {activityData.map((item, idx) => (
          <Content key={item.id} item={item} idx={idx} />
        ))}
      </CardRiwayatPerubahan.Root>
    </TabsContent>
  );
};

const Content = ({ item, idx }) => {
  const { t } = useTranslation();

  const renderChangeComponents = (changeItems) => {
    const changeTypeMap = {
      driver: {
        component: CardRiwayatPerubahan.ItemPerubahanDriver,
        getProps: (changeData) => ({
          timestamp: formatDate(changeData.timestamp),
          before: changeData.before,
          after: changeData.after,
        }),
      },
      armada: {
        component: CardRiwayatPerubahan.ItemPerubahanArmada,
        getProps: (changeData) => ({
          timestamp: formatDate(changeData.timestamp),
          before: changeData.before,
          after: changeData.after,
        }),
      },
      transporter: {
        component: CardRiwayatPerubahan.ItemPerubahanTransporter,
        getProps: (changeData) => ({
          timestamp: formatDate(changeData.timestamp),
          before: changeData.before,
          after: changeData.after,
          title: t(
            "TabRiwayatAktivitas.titlePerubahanRuteMuatBongkar",
            {},
            "Perubahan Rute Muat & Bongkar"
          ),
          blastCount: changeData?.blastCount,
        }),
      },
      canceledByShipper: {
        component: CardRiwayatPerubahan.ItemPesananDibatalkan,
        getProps: (changeData) => ({
          name: changeData.name,
          picture: changeData.picture,
          unit: changeData.unit,
          reason: changeData.reason,
        }),
      },
      canceledByTransporter: {
        component: CardRiwayatPerubahan.ItemPesananDibatalkan,
        getProps: (changeData) => ({
          name: changeData.name,
          picture: changeData.picture,
          unit: changeData.unit,
          reason: changeData.reason,
        }),
      },
      gmRejectOrderRequest: {
        component: CardRiwayatPerubahan.ItemPenolakanGM,
        getProps: (changeData) => ({
          title: t(
            "TabRiwayatAktivitas.titleAlasanPenolakanGm",
            {},
            "Alasan Penolakan GM muatrans"
          ),
          reason: changeData.reason,
        }),
      },
      changeRoute: {
        component: CardRiwayatPerubahan.ItemPerubahanRute,
        getProps: (changeData) => ({
          before: changeData.before,
          after: changeData.after,
        }),
      },
      changeTime: {
        component: CardRiwayatPerubahan.ItemPerubahanWaktu,
        getProps: (changeData) => ({
          before: {
            timestamp: formatDate(changeData.before.timestamp, {
              padDay: true,
            }),
          },
          after: {
            timestamp: formatDate(changeData.after.timestamp, { padDay: true }),
          },
        }),
      },
    };

    return Object.entries(changeItems)
      .filter(([key, changeData]) => changeData && changeTypeMap[key])
      .map(([key, changeData], index) => {
        const { component: Component, getProps } = changeTypeMap[key];
        const props = getProps(changeData);

        return (
          <Component
            key={key}
            isFirst={index === 0}
            isLast={index === Object.keys(changeItems).length - 1}
            {...props}
          />
        );
      });
  };

  const footer = useMemo(() => {
    const isFooterButtons =
      item.changes?.isCanRepeatBlast ||
      item.changes?.isCanAssignAnotherTransporter ||
      item.changes?.isCanReset;

    if (isFooterButtons) {
      return (
        <div className="mt-4 flex justify-end gap-3">
          {item.changes?.isCanRepeatBlast && (
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 min-w-[160px] !rounded-full !text-sm"
              onClick={() => alert("handle button1 click")}
            >
              {t("TabRiwayatAktivitas.buttonBlastUlang", {}, "Blast Ulang")}
            </Button>
          )}
          {item.changes?.isCanAssignAnotherTransporter && (
            <Button
              variant="muattrans-primary"
              className="h-8 min-w-[174px] !rounded-full !text-sm"
              onClick={() => alert("handle button2 click")}
            >
              {t(
                "TabRiwayatAktivitas.buttonTugaskanTransporterLain",
                {},
                "Tugaskan Transporter Lain"
              )}
            </Button>
          )}
          {item.changes?.isCanReset && (
            <Button
              variant="muattrans-primary"
              className="h-8 min-w-[174px] !rounded-full !text-sm"
              onClick={() => alert("handle button2 click")}
            >
              {t("TabRiwayatAktivitas.buttonAturUlang", {}, "Atur Ulang")}
            </Button>
          )}
        </div>
      );
    } else if (item.changes?.revenueAdjustment) {
      return (
        <div className="mt-4 box-border flex w-full flex-row items-center justify-between gap-12 rounded-lg border border-neutral-400 p-4">
          {/* Left Section: Label and Info Icon */}
          <div className="flex flex-1 items-center gap-2">
            <p className="text-sm font-bold leading-tight text-neutral-900">
              {t(
                "TabRiwayatAktivitas.labelPenyesuaianPendapatan",
                {},
                "Penyesuaian Pendapatan"
              )}
            </p>
            <button
              onClick={() => alert("More information about revenue adjustment")}
              aria-label="More information"
              className="flex h-4 w-4 items-center justify-center"
            >
              <IconComponent
                src="/icons/info-circle24.svg"
                alt="Info icon"
                className="h-full w-full"
              />
            </button>
          </div>

          {/* Right Section: Price Adjustment */}
          <div className="flex flex-1 items-center gap-4">
            <p className="text-right text-sm font-medium text-neutral-900 line-through">
              {idrFormat(24500000)}
            </p>
            <IconComponent
              src="/icons/arrow-right.svg"
              alt="Indicates adjustment to"
              className="h-4 w-4 flex-shrink-0"
            />
            <p className="text-right text-sm font-bold leading-tight text-neutral-900">
              {idrFormat(25400000)}
            </p>
          </div>
        </div>
      );
    }
  }, [
    item.changes?.isCanRepeatBlast,
    item.changes?.isCanAssignAnotherTransporter,
    item.changes?.isCanReset,
    item.changes?.revenueAdjustment,
    t,
  ]);

  return (
    <CardRiwayatPerubahan.Item
      key={item.id}
      isActive={idx === 0}
      timestamp={formatDate(item.timestamp, { withWIB: false })}
      actor={item.actor}
      action={item.action}
    >
      {item?.changes && (
        <>
          <CardRiwayatPerubahan.ContentPerubahan
            className="mt-3"
            title={item.changes?.title}
            footer={footer}
          >
            {renderChangeComponents(item.changes?.items)}
          </CardRiwayatPerubahan.ContentPerubahan>
        </>
      )}
    </CardRiwayatPerubahan.Item>
  );
};
