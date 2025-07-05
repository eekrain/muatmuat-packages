import { Fragment, useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { LightboxProvider, useLightbox } from "@/components/Lightbox/Lightbox";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import {
  OrderStatusIcon,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

export const DriverTimeline = ({ dataDriverStatus, className }) => {
  const [images, setImages] = useState({ packages: [], pods: [] });
  const [currentStatus, setCurrentStatus] = useState(null);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);

  const lightboxTitle = () => {
    const splitted = currentStatus?.beforeStatusCode?.split("_") || [];
    if (splitted.length !== 5 || splitted[0] !== "SEDANG")
      return `Bukti ${currentStatus?.beforeStatusName || currentStatus?.statusName}`;

    if (lightboxActiveIndex > images.packages.length - 1)
      return `POD ${splitted[1][0] + splitted[1].slice(1).toLowerCase()} di Lokasi ${splitted[4]}`;
    else {
      return `Bukti ${splitted[1][0] + splitted[1].slice(1).toLowerCase()} Barang di Lokasi ${splitted[4]}`;
    }
  };

  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto p-4 pt-0", className)}>
      <LightboxProvider
        images={[...images.packages, ...images.pods]}
        title={lightboxTitle()}
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
              title={OrderStatusTitle[parent.mappedOrderStatus]}
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
              canceledAt={
                parent.mappedOrderStatus.startsWith("CANCELED")
                  ? parent.date
                  : null
              }
              className={
                parentIndex === 0 && !Boolean(parent?.children) ? "mt-0" : ""
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
}) => {
  const subtitle = () => {
    if (driverStatusItem.statusCode.startsWith("MENUJU_")) {
      return "Lihat Bukti Muat Barang & POD";
    }

    return `Lihat Bukti ${driverStatusItem.statusName}`;
  };

  const { openLightbox, current } = useLightbox();

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
        withButton={
          driverStatusItem.requiresPhoto
            ? {
                label: subtitle(),
                onClick: () => {
                  setImages({
                    packages: driverStatusItem.photoEvidences.packages,
                    pods: driverStatusItem.photoEvidences.pods,
                  });
                  setCurrentStatus(driverStatusItem);
                  openLightbox(0);
                },
              }
            : null
        }
        withDate={new Date(driverStatusItem.date)}
        className={index === totalLength - 1 ? "pb-0" : ""}
        appearance={{
          dateClassname:
            parentIndex === 0 && index === 0
              ? "text-neutral-900"
              : "text-neutral-600",
          titleClassname:
            parentIndex === 0 && index === 0
              ? "text-neutral-900"
              : "text-neutral-600",
        }}
        onSubtitleClick={() =>
          alert(`Tampilkan modal untuk ${driverStatusItem.subtitle}`)
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
          "mt-5 grid grid-cols-[32px_1fr] items-center gap-3",
          className
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-transparent",
            iconStyles[variant]
          )}
        >
          <IconComponent src={icon} width={16} height={16} />
        </div>

        <div
          className={cn(
            "flex justify-between text-sm font-bold leading-[1.2] text-neutral-600",
            variant === "active" || variant === "canceled"
              ? "text-neutral-900"
              : ""
          )}
        >
          <span>{title}</span>
          {canceledAt && (
            <span className={cn("block text-xs font-medium leading-[1.2]")}>
              {formatDate(canceledAt)}
            </span>
          )}
        </div>
      </div>

      {withDivider && (
        <div className="my-5 grid grid-cols-[32px_1fr] items-center gap-3">
          <div />
          <hr className="border-neutral-400" />
        </div>
      )}
    </>
  );
};
