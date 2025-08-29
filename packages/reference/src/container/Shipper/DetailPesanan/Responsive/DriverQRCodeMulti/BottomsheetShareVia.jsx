import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";

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

const ShareOption = ({ name, icon, shareUrl, qrCodeImage }) => {
  const handleShare = () => {
    const urlToShare = qrCodeImage;
    const message = encodeURIComponent(
      `Silakan scan QR Code ini untuk melanjutkan proses muat: ${urlToShare}`
    );

    switch (name) {
      case "Whatsapp":
        window.open(`https://wa.me/?text=${message}`, "_blank");
        break;
      case "Telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent("Silakan scan QR Code ini untuk melanjutkan proses muat")}`,
          "_blank"
        );
        break;
      case "Facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`,
          "_blank"
        );
        break;
      case "Instagram":
        // Instagram tidak mendukung sharing via URL, copy ke clipboard
        navigator.clipboard.writeText(
          `Silakan scan QR Code ini untuk melanjutkan proses muat: ${urlToShare}`
        );
        alert(
          "Link telah disalin ke clipboard. Anda dapat membagikannya di Instagram."
        );
        break;
      case "X":
        window.open(
          `https://twitter.com/intent/tweet?text=${message}`,
          "_blank"
        );
        break;
      case "Email":
        window.open(
          `mailto:?subject=${encodeURIComponent("QR Code Lokasi Muat")}&body=${message}`,
          "_blank"
        );
        break;
      case "Salin Tautan":
        navigator.clipboard.writeText(urlToShare);
        break;
      default:
        console.log(`Sharing via ${name}`);
    }
  };

  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2"
      onClick={handleShare}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 bg-white">
        <img src={icon} alt="icon" className="size-6" />
      </div>
      <p className="w-[60px] text-center text-xs font-medium text-neutral-900">
        {name}
      </p>
    </button>
  );
};

export const BottomsheetShareVia = ({
  open,
  onOpenChange,
  shareUrl = "",
  qrCodeImage = "",
}) => {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Bagikan</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="px-4 pb-6">
          <span className="text-sm font-medium">Bagikan melalui</span>

          <div className="mt-[14px] flex flex-wrap justify-center gap-6">
            {shareOptions.map((option) => (
              <ShareOption
                key={option.name}
                name={option.name}
                icon={option.icon}
                shareUrl={shareUrl}
                qrCodeImage={qrCodeImage}
              />
            ))}
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
