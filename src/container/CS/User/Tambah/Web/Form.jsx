import {
  InformasiPendaftar,
  InformasiPerusahaan,
  InformasiRekeningPerusahaan,
  LokasiPerusahaan,
} from "@/container/CS/User/Tambah/Web/DataPerusahaan";

import KelengkapanLegalitas from "./KelengkapanLegalitas/KelengkapanLegalitas";
import KontakPIC from "./KontakPIC/KontakPIC";

function Form({ activeIdx }) {
  return (
    <div className="max-w-[70%]">
      {activeIdx === 0 && (
        <>
          <InformasiPendaftar />
          <InformasiPerusahaan />
          <LokasiPerusahaan />
          <InformasiRekeningPerusahaan />
        </>
      )}
      {activeIdx === 1 && <KelengkapanLegalitas />}
      {activeIdx === 2 && <KontakPIC />}
    </div>
  );
}

export default Form;
