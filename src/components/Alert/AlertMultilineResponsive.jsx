import Link from "next/link";

import { ChevronRightIcon } from "lucide-react";

import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import { InfoBottomsheetDriverCharge } from "@/components/Form/InfoBottomsheetDriverCharge";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} AlertItem
 * @property {string} label - The label text for the item.
 * @property {string} [info] - Additional info for the item.
 * @property {{ label: string, link: string }} [link] - Link object with label and href.
 * @property {() => void} [onClick] - onClick function to render as button.
 */

/**
 * @typedef {Object} AlertProps
 * @property {string} [className] - Additional class names.
 * @property {AlertItem[]} [items] - Array of alert items.
 */

/**
 * Alert component for displaying multiline alerts with icon and custom content.
 *
 * @param {AlertProps} props - The props for the Alert component.
 * @returns {JSX.Element}
 */
export const AlertMultilineResponsive = ({ className, items = [] }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 rounded-xl bg-warning-100 px-3 py-2",
        "text-xs font-medium leading-[1.2] text-neutral-900",
        className
      )}
    >
      {items.length > 1 ? (
        <>
          <div className="flex items-center gap-x-1">
            <IconComponent
              className="text-secondary-400"
              src="/icons/warning20.svg"
              width={20}
              height={20}
            />
            <span className="font-semibold leading-[1.1]">Pemberitahuan:</span>
          </div>

          <ul className="flex w-full flex-col gap-y-1 pl-[26px]">
            {items.map((item, index) => {
              return (
                <li key={index}>
                  <Item item={item} />
                </li>
              );
            })}
          </ul>
        </>
      ) : items.length === 1 ? (
        <div className="flex items-center gap-x-3">
          <IconComponent
            className="text-secondary-400"
            src="/icons/warning20.svg"
            width={20}
            height={20}
          />

          <Item item={items[0]} />
        </div>
      ) : null}
    </div>
  );
};

const Item = ({ item }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();

  // Special handling for warning banner items
  if (item?.isWarningBanner) {
    return (
      <div className="-mx-3 mt-2 flex items-center gap-2.5 bg-warning-100 p-3">
        <div className="flex flex-1 items-center gap-1">
          <p className="text-xs font-medium leading-[14.4px] text-neutral-900">
            {t(item.label)}
          </p>
        </div>
      </div>
    );
  }

  if (item?.onClick) {
    return (
      <button
        className="flex w-full items-center justify-between"
        onClick={() => item?.onClick()}
      >
        <span
          className="info-alert-content"
          dangerouslySetInnerHTML={{ __html: t(item.label) }}
        />
        <ChevronRightIcon className="size-4 text-neutral-700" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span
        className="info-alert-content"
        dangerouslySetInnerHTML={{ __html: t(item.label) }}
      />

      {item.link ? (
        <Link
          className="text-xs font-medium text-primary-700"
          href={item.link.link}
        >
          {t(item.link.label)}
        </Link>
      ) : item.label === "Driver kamu akan dikenakan biaya waktu tunggu." ||
        item.label === "Your driver will be charged waiting time fee." ||
        item.label === "您的司机将被收取等待时间费用。" ? (
        <InfoBottomsheetDriverCharge title="Informasi" />
      ) : item.type === "ORDER_CHANGES_CONFIRMATION" ? (
        <IconComponent
          src="/icons/info16.svg"
          onClick={() => navigation.push("/DetailSebelumPerubahan")}
        />
      ) : item.info ? (
        <InfoBottomsheet title="Informasi" render={item.info} />
      ) : null}
    </div>
  );
};
