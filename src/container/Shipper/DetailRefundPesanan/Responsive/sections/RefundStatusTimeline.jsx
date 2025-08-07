import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import ResponsiveSection from "@/components/Section/ResponsiveSection";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { formatDate } from "@/lib/utils/dateFormat";

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
        <div className="mx-auto w-[170px]">
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
                subtitle: refundData?.requestedAt
                  ? formatDate(new Date(refundData.requestedAt))
                  : "-",
              },
              {
                icon: "/icons/stepper/stepper-check-circle.svg",
                status: "DONE_REFUND",
                subtitle: refundData?.processedAt
                  ? formatDate(new Date(refundData.processedAt))
                  : "-",
              },
            ].map((step, index) => (
              <StepperItemResponsive
                key={step.status}
                step={step}
                index={index}
              />
            ))}
          </StepperContainer>
        </div>
      </div>
    </ResponsiveSection>
  );
};

export default RefundStatusTimeline;
