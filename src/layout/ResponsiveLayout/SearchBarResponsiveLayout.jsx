import {
  HeaderResponsiveContainer,
  HeaderResponsiveSearchBar,
} from "@/components/Header/Responsive";

const SearchBarResponsiveLayout = ({
  children,
  onClickBackButton,
  placeholder,
}) => {
  return (
    <div className="min-h-screen bg-neutral-200">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveSearchBar
          onClickBackButton={onClickBackButton}
          placeholder={placeholder}
        />
      </HeaderResponsiveContainer>
      <main className="min-h-screen pt-[62px]">{children}</main>
    </div>
  );
};

export default SearchBarResponsiveLayout;
