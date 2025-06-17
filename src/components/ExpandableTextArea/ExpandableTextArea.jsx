import { useEffect, useRef, useState } from "react";

const ExpandableTextArea = (props) => {
  const textareaRef = useRef(null);
  const [isGrow, setIsGrow] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = "12px";

      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 12), 100);
      setIsGrow(newHeight > 16);
      textarea.style.height = `${newHeight}px`;
    }
  }, [props.value]);

  return (
    <div
      className={`max-h-[100px] min-h-[32px] w-full ${isGrow ? "p-3" : "px-3"} flex items-center rounded-lg border border-[#868686]`}
    >
      <textarea
        {...props}
        ref={textareaRef}
        className={`my-auto max-h-[76px] min-h-[12px] w-full resize-none overflow-y-auto text-[12px] font-medium leading-[15.6px] outline-none ${props.textareaClassname}`}
        style={{
          height: "12px",
        }}
      />
    </div>
  );
};

export default ExpandableTextArea;
