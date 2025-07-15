import IconComponent from "@/components/IconComponent/IconComponent";

export const DetailPICMobile = ({ dataDetailPIC }) => {
  const { muat, bongkar } = dataDetailPIC || { muat: [], bongkar: [] };

  return (
    <div className="space-y-2 bg-neutral-200">
      {/* Pickup Locations Section */}
      <div className="bg-white px-4 py-5">
        <h1 className="mb-4 text-sm font-bold">Detail PIC Lokasi Muat</h1>

        <div className="divide-y divide-gray-200">
          {muat.map((location, index) => (
            <div
              key={`muat-${index}`}
              className={index === 0 ? "pb-6" : "pt-6"}
            >
              <h2 className="mb-3 text-sm font-semibold">
                Lokasi Muat {location.sequence}
              </h2>

              {/* Address */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/marker-outline.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.fullAddress}
                </p>
              </div>

              {/* Detail Address */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/note16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.detailAddress}
                </p>
              </div>

              {/* PIC Name */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/profile16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.picName}
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/phone16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.picPhoneNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dropoff Locations Section */}
      <div className="bg-white px-4 py-5">
        <h1 className="mb-4 text-sm font-bold">Detail PIC Lokasi Bongkar</h1>

        <div className="divide-y divide-gray-200">
          {bongkar.map((location, index) => (
            <div
              key={`bongkar-${index}`}
              className={index === 0 ? "pb-6" : "pt-6"}
            >
              <h2 className="mb-3 text-sm font-semibold">
                Lokasi Bongkar {location.sequence}
              </h2>

              {/* Address */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/marker-outline.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.fullAddress}
                </p>
              </div>

              {/* Detail Address */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/note16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.detailAddress}
                </p>
              </div>

              {/* PIC Name */}
              <div className="mb-3 flex items-center gap-2">
                <IconComponent
                  src="/icons/profile16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.picName}
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/phone16.svg"
                  width={20}
                  height={20}
                  className="text-muat-trans-secondary-900"
                />
                <p className="text-xs font-medium text-gray-800">
                  {location.picPhoneNumber}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
