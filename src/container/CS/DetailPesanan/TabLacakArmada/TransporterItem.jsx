import { useMemo } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

import { ArmadaStatusItem } from "./ArmadaStatusItem";

export const TransporterItem = ({ data }) => {
  // Calculate total armada by summing all fleets from all transporters
  const asssignedFleets = data?.fleets?.length || 0;

  const fleets = useMemo(() => {
    return Array.from({ length: data?.fleetsOrdered || 0 }).map((_, index) => {
      const temp = data?.fleets?.[index];
      if (temp) return temp;
      return null;
    });
  }, [data?.fleets, data?.fleetsOrdered]);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-400">
      {/* Transporter Header */}
      <div className="flex items-center gap-4 bg-neutral-100 p-4">
        <div className="flex flex-1 items-center gap-4">
          <img
            src="https://picsum.photos/200"
            alt="Logo PT. Siba Surya"
            className="size-10 rounded-full border border-neutral-500"
          />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-neutral-900">
              {data?.companyName}
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-900">
              <div className="flex items-center gap-1">
                <IconComponent
                  src="/icons/transporter16.svg"
                  className="size-4 text-muat-trans-secondary-900"
                />
                <span>{data?.fleetsOrdered} Unit</span>
              </div>
              <div className="size-0.5 rounded-full bg-neutral-600" />
              <div className="flex items-center gap-1">
                <IconComponent
                  src="/icons/marker-outline.svg"
                  className="size-4 text-muat-trans-secondary-900"
                />
                <span>{data?.companyAddress}</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="muattrans-primary"
          className="h-8 min-w-[105px] !rounded-full !text-sm"
        >
          Hubungi
        </Button>
      </div>

      {/* List of Armada Items */}
      <div className="divide-y divide-neutral-400">
        {!data || data?.fleets?.length === 0 ? (
          <div className="flex h-[72px] items-center justify-center">
            <p className="text-center text-base font-semibold text-neutral-600">
              Belum Ada Armada
              <br />
              Transporter Perlu Assign Armada
            </p>
          </div>
        ) : (
          data?.fleets?.map((fleet) => (
            <ArmadaStatusItem key={fleet.id} item={fleet} />
          ))
        )}
      </div>
    </div>
  );
};
