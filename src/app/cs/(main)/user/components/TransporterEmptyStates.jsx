import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import IconComponent from "@/components/IconComponent/IconComponent";

const TransporterEmptyStates = ({
  error,
  showNoDataState,
  showSearchNotFoundState,
  showFilterNotFoundState,
}) => {
  if (error) {
    return (
      <div className="flex h-[280px] w-full flex-col items-center justify-center">
        <DataNotFound
          type="data"
          title="Terjadi kesalahan saat memuat data"
          subtitle="Silakan refresh halaman atau coba lagi nanti"
        />
      </div>
    );
  }

  if (showNoDataState) {
    return (
      <div className="flex h-[280px] w-full flex-col items-center justify-center">
        <DataNotFound type="data" title="Belum ada Transporter" />
        <Button
          iconLeft={
            <IconComponent
              src="/icons/plus16.svg"
              className="fill-black stroke-2"
            />
          }
          className="mt-3"
        >
          Tambah Transporter
        </Button>
      </div>
    );
  }

  if (showSearchNotFoundState) {
    return <DataNotFound type="search" title="Keyword Tidak Ditemukan" />;
  }

  if (showFilterNotFoundState) {
    return (
      <DataNotFound
        type="data"
        title="Data tidak Ditemukan."
        subtitle="Mohon coba hapus beberapa filter"
      />
    );
  }

  return <DataNotFound className="w-full" title="Tidak ada data ditemukan" />;
};

export default TransporterEmptyStates;
