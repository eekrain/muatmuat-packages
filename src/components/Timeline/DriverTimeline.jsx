import { Fragment, useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { LightboxProvider, useLightbox } from "@/components/Lightbox/Lightbox";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusIcon,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

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
export const DriverTimeline = ({ dataDriverStatus, onClickProof }) => {
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
          ? t("labelPODMuatMulti", { index })
          : t("labelPODMuat");
      } else {
        return index > 1
          ? t("labelPODBongkarMulti", { index })
          : t("labelPODBongkar");
      }
    } else {
      if (statusCode.includes("MUAT")) {
        return index > 1
          ? t("labelBuktiMuatBarangMulti", { index })
          : t("labelBuktiMuatBarang");
      } else {
        return index > 1
          ? t("labelBuktiBongkarBarangMulti", { index })
          : t("labelBuktiBongkarBarang");
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
              <TimelineContainer>
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
                parentIndex !== dataDriverStatus?.statusDefinitions.length - 1
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
                parentIndex === 0 && !Boolean(parent?.children) ? "md:mt-0" : ""
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

  const buttonConfig = driverStatusItem.requiresPhoto
    ? {
        label: subtitle(),
        onClick: handleClickProof,
      }
    : null;

  // Sync active index from Lightbox Provider
  useEffect(() => {
    setLightboxActiveIndex(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <TimelineItem
      key={driverStatusItem.statusCode}
      variant="bullet-driver-status"
      totalLength={parent.children.length}
      index={index}
      activeIndex={parentIndex === 0 ? 0 : -1}
      className="grid-cols-[32px_1fr] gap-3"
    >
      <TimelineContentWithButtonDate
        title={driverStatusItem.statusName}
        withButton={buttonConfig}
        withDate={new Date(driverStatusItem.date)}
        className={index === totalLength - 1 ? "pb-0" : ""}
        appearance={{
          dateClassname:
            parentIndex === 0 && index === 0
              ? "text-neutral-900"
              : "text-neutral-600",
          titleClassname:
            parentIndex === 0 && index === 0
              ? "text-neutral-900 font-semibold"
              : "text-neutral-600",
        }}
        onSubtitleClick={() =>
          alert(
            t("messageTampilkanModal", { subtitle: driverStatusItem.subtitle })
          )
        }
      />
    </TimelineItem>
  );
};

const iconStyles = {
  canceled: "bg-error-400 text-neutral-50",
  active: "bg-muat-trans-primary-400 text-muat-trans-primary-900",
  inactive: "bg-neutral-200 text-neutral-600 border-neutral-400",
};

const ParentItem = ({
  icon,
  title,
  withDivider = true,
  variant = "inactive",
  canceledAt = null,
  className,
}) => {
  return (
    <>
      <div
        className={cn(
          "mt-4 grid grid-cols-[32px_1fr] items-center gap-3 md:mt-5",
          className
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-transparent",
            iconStyles[variant]
          )}
        >
          <IconComponent src={icon} className="h-5 w-5 md:h-4 md:w-4" />
        </div>

        <div
          className={cn(
            "flex items-center justify-between text-sm font-bold leading-[1.2] text-neutral-600",
            variant === "canceled" && "text-neutral-900",
            variant === "active" && "text-neutral-900"
          )}
        >
          <span>{title}</span>
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

      {withDivider && (
        <div className="my-4 grid items-center gap-3 md:my-5 md:grid-cols-[32px_1fr]">
          <div className="hidden md:block" />
          <hr className="w-full border-neutral-400" />
        </div>
      )}
    </>
  );
};
