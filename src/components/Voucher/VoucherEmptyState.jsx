const VoucherEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* This SVG is a more accurate representation based on the image provided earlier. */}
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        {/* Blue Folder */}
        <path
          d="M84.5 30.8333H58.125C55.4375 25.5 50.8125 21.6667 45.4167 21.6667H20.8333C14.8958 21.6667 10 26.5625 10 32.5V79.1667C10 85.1042 14.8958 90 20.8333 90H79.1667C85.1042 90 90 85.1042 90 79.1667V42.5C90 36.5625 85.1042 31.6667 79.1667 31.6667H84.5V30.8333Z"
          fill="#4285F4"
        />
        {/* Yellow Base */}
        <path
          d="M20.8333 80.8333C15.9375 80.8333 11.6667 76.5625 11.6667 71.6667V32.5C11.6667 27.5 15.9375 23.3333 20.8333 23.3333H45.4167C50.3125 23.3333 54.5833 27.5 54.5833 32.5H79.1667C84.0625 32.5 88.3333 36.7708 88.3333 41.6667V71.6667C88.3333 76.5625 84.0625 80.8333 79.1667 80.8333H20.8333Z"
          fill="#FABC05"
        />
        {/* Red X circle */}
        <circle cx="75" cy="75" r="20" fill="#EA4335" />
        {/* White X paths */}
        <path
          d="M85 65L65 85M65 65L85 85"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-lg font-medium text-gray-600">Belum Ada Voucher</p>
    </div>
  );
};

export default VoucherEmptyState;
