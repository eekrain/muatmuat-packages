import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

const Page = () => {
  return (
    <StatusPage
      type="failed"
      title="Berhasil Menghentikan Proses Verifikasi Transporter"
      description={
        <span>
          Kamu tidak akan menerima lagi Email verifikasi dari{" "}
          <strong>Muatrans</strong>
        </span>
      }
      appearence={{
        containerClassName: "!max-w-4xl",
        descriptionClassName: "!max-w-4xl",
      }}
    />
  );
};

export default Page;
