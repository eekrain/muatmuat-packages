import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// import { Collapsible, CollapsibleTrigger } from "@/components/Collapsible";
// import IconComponent from "@/components/IconComponent/IconComponent";

const Root = ({ title = "Riwayat Aktivitas", children }) => {
  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md">
      <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>

      <div className="relative mt-6 rounded-xl border border-neutral-400 p-4">
        <div className="absolute bottom-4 left-6 top-4 w-px border-l-2 border-dashed border-neutral-400" />
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
};

const Item = ({ isActive, timestamp, actor, action, children }) => {
  return (
    <div className="relative z-10 flex items-start gap-3">
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-neutral-300">
        {isActive && (
          <div className="h-4 w-4 rounded-full bg-muat-trans-primary-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start pt-px">
        <div className="flex w-full items-center gap-3">
          <p className="w-[124px] flex-shrink-0 text-xs font-medium text-neutral-600">
            {timestamp}
          </p>
          <p className="flex-1 text-xs font-medium text-neutral-900">
            <span className="font-semibold">{actor}</span> {action}
          </p>
        </div>

        <div className="relative w-full pl-[136px]">{children}</div>
      </div>
    </div>
  );
};

const ContentPerubahan = ({
  title = "Detail Perubahan",
  className,
  children,
}) => {
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

const ItemPerubahanDriver = ({ isFirst, timestamp, before, after }) => {
  return (
    <ChangeSection
      iconSrc="/icons/card-perubahan/driver.svg"
      title="Perubahan Driver"
      timestamp={timestamp}
      isFirst={isFirst}
    >
      <ChangeDetailColumn label="Driver Awal">
        <img
          src={before.picture}
          alt={`Driver ${before.name}`}
          className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
        />
        <p className="text-xs font-bold text-neutral-900">{before.name}</p>
      </ChangeDetailColumn>
      <div className="w-px self-stretch bg-neutral-400" />
      <ChangeDetailColumn label="Driver Baru">
        <img
          src={after.picture}
          alt={`Driver ${after.name}`}
          className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
        />
        <p className="text-xs font-bold text-neutral-900">{after.name}</p>
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const ItemPerubahanArmada = ({ isFirst, timestamp, before, after }) => {
  const ArmadaInfo = ({ picture, plate, name }) => (
    <>
      <img
        src={picture}
        alt={`Armada ${plate}`}
        className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
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
          <p className="font-medium">{name}</p>
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
          picture={before.picture}
          plate={before.plate}
          name={before.name}
        />
      </ChangeDetailColumn>
      <div className="w-px self-stretch bg-neutral-400" />
      <ChangeDetailColumn label="Armada Baru">
        <ArmadaInfo
          picture={after.picture}
          plate={after.plate}
          name={after.name}
        />
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const CardRiwayatPerubahan = {
  Root,
  Item,
  ContentPerubahan,
  ItemPerubahanDriver,
  ItemPerubahanArmada,
};

export default CardRiwayatPerubahan;
