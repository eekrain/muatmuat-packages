import {
  HeaderResponsiveContainer,
  HeaderResponsiveDefault,
} from "@/components/Header/Responsive";

const DefaultResponsiveLayout = ({
  children,
  mode = "default",
  onClickBackButton,
  onClickNotificationButton,
  onClickChatButton,
  onClickMenuButton,
}) => {
  return (
    <div className="min-h-screen bg-neutral-200">
      <HeaderResponsiveContainer className="flex h-[62px] items-center border-b-2 border-b-muat-trans-secondary-900 px-4">
        <HeaderResponsiveDefault
          mode={mode}
          onClickBackButton={onClickBackButton}
          onClickNotificationButton={onClickNotificationButton}
          onClickChatButton={onClickChatButton}
          onClickMenuButton={onClickMenuButton}
        />
      </HeaderResponsiveContainer>
      <main className="min-h-screen pt-[62px]">{children}</main>
    </div>
  );
};

export default DefaultResponsiveLayout;
