"use client";

import { useEffect, useState } from "react";

import * as HoverCard from "@radix-ui/react-hover-card";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useOverlayAction } from "@/store/Shared/overlayStore";

const MenuItem = ({ imgUrl, title, variant, onClick }) => {
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-[18px] py-2 font-medium text-neutral-900 hover:bg-neutral-100",
        variant == "danger" && "text-error-400"
      )}
      onClick={onClick}
    >
      <IconComponent src={imgUrl} width={16} height={16} alt="profile" />
      <span className="pt-1 text-xs">{title}</span>
    </button>
  );
};

export const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { isLoggedIn, dataUser, logout } = useAuth();
  const { setIsOverlayActive } = useOverlayAction();

  useEffect(() => {
    setIsOverlayActive(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <>
      {!isLoggedIn ? (
        <a href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=muattrans`}>
          <Button variant="muatparts-primary">
            <span className="leading-[1] text-sm font-semibold text-neutral-50">
              Masuk
            </span>
          </Button>
        </a>
      ) : (
        <HoverCard.Root
          open={open}
          onOpenChange={setOpen}
          openDelay={0}
          closeDelay={200}
        >
          <HoverCard.Trigger asChild>
            <button className="flex cursor-pointer items-center gap-x-2">
              <img
                src={dataUser?.Avatar}
                alt={`${dataUser?.name} profile`}
                className="block size-[20px] overflow-hidden rounded-full border border-neutral-500"
              />
              <div className="max-w-[104px] text-xs font-medium capsize">
                <span className="block truncate">{dataUser?.name}</span>
              </div>
            </button>
          </HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              className="shadow-muat z-20 flex w-[174px] flex-col justify-between rounded-md border border-neutral-300 bg-neutral-50"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <div className="flex flex-col py-2">
                <MenuItem
                  imgUrl="/icons/profil-user.svg"
                  title={t("HomeSellerIndexProfile")}
                />
                <MenuItem
                  imgUrl="/icons/profile-user-setting.svg"
                  title="Pengaturan Akun"
                />
                <MenuItem
                  imgUrl="/icons/profil-logout.svg"
                  title={t("buttonLogOut")}
                  variant="danger"
                  onClick={logout}
                />
              </div>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      )}
    </>
  );
};
