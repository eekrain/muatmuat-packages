import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const Root = ({ title = "Detail Perubahan", className, children }) => {
  return (
    <Collapsible
      defaultOpen
      className={cn("rounded-lg border border-neutral-400", className)}
    >
      <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
        {({ open }) => (
          <>
            <h3 className="font-semibold">{title}</h3>

            <div className="flex items-center gap-2 font-medium text-primary-700">
              <p>{open ? "Sembunyikan" : "Lihat Detail"}</p>
              <IconComponent
                src="/icons/chevron-down.svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="rounded-lg border border-neutral-400 p-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ChangeSection = ({
  isFirst = false,
  iconSrc,
  title,
  timestamp,
  children,
  className,
}) => (
  <div className="flex flex-col">
    <div
      className={cn(
        "flex items-center gap-4 border-b border-neutral-400 pb-4",
        !isFirst && "border-t pt-4"
      )}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muat-trans-primary-400">
        <IconComponent
          src={iconSrc}
          width={16}
          height={16}
          className="text-muat-trans-secondary-900"
        />
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <h3 className="font-bold text-neutral-900">{title}</h3>
        <p className="font-medium text-neutral-600">{timestamp}</p>
      </div>
    </div>
    <div className="flex items-start gap-6 px-12 py-4">{children}</div>
  </div>
);

const ChangeDetailColumn = ({ label, children }) => (
  <div className="flex flex-1 flex-col gap-3">
    <p className="text-xs font-medium text-neutral-600">{label}</p>
    <div className="flex items-center gap-3">{children}</div>
  </div>
);

const PerubahanDriver = ({ isFirst, timestamp, oldDriver, newDriver }) => {
  return (
    <ChangeSection
      iconSrc="/icons/card-perubahan/driver.svg"
      title="Perubahan Driver"
      timestamp={timestamp}
      isFirst={isFirst}
    >
      <ChangeDetailColumn label="Driver Awal">
        <img
          src={oldDriver.picture}
          alt={`Driver ${oldDriver.name}`}
          className="h-12 w-12 rounded-lg border border-neutral-400 object-cover"
        />
        <p className="text-xs font-bold text-neutral-900">{oldDriver.name}</p>
      </ChangeDetailColumn>
      <div className="w-px self-stretch bg-neutral-400" />
      <ChangeDetailColumn label="Driver Baru">
        <img
          src={newDriver.picture}
          alt={`Driver ${newDriver.name}`}
          className="h-12 w-12 rounded-lg border border-neutral-400 object-cover"
        />
        <p className="text-xs font-bold text-neutral-900">{newDriver.name}</p>
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const PerubahanArmada = ({ isFirst, timestamp, oldArmada, newArmada }) => {
  const ArmadaInfo = ({ picture, plate, driverName }) => (
    <>
      <img
        src={picture}
        alt={`Armada ${plate}`}
        className="h-12 w-12 rounded-lg border border-neutral-400 object-cover"
      />
      <div className="flex h-12 flex-col justify-between text-xs text-neutral-900">
        <p className="font-bold">{plate}</p>
        <div className="flex items-center gap-1">
          <IconComponent
            src="/icons/profile16.svg"
            width={16}
            height={16}
            className="flex-shrink-0 text-neutral-700"
          />
          <p className="font-medium">{driverName}</p>
        </div>
      </div>
    </>
  );

  return (
    <ChangeSection
      iconSrc="/icons/card-perubahan/armada.svg"
      title="Perubahan Armada"
      timestamp={timestamp}
      isFirst={isFirst}
    >
      <ChangeDetailColumn label="Armada Awal">
        <ArmadaInfo
          picture={oldArmada.picture}
          plate={oldArmada.plate}
          driverName={oldArmada.driverName}
        />
      </ChangeDetailColumn>
      <div className="w-px self-stretch bg-neutral-400" />
      <ChangeDetailColumn label="Armada Baru">
        <ArmadaInfo
          picture={newArmada.picture}
          plate={newArmada.plate}
          driverName={newArmada.driverName}
        />
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const CardPerubahan = { Root, PerubahanDriver, PerubahanArmada };
export default CardPerubahan;
