import { useRouter } from "next/navigation";

const PageTitle = ({ children }) => {
  const router = useRouter();

  return (
    <div className="mb-4 flex items-center gap-3">
      <img
        src="/icons/arrow-left24.svg"
        width={24}
        height={24}
        className="cursor-pointer"
        alt="Back"
        onClick={() => router.back()}
      />
      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};

export default PageTitle;
