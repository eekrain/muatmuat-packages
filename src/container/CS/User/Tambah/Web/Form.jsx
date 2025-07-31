import InformasiPendaftar from "./DataPerusahaan/InformasiPendaftar";
import KelengkapanLegalitas from "./KelengkapanLegalitas/KelengkapanLegalitas";
import KontakPIC from "./KontakPIC/KontakPIC";

function Form({ activeIdx }) {
  return (
    <div className="max-w-[70%]">
      {activeIdx === 0 && <InformasiPendaftar />}
      {activeIdx === 1 && <KelengkapanLegalitas />}
      {activeIdx === 2 && <KontakPIC />}
    </div>
  );
}

export default Form;
