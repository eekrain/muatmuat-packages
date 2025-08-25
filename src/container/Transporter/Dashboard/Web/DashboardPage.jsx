"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardMenu from "@/components/Card/CardMenu";
import { useTranslation } from "@/hooks/use-translation";

const DashboardPage = ({ title = "Dashboard Analytics" }) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 1,
      statusKey: "addFleetCompleted",
      icon: "/icons/dashboard/truck.svg",
      title: t("DashboardPage.addFleetTitle", {}, "Tambahkan Armada"),
      description: t(
        "DashboardPage.addFleetDesc",
        {},
        "Kamu harus menambahkan armada yang akan digunakan untuk menerima pesanan."
      ),
      buttonText: t("DashboardPage.addFleetButton", {}, "Tambah Armada"),
      path: "/manajemen-armada",
      stepName: t("DashboardPage.addFleetStep", {}, "Tambahkan Armada"),
    },
    {
      id: 2,
      statusKey: "addDriverCompleted",
      icon: "/icons/dashboard/driver.svg",
      title: t("DashboardPage.addDriverTitle", {}, "Tambahkan Driver"),
      description: t(
        "DashboardPage.addDriverDesc",
        {},
        "Kamu harus menambahkan driver terlebih dahulu untuk dapat digunakan menerima pesanan."
      ),
      stepName: t("DashboardPage.addDriverStep", {}, "Tambahkan Driver"),
    },
    {
      id: 3,
      statusKey: "fleetDriverAssignmentCompleted",
      icon: "/icons/dashboard/pair-driver-fleet.svg",
      title: t(
        "DashboardPage.pairFleetDriverTitle",
        {},
        "Pasangkan Armada dan Driver"
      ),
      description: t(
        "DashboardPage.pairFleetDriverDesc",
        {},
        "Pasangkan armada dengan driver yang sesuai agar siap menerima pesanan pengiriman."
      ),
      stepName: t(
        "DashboardPage.pairFleetDriverStep",
        {},
        "Pasangkan Armada & Driver"
      ),
    },
    {
      id: 4,
      statusKey: "areaSettingCompleted",
      icon: "/icons/dashboard/maps-box.svg",
      title: t(
        "DashboardPage.areaSettingTitle",
        {},
        "Atur Area Muat dan Muatan yang Dilayani"
      ),
      description: t(
        "DashboardPage.areaSettingDesc",
        {},
        "Atur area muat dan jenis muatan agar kami dapat mencarikan pesanan yang sesuai untukmu."
      ),
      stepName: t(
        "DashboardPage.areaSettingStep",
        {},
        "Atur Area Muat & Muatan"
      ),
    },
  ];

  return (
    <>
      <h1 className="text-xl font-bold text-neutral-900">
        {t("DashboardPage.title", {}, title)}
      </h1>
      <div className="flex justify-between py-6">
        {menuItems.map((val, index) => {
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-secondary-500 font-bold">
                {index + 1}
              </div>
              <div className="font-semibold">{val.stepName}</div>
            </div>
          );
        })}
      </div>
      <div className="">
        <Card className="h-[409px] w-[1232px] !border-none !p-0 !py-0 px-0 shadow-muat">
          <CardHeader className="!border-none !px-6 !py-5">
            <h1 className="text-lg font-bold text-neutral-900">
              {t(
                "DashboardPage.stepsTitle",
                {},
                "Langkah Mudah Untuk Mulai Mendapatkan Pesanan"
              )}
            </h1>
            <p className="text-xs text-neutral-600">
              {t(
                "DashboardPage.stepsDesc",
                {},
                "Ayo lengkapi informasi armada dan driver kamu untuk mulai menerima pesanan di muatrans"
              )}
            </p>
          </CardHeader>
          <CardContent className="!px-6 !py-0">
            <div className="flex flex-col gap-6">
              {menuItems.map((item) => (
                <CardMenu
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  buttonText={item.buttonText}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
