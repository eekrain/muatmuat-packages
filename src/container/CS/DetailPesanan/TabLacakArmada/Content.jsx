import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import { ArmadaStatusItem } from "./ArmadaStatusItem";
import ChangeAssignmentCard from "./ChangeAssignmentCard";
import { useLacakArmadaContext } from "./use-lacak-armada";

export const Content = () => {
  const { t } = useTranslation();
  const {
    data,
    isEdit,
    assignments,
    handleAssignmentChange,
    availableTransporters,
    hasActiveFilters,
    hasActiveSearch,
    filteredDataByFilters,
  } = useLacakArmadaContext();

  // --- Data Not Found & Empty State Logic ---
  const hasNoFilteredData =
    hasActiveFilters &&
    !hasActiveSearch &&
    (!filteredDataByFilters ||
      filteredDataByFilters.length === 0 ||
      filteredDataByFilters.every(
        (transporter) => !transporter.fleets || transporter.fleets.length === 0
      ));
  const hasNoSearchResults =
    hasActiveSearch &&
    (!data ||
      data.length === 0 ||
      data.every(
        (transporter) => !transporter.fleets || transporter.fleets.length === 0
      )) &&
    filteredDataByFilters &&
    filteredDataByFilters.length > 0 &&
    filteredDataByFilters.some(
      (transporter) => transporter.fleets && transporter.fleets.length > 0
    );

  if (!data || data.length === 0) {
    return (
      <div className="flex w-full justify-center text-center font-medium text-neutral-600">
        <DataNotFound type="data" width={95.5} height={76.76}>
          <div className="text-base font-semibold">
            {t("Content.titleBelumAdaArmada", {}, "Belum ada Armada")}
          </div>
          <div className="mt-3 text-xs">
            {t(
              "Content.descriptionBelumAdaArmada",
              {},
              "Tugaskan transporter secara langsung, atau gunakan fitur blast ulang agar sistem mengirimkan penawaran ke transporter lain"
            )}
          </div>
          <div className="mt-3 flex justify-center gap-3">
            <Button
              variant="muattrans-primary-secondary"
              className="h-8 min-w-[160px] !rounded-full !text-sm"
            >
              {t("Content.buttonPilihTransporter", {}, "Pilih Transporter")}
            </Button>
            <Button
              variant="muattrans-primary"
              className="h-8 min-w-[160px] !rounded-full !text-sm"
            >
              {t("Content.buttonBlastUlang", {}, "Blast Ulang")}
            </Button>
          </div>
        </DataNotFound>
      </div>
    );
  }

  if (hasNoFilteredData) {
    return (
      <div className="flex h-full min-h-[230px] w-full flex-1 items-center justify-center">
        <DataNotFound
          type="data"
          className="gap-4"
          textClass="!w-auto max-w-[400px]"
        >
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              {t(
                "Content.messageDataTidakDitemukan",
                {},
                "Data tidak Ditemukan."
              )}
              <br />
              {t(
                "Content.messageCobahapusFilter",
                {},
                "Mohon coba hapus beberapa filter"
              )}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }

  if (hasNoSearchResults) {
    return (
      <div className="flex h-full min-h-[300px] w-full flex-1 items-center justify-center">
        <DataNotFound
          type="search"
          className="gap-4"
          textClass="!w-auto max-w-[400px]"
        >
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-600">
              {t(
                "Content.messageKeywordTidakDitemukan",
                {},
                "Keyword Tidak Ditemukan"
              )}
            </p>
          </div>
        </DataNotFound>
      </div>
    );
  }

  return data.map((transporter, transporterIndex) => {
    const unassignedCount =
      transporter.fleetsOrdered - (transporter.fleets?.length || 0);
    const transporterKey = `${transporter.transporterId}-${transporterIndex}`;

    return (
      <div
        key={transporterKey}
        className="overflow-hidden rounded-xl border border-neutral-400"
      >
        <div className="flex items-center gap-4 bg-neutral-100 p-4">
          <div className="flex flex-1 items-center gap-4">
            <img
              src={transporter.companyPicture || "/img/default-picture.png"}
              alt={t(
                "Content.altPictureCompany",
                { companyName: transporter.companyName },
                "picture {companyName}"
              )}
              className="size-10 rounded-full border border-neutral-500 object-cover"
            />
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold text-neutral-900">
                {transporter.companyName}
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-900">
                <div className="flex items-center gap-1">
                  <IconComponent
                    src="/icons/transporter16.svg"
                    className="size-4 text-muat-trans-secondary-900"
                  />
                  <span>
                    {t(
                      "Content.labelUnit",
                      { count: transporter.fleetsOrdered },
                      "{count} Unit"
                    )}
                  </span>
                </div>
                <div className="size-0.5 rounded-full bg-neutral-600" />
                <div className="flex items-center gap-1">
                  <IconComponent
                    src="/icons/marker-outline.svg"
                    className="size-4 text-muat-trans-secondary-900"
                  />
                  <span>{transporter.companyAddress}</span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="muattrans-primary"
            className="h-8 min-w-[105px] !rounded-full !text-sm"
          >
            {t("Content.buttonHubungi", {}, "Hubungi")}
          </Button>
        </div>
        <div className="divide-y divide-neutral-200">
          {isEdit && unassignedCount > 0 ? (
            Array.from({ length: unassignedCount }).map((_, index) => {
              const unassignedId = `${transporter.transporterId}-${transporterIndex}-unassigned-${index}`;
              return (
                <ChangeAssignmentCard
                  key={unassignedId}
                  uniqueGroupName={unassignedId}
                  armadaImage="/img/truck.png"
                  armadaName={t(
                    "Content.labelArmadaNumber",
                    { number: (transporter.fleets?.length || 0) + index + 1 },
                    "Armada {number}"
                  )}
                  value={
                    assignments[unassignedId] || {
                      type: "SAME_TRANSPORTER",
                      transporterId: null,
                    }
                  }
                  onChange={(newValue) =>
                    handleAssignmentChange(unassignedId, newValue)
                  }
                  transporterOptions={availableTransporters}
                />
              );
            })
          ) : transporter.fleets.length === 0 ? (
            <div className="flex h-[72px] items-center justify-center">
              <p className="text-center text-base font-semibold text-neutral-600">
                {t("Content.messageBelumAdaArmada", {}, "Belum Ada Armada")}
                <br />
                {t(
                  "Content.messageTransporterPerluAssign",
                  {},
                  "Transporter Perlu Assign Armada"
                )}
              </p>
            </div>
          ) : (
            transporter.fleets?.map((fleet) => (
              <ArmadaStatusItem key={fleet.fleetId} item={fleet} />
            ))
          )}
        </div>
      </div>
    );
  });
};
