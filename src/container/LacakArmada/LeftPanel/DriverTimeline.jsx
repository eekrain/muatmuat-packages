import { Fragment, useEffect, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { LightboxProvider, useLightbox } from "@/components/Lightbox/Lighbox";
import {
  TimelineContainer,
  TimelineContentWithButtonDate,
  TimelineItem,
} from "@/components/Timeline";
import { OrderStatusTitle } from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const DriverTimeline = ({ driverStatusTimeline }) => {
  const [images, setImages] = useState({ packages: [], pods: [] });
  const [currentStatus, setCurrentStatus] = useState(null);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(0);

  const lightboxTitle = () => {
    if (lightboxActiveIndex > images.packages.length - 1)
      return `POD ${currentStatus?.statusName}`;
    return `Bukti ${currentStatus?.beforeStatusName || currentStatus?.statusName}`;
  };

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4 pt-0">
      <LightboxProvider
        images={[...images.packages, ...images.pods]}
        title={lightboxTitle()}
      >
        {driverStatusTimeline?.statusDefinitions.map((parent, parentIndex) => (
          <Fragment key={parent.mappedOrderStatus}>
            {parent.children.length > 0 ? (
              <TimelineContainer className="ml-[9px]">
                {parent.children.map((driverStatus, index) => (
                  <ItemWithLightbox
                    key={driverStatus.statusCode}
                    parent={parent}
                    driverStatus={driverStatus}
                    index={index}
                    parentIndex={parentIndex}
                    setImages={setImages}
                    setCurrentStatus={setCurrentStatus}
                    setLightboxActiveIndex={setLightboxActiveIndex}
                  />
                ))}
              </TimelineContainer>
            ) : null}

            <ParentItem
              icon="/icons/stepper/stepper-box-opened.svg"
              title={OrderStatusTitle[parent.mappedOrderStatus]}
              withDivider={
                parentIndex !==
                driverStatusTimeline?.statusDefinitions.length - 1
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
  driverStatus,
  index,
  parentIndex,
  setImages,
  setCurrentStatus,
  setLightboxActiveIndex,
}) => {
  const subtitle = () => {
    if (driverStatus.statusCode.startsWith("MENUJU_")) {
      return "Lihat Bukti Muat Barang & POD";
    }

    return `Lihat Bukti ${driverStatus.statusName}`;
  };

  const { openLightbox, current } = useLightbox();

  // Sync active index from Lightbox Provider
  useEffect(() => {
    setLightboxActiveIndex(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <TimelineItem
      key={driverStatus.statusCode}
      variant="bullet-driver-status"
      totalLength={parent.children.length}
      index={index}
      activeIndex={parentIndex === 0 ? 0 : -1}
    >
      <TimelineContentWithButtonDate
        title={driverStatus.statusName}
        withButton={
          driverStatus.requiresPhoto
            ? {
                label: subtitle(),
                onClick: () => {
                  setImages({
                    packages: driverStatus.photoEvidences.packages,
                    pods: driverStatus.photoEvidences.pods,
                  });
                  setCurrentStatus(driverStatus);
                  openLightbox(0);
                },
              }
            : null
        }
        withDate={new Date(driverStatus.date)}
        onSubtitleClick={() =>
          alert(`Tampilkan modal untuk ${driverStatus.subtitle}`)
        }
      />
    </TimelineItem>
  );
};

const ParentItem = ({ icon, title, withDivider = true }) => {
  return (
    <>
      <div className="mt-5 grid grid-cols-[32px_1fr] items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muat-trans-primary-400">
          <IconComponent
            src={icon}
            width={16}
            height={16}
            className="text-muat-trans-primary-900"
          />
        </div>

        <div className="text-sm font-bold leading-[1.2]">{title}</div>
      </div>

      {withDivider && (
        <div className="my-5 grid grid-cols-[32px_1fr] items-center gap-3">
          <div />
          <hr />
        </div>
      )}
    </>
  );
};
