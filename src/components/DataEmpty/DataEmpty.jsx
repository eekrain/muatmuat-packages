import Image from "next/image";

import { Plus, Search } from "lucide-react";

import Button from "../Button/Button";
import style from "./style.module.scss";

const DataEmpty = ({
  title = "add your title",
  subtitle = "add your subtitle",
  buttonText = "add your button text",
  onButtonClick,
  iconPlus = false,
}) => {
  return (
    <div className={style.main}>
      <Image
        src="/img/daftarprodukicon.png"
        width={95}
        height={95}
        alt="Empty cart"
      />
      <div className="my-3 font-semibold text-neutral-600">{title}</div>
      <div className="mb-5 max-w-[322px] text-center text-xs font-medium text-neutral-600">
        {subtitle}
      </div>
      <Button
        iconLeft={iconPlus ? <Plus size={16} /> : <Search size={16} />}
        Class="!font-semibold !gap-2 !items-center !h-8"
        onClick={onButtonClick}
      >
        <span className="pt-0.5">{buttonText}</span>
      </Button>
    </div>
  );
};

export default DataEmpty;
