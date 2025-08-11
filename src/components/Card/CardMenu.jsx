import PropTypes from "prop-types";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const CardMenu = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  status = "completed",
}) => {
  return (
    <div className="flex h-[60px] w-[1184px] flex-wrap items-center justify-between gap-4 px-6">
      <div className="flex items-center gap-x-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
          <IconComponent src={icon} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-neutral-900">{title}</h3>
          <p className="text-xs text-neutral-800">{description}</p>
        </div>
      </div>

      {status === "completed" ? (
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
        <Button className="h-[32px] w-[177px]" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

CardMenu.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  status: PropTypes.oneOf(["incompleted", "completed"]),
};

CardMenu.defaultProps = {
  status: "incompleted",
  buttonText: "Click Me",
  onClick: () => {},
};

export default CardMenu;
