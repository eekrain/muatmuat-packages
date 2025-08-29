import InformasiPendaftar from "./DataPerusahaan/InformasiPendaftar";
import KelengkapanLegalitas from "./KelengkapanLegalitas/KelengkapanLegalitas";
import KontakPIC from "./KontakPIC/KontakPIC";

function Form({ activeIdx, onSectionSave, onFormChange, setActiveIdx }) {
  return (
    <>
      {activeIdx === 0 && (
        <InformasiPendaftar
          onSave={() => onSectionSave(0)}
          onFormChange={() => onFormChange(0)}
        />
      )}
      {activeIdx === 1 && (
        <KelengkapanLegalitas
          onSave={() => onSectionSave(1)}
          onFormChange={() => onFormChange(1)}
          setActiveIdx={setActiveIdx}
        />
      )}
      {activeIdx === 2 && (
        <KontakPIC
          onSave={() => onSectionSave(2)}
          onFormChange={() => onFormChange(2)}
          setActiveIdx={setActiveIdx}
        />
      )}
    </>
  );
}

export default Form;
