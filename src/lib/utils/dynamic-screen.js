import dynamic from "next/dynamic";

export const dynamicScreen = (screen) => {
  return dynamic(screen, { ssr: false });
};
