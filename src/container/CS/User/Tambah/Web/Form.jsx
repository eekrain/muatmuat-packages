import InformasiPendaftar from "./DataPerusahaan/InformasiPendaftar";
import KelengkapanLegalitas from "./KelengkapanLegalitas/KelengkapanLegalitas";
import KontakPIC from "./KontakPIC/KontakPIC";

function Form({ activeIdx }) {
  return (
    <>
      {activeIdx === 0 && <InformasiPendaftar />}
      {activeIdx === 1 && <KelengkapanLegalitas />}
      {activeIdx === 2 && <KontakPIC />}
    </>
  );
}

export default Form;
