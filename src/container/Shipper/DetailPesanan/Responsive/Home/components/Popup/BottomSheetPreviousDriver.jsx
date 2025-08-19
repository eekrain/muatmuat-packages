import Image from "next/image";
import { useParams } from "next/navigation";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

const BottomSheetPreviousDriver = ({
  isOpen,
  setOpen,
  oldDriverData,
  type,
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const navigation = useResponsiveNavigation();

  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <BottomSheetTrigger asChild>
        <button
          type="button"
          className="w-full text-left text-sm font-semibold"
        >
          {t(
            "BottomSheetPreviousDriver.buttonViewPreviousDriver",
            {},
            "Lihat Driver Sebelumnya"
          )}
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t(
              "BottomSheetPreviousDriver.titlePreviousDriver",
              {},
              "Driver Sebelumnya"
            )}
          </BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-4 p-4 pt-0 text-neutral-900">
          <div className="flex items-center gap-x-3 rounded-xl border border-neutral-400 p-4">
            <Image
              src="/img/avatar2.png"
              width={40}
              height={40}
              alt={t("BottomSheetPreviousDriver.altDriverAvatar", {}, "driver")}
            />
            <div className="flex flex-col gap-y-3">
              <span className="text-base font-semibold leading-[1.1]">
                {oldDriverData?.driver?.name ||
                  t(
                    "BottomSheetPreviousDriver.textDriverNotFound",
                    {},
                    "Driver tidak ditemukan"
                  )}
              </span>
              <div className="flex items-center gap-x-1">
                <IconComponent
                  width={12}
                  height={12}
                  src="/icons/transporter12.svg"
                  className="text-neutral-900"
                />
                <span className="text-base font-semibold leading-[1.1]">
                  {oldDriverData?.driver?.licensePlate || "-"}
                </span>
              </div>
            </div>
          </div>

          {oldDriverData?.orderStatus === OrderStatusEnum.FLEET_CHANGE ? (
            <div className="flex w-full gap-3">
              <Button
                variant="muatparts-primary-secondary"
                onClick={() =>
                  alert(`Contacting ${oldDriverData?.driver?.name}`)
                }
                className="h-10 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
              >
                Hubungi Driver
              </Button>
              <Button
                variant="muatparts-primary"
                onClick={() =>
                  navigation.push("/LacakArmada", {
                    orderId: params.orderId,
                    driverId: oldDriverData?.driver?.driverId,
                  })
                }
                className="h-10 w-full !rounded-[20px] bg-primary-700 !text-xs !font-semibold text-white"
              >
                Lacak Armada
              </Button>
            </div>
          ) : (
            <Button
              variant="muatparts-primary-secondary"
              onClick={() => {
                navigation.push("/DetailStatusDriverScreen", {
                  orderId: params.orderId,
                  driverId: oldDriverData?.driver?.driverId,
                });
              }}
              className="h-10 w-full"
            >
              {t(
                "BottomSheetPreviousDriver.buttonDriverStatusDetail",
                {},
                "Detail Status Driver"
              )}
            </Button>
            //
          )}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default BottomSheetPreviousDriver;
