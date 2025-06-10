import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const LayananTambahan = () => {
  const kirimBuktiFisik = useSewaArmadaStore(
    (state) => state.formValues.kirimBuktiFisik
  );
  const bantuanTambahan = useSewaArmadaStore(
    (state) => state.formValues.bantuanTambahan
  );
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer>
      {/* Label Bagian */}
      <FormLabel variant="small">Layanan Tambahan</FormLabel>

      {/* Container Opsi Layanan */}
      <div className="flex-grow-1 flex h-[44px] w-[576px] flex-col gap-[12px]">
        {/* Opsi Layanan 1 - Kirim Bukti Fisik */}
        <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
          {/* Container Checkbox dan Label */}
          <div className="flex h-[16px] flex-row items-center gap-[4px]">
            <Checkbox
              onChange={(e) => setField("kirimBuktiFisik", e.checked)}
              label="Kirim Bukti Fisik Penerimaan Barang"
              checked={kirimBuktiFisik}
              value="kirim_bukti_fisik"
            />
            <IconComponent src="/icons/info16.svg" width={16} height={16} />
          </div>

          {/* Harga Opsi 1 */}
          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
            Rp-
          </span>
        </div>

        {/* Opsi Layanan 2 - Bantuan Tambahan */}
        <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
          {/* Container Checkbox dan Label */}
          <div className="flex h-[16px] flex-row items-center gap-[4px]">
            <Checkbox
              onChange={(e) => setField("bantuanTambahan", e.checked)}
              label="Bantuan Tambahan"
              checked={bantuanTambahan}
              value="bantuan_tambahan"
            />
            <IconComponent src="/icons/info16.svg" width={16} height={16} />
          </div>

          {/* Harga Opsi 2 */}
          <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
            Rp105.000
          </span>
        </div>
      </div>
    </FormContainer>
  );
};
