import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

/**
 * A reusable row component for displaying information with an icon.
 * @param {{ iconSrc: string, children: React.ReactNode }} props
 */
const InfoRow = ({ iconSrc, children }) => (
  <div className="flex items-center gap-2 self-stretch">
    <IconComponent
      src={iconSrc}
      width={16}
      height={16}
      className="flex-shrink-0 text-[#461B02]"
    />
    <div className="flex-1 text-xs font-medium leading-tight text-black">
      {children}
    </div>
  </div>
);

/**
 * Card component to display PIC (Person In Charge) and location details for pickup.
 * @param {{
 * data: {
 * address: string,
 * addressDetail: string,
 * picName: string,
 * picPhone: string,
 * expedition: string
 * }
 * }} props
 */
export const DetailPicLokasiCard = ({ data }) => {
  const { t } = useTranslation();
  const { address, addressDetail, picName, picPhone, expedition } = data;

  return (
    <div className="box-border flex w-full max-w-[564px] flex-col items-center rounded-xl border border-neutral-400 bg-white px-4 py-5">
      <div className="flex items-start gap-2 self-stretch">
        <IconComponent
          src="/icons/location.svg"
          width={16}
          height={16}
          className="mt-px flex-shrink-0 text-[#461B02]"
          alt="Location pin icon"
        />
        <div className="flex flex-1 flex-col items-start justify-center gap-3 text-neutral-900">
          <div>
            <p className="self-stretch text-xs font-bold">{address}</p>
            <p className="mt-1 self-stretch text-xs font-medium">
              {addressDetail}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 self-stretch">
            <InfoRow iconSrc="/icons/profile16.svg">
              {t(
                "DetailPicLokasiCard.labelNamaPenerima",
                {},
                "Nama Penerima :"
              )}
              <div className="text-xs font-semibold">{picName}</div>
            </InfoRow>
            <InfoRow iconSrc="/icons/contact.svg">
              {t(
                "DetailPicLokasiCard.labelNomorHandphonePenerima",
                {},
                "Nomor Handphone Penerima :"
              )}
              <div className="text-xs font-semibold">{picPhone}</div>
            </InfoRow>
            <InfoRow iconSrc="/icons/transporter16.svg">
              {t(
                "DetailPicLokasiCard.labelEkspedisiPengiriman",
                {},
                "Ekspedisi Pengiriman :"
              )}
              <div className="text-xs font-semibold">{expedition}</div>
            </InfoRow>
          </div>
        </div>
      </div>
    </div>
  );
};
