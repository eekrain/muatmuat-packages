import { Fragment, useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { LightboxProvider, useLightbox } from "@/components/Lightbox/Lightbox";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusIcon,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

import { ButtonMini } from "../Button/ButtonMini";

const getStatusCodeMeta = (statusCode) => {
  const splitted = statusCode.split("_");
  let index = null;
  // Remote the last element if it's a number
  if (!isNaN(Number(splitted[splitted.length - 1]))) {
    index = Number(splitted[splitted.length - 1]);
    splitted.pop();
  }

  return {
    statusCode: splitted.join("_"),
    index,
  };
};

/**
 * @typedef {Object} WithButton
 * @property {(driverStatusItem: DriverStatusItem) => void} onClickProof
 */

/**
 * @typedef {Object} DriverTimelineProps
 * @property {DataDriverStatus} dataDriverStatus
 * @property {WithButton} [withButton]
 */

/**
 * DriverTimeline component displays the timeline of driver statuses with image lightbox support.
 *
 * @param {DriverTimelineProps} props
 * @returns {React.ReactNode}
 */
export const DriverTimeline = ({
  dataDriverStatus,
  onClickProof,
  withMenu = true,
}) => {
  console.log("🚀 ~ dataDriverStatus:", dataDriverStatus);
  const { t } = useTranslation();
  const [images, setImages] = useState({ packages: [], pods: [] });
  const [currentStatus, setCurrentStatus] = useState(null);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);

  const getTitle = () => {
    if (!currentStatus) return "";

    if (!currentStatus?.beforeStatusCode?.includes("SEDANG")) {
      const { statusCode, index } = getStatusCodeMeta(
        currentStatus?.statusCode
      );
      return t("labelBuktiStatus", {
        statusName: `${t(DriverStatusLabel[statusCode])}${index > 1 ? ` ${index}` : ""}`,
      });
    }

    const { statusCode, index } = getStatusCodeMeta(
      currentStatus?.beforeStatusCode
    );

    if (lightboxActiveIndex > images.packages.length - 1) {
      if (statusCode.includes("MUAT")) {
        return index > 1
          ? t("labelPODMuatMulti", { index }, "Bukti POD Muat di Lokasi 1")
          : t("labelPODMuat", {}, "Bukti POD Muat");
      } else {
        return index > 1
          ? t(
              "labelPODBongkarMulti",
              { index },
              "Bukti POD Bongkar di Lokasi 1"
            )
          : t("labelPODBongkar", {}, "Bukti POD Bongkar");
      }
    } else {
      if (statusCode.includes("MUAT")) {
        return index > 1
          ? t(
              "labelBuktiMuatBarangMulti",
              { index },
              "Bukti Bongkar Barang di Lokasi 1"
            )
          : t("labelBuktiMuatBarang", {}, "Bukti Muat Barang");
      } else {
        return index > 1
          ? t(
              "labelBuktiBongkarBarangMulti",
              { index },
              "Bukti Bongkar Barang di Lokasi 1"
            )
          : t("labelBuktiBongkarBarang", {}, "Bukti Bongkar Barang");
      }
    }
  };

  return (
    <div>
      <LightboxProvider
        images={[...images.packages, ...images.pods]}
        title={getTitle()}
      >
        {dataDriverStatus?.statusDefinitions.map((parent, parentIndex) => (
          <Fragment key={parent.mappedOrderStatus}>
            {parent?.children && parent.children.length > 0 ? (
              <TimelineContainer className="mb-5">
                {parent.children.map((driverStatusItem, index) => (
                  <ItemWithLightbox
                    key={driverStatusItem.statusCode}
                    parent={parent}
                    driverStatusItem={driverStatusItem}
                    index={index}
                    parentIndex={parentIndex}
                    setImages={setImages}
                    setCurrentStatus={setCurrentStatus}
                    setLightboxActiveIndex={setLightboxActiveIndex}
                    totalLength={parent.children.length}
                    onClickProof={onClickProof}
                  />
                ))}
              </TimelineContainer>
            ) : null}

            <ParentItem
              icon={
                parent.mappedOrderStatus?.startsWith("CANCELED")
                  ? "/icons/close-circle.svg"
                  : OrderStatusIcon[parent.mappedOrderStatus]
              }
              title={t(OrderStatusTitle[parent.mappedOrderStatus])}
              withDivider={
                parentIndex !==
                  dataDriverStatus?.statusDefinitions.length - 1 &&
                parent.mappedOrderStatus !== OrderStatusEnum.DOCUMENT_DELIVERY
              }
              withLine={
                parent.mappedOrderStatus === OrderStatusEnum.DOCUMENT_DELIVERY
              }
              withButton={
                parent?.shippingEvidence?.photo.length > 0
                  ? {
                      label: "Lihat Bukti Pengiriman",
                      onClick: () => {},
                    }
                  : null
              }
              variant={
                parent.mappedOrderStatus.startsWith("CANCELED")
                  ? "canceled"
                  : parentIndex === 0
                    ? "active"
                    : "inactive"
              }
              canceledAt={parent.date}
              className={
                parentIndex === 0 && !parent?.children ? "md:mt-0" : ""
              }
            />
          </Fragment>
        ))}
      </LightboxProvider>
    </div>
  );
};

const ItemWithLightbox = ({
  parent,
  driverStatusItem,
  index,
  parentIndex,
  setImages,
  setCurrentStatus,
  setLightboxActiveIndex,
  totalLength,
  onClickProof,
}) => {
  const { t } = useTranslation();
  const subtitle = () => {
    if (driverStatusItem.statusCode.startsWith("MENUJU_")) {
      return t("labelLihatBuktiMuatBarangPOD");
    }

    return t("labelLihatBuktiStatus", {
      statusName: driverStatusItem.statusName,
    });
  };

  const { openLightbox, current } = useLightbox();

  const { isMobile } = useDevice();

  const handleClickProof = () => {
    if (isMobile && onClickProof) {
      onClickProof(driverStatusItem);
    } else {
      setImages({
        packages: driverStatusItem.photoEvidences.packages,
        pods: driverStatusItem.photoEvidences.pods,
      });
      setCurrentStatus(driverStatusItem);
      openLightbox(0);
    }
  };

  const buttonConfig = driverStatusItem.requiresPhoto ? (
    <ButtonMini className="mt-1" onClick={handleClickProof}>
      {subtitle()}
    </ButtonMini>
  ) : null;

  // Sync active index from Lightbox Provider
  useEffect(() => {
    setLightboxActiveIndex(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <NewTimelineItem
      variant="bullet-driver-status"
      totalLength={parent.children.length}
      index={index}
      activeIndex={parentIndex === 0 ? 0 : -1}
      title={driverStatusItem.statusName}
      isLast={index === parent.children.length - 1}
      timestamp={driverStatusItem.date}
      className="grid-cols-[32px_1fr] gap-x-3"
      appearance={{
        titleClassname:
          parentIndex === 0 && index === 0
            ? "text-neutral-900 font-semibold"
            : "text-neutral-600",
        timestampClassname:
          parentIndex === 0 && index === 0
            ? "text-neutral-900"
            : "text-neutral-600",
      }}
      buttonDetail={buttonConfig}
    />
  );
};

const iconStyles = {
  canceled: "bg-error-400 text-neutral-50",
  active: "bg-muat-trans-primary-400 text-muat-trans-primary-900",
  inactive: "bg-neutral-200 text-neutral-600 border-neutral-400",
};

/**
 * An item in a vertical timeline, responsible for drawing a connector to the next item.
 *
 * @param {object} props
 * @param {string} props.icon - The source path for the icon.
 * @param {string} props.title - The main title of the timeline event.
 * @param {'canceled' | 'active' | 'inactive'} [props.variant='inactive'] - The style variant of the item.
 * @param {string | Date} [props.canceledAt] - Optional timestamp, displayed on the right.
 * @param {string} [props.className] - Optional container class name.
 * @param {boolean} [props.isLast=false] - Should be true if it's the last item in the list to prevent drawing a final connector line.
 */
const ParentItem = ({
  icon,
  title,
  variant = "inactive",
  canceledAt = null,
  className,
  withLine = false,
  withDivider = true,
  withButton,
}) => {
  return (
    <div className="w-full">
      <div className={cn("flex items-center gap-3", className)}>
        {/* Icon and Connector Line Column */}
        <div className="flex flex-col items-center self-stretch">
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-transparent",
              iconStyles[variant]
            )}
          >
            <IconComponent src={icon} className="h-5 w-5 md:h-4 md:w-4" />
          </div>
          {/* Render connector line if it's not the last item */}
          {withLine && (
            <div className="w-0 flex-1 border-l-2 border-dashed border-neutral-400" />
          )}
        </div>

        {/* Content Section */}
        <div
          className={cn("w-full flex-1", withLine && "pb-8 md:pb-8 md:pt-2")}
        >
          <div
            className={cn(
              "flex items-center justify-between text-sm font-bold leading-[1.2] text-neutral-600",
              (variant === "active" || variant === "canceled") &&
                "text-neutral-900"
            )}
          >
            <div className="relative">
              <span>{title}</span>
              {withButton?.label && (
                <button
                  onClick={() => withButton?.onClick?.()}
                  className="absolute bottom-0 left-0 translate-y-full text-xs font-medium text-primary-700"
                >
                  {withButton.label}
                </button>
              )}
            </div>
            {canceledAt && (
              <span
                className={cn(
                  "block w-20 text-right text-xs font-medium leading-[1.2] text-neutral-600 md:w-fit",
                  variant === "canceled" && "text-neutral-900"
                )}
              >
                {formatDate(canceledAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {withDivider && (
        <div className="my-4 grid items-center gap-3 md:my-5 md:grid-cols-[32px_1fr]">
          <div className="hidden md:block" />
          <hr className="w-full border-neutral-400" />
        </div>
      )}
    </div>
  );
};
