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

const CardRiwayat = {
  Root,
  Item,
};

export default CardRiwayat;
