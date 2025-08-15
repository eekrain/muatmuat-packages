"use client";

export default function LabelLacakArmada({ fleetCount, hasSOS }) {
  return (
    <span className="flex items-center gap-1">
      Lacak Armada ({fleetCount})
      {hasSOS && (
        <span className="inline-flex h-[14px] w-6 items-center justify-center rounded-[4px] bg-error-400 text-[8px] font-bold text-error-50">
          SOS
        </span>
      )}
    </span>
  );
}
