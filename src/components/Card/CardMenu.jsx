import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const CardMenu = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  status,
  className,
  iconContainerClassName,
  titleClassName,
  descriptionClassName,
  actionContainerClassName,
  customAction,
}) => {
  return (
    <div
      className={cn(
        "flex h-[60px] w-full items-center justify-between gap-4 px-6",
        className
      )}
    >
      {/* Container for Icon, Title, and Description */}
      <div className="flex flex-1 items-center gap-x-4 overflow-hidden">
        <div
          className={cn(
            "flex h-12 w-12 flex-shrink-0 items-center justify-center",
            iconContainerClassName
          )}
        >
          <IconComponent src={icon} width={40} height={40} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3
            className={cn(
              "truncate text-base font-bold text-neutral-900",
              titleClassName
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "truncate text-xs text-neutral-800",
              descriptionClassName
            )}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Container for the action element (Button or Custom Action) */}
      <div className={cn("flex-shrink-0", actionContainerClassName)}>
        {customAction ||
          (status === "completed" ? (
            // "Completed" state is a special, non-interactive variant
            <Button
              className="pointer-events-none h-[32px] w-[177px] bg-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
              iconLeft="/icons/check16.svg"
              onClick={onClick}
              appearance={{
                iconClassName: "text-success-700",
              }}
            >
              Selesai
            </Button>
          ) : (
            // Default interactive button for any other case
            <Button className="h-[32px] w-[177px]" onClick={onClick}>
              {buttonText}
            </Button>
          ))}
      </div>
    </div>
  );
};

CardMenu.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  /**
   * The onClick function is optional. It defaults to an empty function to prevent errors.
   */
  onClick: PropTypes.func,
  /**
   * The status is optional. Use "completed" for the special completed state.
   * If omitted, it will render the default, clickable button.
   */
  status: PropTypes.string,
  className: PropTypes.string,
  iconContainerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  actionContainerClassName: PropTypes.string,
  customAction: PropTypes.node,
};

CardMenu.defaultProps = {
  buttonText: "Click Me",
  onClick: () => {},
  status: undefined,
  className: "",
  iconContainerClassName: "",
  titleClassName: "",
  descriptionClassName: "",
  actionContainerClassName: "",
  customAction: null,
};

export default CardMenu;
