import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { thousandSeparator } from "@/lib/utils/formatters";

const Label = ({ children, tooltip }) => (
  <div className="flex h-[16px] items-center gap-1">
    <div className="leading-[1.2] mt-[2px] h-4 text-xs font-bold text-neutral-600">
      {children}
    </div>
    <div className="flex-shrink-0">{tooltip}</div>
  </div>
);

export const InformasiMuatanTable = ({ informasiMuatan, onClickUpdate }) => {
  return (
    <div className="rounded-xl border px-4 py-5">
      <div className="h-[36px] border-b border-neutral-400">
        <div className="grid h-[16px] grid-cols-[209px_113px_1fr] gap-x-4">
          <Label>Nama Muatan</Label>
          <Label
            tooltip={
              <InfoTooltip>
                Masukkan berat keseluruhan atau total dari seluruh muatan yang
                akan dikirim.
              </InfoTooltip>
            }
          >
            Berat Muatan
          </Label>

          <div className="flex items-center justify-between">
            <Label
              tooltip={
                <InfoTooltip>
                  <ul>
                    <li>
                      <b>Panjang</b> : Ukuran terpanjang dari muatan.
                    </li>
                    <li>
                      <b>Lebar</b> : Ukuran terlebar dari muatan.
                    </li>
                    <li>
                      <b>Tinggi</b> : Ukuran tertinggi dari muatan
                    </li>
                  </ul>
                  <p>
                    Pengisian dimensi yang tepat akan membantu dalam pengelolaan
                    dan pengiriman.
                  </p>
                </InfoTooltip>
              }
            >
              Dimensi Muatan
            </Label>

            <button
              onClick={onClickUpdate}
              className="flex w-[54px] items-end justify-center gap-2 text-primary-700"
            >
              <span className="leading-[14.4px] cursor-pointer text-xs font-medium">
                Ubah
              </span>
              <div className="flex h-4 w-4 items-center justify-center">
                <IconComponent
                  src="/icons/pencil-outline.svg"
                  width={16}
                  height={16}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-y-2">
        {informasiMuatan.map((item, index) => (
          <div
            key={`${item.namaMuatan.label}${item.beratMuatan.berat}${item.dimensiMuatan.panjang}`}
            className="grid grid-cols-[209px_113px_190px] gap-x-4"
          >
            <div className="w-[209px]">
              <span className="leading-[14.4px] text-xs font-medium text-neutral-900">
                {item.namaMuatan.label}
              </span>
            </div>
            <div className="w-[113px]">
              <span className="leading-[14.4px] text-xs font-medium text-neutral-900">
                {thousandSeparator(item.beratMuatan.berat)}{" "}
                {item.beratMuatan.unit}
              </span>
            </div>
            <div className="w-[190px]">
              <span className="leading-[14.4px] text-xs font-medium text-neutral-900">
                {thousandSeparator(item.dimensiMuatan.panjang)} x{" "}
                {thousandSeparator(item.dimensiMuatan.lebar)} x{" "}
                {thousandSeparator(item.dimensiMuatan.tinggi)}{" "}
                {item.dimensiMuatan.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
