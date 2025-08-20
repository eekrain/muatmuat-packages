import propTypes from "prop-types";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

// componen card terdiri dari beberapa fungsi yang dapat di export di childrennya, seperti header/content/footer (depends sesuai kebutuhan)
// componen main card mempunyai 2 props yang dapat di isi yakni:
// props className, valuenya berupa string jika anda ingin menambah custom class pada cardnya ("flex flex-col justify-between")
// props children, valuenya berupa tag elemen html yang akan dirender di dalam cardnya. disini anda juga dapat mengisi fungsi export dari CardContent/CardFooter/CardHeader/lainnya ("<span>Data card</span>") / (<><CardHeader></CardHeader><CardContent></CardContent><CardFooter></CardFooter></>)

const Card = ({ className, keys, children }) => {
  return (
    <div
      key={keys}
      className={cn(
        "h-full w-full rounded-md border border-neutral-600 bg-white text-neutral-900 shadow-muat",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;

// props className, valuenya berupa string jika anda ingin menambah custom class pada cardnya ("flex flex-col justify-between")
// props children, valuenya berupa tag elemen html yang akan dirender di dalam cardnya. disini anda juga dapat mengisi fungsi export dari  komponen lainnya ("<span>Data card</span>") / (<div><Badges>Tolak</Badges><Button>Detail</Button></div>)
export const CardHeader = ({ className, children }) => {
  return (
    <header
      className={cn(`border-b border-neutral-600 px-8 py-5 ${className}`)}
    >
      {children}
    </header>
  );
};

// terdapat CardContent meski main card memiliki props children yang hampir sama fungsinya seperti CardContent, yang membedakan yakni disini value padding sudah disamakan dengan figma untuk menyelaraskan isi konten pada card nantinya
// props className, valuenya berupa string jika anda ingin menambah custom class pada cardnya ("flex flex-col justify-between")
// props children, valuenya berupa tag elemen html yang akan dirender di dalam cardnya. disini anda juga dapat mengisi fungsi export dari komponen lainnya ("<span>Data card</span>") / (<div><Badges>Tolak</Badges><Button>Detail</Button></div>)
export const CardContent = ({ className, children }) => {
  return <div className={cn("px-8 py-5", className)}>{children}</div>;
};

// props className, valuenya berupa string jika anda ingin menambah custom class pada cardnya ("flex flex-col justify-between")
// props children, valuenya berupa tag elemen html yang akan dirender di dalam cardnya. disini anda juga dapat mengisi fungsi export dari komponen lainnya ("<span>Data card</span>") / (<div><Badges>Tolak</Badges><Button>Detail</Button></div>)
export const CardFooter = ({ className, children }) => {
  return (
    <footer className={`border-t border-neutral-600 px-8 py-5 ${className}`}>
      {children}
    </footer>
  );
};

// small molecules content
// ListContent akan merender content yang sering ditampilkan pada list card muatmuat (terdapat icon, title, dan value di bawahnya)
// props icon, harus diisi base url icon string ("../../icons/amandemen-tender.svg")
// props title, harus diisi value string ("Destinasi")
// props value, harus diisi value string ("Surabaya")
export const ListContent = ({ icon, title, value, className }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="sm flex gap-2">
        <IconComponent src={icon} />
        <span className="text-xs font-medium text-neutral-600">{title}</span>
      </div>
      <span className="text-1b1b text-xs font-medium">{value}</span>
    </div>
  );
};

Card.propTypes = {
  className: propTypes.string,
};
CardHeader.propTypes = {
  className: propTypes.string,
};
CardContent.propTypes = {
  className: propTypes.string,
};
CardFooter.propTypes = {
  className: propTypes.string,
};
ListContent.propTypes = {
  icon: propTypes.any.isRequired,
  title: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
};
