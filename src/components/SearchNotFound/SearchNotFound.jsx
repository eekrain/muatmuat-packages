import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { cn } from "@/lib/utils";

const SearchNotFound = ({ label = "Keyword Tidak Ditemukan", className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[10px]",
        className
      )}
    >
      <ImageComponent
        src="/icons/search-not-found.svg"
        alt="Search Not Found"
        width={142}
        height={122}
      />
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-base font-[600] text-neutral-600">
          {label}
        </p>
      </div>
    </div>
  );
};

export default SearchNotFound;
