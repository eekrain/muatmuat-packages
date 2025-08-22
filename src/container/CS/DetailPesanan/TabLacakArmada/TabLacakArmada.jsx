import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { TabsContent } from "@/components/Tabs/Tabs";
import { cn } from "@/lib/utils";

import { Alert } from "./Alert";
import { AppliedFilterBubbles } from "./AppliedFilterBubbles";
import { Content } from "./Content";
import { Filter } from "./Filter";
import { ModalKonfirmasiPerubahanPesanan } from "./ModalKonfirmasiPerubahanPesanan";
import { LacakArmadaProvider, useLacakArmadaContext } from "./use-lacak-armada";

export const TabLacakArmada = (props) => {
  return (
    <LacakArmadaProvider {...props}>
      <Inner />
    </LacakArmadaProvider>
  );
};

export const Inner = () => {
  const {
    data,
    totalArmada,
    totalSos,
    setMainSearchQuery,
    searchInputValue,
    setSearchInputValue,
    isEdit,
    setIsEdit,
    handleSaveChanges,

    isConfirmModalOpen,
    setIsConfirmModalOpen,
    changeSummary,
    executeSaveChanges,
  } = useLacakArmadaContext();

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setMainSearchQuery(searchInputValue);
    }
  };

  return (
    <TabsContent className="flex flex-col gap-y-4" value="lacak-armada">
      <Alert />
      <div className="flex w-full max-w-[1200px] flex-col gap-6 rounded-xl bg-white p-6 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
        <div
          className={cn(
            "flex items-center justify-between gap-6",
            totalArmada > 1 && "flex-col items-start justify-normal"
          )}
        >
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-neutral-900">
              Lacak Armada
            </h1>
            {totalSos > 0 && (
              <>
                <span className="flex h-6 items-center rounded-md bg-error-400 px-2 py-1 text-xs font-semibold text-error-50">
                  SOS{totalSos > 1 ? `: ${totalSos} Unit` : ""}
                </span>
                <a href="#" className="text-xs font-medium text-primary-700">
                  Lihat SOS
                </a>
              </>
            )}
          </div>
          <div
            className={cn(
              "flex items-center justify-between",
              totalArmada > 1 && "w-full"
            )}
          >
            {totalArmada > 1 && (
              <div className="flex items-center gap-3">
                <Input
                  icon={{ left: "/icons/search.svg" }}
                  appearance={{ iconClassName: "text-neutral-700" }}
                  className="w-[278px]"
                  placeholder="Cari No. Polisi / Nama Driver / Transporter"
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Filter />
              </div>
            )}
            {data?.length > 0 && !isEdit ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-8 min-w-[160px] !rounded-full !text-sm"
                  onClick={() => setIsEdit(true)}
                >
                  Ubah Transporter
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-8 min-w-[174px] !rounded-full !text-sm"
                >
                  Lihat Posisi Armada
                </Button>
              </div>
            ) : data?.length > 0 && isEdit ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="muattrans-error-secondary"
                  className="h-8 w-[105px] !rounded-full !text-sm"
                  onClick={() => setIsEdit(false)}
                >
                  Batalkan
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-8 w-[112px] !rounded-full !text-sm"
                  onClick={handleSaveChanges}
                >
                  Simpan
                </Button>
              </div>
            ) : null}
          </div>
          <AppliedFilterBubbles />
        </div>
        <Content />
      </div>

      <ModalKonfirmasiPerubahanPesanan
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        changes={changeSummary}
        onConfirm={executeSaveChanges}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </TabsContent>
  );
};
