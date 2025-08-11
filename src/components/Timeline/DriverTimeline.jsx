import { Fragment, useCallback, useEffect, useState } from "react";

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
import { getDriverStatusMetadata } from "@/lib/normalizers/detailpesanan/getDriverStatusMetadata";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

import { ButtonMini } from "../Button/ButtonMini";

const getStatusCodeMeta = (statusCode) => {
  if (!statusCode) return { statusCode: "", index: null };
  const splitted = statusCode.split("_");
  let index = null;
  if (!isNaN(Number(splitted[splitted.length - 1]))) {
    index = Number(splitted.pop());
  }
  return { statusCode: splitted.join("_"), index };
};

const calculateTitle = (currentStatus, activeIndex, images, t) => {
  if (!currentStatus) return "";
  if (currentStatus.isParentProof) {
    const packagesCount = images.packages?.length || 0;
    if (currentStatus.mappedOrderStatus === OrderStatusEnum.DOCUMENT_DELIVERY) {
      return t("labelLihatBuktiPengiriman");
    }
    if (activeIndex < packagesCount) {
      return t("labelBuktiBongkarBarang");
    }
    return t("labelPODBongkar");
  }
  if (!currentStatus.beforeStatusCode?.includes("SEDANG")) {
    const { statusCode, index } = getStatusCodeMeta(currentStatus.statusCode);
    const statusName = `${t(DriverStatusLabel[statusCode])}${index > 1 ? ` ${index}` : ""}`;
    return t("labelBuktiStatus", { statusName });
  }
  const { statusCode, index } = getStatusCodeMeta(
    currentStatus.beforeStatusCode
  );
  const isPodImage = activeIndex >= (images.packages?.length || 0);
  let titleKey;
  if (isPodImage) {
    titleKey = statusCode.includes("MUAT")
      ? index > 1
        ? "labelPODMuatMulti"
        : "labelPODMuat"
      : index > 1
        ? "labelPODBongkarMulti"
        : "labelPODBongkar";
  } else {
    titleKey = statusCode.includes("MUAT")
      ? index > 1
        ? "labelBuktiMuatBarangMulti"
        : "labelBuktiMuatBarang"
      : index > 1
        ? "labelBuktiBongkarBarangMulti"
        : "labelBuktiBongkarBarang";
  }
  return t(titleKey, { index });
};

export const DriverTimeline = ({ dataTimeline, onClickProof }) => {
  const { t } = useTranslation();
  const [images, setImages] = useState({ packages: [], pods: [], photo: [] });
  const [currentStatus, setCurrentStatus] = useState(null);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const newTitle = calculateTitle(
      currentStatus,
      lightboxActiveIndex,
      images,
      t
    );
    setTitle(newTitle);
  }, [currentStatus, lightboxActiveIndex, images, t]);

  const handleSetLightboxData = useCallback((statusObject) => {
    const evidence = statusObject.isParentProof
      ? statusObject.photoEvidences
      : statusObject.photoEvidences;
    setImages({
      packages: evidence?.packages || [],
      pods: evidence?.pods || [],
      photo: evidence?.photo || [],
    });
    setCurrentStatus(statusObject);
  }, []);

  return (
    <div>
      <LightboxProvider
        images={[
          ...(images.packages || []),
          ...(images.pods || []),
          ...(images.photo || []),
        ]}
        title={title}
      >
        {dataTimeline?.statusDefinitions.map((parent, parentIndex) => (
          <Fragment key={`${parent.mappedOrderStatus}-${parentIndex}`}>
            {parent?.children?.length > 0 && (
              <TimelineContainer className="mb-5">
                {parent.children.map((driverStatusItem, index) => (
                  <ItemWithLightbox
                    key={driverStatusItem.statusCode}
                    data={{
                      item: driverStatusItem,
                      isActive: parentIndex === 0 && index === 0,
                      isLastInGroup: index === parent.children.length - 1,
                    }}
                    // Callbacks are now passed as individual props
                    setLightboxActiveIndex={setLightboxActiveIndex}
                    onSetLightboxData={handleSetLightboxData}
                    onMobileClick={onClickProof}
                  />
                ))}
              </TimelineContainer>
            )}
            <ParentItem
              parent={parent}
              isActive={parentIndex === 0}
              isLastItem={
                parentIndex === dataTimeline.statusDefinitions.length - 1
              }
              onSetLightboxData={handleSetLightboxData}
            />
          </Fragment>
        ))}
      </LightboxProvider>
    </div>
  );
};

// The component now receives individual function props again
const ItemWithLightbox = ({
  data,
  setLightboxActiveIndex,
  onSetLightboxData,
  onMobileClick,
}) => {
  const { item, isActive, isLastInGroup } = data;
  const { t } = useTranslation();
  const { current, openLightbox } = useLightbox();
  const { isMobile } = useDevice();

  useEffect(() => {
    setLightboxActiveIndex(current);
  }, [current, setLightboxActiveIndex]);

  const handleProofClick = () => {
    if (isMobile && onMobileClick) {
      onMobileClick(item);
      return;
    }
    onSetLightboxData(item);
    openLightbox(0);
  };

  const statusMeta = getDriverStatusMetadata({
    driverStatus: item.statusCode,
    t,
  });

  return (
    <NewTimelineItem
      variant="bullet-driver-status"
      activeIndex={isActive ? 0 : -1}
      title={statusMeta.label}
      isLast={isLastInGroup}
      timestamp={item.date}
      className="grid-cols-[32px_1fr] gap-x-3"
      appearance={{
        titleClassname: isActive
          ? "font-semibold text-neutral-900"
          : "text-neutral-600",
        timestampClassname: isActive ? "text-neutral-900" : "text-neutral-600",
      }}
      buttonDetail={
        item.requiresPhoto && (
          <ButtonMini className="mt-1" onClick={handleProofClick}>
            {item.statusCode.startsWith("MENUJU_") ||
            item.statusCode.startsWith("PENGIRIMAN_")
              ? t("labelLihatBuktiMuatBarangPOD")
              : t("labelLihatBuktiStatus", { statusName: item.statusName })}
          </ButtonMini>
        )
      }
    />
  );
};

const iconStyles = {
  canceled: "bg-error-400 text-neutral-50",
  active: "bg-muat-trans-primary-400 text-muat-trans-primary-900",
  inactive: "bg-neutral-200 text-neutral-600 border-neutral-400",
};

const ParentItem = ({ parent, isActive, isLastItem, onSetLightboxData }) => {
  const { t } = useTranslation();
  const { isMobile } = useDevice();
  const { openLightbox } = useLightbox();

  const handleShowProof = () => {
    const syntheticStatus = {
      isParentProof: true,
      photoEvidences: parent.shippingEvidence,
      mappedOrderStatus: parent.mappedOrderStatus,
    };
    onSetLightboxData(syntheticStatus);
    openLightbox(0);
  };

  const variant = parent.mappedOrderStatus.startsWith("CANCELED")
    ? "canceled"
    : isActive
      ? "active"
      : "inactive";
  const icon =
    variant === "canceled" && !isMobile
      ? "/icons/close-circle.svg"
      : variant === "canceled" && isMobile
        ? "/icons/close24.svg"
        : OrderStatusIcon[parent.mappedOrderStatus];
  const title = t(OrderStatusTitle[parent.mappedOrderStatus]);
  const withLine =
    parent.mappedOrderStatus === OrderStatusEnum.DOCUMENT_DELIVERY;
  const withDivider = !isLastItem && !withLine;
  const timestamp = parent.date;

  const buttonProps = (() => {
    const evidence = parent?.shippingEvidence;
    if (evidence?.packages?.length > 0 || evidence?.pods?.length > 0) {
      return {
        label: t("labelLihatBuktiBongkarBarangDanPOD"),
        onClick: handleShowProof,
      };
    }
    if (evidence?.photo?.length > 0) {
      return {
        label: t("labelLihatBuktiPengiriman"),
        onClick: handleShowProof,
      };
    }
    return null;
  })();

  const className = cn(
    isActive && !parent?.children && "md:mt-0",
    buttonProps && "pb-2"
  );

  return (
    <div className="w-full">
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex flex-col items-center self-stretch">
          <div
            className={cn(
              "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-transparent",
              iconStyles[variant]
            )}
          >
            <IconComponent src={icon} className="h-5 w-5 md:h-4 md:w-4" />
          </div>
          {withLine && (
            <div className="w-0 flex-1 border-l-2 border-dashed border-neutral-400" />
          )}
        </div>
        <div className={cn("w-full flex-1", withLine && "pb-8 pt-2")}>
          <div
            className={cn(
              "flex items-center justify-between text-sm font-bold leading-tight",
              variant === "inactive" ? "text-neutral-600" : "text-neutral-900"
            )}
          >
            <div className="relative flex-1">
              <span>{title}</span>
              {buttonProps && (
                <button
                  onClick={buttonProps.onClick}
                  className="absolute -bottom-0.5 left-0 translate-y-full text-xs font-medium text-primary-700"
                >
                  {buttonProps.label}
                </button>
              )}
            </div>
            {timestamp && (
              <span
                className={cn(
                  "block w-20 text-right text-xs font-medium leading-tight md:w-fit",
                  variant === "canceled"
                    ? "text-neutral-900"
                    : "text-neutral-600"
                )}
              >
                {formatDate(timestamp)}
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
