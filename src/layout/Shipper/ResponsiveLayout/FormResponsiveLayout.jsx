import { HeaderResponsiveContainer } from "@/components/Header/Responsive";
import { HeaderResponsiveForm } from "@/components/Header/Responsive/Form";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} HeaderResponsiveFormTitle
 * @property {string} label
 * @property {string} className
 */
/**
 * @typedef {Object} HeaderResponsiveFormWithMenu
 * @property {() => void | undefined} onClickInfo
 * @property {() => void | undefined} onClickMenu
 * @property {() => void | undefined} onClickShare
 */
/**
 * @typedef {Object} HeaderResponsiveFormProps
 * @property {() => void | undefined} onClickBackButton
 * @property {HeaderResponsiveFormTitle | undefined} title
 * @property {HeaderResponsiveFormWithMenu | undefined} withMenu
 * @property {React.ReactNode} children
 */

/**
 * @param {HeaderResponsiveFormProps} props
 * @returns {React.ReactNode}
 */
const FormResponsiveLayout = ({
  onClickBackButton,
  title,
  withMenu,
  children,
  className,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveForm
          onClickBackButton={onClickBackButton}
          title={title}
          withMenu={withMenu}
        />
      </HeaderResponsiveContainer>

      <main className={cn("min-h-[calc(100vh-62px)]", className)}>
        {children}
      </main>
    </div>
  );
};

export default FormResponsiveLayout;
