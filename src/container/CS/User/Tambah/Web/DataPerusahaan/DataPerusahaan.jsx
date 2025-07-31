import InformasiPendaftar from "./InformasiPendaftar";
import InformasiPerusahaan from "./InformasiPerusahaan";

function DataPerusahaan({ activeIdx }) {
  return (
    <>
      {activeIdx === 0 && <InformasiPendaftar />}
      {activeIdx === 1 && <InformasiPerusahaan />}
    </>
  );
}

export default DataPerusahaan;
