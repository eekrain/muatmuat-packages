import { cn } from "@/lib/cn";

import Button from "../Button/Button";

const FooterOneButton = ({ className, buttonTitle, onClick }) => {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-screen rounded-t-[10px] bg-neutral-50 px-4 py-3",
        className
      )}
    >
      <Button
        color="primary"
        onClick={onClick}
        type="muatparts"
        className="w-full"
      >
        {buttonTitle}
      </Button>
    </div>
  );
};

export default FooterOneButton;
