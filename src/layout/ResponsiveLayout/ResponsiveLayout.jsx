import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";
import { HeaderResponsiveForm } from "@/components/Header/Responsive/Form";
import { useResponsiveRouterStore } from "@/store/responsiveRouter";

import { ResponsiveMenu } from "./ResponsiveMenu";

const ResponsiveLayout = ({ children }) => {
  // Get the current screen from the top of the stack
  const screenStack = useResponsiveRouterStore((state) => state.screenStack);
  const currentScreen = screenStack[screenStack.length - 1];

  return (
    <div className="min-h-screen bg-neutral-200">
      {(currentScreen?.layout === "default" ||
        currentScreen?.layout === "menu") && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveDefault />
        </HeaderResponsiveContainer>
      )}
      {currentScreen?.layout === "searchBar" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveSearchBar />
        </HeaderResponsiveContainer>
      )}
      {currentScreen?.layout === "form" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveForm />
        </HeaderResponsiveContainer>
      )}

      {currentScreen?.layout === "menu" ? (
        <ResponsiveMenu />
      ) : (
        <main className="min-h-screen pt-[62px]">{children}</main>
      )}
    </div>
  );
};

export default ResponsiveLayout;
