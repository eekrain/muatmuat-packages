import { Fragment } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { formatShortDate } from "@/lib/utils/dateFormat";

const RefundStatusTimeline = ({ refundData }) => {
  const refundStatusLabels = {
    REFUND_PROCESSING: "Pengembalian Dana Diproses",
    REFUND_COMPLETED: "Dana Terkirim",
  };
  const refundStatusLabel = refundStatusLabels[refundData?.refundStatus] || "";
  return (
    <ResponsiveSection appearance={{ containerClassname: "h-[142px]" }}>
      <div className="flex flex-col gap-y-4">
        <BadgeStatusPesanan
          variant={
            refundData?.refundStatus === "REFUND_PROCESSING"
              ? "warning"
              : "success"
          }
          className="w-full"
        >
          {refundStatusLabel}
        </BadgeStatusPesanan>
        <div className="px-20">
          <StepperContainer
            activeIndex={
              refundData?.refundStatus === "REFUND_COMPLETED" ? 1 : 0
            }
            totalStep={2}
          >
            {[
              {
                icon: "/icons/money16.svg",
                status: "PROCESS_REFUND",
                subtitle: refundData?.requestedAt ? (
                  <div className="flex flex-col gap-y-2 text-xxs font-medium leading-none text-neutral-900">
                    <span>
                      {formatShortDate(new Date(refundData.requestedAt))}
                    </span>
                    <span>
                      {`${new Date(refundData.requestedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )} WIB`}
                    </span>
                  </div>
                ) : (
                  ""
                ),
              },
              {
                icon: "/icons/stepper/stepper-check-circle.svg",
                status: "DONE_REFUND",
                subtitle: refundData?.processedAt ? (
                  <div className="flex flex-col gap-y-2 text-xxs font-medium leading-none text-neutral-900">
                    <span>
                      {formatShortDate(new Date(refundData.processedAt))}
                    </span>
                    <span>
                      {`${new Date(refundData.processedAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )} WIB`}
                    </span>
                  </div>
                ) : (
                  ""
                ),
              },
            ].map((step, key) => (
              <Fragment key={key}>
                <StepperItemResponsive
                  key={step.status}
                  status={step?.status}
                  icon={step.icon}
                  subtitle={step.subtitle}
                  index={key}
                />
              </Fragment>
            ))}
          </StepperContainer>
        </div>
      </div>
    </ResponsiveSection>
  );
};

export default RefundStatusTimeline;
