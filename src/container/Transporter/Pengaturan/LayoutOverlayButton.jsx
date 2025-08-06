import React from "react";

const LayoutOverlayButton = ({ children, button }) => {
  return (
    <>
      <div className="w-full pb-28 pt-6">{children}</div>
      <div className="fixed bottom-0 left-0 z-50 h-[72px] w-screen bg-white p-4 shadow-button-container">
        <div className="md:flex md:justify-end">{button}</div>
      </div>
    </>
  );
};
export default LayoutOverlayButton;
