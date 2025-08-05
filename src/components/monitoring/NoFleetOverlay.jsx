import Image from "next/image";
import { useRouter } from "next/navigation";

export const NoFleetOverlay = () => {
  const router = useRouter();

  const handleAddFleet = () => {
    // Navigate to fleet management page
    router.push("/transporter/fleet");
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div
        className="flex flex-col items-center rounded-[12px] bg-white"
        style={{
          width: "456px",
          padding: "24px",
          gap: "16px",
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col items-center gap-[12px]">
          <div style={{ width: "100px", height: "76px" }}>
            <Image
              src="/img/monitoring-first-timer.png"
              alt="Add Fleet"
              width={100}
              height={76}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[16px]">
          <h2
            className="font-semibold text-[#7B7B7B]"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontSize: "16px",
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            Kamu Belum Menambahkan Armada
          </h2>

          <p
            className="text-[#7B7B7B]"
            style={{
              fontFamily: "Avenir Next LT Pro",
              fontWeight: 500,
              fontSize: "12px",
              lineHeight: "120%",
              textAlign: "center",
            }}
          >
            Mulai tambahkan armada untuk menggunakan fitur maps
          </p>
        </div>

        <button
          onClick={handleAddFleet}
          className="flex flex-row items-center justify-center gap-[4px] rounded-[24px] bg-[#FFC217] font-semibold text-[#461B02] transition-colors duration-200 hover:bg-[#FFB000]"
          style={{
            padding: "8px 24px",
            minWidth: "112px",
            height: "32px",
            fontFamily: "Avenir Next LT Pro",
            fontSize: "14px",
            lineHeight: "120%",
          }}
        >
          Tambah Armada
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12l4-4-4-4"
              stroke="#461B02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
