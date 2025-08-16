import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { cn } from "@/lib/utils";

const DetailContent = ({
  displayData,
  request,
  formatCurrency,
  getOrderTypeStyle,
  getTimeLabelStyle,
  handleSave,
  isSaved,
}) => {
  // Helper function to calculate load time text
  const getLoadTimeText = () => {
    if (!displayData?.loadTimeStart) return "Muat 7 Hari Lagi";

    const today = new Date();
    const muatDate = new Date(displayData.loadTimeStart);
    today.setHours(0, 0, 0, 0);
    muatDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((muatDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Muat Hari Ini";
    if (diffDays === 1) return "Muat Besok";
    if (diffDays > 1) return `Muat ${diffDays} Hari Lagi`;
    return "Muat 7 Hari Lagi";
  };

  // Helper function to format load date time
  const formatLoadDateTime = () => {
    if (!displayData?.loadTimeStart) return "03 Jan 2025 09:00 WIB";

    const startDate = new Date(displayData.loadTimeStart);

    const formatDate = (date) => {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatTime = (date) => {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return `${formatDate(startDate)} ${formatTime(startDate)} WIB`;
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-4",
        displayData?.isTaken && "grayscale"
      )}
    >
      {/* Informasi Shipper */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Shipper
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-semibold text-gray-600">
              {displayData?.shipperInfo?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {displayData?.shipperInfo?.name || "Agam Tunggal Jaya"}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary-700">
              <IconComponent src="/icons/phone.svg" className="h-3 w-3" />
              <span>Hubungi</span>
              <span className="ml-2 text-neutral-600">
                {(() => {
                  const created = new Date(
                    displayData?.shipperInfo?.createdAt || new Date()
                  );
                  const now = new Date();
                  const diffMin = Math.floor((now - created) / (1000 * 60));
                  const diffHour = Math.floor(diffMin / 60);

                  if (diffHour > 0) return `${diffHour} Jam yang lalu`;
                  return `${diffMin} Menit yang lalu`;
                })()}
              </span>
              <span className="ml-auto text-sm font-semibold text-neutral-900">
                {getLoadTimeText()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tags */}
      <div className="mb-4 flex gap-2">
        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {displayData?.orderType === "INSTANT" ? "Instan" : "Terjadwal"}
        </span>
        <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          {getLoadTimeText()}
        </span>
      </div>

      {/* Counters */}
      <div className="mb-4 flex gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-1">
          <IconComponent src="/icons/truck.svg" className="h-4 w-4" />
          <span>
            {displayData?.counters?.available || 16} Transporter Tersedia
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconComponent src="/icons/eye.svg" className="h-4 w-4" />
          <span>{displayData?.counters?.viewed || 0} Dilihat</span>
        </div>
        <div className="flex items-center gap-1">
          <IconComponent src="/icons/bookmark.svg" className="h-4 w-4" />
          <span>{displayData?.counters?.saved || 0} Disimpan</span>
        </div>
      </div>

      {/* Informasi Armada */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">
            Informasi Armada
          </h3>
          <h3 className="text-sm font-semibold text-neutral-500">
            Potensi Pendapatan
          </h3>
        </div>

        <div className="mb-3 flex justify-between">
          <p className="text-sm font-bold text-neutral-900">
            {displayData?.vehicle?.truckType || "Tractor head 6 x 4"} dan{" "}
            {displayData?.vehicle?.carrierType ||
              "Semi Trailer - Skeletal Container Jumbo 45 ft"}{" "}
            ({displayData?.vehicle?.truckCount || 3} As)
          </p>
          <p className="text-sm font-bold text-primary-700">
            {formatCurrency(displayData?.pricing?.potentialIncome || 800000)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center text-xs font-medium text-neutral-600">
            <IconComponent
              src="/icons/truck.svg"
              className="mr-2 h-4 w-4 text-neutral-600"
            />
            Kebutuhan : {displayData?.vehicle?.truckCount || 3} Unit
          </p>
          <div className="rounded-md border border-orange-600 bg-white px-2 py-1 text-xs font-semibold text-orange-600">
            {displayData?.orderCode || request?.orderCode || "MT25A001A"}
          </div>
        </div>
      </div>

      {/* Waktu Muat */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Waktu Muat
        </h3>
        <div className="flex items-center">
          <IconComponent
            src="/icons/calendar.svg"
            className="mr-2 h-4 w-4 text-orange-600"
          />
          <span className="text-sm font-semibold text-neutral-900">
            {formatLoadDateTime()}
          </span>
        </div>
      </div>

      {/* Rute Muat & Bongkar */}
      <div className="mb-4">
        <div className="mb-3 flex items-center">
          <h3 className="text-sm font-semibold text-neutral-900">
            Rute Muat & Bongkar
          </h3>
          <span className="ml-2 inline-flex items-center rounded-full border border-neutral-400 bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-900">
            Estimasi Jarak: {displayData?.locations?.estimatedDistance || 121}{" "}
            km
          </span>
        </div>

        <div className="space-y-3">
          {/* Lokasi Muat */}
          <div>
            <h4 className="mb-2 text-xs font-medium text-neutral-600">
              Lokasi Muat
            </h4>
            <div className="flex items-start gap-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xs font-semibold text-orange-600">1</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {displayData?.locations?.pickupLocations?.[0]?.fullAddress ||
                  "Kota Surabaya, Kec. Tegalsari"}
              </span>
            </div>
          </div>

          {/* Lokasi Bongkar */}
          <div>
            <h4 className="mb-2 text-xs font-medium text-neutral-600">
              Lokasi Bongkar
            </h4>
            <div className="flex items-start gap-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <span className="text-xs font-semibold text-green-600">1</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {displayData?.locations?.dropoffLocations?.[0]?.fullAddress ||
                  "Kab. Tanah Bumbu Tanah Bumbu Tanah Bumbu Tanah Bumbu, Kec. Karangbintang Bandarkarangmulyo Gunung"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Muatan (Total: {displayData?.cargo?.totalWeight || 2500} kg)
        </h3>

        <div className="space-y-2">
          {displayData?.cargo?.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center">
              <IconComponent
                src="/icons/box.svg"
                className="mr-2 h-4 w-4 text-orange-600"
              />
              <span className="text-sm font-semibold text-neutral-900">
                {item.name}{" "}
                <span className="font-medium text-neutral-600">
                  ({item.weight?.toLocaleString("id-ID") || "0"} kg)
                  {item.dimensions && (
                    <span>
                      {" "}
                      ({item.dimensions.length}x{item.dimensions.width}x
                      {item.dimensions.height} m)
                    </span>
                  )}
                </span>
              </span>
            </div>
          )) || (
            <>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Besi Baja{" "}
                  <span className="font-medium text-neutral-600">
                    (1.000 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Batu Bata{" "}
                  <span className="font-medium text-neutral-600">
                    (1.000 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Karet Mentah{" "}
                  <span className="font-medium text-neutral-600">
                    (500 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deskripsi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Deskripsi Muatan
        </h3>
        <p className="text-sm font-medium text-neutral-900">
          {displayData?.cargo?.description ||
            "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih"}
        </p>
      </div>

      {/* Foto Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Foto Muatan
        </h3>

        <LightboxProvider
          images={
            displayData?.photos || [
              "https://picsum.photos/400/300?random=1",
              "https://picsum.photos/400/300?random=2",
              "https://picsum.photos/400/300?random=3",
              "https://picsum.photos/400/300?random=4",
            ]
          }
          title="Foto Muatan"
          modalClassName="w-[592px] h-[445px]"
        >
          <div className="flex gap-2">
            {(
              displayData?.photos || [
                "https://picsum.photos/400/300?random=1",
                "https://picsum.photos/400/300?random=2",
                "https://picsum.photos/400/300?random=3",
                "https://picsum.photos/400/300?random=4",
              ]
            ).map((photo, index) => (
              <LightboxPreview
                key={index}
                image={photo}
                index={index}
                className="h-14 w-14 overflow-hidden rounded-md border border-neutral-200 object-cover"
                alt={`Foto muatan ${index + 1}`}
              />
            ))}
          </div>
        </LightboxProvider>
      </div>
    </div>
  );
};

export default DetailContent;
