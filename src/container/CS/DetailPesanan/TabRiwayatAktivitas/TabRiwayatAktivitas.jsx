// import { Collapsible, CollapsibleTrigger } from "@/components/Collapsible";
// import IconComponent from "@/components/IconComponent/IconComponent";
import CardRiwayatPerubahan from "@/components/Card/CardRiwayatPerubahan";
import { TabsContent } from "@/components/Tabs/Tabs";
import { formatDate } from "@/lib/utils/dateFormat";

export const activityData = [
  {
    id: 1,
    timestamp: formatDate(new Date(), { withWIB: false }),
    actor: "PT. Airmas International (Shipper)",
    action: "Telah melakukan perubahan armada pada pesanan",

    changes: {
      driver: {
        timestamp: "08 Jan 2025 12:00 WIB",
        before: {
          name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra Toldo Sasmita",
          picture: "https://picsum.photos/200?random=21",
        },
        after: {
          name: "Yoel Gallagher",
          picture: "https://picsum.photos/200?random=22",
        },
      },
      armada: {
        timestamp: "10 Jan 2025 10:00 WIB",
        before: {
          plate: "AE 1111 LBA",
          name: "Muhammad Rizky Ramadhani Pratama Setiawan Nugroho Putra Perdana Kusuma Wijayanto Saputra",
          picture: "https://picsum.photos/200?random=23",
        },
        after: {
          plate: "AE 2222 LBA",
          name: "Yoel",
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
      <CardRiwayatPerubahan.Root title="Riwayat Aktivitas">
        {activityData.map((item, idx) => (
          <CardRiwayatPerubahan.Item
            key={item.id}
            isActive={idx === 0}
            timestamp={item.timestamp}
            actor={item.actor}
            action={item.action}
          >
            {item?.changes && (
              <CardRiwayatPerubahan.ContentPerubahan className="mt-3">
                {item.changes?.driver && (
                  <CardRiwayatPerubahan.ItemPerubahanDriver
                    timestamp={item.changes.driver.timestamp}
                    before={item.changes.driver.before}
                    after={item.changes.driver.after}
                    isFirst={true}
                  />
                )}
                {item.changes?.armada && (
                  <CardRiwayatPerubahan.ItemPerubahanArmada
                    timestamp={item.changes.armada.timestamp}
                    before={item.changes.armada.before}
                    after={item.changes.armada.after}
                  />
                )}
              </CardRiwayatPerubahan.ContentPerubahan>
            )}
          </CardRiwayatPerubahan.Item>
        ))}
      </CardRiwayatPerubahan.Root>
    </TabsContent>
  );
};
