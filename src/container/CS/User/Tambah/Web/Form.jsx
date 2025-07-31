import {
  InformasiPendaftar,
  InformasiPerusahaan,
  InformasiRekeningPerusahaan,
  LokasiPerusahaan,
} from "@/container/CS/User/Tambah/Web/DataPerusahaan";
import { LocationProvider } from "@/hooks/use-location/use-location";

import KelengkapanLegalitas from "./KelengkapanLegalitas/KelengkapanLegalitas";
import KontakPIC from "./KontakPIC/KontakPIC";

function Form({ activeIdx }) {
  return (
    <LocationProvider>
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
    </LocationProvider>
  );
}

export default Form;
