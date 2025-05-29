import Card from "@/components/Card/Card";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const WelcomeCard = () => {
  return (
    <Card className="flex !h-[140px] max-w-[1200px] flex-col items-center justify-center gap-6 rounded-xl border-none bg-neutral-50">
      <div className="flex h-[76px] w-[670px] flex-row items-center justify-center gap-3">
        <ImageComponent
          src="/img/welcome-illustration.png"
          width={100}
          height={76}
          alt="Muatrans truck illustration"
        />
        <div className="flex h-[45px] w-[558px] flex-col items-start gap-3">
          <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Selamat Datang di Muatrans!
          </h2>
          <p className="w-full text-center text-[12px] font-medium leading-[14.4px] text-neutral-600">
            Pesen truk kapan saja dan di mana saja dengan mudah. Serta lacak
            kiriman secara real-time untuk memastikan keamanan pengiriman dan
            dapatkan rekomendasi truk sesuai muatan agar lebih efisien!
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
