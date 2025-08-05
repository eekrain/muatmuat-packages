import React from "react";

const LayoutOverlayButton = ({ children, button }) => {
  return (
    <>
      <div className="w-full p-4 pb-28 lg:p-8 lg:pb-28">{children}</div>
      <div className="fixed bottom-0 left-0 z-50 h-[72px] w-screen bg-white p-4 shadow-button-container">
        <div className="md:flex md:justify-end">{button}</div>
      </div>
    </>
  );
};

export default LayoutOverlayButton;
