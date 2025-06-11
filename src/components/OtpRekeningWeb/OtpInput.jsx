import { useEffect, useRef } from "react";

import useDevice from "@/hooks/use-device";
import { otpInputZustand } from "@/store/zustand/otpInput";

export const OtpInput = () => {
  const { otp, setOtpAtIndex } = otpInputZustand();
  const { isMobile } = useDevice();
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    setOtpAtIndex(index, value);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleInput = (e) => {
    if (e.target.value.length > 1) {
      e.target.value = e.target.value.slice(0, 1);
    }
  };

  return (
    <div className="flex items-start gap-2">
      {otp.map((_, key) => (
        <input
          key={key}
          type="number"
          ref={(ref) => (inputRefs.current[key] = ref)}
          value={otp[key]}
          onChange={(e) => handleChange(e.target, key)}
          onKeyDown={(e) => handleKeyDown(e, key)}
          className={`${isMobile ? "size-[42px] rounded text-[20px] leading-[24px]" : "h-[30px] w-[30px] rounded-lg border border-[#868686] text-[14px] leading-[16.8px]"} bg-white p-0 text-center font-bold outline-none`}
          aria-label={`OTP digit ${key + 1}`}
          onInput={handleInput}
        />
      ))}
    </div>
  );
};
