// import { Collapsible, CollapsibleTrigger } from "@/components/Collapsible";
// import IconComponent from "@/components/IconComponent/IconComponent";
import { sub } from "date-fns";

import CardRiwayatPerubahan from "@/components/Card/CardRiwayatPerubahan";
import { TabsContent } from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/utils/dateFormat";

const activityData = [
  {
    id: "ac56761c-830b-4f69-b655-3d509ecbe381",
    timestamp: sub(new Date(), { days: 1, hours: 20 }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action:
      "Telah menerima perubahan detail pesanan yang dibuat <b>PT. Airmas International (Shipper)</b>",
  },

  {
    id: "a817e51d-ecc1-4eef-8ffc-2923679faa2a",
    timestamp: sub(new Date(), { days: 2, hours: 14 }).toISOString(),
    actor: "PT. Siba Surya (Transporter)",
    action: "Telah mengkonfirmasi siap pada pesanan",
  },
];

export const TabRiwayatAktivitas = ({ orderSummary }) => {
  const { t } = useTranslation();

  return (
    <TabsContent
      className="flex flex-col justify-start gap-y-4 text-start"
      value="riwayat-aktivitas"
    >
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
          >
            {renderChangeComponents(item.changes?.items)}
          </CardRiwayatPerubahan.ContentPerubahan>
        </>
      )}
    </CardRiwayatPerubahan.Item>
  );
};
