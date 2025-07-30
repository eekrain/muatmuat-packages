import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";

// Data for share options. Assumed icon paths.
const shareOptions = [
  { name: "Salin Tautan", icon: "/img/share-icons/copy.png" },
  { name: "Whatsapp", icon: "/img/share-icons/whatsapp.png" },
  { name: "Telegram", icon: "/img/share-icons/telegram.png" },
  { name: "Facebook", icon: "/img/share-icons/facebook.png" },
  { name: "Instagram", icon: "/img/share-icons/instagram.png" },
  { name: "X", icon: "/img/share-icons/twitter.png" },
  { name: "Email", icon: "/img/share-icons/gmail.png" },
];

const ShareOption = ({ name, icon }) => (
  <button
    type="button"
    className="flex flex-col items-center gap-2"
    onClick={() => console.log(`Sharing via ${name}`)}
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 bg-white">
      <img src={icon} alt="icon" className="size-6" />
    </div>
    <p className="w-[60px] text-center text-xs font-medium text-neutral-900">
      {name}
    </p>
  </button>
);

export const BottomsheetShareVia = ({ open, onOpenChange }) => {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>Bagikan</BottomSheetHeader>
        <div className="mt-6 px-4 pb-6">
          <span className="text-sm font-medium">Bagikan melalui</span>

          <div className="mt-[14px] flex flex-wrap justify-center gap-6">
            {shareOptions.map((option) => (
              <ShareOption
                key={option.name}
                name={option.name}
                icon={option.icon}
              />
            ))}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
