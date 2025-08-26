import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { useGetScheduleEstimation } from "@/services/Transporter/agenda-armada-driver/getScheduleEstimation";
import { useUpdateScheduleEstimation } from "@/services/Transporter/agenda-armada-driver/updateScheduleEstimation";

// import { formatDate } from "@/lib/utils/dateFormat";

import CardDetail from "./CardDetail";
import { getDynamicDates } from "./getDynamicDates";
import { useDateNavigator } from "./use-date-navigator";

// --- Main Component ---

const EditSchedule = ({ cardData, onClose, defaultDays = 0 }) => {
  const { t } = useTranslation();
  const { dateRange } = useDateNavigator();

  // Get schedule ID from cardData
  const scheduleId = cardData?.id || cardData?.scheduleId || "schedule-123";

  // Get current estimation from API (Moment 1: When modal opens)
  const {
    data: estimationData,
    isLoading: isLoadingEstimation,
    mutate: refreshEstimation,
  } = useGetScheduleEstimation(scheduleId);

  // Log when API is called for getting estimation
  useEffect(() => {
    console.log(
      "📡 MOMENT 1 - Modal opened, fetching estimation for scheduleId:",
      scheduleId
    );
  }, [scheduleId]);

  // Use API data if available, otherwise fallback to cardData or default
  const [days, setDays] = useState(() => {
    if (estimationData?.data?.Data?.currentEstimation?.days !== undefined) {
      return estimationData.data.Data.currentEstimation.days;
    }
    return defaultDays || cardData?.additional || 0;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update schedule estimation mutation (Moment 2 & 3: When estimation changes and when Save button is pressed)
  const { trigger: updateEstimation, isMutating } =
    useUpdateScheduleEstimation(scheduleId);

  // Update days when API data is loaded
  useEffect(() => {
    if (estimationData?.data?.Data?.currentEstimation?.days !== undefined) {
      console.log("📥 MOMENT 1 - API data loaded:", estimationData);
      setDays(estimationData.data.Data.currentEstimation.days);
    }
  }, [estimationData]);

  // Handle estimation change (Moment 2: When estimation is changed - real-time API call)
  const handleEstimationChange = async (newDays) => {
    // Validate maximum days limit (3 days)
    if (newDays > 3) {
      toast.warning(
        t("EditSchedule.maxDaysLimit", {}, "Estimasi maksimal adalah 3 hari")
      );
      return;
    }

    console.log("🔄 MOMENT 2 - Estimation changed from", days, "to", newDays);
    setDays(newDays);

    // Call API to update estimation in real-time
    try {
      const estimatedDurationMinutes = newDays * 24 * 60;
      const estimatedDistanceKm = cardData?.estimatedTotalDistanceKm || 0;

      const estimationData = {
        estimatedDistanceKm,
        estimatedDurationMinutes,
        updateReason: `Real-time update: Changed unloading time estimation to ${newDays} days`,
      };

      console.log("📤 MOMENT 2 - Real-time estimation update:", {
        scheduleId,
        estimationData,
        timestamp: new Date().toLocaleTimeString(),
      });

      await updateEstimation(estimationData);
      console.log("✅ MOMENT 2 - Real-time estimation updated successfully");
    } catch (error) {
      console.error(
        "❌ MOMENT 2 - Failed to update estimation in real-time:",
        error
      );
      // Don't show error toast for real-time updates to avoid spam
    }
  };

  const [dateOffset, setDateOffset] = useState(0);
  const scheduleContainerWidth = 860;
  const scheduledDays = cardData?.scheduled || 1;

  // Calculate dates based on dateRange.start and cardData.position
  const DATES = getDynamicDates(
    dateRange.start,
    cardData?.position || 0,
    dateOffset
  );
  const cellWidth = scheduleContainerWidth / DATES.length;

  // Calculate if there's overflow
  const totalDays = scheduledDays + days;
  const hasOverflow = totalDays > 5;
  const maxOffset = Math.max(0, totalDays - 5);
  const cardPosition = 0 - dateOffset; // Shift card left when dates shift right

  // Auto-follow the last estimate when days change
  useEffect(() => {
    if (hasOverflow) {
      // Set dateOffset to show the last estimate date
      setDateOffset(maxOffset);
    } else {
      // Reset to start when no overflow
      setDateOffset(0);
    }
  }, [days, hasOverflow, maxOffset]);

  // Navigation handlers
  const canNavigateLeft = dateOffset > 0;
  const canNavigateRight = dateOffset < maxOffset;

  const handleNavigateLeft = () => {
    if (canNavigateLeft) {
      setDateOffset(dateOffset - 1);
    }
  };

  const handleNavigateRight = () => {
    if (canNavigateRight) {
      setDateOffset(dateOffset + 1);
    }
  };

  // Handle save estimation (Moment 3: Final save)
  const handleSaveEstimation = async () => {
    console.log(
      "🚀 MOMENT 3 - FINAL SAVE - handleSaveEstimation called with:",
      {
        days,
        isSubmitting,
        isMutating,
        scheduleId,
        timestamp: new Date().toLocaleTimeString(),
      }
    );

    if (isSubmitting || isMutating) return;

    // Check if estimation has changed
    const currentEstimation = cardData?.additional || 0;
    if (days === currentEstimation) {
      toast.info(
        t(
          "EditSchedule.noChangeMessage",
          {},
          "Estimasi waktu bongkar tidak berubah"
        )
      );
      if (onClose) {
        onClose();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate estimated duration in minutes (days * 24 * 60)
      const estimatedDurationMinutes = days * 24 * 60;

      // Get current estimated distance from cardData
      const estimatedDistanceKm = cardData?.estimatedTotalDistanceKm || 0;

      const estimationData = {
        estimatedDistanceKm,
        estimatedDurationMinutes,
        updateReason: `Final save: Updated unloading time estimation to ${days} days`,
      };

      console.log("📤 MOMENT 3 - Submitting final estimation update:", {
        scheduleId,
        estimationData,
        timestamp: new Date().toLocaleTimeString(),
      });

      console.log(
        "🔄 MOMENT 3 - Calling updateEstimation with:",
        estimationData
      );
      const result = await updateEstimation(estimationData);
      console.log("📥 MOMENT 3 - updateEstimation result:", result);

      console.log(
        "✅ MOMENT 3 - Final estimation updated successfully:",
        result
      );

      toast.success(
        t(
          "EditSchedule.successMessage",
          { days },
          `Estimasi waktu bongkar berhasil diubah menjadi ${days} hari`
        )
      );

      // Close modal if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("❌ MOMENT 3 - Failed to update estimation:", error);
      toast.error(
        t(
          "EditSchedule.errorMessage",
          {},
          "Gagal mengupdate estimasi waktu bongkar"
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col items-center justify-center">
        <div className="font-bold text-neutral-900">
          {t("EditSchedule.title", {}, "Ubah Estimasi")}
        </div>
      </div>
      <div className="flex items-center gap-8 border-neutral-200">
        <div className="text-sm font-medium text-neutral-600">
          {t("EditSchedule.estimateUnloadTime", {}, "Estimasi Waktu Bongkar")}
        </div>
        <div className="flex items-center gap-2">
          {isLoadingEstimation ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 animate-pulse rounded border bg-neutral-200"></div>
              <span className="text-sm font-medium text-neutral-400">
                {t("EditSchedule.loading", {}, "Memuat...")}
              </span>
            </div>
          ) : (
            <>
              <ButtonPlusMinus
                value={days}
                onChange={handleEstimationChange}
                disabled={isLoadingEstimation}
                max={3}
                min={0}
              />
              <span className="text-sm font-medium text-neutral-900">
                {t("EditSchedule.days", {}, "Hari")}
              </span>
            </>
          )}
        </div>
      </div>
      <div
        className="relative overflow-hidden rounded-md border border-neutral-400"
        style={{ width: `${scheduleContainerWidth}px` }}
      >
        <div className="grid h-14 grid-cols-5 items-center border-b text-center">
          {DATES.map((date, index) => (
            <div
              key={date}
              className={`text-sm font-semibold text-neutral-900 ${
                index < DATES.length - 1 ? "border-neutral-200" : ""
              }`}
            >
              {date}
            </div>
          ))}
        </div>
        <div className="absolute top-3 flex w-full items-center justify-between gap-4 px-2">
          <div className="flex justify-start">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateLeft}
                disabled={!canNavigateLeft}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-left16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
          <div className="flex justify-end">
            {hasOverflow && (
              <button
                type="button"
                onClick={handleNavigateRight}
                disabled={!canNavigateRight}
                className="flex size-8 items-center justify-center rounded-full bg-white shadow-md disabled:cursor-not-allowed"
              >
                <IconComponent
                  src="/icons/chevron-right16-2.svg"
                  width={16}
                  height={16}
                />
              </button>
            )}
          </div>
        </div>

        <div className="relative grid h-[68px] grid-cols-5 overflow-visible border-r">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-neutral-200"></div>
          ))}

          <CardDetail
            key={`card-${days}-${scheduledDays}`}
            cellWidth={cellWidth}
            statusCode={cardData?.agendaStatus}
            firstDestinationName={cardData?.firstDestinationName}
            lastDestinationName={cardData?.lastDestinationName}
            scheduled={cardData?.scheduled || 1}
            additional={days}
            position={cardPosition}
            distanceRemaining={cardData?.estimatedTotalDistanceKm}
            hasSosIssue={cardData?.hasSosIssue || false}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          className="w-[112px]"
          onClick={handleSaveEstimation}
          disabled={isSubmitting || isMutating}
        >
          {isSubmitting || isMutating
            ? t("EditSchedule.saving", {}, "Menyimpan...")
            : t("EditSchedule.save", {}, "Simpan")}
        </Button>
      </div>
    </div>
  );
};

export default EditSchedule;
