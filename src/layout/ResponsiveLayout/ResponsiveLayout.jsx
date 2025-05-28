import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
} from "@/components/Header/Responsive/HeaderResponsive";
import responsiveLayoutZustand from "@/store/responsiveLayout";

const ResponsiveLayout = ({ children }) => {
  const { screen } = responsiveLayoutZustand();
  console.log("scr", screen);
  if (screen === "menu") {
    return (
      <>
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveDefault />
        </HeaderResponsiveContainer>
        <div className="mt-[62px]">menu</div>
      </>
    );
  }
  return <div className="min-h-screen bg-neutral-200">{children}</div>;
};

export default ResponsiveLayout;
