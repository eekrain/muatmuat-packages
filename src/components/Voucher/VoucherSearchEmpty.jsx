// IconComponent might not be needed for this specific illustration
// as it appears to be a composite of elements or a single SVG/image.
// If you have a single SVG file for this specific "search not found" graphic,
// you would use IconComponent or an <img> tag pointing to it.
// For now, I'll provide the SVG code directly as it's a specific, complex illustration.
import Image from "next/image";

const VoucherSearchEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* SVG illustration for "Keyword Not Found" */}
      <Image
        src="/icons/search-not-found.svg"
        alt="Voucher"
        width={142}
        height={122}
        className="object-cover"
      />

      <p className="mt-[12px] text-[16px] font-medium text-gray-600">
        Keyword Tidak Ditemukan
      </p>
    </div>
  );
};

export default VoucherSearchEmpty;
