import Image from "next/image";
import { useRouter } from "next/navigation";

import { ChevronRight } from "lucide-react";

import Button from "@/components/Button/Button";
import { useTranslation } from "@/hooks/use-translation";

export const NoFleetOverlay = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleAddFleet = () => {
    // Navigate to fleet management page
    router.push("/transporter/fleet");
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
      <div
        className="flex flex-col items-center rounded-[12px] bg-white"
        style={{
          width: "456px",
          padding: "24px",
          gap: "16px",
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col items-center gap-[12px]">
          <div style={{ width: "100px", height: "76px" }}>
            <Image
              src="/img/monitoring-first-timer.png"
              alt={t("NoFleetOverlay.imageAlt", {}, "Add Fleet")}
              width={100}
              height={76}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[16px]">
          <h2
            className="font-semibold text-[#7B7B7B]"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontSize: "16px",
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            {t("NoFleetOverlay.title", {}, "Kamu Belum Menambahkan Armada")}
          </h2>

          <p
            className="text-[#7B7B7B]"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            {t(
              "NoFleetOverlay.description",
              {},
              "Mulai tambahkan armada untuk menggunakan fitur maps"
            )}
          </p>
        </div>

        <Button
          variant="muattrans-primary"
          onClick={handleAddFleet}
          iconRight={<ChevronRight size={16} />}
        >
          {t("NoFleetOverlay.addFleetButton", {}, "Tambah Armada")}
        </Button>
      </div>
    </div>
  );
};
