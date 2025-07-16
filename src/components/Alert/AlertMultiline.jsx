import Link from "next/link";

import { cn } from "@/lib/utils";

import { InfoTooltip } from "../Form/InfoTooltip";
import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {Object} AlertItem
 * @property {string} label - The label text for the item.
 * @property {string} [info] - Additional info for the item.
 * @property {{ label: string, href: string }} [link] - Link object with label and href.
 * @property {{ label: string, onClick: () => void }} [button] - Button object with label and onClick.
 */

/**
 * @typedef {Object} AlertProps
 * @property {"warning"|"secondary"} [variant] - The alert variant.
 * @property {"sm"|"big"} [size] - The alert size.
 * @property {string} [className] - Additional class names.
 * @property {AlertItem[]} [items] - Array of alert items.
 * @property {import("react").ReactNode} [children] - Content of the alert.
 */

/**
 * Alert component for displaying multiline alerts with icon and custom content.
 *
 * @param {AlertProps & { children?: import("react").ReactNode }} props - The props for the Alert component.
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
            <span className="text-[12px] font-semibold leading-[14.4px] text-neutral-900">
              Pemberitahuan:
            </span>
          </div>

          <ul className="flex w-full list-disc flex-col gap-y-1 pl-10 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
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

          <div className="flex items-center gap-x-1 text-[12px] font-semibold leading-[14.4px] text-neutral-900">
            <Item item={items[0]} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Item = ({ item }) => {
  return (
    <>
      <span>{item.label}</span>

      {item.href ? (
        <Link
          className="text-xs font-medium text-primary-700"
          href={
            item.orderId.length === 1
              ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
              : listPesananUrl[key]
          }
        >
          {item.href.label}
        </Link>
      ) : item.button ? (
        <button
          className="text-xs font-medium text-primary-700"
          onClick={item.button.onClick}
        >
          {item.button.label}
        </button>
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
