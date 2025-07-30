import { useMemo, useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverInfo } from "../Home/components/DriverInfoSlider";

export default function MultiDriverQRCodeScreen({ dataStatusPesanan }) {
  const navigation = useResponsiveNavigation();
  const [isShareBottomsheetOpen, setIsShareBottomsheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = useMemo(() => {
    const drivers = dataStatusPesanan?.driverStatus;
    if (!drivers) return [];
    if (!searchQuery) return drivers;
    return drivers?.filter((driver) =>
      driver?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataStatusPesanan?.driverStatus, searchQuery]);

  return (
    <FormResponsiveLayout
      title={{
        label: "QR Code Lokasi Muat 1",
      }}
      withMenu={{
        onClickShare: () => setIsShareBottomsheetOpen(true),
      }}
      onClickBackButton={() => navigation.pop()}
      className="flex flex-col"
    >
      <div className="mb-2 w-full border-b border-neutral-400 bg-white p-4">
        <Input
          icon={{ left: "/icons/search.svg" }}
          placeholder="Cari Nama Driver/Plat Nomor"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="mt-2 flex h-full flex-1 flex-col gap-2">
          <DataNotFound
            type="search"
            title="Keyword Tidak Ditemukan"
            className="flex-1"
          />
        </div>
      ) : (
        <div className="mt-2 flex h-full flex-1 flex-col gap-2">
          {filteredDrivers.map((driver, index) => (
            <DriverInfo.Root
              key={driver?.driverId || index}
              className="flex flex-col gap-4 border-none px-4 py-5"
            >
              <DriverInfo.Header
                statusCode={driver.driverStatus}
                withMenu={false}
                mode="status-scan"
              />
              <DriverInfo.Avatar driver={driver} />

              <Button variant="muatparts-primary">Tampilkan QR Code</Button>
            </DriverInfo.Root>
          ))}
        </div>
      )}

      <BottomSheet
        open={isShareBottomsheetOpen}
        onOpenChange={setIsShareBottomsheetOpen}
      >
        <BottomSheetContent>
          <BottomSheetHeader>Bagikan</BottomSheetHeader>
          <div className="mt-6 px-4 pb-6">
            <span className="text-sm font-medium">Bagikan melalui</span>

            <div className="mt-[14px] flex flex-wrap justify-center gap-6">
              {shareOptions.map((option) => (
                <ShareOption
                  key={option.name}
                  name={option.name}
                  icon={option.icon}
                />
              ))}
            </div>
          </div>
        </BottomSheetContent>
      </BottomSheet>
    </FormResponsiveLayout>
  );
}

// Data for share options. Assumed icon paths.
const shareOptions = [
  { name: "Salin Tautan", icon: "/img/share-icons/copy.png" },
  { name: "Whatsapp", icon: "/img/share-icons/whatsapp.png" },
  { name: "Telegram", icon: "/img/share-icons/telegram.png" },
  { name: "Facebook", icon: "/img/share-icons/facebook.png" },
  { name: "Instagram", icon: "/img/share-icons/instagram.png" },
  { name: "X", icon: "/img/share-icons/twitter.png" },
  { name: "Email", icon: "/img/share-icons/gmail.png" },
];

const ShareOption = ({ name, icon }) => (
  <button
    type="button"
    className="flex flex-col items-center gap-2"
    onClick={() => console.log(`Sharing via ${name}`)}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 bg-white">
      <img src={icon} alt="icon" className="size-6" />
    </div>
    <p className="w-[60px] text-center text-xs font-medium text-neutral-900">
      {name}
    </p>
  </button>
);
