import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Input from "@/components/Form/Input";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useGetDriverQRCodeById } from "@/services/Shipper/detailpesanan/getDriverQRCodeById";

import { DriverInfo } from "../Home/components/DriverInfoSlider";
import { BottomsheetShareVia } from "./BottomsheetShareVia";

export default function MultiDriverQRCodeScreen({ dataStatusPesanan }) {
  const params = useParams();
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
        label: "QR Code Lokasi Muat/Bongkar",
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
            <DriverQRItem
              key={driver?.driverId}
              driver={driver}
              orderId={params.orderId}
            />
          ))}
        </div>
      )}

      <BottomsheetShareVia
        open={isShareBottomsheetOpen}
        onOpenChange={setIsShareBottomsheetOpen}
      />
    </FormResponsiveLayout>
  );
}

const DriverQRItem = ({ driver, orderId }) => {
  const navigation = useResponsiveNavigation();
  const { qrData } = useGetDriverQRCodeById({
    driverId: driver?.driverId,
    orderId,
  });

  if (!qrData) return null;

  return (
    <DriverInfo.Root
      key={driver?.driverId}
      className="flex flex-col gap-4 border-none px-4 py-5"
    >
      <DriverInfo.Header
        statusCode={qrData?.driverInfo?.statusScan}
        withMenu={false}
        mode="status-scan"
      />
      <DriverInfo.Avatar driver={driver} />

      <Button
        variant="muatparts-primary"
        onClick={() =>
          navigation.push("/DriverQRCodeSingle", {
            driverId: driver?.driverId,
            orderId,
          })
        }
      >
        Tampilkan QR Code
      </Button>
    </DriverInfo.Root>
  );
};
