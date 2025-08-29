import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";

// Change Details Response Component
function ChangeDetailsResponseComponent({
  changeDetails = {},
  formatDateTimeRange = () => "N/A",
  formatDistance = () => "N/A",
  formatCurrency = () => "N/A",
  t = (key, params, fallback) => fallback || key,
}) {
  // Parse locations data to match RespondChangeModal structure
  const originalPickups =
    changeDetails.originalData?.locations?.filter(
      (l) => l.locationType === "PICKUP"
    ) || [];
  const originalDropoffs =
    changeDetails.originalData?.locations?.filter(
      (l) => l.locationType === "DROPOFF"
    ) || [];
  const newPickups =
    changeDetails.requestedChanges?.locations?.filter(
      (l) => l.locationType === "PICKUP"
    ) || [];
  const newDropoffs =
    changeDetails.requestedChanges?.locations?.filter(
      (l) => l.locationType === "DROPOFF"
    ) || [];

  // Get translated text for route changed
  const routeChangedText = t(
    "RespondChangeModal.routeChanged",
    {},
    "Rute Diubah"
  );

  // LocationComparisonRow component matching RespondChangeModal
  const LocationComparisonRow = ({ oldLoc, newLoc, index, isLast, type }) => {
    const isChanged = oldLoc?.fullAddress !== newLoc?.fullAddress;

    // Warna untuk dot dan teks di dalamnya
    const dotClass =
      type === "pickup"
        ? "bg-[#FFC217] text-[#461B02]"
        : "bg-[#461B02] text-white";
    const dotText = type === "pickup" ? "text-[#461B02]" : "text-white";

    return (
      // Wadah utama baris dengan layout grid 2 kolom dan posisi relative
      <div
        className={`relative grid h-[24px] grid-cols-2 gap-0 ${
          isChanged ? "-mx-2 rounded bg-success-50 px-2 py-1" : ""
        }`}
      >
        {/* Latar belakang sorotan (highlight) yang melebar ke kiri */}
        {isChanged && (
          <div className="absolute -left-10 top-0 z-[1] h-full w-36 rounded-l bg-success-50"></div>
        )}

        {/* === KOLOM KIRI (RUTE AWAL) === */}
        <div className="relative flex items-center gap-3">
          {/* Garis vertikal putus-putus (timeline connector) */}
          {!isLast && (
            <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[2px] border-dashed border-neutral-400" />
          )}
          {/* Dot bernomor */}
          <div
            className={`relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${dotClass}`}
          >
            <span className={`text-[10px] font-bold leading-[12px] ${dotText}`}>
              {oldLoc?.sequence || index + 1}
            </span>
          </div>
          {/* Teks Alamat */}
          <p className="relative z-[4] line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
            {oldLoc?.fullAddress || oldLoc?.name || "-"}
          </p>
        </div>

        {/* === KOLOM KANAN (RUTE BARU) === */}
        <div className="relative flex items-center gap-3">
          {/* Garis vertikal putus-putus (identik dengan yang kiri) */}
          {!isLast && (
            <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[2px] border-dashed border-neutral-400" />
          )}
          {/* Dot bernomor */}
          <div
            className={`relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${dotClass}`}
          >
            <span className={`text-[10px] font-bold leading-[12px] ${dotText}`}>
              {newLoc?.sequence || index + 1}
            </span>
          </div>
          {/* Teks Alamat + Badge */}
          <div className="relative z-[4] flex flex-1 items-center gap-2">
            <p className="line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
              {newLoc?.fullAddress || newLoc?.name || "-"}
            </p>
            {isChanged && (
              <span className="flex h-[14px] w-[54px] flex-shrink-0 items-center justify-center rounded bg-black text-[8px] font-semibold leading-[130%] text-white">
                {routeChangedText}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="m-4 rounded-lg border border-neutral-400 px-4">
      <div className="flex items-center gap-2 pt-4">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-muat-trans-primary-400">
          <IconComponent
            src={"/icons/monitoring/daftar-pesanan-aktif/change-route.svg"}
            width={16}
            height={16}
          />
        </span>
        <div className="space-y-2">
          <p className="text-xs font-bold">Detail Perubahan Pesanan</p>
          <p className="text-xs font-medium text-neutral-600">
            Rincian perubahan yang diminta
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-400 p-4">
        {changeDetails && Object.keys(changeDetails).length > 0 ? (
          <>
            <div className="max-h-[300px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
              {/* Time Change Section */}
              {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                changeDetails.changeType === "TIME_ONLY") && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                      <IconComponent src="/icons/monitoring/daftar-pesanan-aktif/change-time.svg" />
                    </div>
                    <h3 className="text-xs font-bold leading-[120%] text-black">
                      {t(
                        "RespondChangeModal.loadTimeChange",
                        {},
                        "Perubahan Waktu Muat"
                      )}
                    </h3>
                  </div>

                  <div className="relative grid grid-cols-2 gap-12">
                    <div className="absolute bottom-0 left-1/2 top-0 z-[3] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />
                    <div className="relative z-10 ml-12 flex flex-col gap-2">
                      <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                        {t(
                          "RespondChangeModal.originalLoadTime",
                          {},
                          "Waktu Muat Awal"
                        )}
                      </p>
                      <p className="text-xs font-medium leading-[120%] text-black">
                        {formatDateTimeRange(
                          changeDetails.originalData?.loadTimeStart,
                          changeDetails.originalData?.loadTimeEnd
                        )}
                      </p>
                    </div>
                    <div className="relative z-10 flex flex-col gap-2">
                      <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                        {t(
                          "RespondChangeModal.newLoadTime",
                          {},
                          "Waktu Muat Baru"
                        )}
                      </p>
                      <p className="text-xs font-medium leading-[120%] text-black">
                        {formatDateTimeRange(
                          changeDetails.requestedChanges?.loadTimeStart,
                          changeDetails.requestedChanges?.loadTimeEnd
                        )}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Divider if both sections exist */}
              {changeDetails.changeType === "LOCATION_AND_TIME" && (
                <div className="my-4 border-b border-neutral-400"></div>
              )}

              {/* Location Change Section */}
              {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                changeDetails.changeType === "LOCATION_ONLY") && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                      <IconComponent
                        src="/icons/monitoring/daftar-pesanan-aktif/change-route.svg"
                        className="h-5 w-5 text-primary-700"
                      />
                    </div>
                    <h3 className="text-xs font-bold leading-[120%] text-black">
                      {t(
                        "RespondChangeModal.routeChange",
                        {},
                        "Perubahan Rute Muat & Bongkar"
                      )}
                    </h3>
                  </div>

                  <div className="relative ml-12">
                    {/* Garis pemisah tengah yang membentang di belakang baris */}
                    <div className="absolute bottom-0 left-[calc(50%-24px)] top-0 z-[2] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />

                    {/* Header Rute Awal vs Rute Baru */}
                    <div className="grid grid-cols-2 gap-0">
                      <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                        {t("RespondChangeModal.originalRoute", {}, "Rute Awal")}{" "}
                        :{" "}
                        <span className="font-medium text-neutral-900">
                          {t("RespondChangeModal.estimated", {}, "Estimasi")}{" "}
                          {formatDistance(
                            changeDetails.originalData?.estimatedDistance || 0
                          )}
                        </span>
                      </p>
                      <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                        {t("RespondChangeModal.newRoute", {}, "Rute Baru")} :{" "}
                        <span className="font-medium text-neutral-900">
                          {t("RespondChangeModal.estimated", {}, "Estimasi")}{" "}
                          {formatDistance(
                            changeDetails.requestedChanges?.estimatedDistance ||
                              0
                          )}
                        </span>
                      </p>
                    </div>

                    {/* Container untuk daftar lokasi yang dibandingkan per baris */}
                    <div className="mt-4 space-y-1">
                      {/* Judul Lokasi Muat */}
                      <div className="grid grid-cols-2">
                        <p className="ml-7 text-xs font-medium text-[#7B7B7B]">
                          {t(
                            "RespondChangeModal.pickupLocation",
                            {},
                            "Lokasi Muat"
                          )}
                        </p>
                        <p className="ml-7 text-xs font-medium text-[#7B7B7B]">
                          {t(
                            "RespondChangeModal.pickupLocation",
                            {},
                            "Lokasi Muat"
                          )}
                        </p>
                      </div>
                      {/* Render baris perbandingan untuk setiap lokasi muat */}
                      {newPickups.map((loc, idx) => (
                        <LocationComparisonRow
                          key={`p-${idx}`}
                          oldLoc={originalPickups[idx]}
                          newLoc={loc}
                          index={idx}
                          isLast={
                            idx === newPickups.length - 1 &&
                            newDropoffs.length === 0
                          }
                          type="pickup"
                          routeChangedText={routeChangedText}
                        />
                      ))}

                      {/* Judul Lokasi Bongkar (jika ada) */}
                      {newDropoffs.length > 0 && (
                        <div className="grid grid-cols-2 pt-2">
                          <p className="ml-7 text-xs font-medium text-[#7B7B7B]">
                            {t(
                              "RespondChangeModal.dropoffLocation",
                              {},
                              "Lokasi Bongkar"
                            )}
                          </p>
                          <p className="ml-7 text-xs font-medium text-[#7B7B7B]">
                            {t(
                              "RespondChangeModal.dropoffLocation",
                              {},
                              "Lokasi Bongkar"
                            )}
                          </p>
                        </div>
                      )}
                      {/* Render baris perbandingan untuk setiap lokasi bongkar */}
                      {newDropoffs.map((loc, idx) => (
                        <LocationComparisonRow
                          key={`d-${idx}`}
                          oldLoc={originalDropoffs[idx]}
                          newLoc={loc}
                          index={idx}
                          isLast={idx === newDropoffs.length - 1}
                          type="dropoff"
                          routeChangedText={routeChangedText}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Income Adjustment Section */}
            {changeDetails.incomeAdjustment?.hasAdjustment && (
              <div className="mt-4 flex items-center gap-12 rounded-lg border border-neutral-400 px-16 py-4">
                <div className="flex flex-1 items-center gap-2">
                  <h3 className="text-sm font-bold leading-[120%] text-black">
                    {t(
                      "RespondChangeModal.incomeAdjustment",
                      {},
                      "Penyesuaian Pendapatan"
                    )}
                  </h3>
                  <InfoTooltip side="top" className={"z-[52]"}>
                    <p>
                      {t(
                        "RespondChangeModal.incomeAdjustmentTooltip",
                        {},
                        "Penyesuaian pendapatan hanya estimasi. Pendapatan yang kamu terima menyesuaikan respon perubahan yang kamu kirimkan."
                      )}
                    </p>
                  </InfoTooltip>
                </div>
                <div className="flex flex-1 items-center justify-end gap-4">
                  <span className="text-sm font-medium leading-[120%] text-black line-through">
                    {formatCurrency(
                      changeDetails.incomeAdjustment.originalAmount
                    )}
                  </span>
                  <IconComponent
                    src="/icons/monitoring/daftar-pesanan-aktif/change-arrow.svg"
                    className="h-4 w-4 text-[#555555]"
                  />
                  <span className="text-sm font-bold leading-[120%] text-black">
                    {formatCurrency(
                      changeDetails.incomeAdjustment.adjustedAmount
                    )}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-center text-gray-500">
              {t(
                "RespondChangeModal.cannotLoadDetails",
                {},
                "Tidak dapat memuat detail perubahan"
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangeDetailsResponseComponent;
