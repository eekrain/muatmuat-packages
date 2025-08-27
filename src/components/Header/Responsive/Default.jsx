"use client";

import { useRouter } from "next/navigation";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useAuth } from "@/hooks/use-auth";

import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { HeaderButtonBack } from ".";

/**
 * @typedef {Object} DefaultResponsiveLayoutProps
 * @property {"default" | "menu"} mode
 * @property {() => void | undefined} onClickBackButton
 * @property {() => void | undefined} onClickNotificationButton
 * @property {() => void | undefined} onClickChatButton
 * @property {() => void | undefined} onClickMenuButton
 */

/**
 * @param {DefaultResponsiveLayoutProps} props
 * @returns {React.ReactNode}
 */
export const HeaderResponsiveDefault = ({
  mode = "default",
  notifCounter = {
    notification: 0,
    chat: 0,
  },
  onClickBackButton,
  onClickNotificationButton,
  onClickChatButton,
  onClickMenuButton,
}) => {
  const router = useRouter();
  const navigation = useResponsiveNavigation();
  const { dataUser } = useAuth();

  const handleNotificationButton = () => {
    if (onClickNotificationButton) onClickNotificationButton();
    else
      alert(
        "HeaderResponsiveDefault ~ onClickNotificationButton ~ not implemented"
      );
  };

  const handleChatButton = () => {
    if (onClickChatButton) onClickChatButton();
    else alert("HeaderResponsiveDefault ~ onClickChatButton ~ not implemented");
  };

  const handleMenuButton = () => {
    if (onClickMenuButton) onClickMenuButton();
    else navigation.push("/menu");
  };

  const handleBackButton = () => {
    if (onClickBackButton) onClickBackButton();
    else if (mode === "default") router.back();
    else navigation.pop();
  };

  const menuIcons = [
    {
      src: "/icons/manajemen-notifikasi24.svg",
      count: notifCounter.notification,
      onClick: handleNotificationButton,
    },
    {
      src: "/icons/chat24.svg",
      count: notifCounter.chat,
      onClick: handleChatButton,
    },
    ...(mode === "default"
      ? [
          {
            src: "/icons/burger-menu24.svg",
            onClick: handleMenuButton,
          },
        ]
      : []),
  ];

  return (
    <div className="flex w-full items-center justify-between self-center">
      <div
        className={
          dataUser?.isLoggedIn
            ? "flex items-center gap-x-3"
            : "flex w-full justify-between"
        }
      >
        <HeaderButtonBack onClick={handleBackButton} variant="muattrans" />
        <ImageComponent src="/icons/muattrans.svg" width={120} height={24} />
        {dataUser?.isLoggedIn ? null : <div className="size-[24px]" />}
      </div>
      {dataUser?.isLoggedIn ? (
        <div className="flex items-center gap-x-3">
          {menuIcons.map((menuIcon, key) => (
            <button
              className="relative"
              key={key}
              onClick={() => menuIcon.onClick()}
            >
              {menuIcon.count ? (
                <div className="absolute bottom-2.5 left-2.5 rounded-[30px] bg-muat-trans-secondary-900 p-1 text-xxs font-bold leading-[8px] text-neutral-50">
                  <span>{menuIcon.count}</span>
                </div>
              ) : null}
              <IconComponent
                className="icon-fill-muat-trans-secondary-900"
                src={menuIcon.src}
                width={24}
                height={24}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
