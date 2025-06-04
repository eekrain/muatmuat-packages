"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const DEFAULT_FUNCTION = () =>
  alert("Responsive Default Header: No function provided");

export const HeaderResponsiveDefault = ({
  mode = "default",
  onClickBackButton = DEFAULT_FUNCTION,
  onClickNotificationButton = DEFAULT_FUNCTION,
  onClickChatButton = DEFAULT_FUNCTION,
  onClickMenuButton = DEFAULT_FUNCTION,
}) => {
  const menuIcons = [
    {
      src: "/icons/manajemen-notifikasi24.svg",
      count: 2,
      onClick: onClickNotificationButton || DEFAULT_FUNCTION,
    },
    {
      src: "/icons/chat24.svg",
      count: 99,
      onClick: onClickChatButton || DEFAULT_FUNCTION,
    },
    ...(mode === "menu" && onClickMenuButton
      ? [
          {
            src: "/icons/burger-menu24.svg",
            onClick: onClickMenuButton || DEFAULT_FUNCTION,
          },
        ]
      : []),
  ];

  return (
    <div className="flex w-full items-center justify-between self-center">
      <div className="flex items-center gap-x-3">
        <IconComponent
          className="icon-stroke-muat-trans-primary-400 rounded-xl bg-muat-trans-secondary-900"
          src="/icons/chevron-left24.svg"
          width={24}
          height={24}
          onClick={onClickBackButton || DEFAULT_FUNCTION}
        />
        <ImageComponent src="/icons/muattrans.svg" width={120} height={24} />
      </div>
      <div className="flex items-center gap-x-3">
        {menuIcons.map((menuIcon, key) => (
          <button
            className="relative"
            key={key}
            onClick={() => menuIcon.onClick()}
          >
            {menuIcon.count ? (
              <div className="absolute bottom-2.5 left-2.5 rounded-[30px] bg-muat-trans-secondary-900 p-1 text-[8px] font-bold leading-[8px] text-neutral-50">
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
    </div>
  );
};
