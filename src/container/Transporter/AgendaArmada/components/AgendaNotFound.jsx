import DataNotFound from "@/components/DataNotFound/DataNotFound";

export const AgendaNotFound = () => {
  return (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center rounded-xl bg-white p-6 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      <DataNotFound type="data">
        <p className="text-center text-base font-semibold text-neutral-600">
          Belum ada Agenda Armada & Driver
        </p>
        <p className="mt-3 text-xs font-medium text-neutral-600">
          tunggu pesanan masuk untuk membuat agenda
        </p>
      </DataNotFound>
    </div>
  );
};
