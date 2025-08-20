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

import ContactModal from "./ContactModal";
import ShipperGroupCard from "./ShipperGroupCard";

const TransporterGroupCard = ({ group, userRole }) => {
  const { t } = useTranslation();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Collapsible className="relative flex flex-col overflow-hidden border-b border-neutral-400 first:border-t first:border-t-neutral-400 last:!rounded-b-xl">
        <div className="flex items-center justify-between bg-[#F8F8FB] px-4 py-3 last:rounded-b-xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 text-xs font-medium text-neutral-600">
              {t("pesananCard.labelTransporter", {}, "Transporter :")}
            </span>
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muat-parts-non-500">
              <span className="text-xs font-bold text-white">
                {group.transporter.name.charAt(0)}
              </span>
            </div>
            <div className="flex-grow overflow-hidden">
              <TruncatedTooltip
                text={group.transporter.name}
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
          <div className="space-y-3 px-4 py-3">
            {group.shippers.map((shipperGroup) => (
              <ShipperGroupCard
                key={shipperGroup.shipper.id}
                group={shipperGroup}
                userRole={userRole}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactId={group.transporter.id}
        useMockData={true}
      />
    </>
  );
};

export default TransporterGroupCard;
