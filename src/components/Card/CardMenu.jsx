import PropTypes from "prop-types";

import Button from "../Button/Button";
import IconComponent from "../IconComponent/IconComponent";

const CardMenu = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-x-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
          <IconComponent src={icon} width={40} height={40} />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-700">{description}</p>
        </div>
      </div>
      {/* Action Button */}
      <Button className="h-[32px] w-[177px]" onClick={onClick}>
        {buttonText}
      </Button>
    </div>
  );
};

CardMenu.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CardMenu;
