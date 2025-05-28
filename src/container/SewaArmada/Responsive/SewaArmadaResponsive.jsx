import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
} from "@/components/Header/Responsive/HeaderResponsive";

const SewaArmadaResponsive = () => {
  return (
    <>
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveDefault />
      </HeaderResponsiveContainer>
      <div className="mt-[62px]">abc</div>
    </>
  );
};

export default SewaArmadaResponsive;
