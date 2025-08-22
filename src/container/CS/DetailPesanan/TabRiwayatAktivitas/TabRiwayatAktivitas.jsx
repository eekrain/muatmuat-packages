// import { Collapsible, CollapsibleTrigger } from "@/components/Collapsible";
// import IconComponent from "@/components/IconComponent/IconComponent";
import { TabsContent } from "@/components/Tabs/Tabs";
import { formatDate } from "@/lib/utils/dateFormat";

import CardPerubahan from "../../../../components/Card/CardPerubahan";
import CardRiwayat from "../../../../components/Card/CardRiwayat";

export const activityData = [
  {
    id: 1,
    timestamp: formatDate(new Date(), { withWIB: false }),
    actor: "PT. Airmas International (Shipper)",
    action: "Telah melakukan perubahan armada pada pesanan",

    changes: {
      driver: {
        timestamp: "08 Jan 2025 12:00 WIB",
        awal: {
          name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
          picture: "https://picsum.photos/200?random=21",
        },
        baru: {
          name: "Yoel Gallagher",
          picture: "https://picsum.photos/200?random=22",
        },
      },
      armada: {
        timestamp: "10 Jan 2025 10:00 WIB",
        awal: {
          plate: "AE 1111 LBA",
          driverName:
            "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra",
          picture: "https://picsum.photos/200?random=23",
        },
        baru: {
          plate: "AE 2222 LBA",
          driverName: "Yoel",
          picture: "https://picsum.photos/200?random=24",
        },
      },
    },
  },
  {
    id: 2,
    timestamp: formatDate(new Date(), { withWIB: false }),
    actor: "PT. Siba Surya (Transporter)",
    action: "Telah menugaskan armada pada pesanan",
  },
];

export const TabRiwayatAktivitas = () => {
  return (
    <TabsContent className="flex flex-col gap-y-4" value="riwayat-aktivitas">
      <CardRiwayat.Root title="Riwayat Aktivitas">
        {activityData.map((item, idx) => (
          <CardRiwayat.Item
            key={item.id}
            isActive={idx === 0}
            timestamp={item.timestamp}
            actor={item.actor}
            action={item.action}
          >
            {item?.changes && (
              <CardPerubahan.Root className="mt-3">
                {item.changes?.driver && (
                  <CardPerubahan.PerubahanDriver
                    timestamp={item.changes.driver.timestamp}
                    oldDriver={item.changes.driver.awal}
                    newDriver={item.changes.driver.baru}
                    isFirst={true}
                  />
                )}
                {item.changes?.armada && (
                  <CardPerubahan.PerubahanArmada
                    timestamp={item.changes.armada.timestamp}
                    oldArmada={item.changes.armada.awal}
                    newArmada={item.changes.armada.baru}
                  />
                )}
              </CardPerubahan.Root>
            )}
          </CardRiwayat.Item>
        ))}
      </CardRiwayat.Root>
    </TabsContent>
  );
};
