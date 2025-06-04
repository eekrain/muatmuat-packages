import { HeaderResponsiveContainer } from "@/components/Header/Responsive";
import { HeaderResponsiveForm } from "@/components/Header/Responsive/Form";

const FormResponsiveLayout = ({
  onClickBackButton,
  title,
  withMenu,
  children,
}) => {
  return (
    <div className="min-h-screen bg-neutral-200">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveForm
          onClickBackButton={onClickBackButton}
          title={title}
          withMenu={withMenu}
        />
      </HeaderResponsiveContainer>

      <main className="min-h-screen pt-[62px]">{children}</main>
    </div>
  );
};

export default FormResponsiveLayout;
