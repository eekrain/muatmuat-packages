import { FormContainer, FormLabel } from "@/components/Form/Form";
import RadioButton from "@/components/Radio/RadioButton";
import { InfoTooltip } from "@/components/Tooltip/Tooltip";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const JenisMuatan = () => {
  const jenisMuatan = useSewaArmadaStore(
    (state) => state.formValues.jenisMuatan
  );
  const { setField } = useSewaArmadaActions();

  return (
    <FormContainer className="flex gap-8">
      <FormLabel
        required
        tooltip={
          <InfoTooltip
            className="w-[336px]"
            side="right"
            content={
              <div>
                <ul>
                  <li>
                    <b>Padat:</b> Muatan yang berbentuk solid.
                  </li>
                  <li>
                    <b>Cair:</b> Muatan dalam bentuk cairan, biasanya
                    membutuhkan penanganan khusus.
                  </li>
                  <li>
                    <b>Curah:</b> Muatan yang dikirim secara massal, seperti
                    biji-bijian atau pasir.
                  </li>
                  <li>
                    <b>Kendaraan:</b> Muatan berupa alat transportasi yang perlu
                    diangkut.
                  </li>
                  <li>
                    <b>Container:</b> Muatan yang dikemas dalam suatu container.
                  </li>
                </ul>
                <span>
                  Pemilihan jenis muatan yang tepat akan membantu dalam
                  pengelolaan dan pengiriman.
                </span>
              </div>
            }
          />
        }
      >
        Jenis Muatan
      </FormLabel>
      <div className="flex flex-1 flex-wrap gap-3">
        {false ? (
          [].map((category) => (
            <div className="w-[250px]" key={category.id}>
              <RadioButton
                name="jenisMuatan"
                label={category.name}
                checked={jenisMuatan === category.id}
                onClick={() => setField("jenisMuatan", category.id)}
                value={category.id}
              />
            </div>
          ))
        ) : (
          <>
            <div className="w-[250px]">
              <RadioButton
                name="jenisMuatan"
                label="Padat"
                checked={jenisMuatan === "padat"}
                onClick={() => setField("jenisMuatan", "padat")}
                value="padat"
              />
            </div>
            <div className="w-[250px]">
              <RadioButton
                name="jenisMuatan"
                label="Cair"
                checked={jenisMuatan === "cair"}
                onClick={() => setField("jenisMuatan", "cair")}
                value="cair"
              />
            </div>
            <div className="w-[250px]">
              <RadioButton
                name="jenisMuatan"
                label="Curah"
                checked={jenisMuatan === "curah"}
                onClick={() => setField("jenisMuatan", "curah")}
                value="curah"
              />
            </div>
            <div className="w-[250px]">
              <RadioButton
                name="jenisMuatan"
                label="Kendaraan"
                checked={jenisMuatan === "kendaraan"}
                onClick={() => setField("jenisMuatan", "kendaraan")}
                value="kendaraan"
              />
            </div>
            <div className="w-[250px]">
              <RadioButton
                name="jenisMuatan"
                label="Container"
                checked={jenisMuatan === "container"}
                onClick={() => setField("jenisMuatan", "container")}
                value="container"
              />
            </div>
          </>
        )}
      </div>
    </FormContainer>
  );
};
