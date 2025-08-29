// IconComponent might not be needed for this specific illustration
// as it appears to be a composite of elements or a single SVG/image.
// If you have a single SVG file for this specific "search not found" graphic,
// you would use IconComponent or an <img> tag pointing to it.
// For now, I'll provide the SVG code directly as it's a specific, complex illustration.
import { useTranslation } from "@/hooks/use-translation";

const VoucherSearchEmpty = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* SVG illustration for "Keyword Not Found" */}
      <img
        src="/img/search-not-found.webp"
        alt="search-not-found"
        className="h-[114px] w-[134px] object-contain"
      />

      <p className="mt-[12px] text-base font-medium text-gray-600">
        {t("VoucherSearchEmpty.keywordNotFound", {}, "Keyword Tidak Ditemukan")}
      </p>
    </div>
  );
};

export default VoucherSearchEmpty;
