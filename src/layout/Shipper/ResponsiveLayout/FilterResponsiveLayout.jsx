import { HeaderResponsiveContainer } from "@/components/Header/Responsive";
import HeaderResponsiveFilter from "@/components/Header/Responsive/Filter";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

const FilterResponsiveLayout = ({
  className,
  children,
  onCloseButtonClick,
}) => {
  const navigation = useResponsiveNavigation();
  return (
    <div className="min-h-screen bg-background">
      <HeaderResponsiveContainer className="flex h-14 items-center bg-neutral-50 px-4 shadow-muat">
        <HeaderResponsiveFilter
          onCloseButtonClick={
            onCloseButtonClick ? onCloseButtonClick() : () => navigation.pop()
          }
          title="Filter"
        />
      </HeaderResponsiveContainer>
      <main className={cn("h-full min-h-[calc(100vh-56px)]", className)}>
        {children}
      </main>
    </div>
  );
};

export default FilterResponsiveLayout;
