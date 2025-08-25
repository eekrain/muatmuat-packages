"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import TruncatedTooltip from "@/app/transporter/(main)/dashboard/real-time/components/TruncatedTooltip";
import Button from "@/components/Button/Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import HubungiModal from "../../user/components/HubungiModal";
import PesananCard from "./PesananCard";

const ShipperGroupCard = ({ group, userRole }) => {
  const { t } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Collapsible className="flex flex-col rounded-xl border border-neutral-300 bg-[#F8F8FB]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              {t("pesananCard.labelShipper", {}, "Shipper :")}
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-700">
              <span className="text-xs font-bold text-white">
                {group.shipper.name.charAt(0)}
              </span>
            </div>
            <div className="flex-grow overflow-hidden">
              <TruncatedTooltip
                text={group.shipper.name}
                className="break-all text-xs font-semibold text-black"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 border-l-[1.8px] border-l-neutral-400"></div>
            <Button
              variant="link"
              onClick={() => setIsContactModalOpen(true)}
              iconLeft={
                <IconComponent
                  src="/icons/ic-contact-phone.svg"
                  className="h-4 w-4"
                />
              }
              className="flex items-center gap-1 p-0 text-xs font-medium text-primary-700 hover:text-primary-800"
            >
              {t("pesananCard.contact", {}, "Hubungi")}
            </Button>
            <CollapsibleTrigger asChild>
              {({ open }) => (
                <div className="!flex cursor-pointer !items-center !gap-2 !p-0 text-xs font-medium text-primary-700 hover:!text-primary-800 hover:!no-underline">
                  <span className="collapsible-trigger-text">
                    {open
                      ? t("viewBy.hide", {}, "Sembunyikan")
                      : t("viewBy.show", {}, "Tampilkan")}
                  </span>
                  <ChevronDown className="collapsible-trigger-icon h-4 w-4 transition-transform" />
                </div>
              )}
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div>
            {group.orders.map((order) => (
              <PesananCard
                key={order.id}
                order={order}
                userRole={userRole}
                viewMode="transporter-group"
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <HubungiModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default ShipperGroupCard;
