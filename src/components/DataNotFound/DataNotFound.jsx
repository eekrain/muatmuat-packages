import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const DataNotFound = ({
  title,
  children,
  className,
  image,
  type = "search",
  textClass,
  width = 142,
  height = 122,
}) => {
  const { t } = useTranslation();
  const renderTitle = title || t("labelDataNotFound") || "Data Tidak Ditemukan";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[10px]",
        className
      )}
    >
      <ImageComponent
        src={
          image
            ? image
            : type === "search"
              ? "/icons/data-not-found.svg"
              : type === "data"
                ? "/img/data-empty.png"
                : ""
        }
        alt="Data Not Found"
        width={width}
        height={height}
      />
      <div>
        {children ? (
          children
        ) : (
          <p
            className={cn(
              "w-[257px] text-center text-base font-[600] text-neutral-600",
              textClass
            )}
          >
            {renderTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default DataNotFound;
