import IconComponent from "@/components/IconComponent/IconComponent";
import { InfoTooltip } from "@/components/Tooltip/Tooltip";
import { thousandSeparator } from "@/lib/formatters";

const FormLabel = ({ title, required = false }) => (
  <span
    className={"block text-[12px] font-bold leading-[14.4px] text-neutral-600"}
  >
    {`${title}${required ? "*" : " (Opsional)"}`}
  </span>
);

export const InformasiMuatanTable = ({ informasiMuatan, onClickUpdate }) => {
  return (
    <div className="rounded-xl border px-4 py-5">
      <table className="w-full table-auto">
        <thead className="border-b">
          <tr className="h-9 align-top font-bold">
            <th className="w-[209px] text-left">
              <FormLabel title={"Nama Muatan"} required />
            </th>
            <th className="w-[113px]">
              <div className="flex items-end gap-x-2">
                <FormLabel title={"Berat Muatan"} required />
                <InfoTooltip content="Masukkan berat keseluruhan atau total dari seluruh muatan yang akan dikirim." />
              </div>
            </th>
            <th className="w-[190px]">
              <div className="flex items-end gap-x-2">
                <FormLabel title={"Dimensi Muatan"} />
                <InfoTooltip
                  content={
                    <div className="text-left text-sm font-normal leading-[1.2]">
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
                      <p className="mt-1">
                        Pengisian dimensi yang tepat akan membantu dalam
                        pengelolaan dan pengiriman.
                      </p>
                    </div>
                  }
                >
                  <IconComponent
                    src="/icons/info16.svg"
                    width={16}
                    height={16}
                  />
                </InfoTooltip>
              </div>
            </th>
            <th className="pb-5 text-right text-primary-700">
              <button
                onClick={onClickUpdate}
                className="flex w-[54px] items-end justify-center gap-2"
              >
                <span className="cursor-pointer text-[12px] font-medium leading-[14.4px]">
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
            </th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {informasiMuatan.map((item, index) => (
            <tr key={index}>
              <td className="py-2 pr-4">
                <div className="w-[209px]">
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {item.namaMuatan.label}
                  </span>
                </div>
              </td>
              <td className="py-2 pr-4">
                <div className="w-[113px]">
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {thousandSeparator(item.beratMuatan.berat)}{" "}
                    {item.beratMuatan.unit}
                  </span>
                </div>
              </td>
              <td className="py-2 pr-4">
                <div className="w-[190px]">
                  <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                    {thousandSeparator(item.dimensiMuatan.panjang)} x{" "}
                    {thousandSeparator(item.dimensiMuatan.lebar)} x{" "}
                    {thousandSeparator(item.dimensiMuatan.tinggi)}{" "}
                    {item.dimensiMuatan.unit}
                  </span>
                </div>
              </td>
              <td className="py-2">
                <div className="w-[54px]"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
