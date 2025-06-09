import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import IconComponent from "@/components/IconComponent/IconComponent";

export const FormLabelContainer = ({ children }) => {
  return (
    <div className="flex items-center gap-x-1 text-neutral-900">{children}</div>
  );
};

export const FormLabel = ({ className, title, required = true }) => {
  return (
    <>
      <span className={`text-[14px] leading-[15.4px] ${className}`}>
        {`${title}${required ? "*" : ""}`}
      </span>
      {!required ? (
        <span className="text-[10px] leading-[10px]">{"(Opsional)"}</span>
      ) : null}
    </>
  );
};

export const FormLabelInfoTooltip = ({ children, title }) => {
  return (
    <BottomSheet>
      <BottomSheetTrigger className="block">
        <IconComponent
          className="icon-stroke-neutral-700"
          src="/icons/info16.svg"
          width={16}
          height={16}
        />
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader title={title}></BottomSheetHeader>
        <div className="flex flex-col gap-y-4 px-4 py-6">{children}</div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
