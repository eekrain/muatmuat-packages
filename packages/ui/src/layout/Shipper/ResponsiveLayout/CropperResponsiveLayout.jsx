import IconComponent from "@/components/IconComponent/IconComponent";

const { HeaderResponsiveContainer } = require("@/components/Header/Responsive");

const CropperResponsiveLayout = ({ children, onClose, onCheck }) => {
  return (
    <div className="min-h-screen bg-[#20242F]">
      <HeaderResponsiveContainer className="flex h-[52px] items-center justify-between gap-x-3 bg-[#20242F] px-4">
        <IconComponent
          className="icon-stroke-neutral-50"
          src="/icons/silang24.svg"
          size="medium"
          onClick={onClose}
        />
        <div className="flex-1 text-base font-medium text-neutral-50">
          Cropper
        </div>
        <IconComponent
          className="icon-stroke-neutral-50"
          src="/icons/check24.svg"
          size="medium"
          onClick={onCheck}
        />
      </HeaderResponsiveContainer>

      <main className="min-h-[calc(100vh-52px)]">{children}</main>
    </div>
  );
};

export default CropperResponsiveLayout;
