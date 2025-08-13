import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";

const companyName =
  "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Tbk";

const ModalTransportTersedia = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="relative w-[600px] rounded-xl bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-center">
          <h2 className="text-[16px] font-bold text-neutral-900">
            Transporter Tersedia
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          >
            <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
          </button>
        </div>
        {/* Search Bar */}
        <Search
          placeholder="Cari No. Pesanan / Armada / Lokasi Muat & Bongkar / Muatan"
          // onSearch={handleSearch}
          autoSearch={true}
          debounceTime={300}
          // defaultValue={searchValue}
          // disabled={data?.userStatus?.isSuspended}
          inputClassName="w-full mb-4"
        />
        {/* List Transporter */}
        <div className="max-h-[337px] space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between rounded-xl border border-neutral-400 bg-neutral-100 p-4">
            {/* Left: Logo & Info */}
            <div className="flex items-center gap-4">
              <img className="h-14 w-14 rounded-full border border-neutral-300 object-cover" />
              <div>
                <div className="text-xs font-bold text-neutral-900">
                  {companyName.length > 46
                    ? `${companyName.slice(0, 46)}...`
                    : companyName}
                </div>
                <div className="mt-2 text-xs font-medium text-neutral-900">
                  4 Armada Yang Cocok
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                    <IconComponent
                      src="/icons/truk16.svg"
                      className="h-[14px] w-[14px]"
                    />
                    Armada Aktif
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                    <IconComponent
                      src="/icons/truk16.svg"
                      className="h-[14px] w-[14px]"
                    />
                    Armada Nonaktif
                  </span>
                </div>
                {/* <div className="mt-1 text-xs">
                  <span className="font-semibold text-error-600"></span>
                  <span className="ml-1 cursor-pointer text-primary-700 underline">
                    Detail
                  </span>
                </div> */}
              </div>
            </div>
            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[107px] rounded-full text-sm font-semibold"
              >
                Hubungi
              </Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-700 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-neutral-400 bg-neutral-100 p-4">
            {/* Left: Logo & Info */}
            <div className="flex items-center gap-4">
              <img className="h-14 w-14 rounded-full border border-neutral-300 object-cover" />
              <div>
                <div className="text-xs font-bold text-neutral-900">
                  {companyName.length > 46
                    ? `${companyName.slice(0, 46)}...`
                    : companyName}
                </div>
                <div className="mt-2 text-xs font-medium text-neutral-900">
                  4 Armada Yang Cocok
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                    <IconComponent
                      src="/icons/truk16.svg"
                      className="h-[14px] w-[14px]"
                    />
                    Armada Aktif
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-900">
                    <IconComponent
                      src="/icons/truk16.svg"
                      className="h-[14px] w-[14px]"
                    />
                    Armada Nonaktif
                  </span>
                </div>
                {/* <div className="mt-1 text-xs">
                  <span className="font-semibold text-error-600"></span>
                  <span className="ml-1 cursor-pointer text-primary-700 underline">
                    Detail
                  </span>
                </div> */}
              </div>
            </div>
            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[107px] rounded-full text-sm font-semibold"
              >
                Hubungi
              </Button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-700 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTransportTersedia;
