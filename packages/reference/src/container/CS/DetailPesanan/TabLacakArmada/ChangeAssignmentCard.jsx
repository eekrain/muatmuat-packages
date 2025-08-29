import RadioButton from "@/components/Radio/RadioButton";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { CustomTransporterSelect } from "./CustomTransporterSelect";

const ChangeAssignmentCard = ({
  armadaImage = "/img/truck.png",
  armadaName,
  value,
  onChange,
  transporterOptions,
  uniqueGroupName,
  className,
}) => {
  const { t } = useTranslation();

  const handleTypeChange = (newType) => {
    const newTransporterId =
      newType === "CHOOSE_TRANSPORTER" ? value.transporterId : null;
    onChange({ type: newType, transporterId: newTransporterId });
  };

  // --- FIX IS HERE ---
  // The 'selectedId' is the ID string itself, not an object.
  // We use it directly.
  const handleTransporterChange = (selectedId) => {
    onChange({ type: "CHOOSE_TRANSPORTER", transporterId: selectedId });
  };

  return (
    <div
      className={cn(
        "flex h-[88px] w-full items-center justify-between border-b border-neutral-200 bg-white p-4 last:border-b-0",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-50">
          <img
            src={armadaImage}
            alt={armadaName}
            className="h-full w-full object-contain"
          />
        </div>
        <p className="text-sm font-bold text-neutral-900">{armadaName}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-neutral-600">
          {t("ChangeAssignmentCard.labelUbahKe", {}, "Ubah Ke")}
        </span>
        <div className="flex items-center gap-4">
          <RadioButton
            name={uniqueGroupName}
            checked={value.type === "SAME_TRANSPORTER"}
            onClick={() => handleTypeChange("SAME_TRANSPORTER")}
            label={t(
              "ChangeAssignmentCard.radioTidakDiubah",
              {},
              "Tidak Diubah (Transporter yang sama)"
            )}
          />
          <RadioButton
            name={uniqueGroupName}
            checked={value.type === "REBLAST"}
            onClick={() => handleTypeChange("REBLAST")}
            label={t("ChangeAssignmentCard.radioBlastUlang", {}, "Blast Ulang")}
          />
          <div className="flex items-center gap-2">
            <RadioButton
              name={uniqueGroupName}
              checked={value.type === "CHOOSE_TRANSPORTER"}
              onClick={() => handleTypeChange("CHOOSE_TRANSPORTER")}
            />
            <CustomTransporterSelect
              options={transporterOptions}
              placeholder={t(
                "ChangeAssignmentCard.placeholderPilihTransporter",
                {},
                "Pilih Transporter"
              )}
              value={value.transporterId}
              onChange={handleTransporterChange}
              disabled={value.type !== "CHOOSE_TRANSPORTER"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAssignmentCard;
