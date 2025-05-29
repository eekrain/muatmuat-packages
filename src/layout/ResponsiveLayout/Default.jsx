import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
} from "@/components/Header/Responsive/HeaderResponsive";

const ResponsiveLayoutDefault = ({ onClickBack, children }) => {
  return (
    <div className="min-h-screen bg-neutral-200">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveDefault />
      </HeaderResponsiveContainer>
      {children}
    </div>
  );
};

export default ResponsiveLayoutDefault;
