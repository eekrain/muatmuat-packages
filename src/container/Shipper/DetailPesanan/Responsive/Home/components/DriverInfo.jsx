import { EllipsisVertical } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const DriverInfo = () => {
  const navigation = useResponsiveNavigation();

  return (
    <div className="box-border flex w-full flex-col items-center justify-center border-b-2 border-[#461B02] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <div className="flex w-full items-center justify-between">
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-fit text-sm font-semibold"
            >
              Antri di Lokasi Bongkar 1
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-fit text-sm font-semibold"
            >
              Sedang Muat di Lokasi 1
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-fit text-sm font-semibold"
            >
              Sedang Muat
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="warning"
              className="w-fit text-sm font-semibold"
            >
              Menunggu Pelunasan
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-fit text-sm font-semibold"
            >
              Dokumen Sedang Disiapkan
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-fit text-sm font-semibold"
            >
              Proses Pengiriman Dokumen
            </BadgeStatusPesanan>
          )}

          {true && (
            <BadgeStatusPesanan
              variant="success"
              className="w-fit text-sm font-semibold"
            >
              Selesai
            </BadgeStatusPesanan>
          )}

          {true && <EllipsisVertical />}
        </div>

        <AvatarDriver
          name="Noel Gallagher"
          image="https://picsum.photos/50"
          licensePlate="B 123456"
        />
      </div>

      {/* Action Buttons */}
      {false && (
        <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
          <Button
            variant="muatparts-primary-secondary"
            className="h-7 w-full text-xs font-semibold"
          >
            Hubungi Driver
          </Button>
          <Button
            variant="muatparts-primary"
            className="h-7 w-full text-xs font-semibold"
            onClick={() => navigation.push("/fleet-track")}
            type="button"
          >
            Lacak Armada
          </Button>
        </div>
      )}
      {true && (
        <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
          <Button
            variant="muatparts-primary-secondary"
            className="h-7 w-full text-xs font-semibold"
            onClick={() => navigation.push("/detail-driver-status")}
          >
            Detail Status Driver
          </Button>
        </div>
      )}
      {true && (
        <div className="mt-4 flex items-center justify-center gap-1">
          <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          <div className="h-2 w-8 rounded-full bg-primary-700"></div>
          <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
          <div className="h-2 w-2 rounded-full bg-neutral-400"></div>
        </div>
      )}
    </div>
  );
};
