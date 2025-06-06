import { FormContainer, FormLabel } from "@/components/Form/Form";
import RadioButton from "@/components/Radio/RadioButton";
import { InfoTooltip } from "@/components/Tooltip/Tooltip";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const TipeMuatan = () => {
  const tipeMuatan = useSewaArmadaStore((state) => state.formValues.tipeMuatan);
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer className="flex gap-8">
      <FormLabel
        required
        tooltip={
          <InfoTooltip
            className="w-[336px]"
            content={
              <div>
                <ul>
                  <li>
                    <b>Bahan Mentah :</b> Material atau komponen yang belum
                    diproses.
                  </li>
                  <li>
                    <b>Barang Setengah Jadi :</b> Produk yang telah mengalami
                    beberapa tahap proses tapi belum selesai.
                  </li>
                  <li>
                    <b>Barang Jadi :</b> Produk akhir yang siap untuk digunakan
                    atau dijual.
                  </li>
                  <li>
                    <b>Lainnya :</b> Bahan / barang yang tidak sesuai dengan
                    jenis diatas, namun tetap memiliki fungsi dalam proses
                    produksi atau distribusi.
                  </li>
                </ul>
                <span>
                  Pemilihan tipe muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </span>
              </div>
            }
            side="right"
          />
        }
      >
        Tipe Muatan
      </FormLabel>
      <div className="flex flex-1 flex-wrap gap-3">
        <>
          <div className="w-[250px]">
            <RadioButton
              name="tipeMuatan"
              label="Bahan Mentah"
              checked={tipeMuatan === "bahan-mentah"}
              onClick={() => setField("tipeMuatan", "bahan-mentah")}
              value="bahan-mentah"
            />
          </div>
          <div className="w-[250px]">
            <RadioButton
              name="tipeMuatan"
              label="Barang Jadi"
              checked={tipeMuatan === "barang-jadi"}
              onClick={() => setField("tipeMuatan", "barang-jadi")}
              value="barang-jadi"
            />
          </div>
          <div className="w-[250px]">
            <RadioButton
              name="tipeMuatan"
              label="Barang Setengah Jadi"
              checked={tipeMuatan === "barang-setengah-jadi"}
              onClick={() => setField("tipeMuatan", "barang-setengah-jadi")}
              value="barang-setengah-jadi"
            />
          </div>
          <div className="w-[250px]">
            <RadioButton
              name="tipeMuatan"
              label="Lainnya"
              checked={tipeMuatan === "lainnya"}
              onClick={() => setField("tipeMuatan", "lainnya")}
              value="lainnya"
            />
          </div>
        </>
        {/* {loadingCargoTypes ? (
        <div className="flex w-full items-center justify-center">
          <span>Memuat data...</span>
        </div>
      ) : (
        cargoTypes.map((type) => (
          <div className="w-[250px]" key={type.id}>
            <RadioButton
              name="tipeMuatan"
              label={type.name}
              checked={tipeMuatan === type.id}
              onClick={() => setTipeMuatan(type.id)}
              value={type.id}
            />
          </div>
        ))
      )} */}
      </div>
    </FormContainer>
  );
};
