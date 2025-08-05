import StatusPage from "@/container/Transporter/Auth/components/StatusPage/StatusPage";

const Page = () => {
  return (
    <StatusPage
      type="success"
      title="Sebelumnya Kamu Sudah Berhasil Verifikasi"
      description="Akun Transporter Kamu sudah siap digunakan. Silahkan masuk ke akunmu atau hubungi CS Muatrans jika ada kendala"
      buttonLabel="Masuk ke Muatrans"
      buttonHref="/login"
    />
  );
};

export default Page;
