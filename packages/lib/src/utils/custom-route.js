import { useRouter } from "next/navigation";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_ASSET_REVERSE || "";
};

// imp_undermaintenance_uat
export const createUrl = (path) => {
  if (path.indexOf("https://") === 0) return path;
  const linkPath = `${getBaseUrl()}${path}`;
  return linkPath.replace("/muatparts/muatparts", "/muatparts");
};

export const useCustomRouter = () => {
  const router = useRouter();
  return {
    ...router,
    push: (path, options) => router.push(createUrl(path), options),
    replace: (path, options) => router.replace(createUrl(path), options),
  };
};
