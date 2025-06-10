import {
  HeaderResponsiveContainer,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} SearchBarResponsiveLayoutProps
 * @property {() => void | undefined} onClickBackButton
 * @property {string | undefined} placeholder
 * @property {React.ReactNode} children
 */

/**
 * @param {SearchBarResponsiveLayoutProps} props
 * @returns {React.ReactNode}
 */
const SearchBarResponsiveLayout = ({
  children,
  onClickBackButton,
  placeholder,
  className,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveSearchBar
          onClickBackButton={onClickBackButton}
          placeholder={placeholder}
        />
      </HeaderResponsiveContainer>
      <main
        className={cn(
          "grid h-full min-h-[calc(100vh-62px)] grid-cols-1 items-start justify-start",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default SearchBarResponsiveLayout;
