import { cn } from "@/lib/cn";

import Button from "../Button/Button";

const FooterOneButton = ({ className, buttonTitle, onClick }) => {
  return (
    <div
      className={cn(
        "shadow-muat fixed bottom-0 left-0 flex h-16 w-screen items-center rounded-t-[10px] bg-neutral-50 px-4",
        className
      )}
    >
      <Button variant="muatparts-primary" onClick={onClick} className="w-full">
        {buttonTitle}
      </Button>
    </div>
  );
};

export default FooterOneButton;
