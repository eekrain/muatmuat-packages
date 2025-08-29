import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { TimelineChangeRow } from "../Timeline";
import "./CardRiwayatPerubahan.scss";

// Context for tracking change items
const Context = createContext({
  itemCount: 0,
  registerItem: () => {},
  unregisterItem: () => {},
});

// Hook to use the change items context
const useItems = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useItems must be used within CardRiwayatPerubahan.Root");
  }
  return context;
};

// Hook to register an item component using timestamp as unique identifier
const useRegisterItem = (timestamp) => {
  const { registerItem, unregisterItem } = useItems();

  useEffect(() => {
    registerItem(timestamp);

    return () => {
      unregisterItem(timestamp);
    };
  }, [registerItem, unregisterItem, timestamp]);
};

const Root = ({ title = "Riwayat Aktivitas", children }) => {
  const { t } = useTranslation();
  const [registeredItems, setRegisteredItems] = useState(new Set());

  const registerItem = useCallback((itemId) => {
    setRegisteredItems((prev) => new Set([...prev, itemId]));
  }, []);

  const unregisterItem = useCallback((itemId) => {
    setRegisteredItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }, []);

  const translatedTitle =
    title === "Riwayat Aktivitas"
      ? t("CardRiwayatPerubahan.titleRiwayatAktivitas", {}, "Riwayat Aktivitas")
      : title;

  return (
    <Context.Provider
      value={{
        itemCount: registeredItems.size,
        registerItem,
        unregisterItem,
      }}
    >
      <div className="w-full rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-neutral-900">
          {translatedTitle}
        </h2>

        <div className="relative mt-6 rounded-xl border border-neutral-400 p-4">
          <div className="absolute bottom-4 left-6 top-4 w-px border-l-2 border-dashed border-neutral-400" />
          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </Context.Provider>
  );
};

const Item = ({ isActive, timestamp, actor, action, children }) => {
  useRegisterItem(timestamp);

  return (
    <div className="relative z-10 flex items-start gap-3">
      <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-neutral-300">
        {isActive && (
          <div className="h-4 w-4 rounded-full bg-muat-trans-primary-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col items-start pt-px">
        <div className="content-perubahan-item flex w-full items-start gap-3">
          <p className="w-[124px] flex-shrink-0 text-xs font-medium text-neutral-600">
            {timestamp}
          </p>
          <p className="flex-1 text-xs font-medium text-neutral-900">
            <span className="font-semibold">{actor}</span>{" "}
            <span dangerouslySetInnerHTML={{ __html: action }}></span>
          </p>
        </div>

        <div className="relative w-full pl-[136px]">{children}</div>
      </div>
    </div>
  );
};

const Separator = () => (
  <div className="h-auto w-[0.5px] self-stretch bg-neutral-400" />
);

const ContentPerubahan = ({
  title = "Detail Perubahan",
  className,
  children,
  appearance = {
    contentClassName: "",
  },
  footer,
}) => {
  const { t } = useTranslation();

  const translatedTitle =
    title === "Detail Perubahan"
      ? t("CardRiwayatPerubahan.titleDetailPerubahan", {}, "Detail Perubahan")
      : title;

  return (
    <Collapsible
      defaultOpen
      className={cn("rounded-lg border border-neutral-400", className)}
    >
      <CollapsibleTrigger className="rounded-t-md bg-neutral-100 px-6 hover:no-underline">
        {({ open }) => (
          <>
            <h3 className="font-semibold">{translatedTitle}</h3>

            <div className="flex items-center gap-2 text-xs font-medium text-primary-700">
              <p>
                {open
                  ? t(
                      "CardRiwayatPerubahan.actionSembunyikan",
                      {},
                      "Sembunyikan"
                    )
                  : t(
                      "CardRiwayatPerubahan.actionTampilkanRincian",
                      {},
                      "Tampilkan Rincian"
                    )}
              </p>
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
        <div
          className={cn(
            "rounded-lg border border-neutral-400 px-4 py-3",
            appearance.contentClassName
          )}
        >
          {children}
        </div>
        {footer}
      </CollapsibleContent>
    </Collapsible>
  );
};

const ChangeSection = ({
  isFirst = false,
  icon,
  title,
  timestamp,
  children,
  className,
  appearance = {
    contentClassName: "",
  },
}) => {
  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-4 border-b border-neutral-400 pb-3",
          !isFirst && "border-t pt-3",
          className
        )}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muat-trans-primary-400">
          <IconComponent
            src={icon}
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
      <div
        className={cn(
          "flex items-start gap-6 px-12 py-3",
          appearance.contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

const ChangeDetailColumn = ({ label, children }) => (
  <div className="flex flex-1 flex-col gap-3">
    <p className="text-xs font-medium text-neutral-600">{label}</p>
    {children}
  </div>
);

const ItemPerubahanDriver = ({ isFirst, timestamp, before, after }) => {
  const { t } = useTranslation();

  return (
    <ChangeSection
      icon="/icons/card-perubahan/driver.svg"
      title={t(
        "CardRiwayatPerubahan.titlePerubahanDriver",
        {},
        "Perubahan Driver"
      )}
      timestamp={timestamp}
      isFirst={isFirst}
    >
      <ChangeDetailColumn
        label={t("CardRiwayatPerubahan.labelDriverAwal", {}, "Driver Awal")}
      >
        <div className="flex items-center gap-3">
          <img
            src={before.picture}
            alt={t(
              "CardRiwayatPerubahan.altDriverImage",
              { name: before.name },
              "Driver {name}"
            )}
            className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
          />
          <p className="text-xs font-bold text-neutral-900">{before.name}</p>
        </div>
      </ChangeDetailColumn>
      <Separator />
      <ChangeDetailColumn
        label={t("CardRiwayatPerubahan.labelDriverBaru", {}, "Driver Baru")}
      >
        <div className="flex items-center gap-3">
          <img
            src={after.picture}
            alt={t(
              "CardRiwayatPerubahan.altDriverImage",
              { name: after.name },
              "Driver {name}"
            )}
            className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
          />
          <p className="text-xs font-bold text-neutral-900">{after.name}</p>
        </div>
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const ItemPerubahanArmada = ({ isFirst, timestamp, before, after }) => {
  const { t } = useTranslation();

  const ArmadaInfo = ({ picture, plate, name }) => (
    <div className="flex items-center gap-3">
      <img
        src={picture}
        alt={t(
          "CardRiwayatPerubahan.altArmadaImage",
          { plate },
          "Armada {plate}"
        )}
        className="h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-400 object-cover"
      />
      <div className="flex h-12 flex-col justify-between text-xs text-neutral-900">
        <p className="font-bold">{plate}</p>
        <div className="flex h-7 items-center gap-1">
          <IconComponent
            src="/icons/profile16.svg"
            width={16}
            height={16}
            className="flex-shrink-0 text-neutral-700"
          />
          <p className="font-medium">{name}</p>
        </div>
      </div>
    </div>
  );

  return (
    <ChangeSection
      icon="/icons/card-perubahan/armada.svg"
      title={t(
        "CardRiwayatPerubahan.titlePerubahanArmada",
        {},
        "Perubahan Armada"
      )}
      timestamp={timestamp}
      isFirst={isFirst}
    >
      <ChangeDetailColumn
        label={t("CardRiwayatPerubahan.labelArmadaAwal", {}, "Armada Awal")}
      >
        <ArmadaInfo
          picture={before.picture}
          plate={before.plate}
          name={before.name}
        />
      </ChangeDetailColumn>
      <Separator />
      <ChangeDetailColumn
        label={t("CardRiwayatPerubahan.labelArmadaBaru", {}, "Armada Baru")}
      >
        <ArmadaInfo
          picture={after.picture}
          plate={after.plate}
          name={after.name}
        />
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const TransporterInfo = ({ picture, name, units, phone }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-2 self-stretch">
      <img
        src={picture}
        alt={t(
          "CardRiwayatPerubahan.altTransporterLogo",
          { name },
          "{name} logo"
        )}
        className="h-10 w-10 rounded-full border border-neutral-500 object-contain"
      />
      <div className="flex flex-col items-start justify-center gap-3">
        <p className="text-xs font-bold text-neutral-900">{name}</p>
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-1">
            <IconComponent
              src="/icons/transporter16.svg"
              alt="unit icon"
              className="h-4 w-4 text-muat-trans-secondary-900"
            />
            <p className="text-xs font-medium text-neutral-900">
              {t("CardRiwayatPerubahan.unitCount", { units }, "{units} Unit")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <IconComponent
              src="/icons/contact.svg"
              alt="phone icon"
              className="h-4 w-4 text-muat-trans-secondary-900"
            />
            <p className="text-xs font-medium text-neutral-900">
              {phone || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemPerubahanTransporter = ({
  title = "Perubahan Transporter",
  isFirst,
  isLast,
  timestamp,
  before,
  after,
  blastCount = 0,
  className,
  appearance = {
    sectionContentClassName: "",
  },
}) => {
  const { t } = useTranslation();

  const translatedTitle =
    title === "Perubahan Transporter"
      ? t(
          "CardRiwayatPerubahan.titlePerubahanTransporter",
          {},
          "Perubahan Transporter"
        )
      : title;

  return (
    <ChangeSection
      icon="/icons/transporter16.svg"
      title={translatedTitle}
      timestamp={timestamp}
      isFirst={isFirst}
      className={className}
      appearance={{
        contentClassName: cn(
          appearance.sectionContentClassName,
          isFirst || isLast ? "pb-0 pt-3" : ""
        ),
      }}
    >
      <ChangeDetailColumn
        label={t(
          "CardRiwayatPerubahan.labelTransporterAwal",
          {},
          "Transporter Awal"
        )}
      >
        {before.map((transporter) => (
          <TransporterInfo key={transporter.name} {...transporter} />
        ))}
      </ChangeDetailColumn>
      <Separator />
      <ChangeDetailColumn
        label={t(
          "CardRiwayatPerubahan.labelTransporterBaru",
          {},
          "Transporter Baru"
        )}
      >
        {after.map((transporter) => (
          <TransporterInfo key={transporter.name} {...transporter} />
        ))}

        {blastCount > 0 && (
          <div className="flex flex-col items-start gap-3 self-stretch rounded-xl border border-neutral-400 p-3">
            <h3 className="text-xs font-bold text-neutral-900">
              {t("CardRiwayatPerubahan.titleBlastOrder", {}, "Blast Order")}
            </h3>
            <p className="text-xs font-medium text-neutral-900">
              {t(
                "CardRiwayatPerubahan.descriptionBlastOrder",
                { blastCount },
                "{blastCount} armada akan dimasukkan ke daftar permintaan jasa angkut agar dapat dilihat oleh seluruh transporter"
              )}
            </p>
          </div>
        )}
      </ChangeDetailColumn>
    </ChangeSection>
  );
};

const ItemPesananDibatalkan = ({
  picture = "http://googleusercontent.com/file_content/0",
  name = "PT. Airmas International (AIRI)",
  unit = 1,
  reason = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta vitae risus quis egestas. Proin placerat euismod maximus. Proin fermentum scelerisque nisl, et accumsan elit.",
}) => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Top section with company details */}
      <div className="flex items-center gap-4 pb-3">
        <img
          src={picture}
          alt={t(
            "CardRiwayatPerubahan.altCompanyLogo",
            { name },
            "{name} logo"
          )}
          className="box-border size-10 rounded-[32px] border border-neutral-500 object-cover"
        />
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-xs font-bold leading-tight text-neutral-900">
            {name}
          </p>
          <div className="flex items-center gap-1">
            <IconComponent
              src="/icons/transporter16.svg"
              alt="Unit icon"
              className="size-4 text-muat-trans-secondary-900"
            />
            <p className="text-xs font-medium leading-tight text-neutral-900">
              {t("CardRiwayatPerubahan.unitCount", { unit }, "{unit} Unit")}
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-neutral-400" />

      {/* Bottom section with rejection reason */}
      <div className="flex flex-col gap-2 px-12 pt-3">
        <p className="text-xs font-medium leading-tight text-neutral-600">
          {t(
            "CardRiwayatPerubahan.labelAlasanPenolakan",
            {},
            "Alasan Penolakan"
          )}
        </p>
        <p className="self-stretch text-xs font-medium leading-tight text-neutral-900">
          {reason}
        </p>
      </div>
    </div>
  );
};

const ItemPenolakanGM = ({ title, reason }) => {
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <h3 className="text-xs font-medium leading-tight text-neutral-600">
        {title}
      </h3>
      <p className="self-stretch text-xs font-medium leading-tight text-neutral-900">
        {reason}
      </p>
    </div>
  );
};

const ItemPerubahanRute = ({
  before,
  after,
  isFirst,
  className,
  appearance,
}) => {
  const { t } = useTranslation();

  const combinedLocations = useMemo(
    () => [
      ...before.pickups.map((before, i) => ({
        before,
        after: after.pickups[i],
        type: "pickup",
      })),
      ...before.dropoffs.map((before, i) => ({
        before,
        after: after.dropoffs[i],
        type: "dropoff",
      })),
    ],
    [before, after]
  );

  return (
    <ChangeSection
      icon="/icons/transporter16.svg"
      title={t(
        "CardRiwayatPerubahan.titlePerubahanRuteMuatBongkar",
        {},
        "Perubahan Rute Muat & Bongkar"
      )}
      isFirst={isFirst}
      className={className}
      appearance={{
        contentClassName: cn(
          "px-0",
          appearance?.sectionContentClassName,

          isFirst ? "pb-0 pt-3" : ""
        ),
      }}
    >
      <div className="relative w-full">
        <div className="absolute left-1/2 top-0 z-20 h-full w-[0.75px] -translate-x-1/2 bg-neutral-400" />
        <div className="grid grid-cols-2 px-12 text-xs font-medium text-neutral-600">
          <div className="pb-2 pl-4">
            {t("CardRiwayatPerubahan.labelRuteAwal", {}, "Rute Awal")} :{" "}
            <span className="text-neutral-900">
              {t(
                "CardRiwayatPerubahan.estimasiDistance",
                { distance: before.distance },
                "Estimasi {distance}"
              )}
            </span>
          </div>
          <div className="pb-2 pl-4">
            {t("CardRiwayatPerubahan.labelRuteBaru", {}, "Rute Baru")} :{" "}
            <span className="text-neutral-900">
              {t(
                "CardRiwayatPerubahan.estimasiDistance",
                { distance: after.distance },
                "Estimasi {distance}"
              )}
            </span>
          </div>
        </div>
        <div className="relative flex flex-col">
          {combinedLocations.map((loc, index) => (
            <TimelineChangeRow
              key={`${loc.type}-${loc.before.sequence}`}
              before={loc.before}
              after={loc.after}
              type={loc.type}
              showPickupHeader={index === 0}
              showDropoffHeader={
                loc.type === "dropoff" &&
                combinedLocations[index - 1]?.type === "pickup"
              }
              isLast={index === combinedLocations.length - 1}
              // This is the new logic to check if the next item is of a different type
              isLastInGroup={loc.type !== combinedLocations[index + 1]?.type}
            />
          ))}
        </div>
      </div>
    </ChangeSection>
  );
};

const ItemPerubahanWaktu = ({
  before,
  after,
  isFirst,
  isLast,
  className,
  appearance,
}) => {
  const { t } = useTranslation();

  before = {
    label: t("CardRiwayatPerubahan.labelWaktuMuatAwal", {}, "Waktu Muat Awal"),
    ...before,
  };
  after = {
    label: t("CardRiwayatPerubahan.labelWaktuMuatBaru", {}, "Waktu Muat Baru"),
    ...after,
  };

  const TimeInfo = ({ title, timestamp }) => (
    <div className="flex flex-1 flex-col gap-3">
      <p className="text-xs font-medium leading-tight text-neutral-600">
        {title}
      </p>
      <p className="text-xs font-medium leading-tight text-neutral-900">
        {timestamp}
      </p>
    </div>
  );

  return (
    <ChangeSection
      icon="/icons/transporter16.svg"
      title={t(
        "CardRiwayatPerubahan.titlePerubahanRuteMuatBongkar",
        {},
        "Perubahan Rute Muat & Bongkar"
      )}
      isFirst={isFirst}
      className={className}
      appearance={{
        contentClassName: cn(
          "px-0",
          appearance?.sectionContentClassName,

          isLast ? "pb-0 pt-3" : ""
        ),
      }}
    >
      <div className="grid w-[892px] grid-cols-[1fr_1px_1fr] gap-6 px-12">
        <TimeInfo title={before.label} timestamp={before.timestamp} />
        <div className="w-px self-stretch bg-neutral-400" />
        <TimeInfo title={after.label} timestamp={after.timestamp} />
      </div>
    </ChangeSection>
  );
};

const CardRiwayatPerubahan = {
  Root,
  Item,
  ContentPerubahan,
  ItemPerubahanDriver,
  ItemPerubahanArmada,
  ItemPerubahanTransporter,
  ItemPesananDibatalkan,
  ItemPenolakanGM,
  ItemPerubahanRute,
  ItemPerubahanWaktu,
};

export default CardRiwayatPerubahan;
