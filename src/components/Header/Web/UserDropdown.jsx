"use client";

import * as HoverCard from "@radix-ui/react-hover-card";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useUser } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth/authStore";

const DropdownMenuItem = ({ imgUrl, title, variant, onClick }) => {
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-[18px] py-2 font-medium text-neutral-900 hover:bg-neutral-100 hover:text-muat-trans-primary-600",
        variant == "danger" && "text-error-400 hover:text-error-700"
      )}
      onClick={onClick}
    >
      <IconComponent src={imgUrl} width={16} height={16} alt="profile" />
      <span className="pt-1 text-xs">{title}</span>
    </button>
  );
};

export const UserDropdown = () => {
  const { t } = useTranslation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { dataUser } = useUser();
  return (
    <>
      {!accessToken ? (
        <a href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=muattrans`}>
          <Button variant="muatparts-primary">
            <span className="text-[14px] font-semibold leading-[1] text-neutral-50">
              Masuk
            </span>
          </Button>
        </a>
      ) : (
        <HoverCard.Root openDelay={0} closeDelay={200}>
          <HoverCard.Trigger asChild>
            <button className="flex items-center gap-x-2">
              <div className="size-[20px] overflow-hidden rounded-[90px] border border-neutral-500">
                <ImageComponent src={dataUser?.Avatar} width={20} height={20} />
              </div>
              <span className="max-w-[104px] truncate text-[12px] font-medium leading-[12px]">
                {dataUser?.name}
              </span>
            </button>
          </HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              className="shadow-muat z-20 flex w-[160px] flex-col justify-between rounded-md border border-neutral-300 bg-neutral-50"
              side="bottom"
              align="end"
            >
              <div className="flex flex-col py-2">
                <DropdownMenuItem
                  imgUrl="/icons/profil-user.svg"
                  title={t("HomeSellerIndexProfile")}
                />
                <DropdownMenuItem
                  imgUrl="/icons/profile-user-setting.svg"
                  title="Pengaturan Akun"
                />
                <DropdownMenuItem
                  imgUrl="/icons/profil-logout.svg"
                  title={t("buttonLogOut")}
                  variant="danger"
                />
              </div>
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      )}
    </>
  );
};
