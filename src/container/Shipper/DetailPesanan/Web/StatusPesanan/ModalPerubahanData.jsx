import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { TimelineContainer, TimelinePICData } from "@/components/Timeline";

import { useTranslation } from "@/hooks/use-translation";

import { formatDate } from "@/lib/utils/dateFormat";

export const ModalPerubahanData = ({
  open,
  onOpenChange,
  orderChangeHistory,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent className="p-6" type="muatmuat">
        <h1 className="mb-4 text-center text-base font-bold leading-[1.2] text-neutral-900">
          {t(
            "ModalPerubahanData.titleDetailSebelumPerubahan",
            {},
            "Detail Sebelum Perubahan"
          )}
        </h1>

        <div className="w-[752px] rounded-lg border border-neutral-400 pr-[6px]">
          <div className="flex h-[386px] w-full flex-col overflow-y-auto pl-4 pr-[6px]">
            {/* Waktu Muat Lama */}
            <div className="box-border flex h-14 w-full flex-row items-center gap-4 border-b border-neutral-400 py-3">
              <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-[#FFC217] p-2">
                <div className="flex h-4 w-4 items-center justify-center">
                  <IconComponent
                    src="/icons/calendar16.svg"
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <h2 className="text-xs font-bold leading-tight text-neutral-900">
                {t("ModalPerubahanData.sectionWaktuMuat", {}, "Waktu Muat")}
              </h2>
            </div>

            <div className="flex items-center border-b border-neutral-400 py-3 pl-12">
              <div className="flex flex-col gap-y-3">
                <span className="text-xs font-medium text-neutral-600">
                  {t("ModalPerubahanData.labelWaktuMuat", {}, "Waktu Muat")}
                </span>
                <span className="text-xs font-medium text-neutral-900">
                  {formatDate(orderChangeHistory.schedule?.loadTimeStart)}{" "}
                  {t("ModalPerubahanData.timeRangeSeparator", {}, "s/d")}{" "}
                  {formatDate(orderChangeHistory.schedule?.loadTimeEnd)}
                </span>
              </div>
            </div>

            {/* Lokasi Muat & Bongkar Lama */}
            <div className="box-border flex h-14 w-full flex-row items-center gap-4 border-b border-neutral-400 py-3">
              <div className="flex h-8 w-8 flex-row items-center justify-center rounded-full bg-[#FFC217] p-2">
                <div className="flex h-4 w-4 items-center justify-center">
                  <IconComponent
                    src="/icons/stepper/stepper-point-a-b.svg"
                    className="h-4 w-4"
                  />
                </div>
              </div>

              <h2 className="text-xs font-bold leading-tight text-neutral-900">
                {t(
                  "ModalPerubahanData.sectionLokasiMuatBongkar",
                  {},
                  "Lokasi Muat & Bongkar"
                )}
              </h2>
            </div>

            <div className="flex-1 pb-3 pl-[48px] pt-8">
              <TimelineContainer>
                {orderChangeHistory.pickupLocations?.map((location, index) => (
                  <TimelinePICData
                    key={index}
                    data={location}
                    variant={"number-muat"}
                    isLast={false}
                    index={index}
                    title={
                      index === 0
                        ? t(
                            "ModalPerubahanData.titleLokasiMuat",
                            {},
                            "Lokasi Muat"
                          )
                        : null
                    }
                    className={
                      index === orderChangeHistory.pickupLocations?.length - 1
                        ? "pb-9"
                        : ""
                    }
                  />
                ))}
                {orderChangeHistory.dropoffLocations?.map((location, index) => (
                  <TimelinePICData
                    key={index}
                    data={location}
                    variant={"number-bongkar"}
                    isLast={
                      index === orderChangeHistory.dropoffLocations?.length - 1
                    }
                    index={index}
                    title={
                      index === 0
                        ? t(
                            "ModalPerubahanData.titleLokasiBongkar",
                            {},
                            "Lokasi Bongkar"
                          )
                        : null
                    }
                    className={
                      index === orderChangeHistory.dropoffLocations?.length - 1
                        ? "pb-0"
                        : ""
                    }
                  />
                ))}
              </TimelineContainer>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
