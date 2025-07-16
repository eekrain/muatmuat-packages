import Link from "next/link";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import { InfoTooltip } from "../Form/InfoTooltip";
import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {Object} AlertItem
 * @property {string} label - The label text for the item.
 * @property {string} [info] - Additional info for the item.
 * @property {{ label: string, link: string }} [link] - Link object with label and href.
 * @property {import("react").ReactNode} [button] - Button object with label and onClick.
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
export const AlertMultiline = ({ className, items = [] }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "mt-6 flex flex-col gap-y-3 rounded-xl bg-secondary-100 px-6 py-4",
        "text-xs font-medium leading-[1.2] text-neutral-900",
        className
      )}
    >
      {items.length > 1 ? (
        <>
          <div className="flex items-center gap-x-2">
            <IconComponent
              className="icon-stroke-warning-900"
              src="/icons/warning24.svg"
              size="medium"
            />
            <span className="font-semibold">Pemberitahuan:</span>
          </div>

          <ul className="flex w-full list-disc flex-col gap-y-1 pl-10">
            {items.map((item, index) => {
              return (
                <li key={index}>
                  <div className="flex items-center gap-x-1">
                    <Item item={item} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : items.length === 1 ? (
        <div className="flex items-center gap-x-3">
          <IconComponent
            className="icon-stroke-warning-900"
            src="/icons/warning24.svg"
            size="medium"
          />

          <div className="flex items-center gap-x-1">
            <Item item={items[0]} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Item = ({ item }) => {
  const { t } = useTranslation();
  return (
    <>
      <span
        className="info-alert-content"
        dangerouslySetInnerHTML={{ __html: t(item.label) }}
      />

      {item.href ? (
        <Link
          className="text-xs font-medium text-primary-700"
          href={
            item.orderId.length === 1
              ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
              : listPesananUrl[key]
          }
        >
          {t(item.href.label)}
        </Link>
      ) : item.button ? (
        item.button
      ) : item.info ? (
        <InfoTooltip
          side="right"
          render={item.info}
          className="w-[336px]"
          appearance={{ iconColor: "text-neutral-700" }}
        />
      ) : null}
    </>
  );
};
