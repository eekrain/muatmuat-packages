import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
} from "@/components/Header/Responsive";

/**
 * @typedef {Object} DefaultResponsiveLayoutProps
 * @property {React.ReactNode} children
 * @property {"default" | "menu"} mode
 * @property {() => void | undefined} onClickNotificationButton
 * @property {() => void | undefined} onClickChatButton
 * @property {() => void | undefined} onClickMenuButton
 */

/**
 * @param {DefaultResponsiveLayoutProps} props
 * @returns {React.ReactNode}
 */
const DefaultResponsiveLayout = ({
  children,
  mode = "default",
  onClickBackButton,
  onClickNotificationButton,
  onClickChatButton,
  onClickMenuButton,
}) => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveDefault
          mode={mode}
          onClickBackButton={onClickBackButton}
          onClickNotificationButton={onClickNotificationButton}
          onClickChatButton={onClickChatButton}
          onClickMenuButton={onClickMenuButton}
        />
      </HeaderResponsiveContainer>
      <main className="min-h-screen">{children}</main>
    </div>
  );
};

export default DefaultResponsiveLayout;
