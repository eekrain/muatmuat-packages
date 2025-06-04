import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";
import { HeaderResponsiveForm } from "@/components/Header/Responsive/Form";
import { useResponsiveRouteParams } from "@/lib/responsive-navigation";

import { ResponsiveMenu } from "./ResponsiveMenu";

const ResponsiveLayout = ({ children }) => {
  // Get the current screen from the top of the stack
  const params = useResponsiveRouteParams();

  return (
    <div className="min-h-screen bg-neutral-200">
      {(params?.layout === "default" || params?.layout === "menu") && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveDefault />
        </HeaderResponsiveContainer>
      )}
      {params?.layout === "searchBar" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveSearchBar />
        </HeaderResponsiveContainer>
      )}
      {params?.layout === "form" && (
        <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
          <HeaderResponsiveForm />
        </HeaderResponsiveContainer>
      )}

      {params?.layout === "menu" ? (
        <ResponsiveMenu />
      ) : (
        <main className="min-h-screen pt-[62px]">{children}</main>
      )}
    </div>
  );
};

export default ResponsiveLayout;
