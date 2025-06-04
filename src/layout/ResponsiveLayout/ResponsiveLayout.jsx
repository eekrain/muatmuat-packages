import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";
import { useResponsiveRouter } from "@/store/responsiveRouter";

import { ResponsiveMenu } from "./ResponsiveMenu";

const ResponsiveLayout = ({ children }) => {
  // Get the current screen from the top of the stack
  const screenStack = useResponsiveRouter((state) => state.screenStack);
  const currentScreen = screenStack[screenStack.length - 1];

  return (
    <div className="min-h-screen bg-neutral-200">
      {(currentScreen?.screen === "default" ||
        currentScreen?.screen === "menu") && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveDefault />
        </HeaderResponsiveContainer>
      )}
      {currentScreen?.screen === "searchBar" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveSearchBar />
        </HeaderResponsiveContainer>
      )}

      {currentScreen?.screen === "menu" ? <ResponsiveMenu /> : children}
    </div>
  );
};

export default ResponsiveLayout;
