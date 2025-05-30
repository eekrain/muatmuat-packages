import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";
import { useResponsiveLayout } from "@/store/responsiveLayout";

const ResponsiveLayout = ({ children }) => {
  const screen = useResponsiveLayout((state) => state.screen);
  console.log("🚀 ~ ResponsiveLayout ~ screen:", screen);
  return (
    <div className="min-h-screen bg-neutral-200">
      {(screen === "default" || screen === "menu") && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveDefault />
        </HeaderResponsiveContainer>
      )}
      {screen === "searchBar" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveSearchBar />
        </HeaderResponsiveContainer>
      )}
      {children}
    </div>
  );
};

export default ResponsiveLayout;
