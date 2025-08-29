// export const handleCopy=async({data,alertShow,alertText})=>{
//   try {
//     await navigator.clipboard.writeText(data)
//   } catch (error) {
//     alert('error copied')
//   } finally{
//     if(alertShow&&!alertText) alert('Copied '+data)
//     if(alertShow&&alertText) alert(alertText)
//   }
import { toast } from "../toast";

// }
export function getTimeGap(transactionTime, expiryTime) {
  const transactionTimestamp = new Date(transactionTime).getTime();
  const expiryTimestamp = new Date(expiryTime).getTime();
  const timeGap = expiryTimestamp - transactionTimestamp;
  return timeGap / 60000;
}

export function handleChangeInput({
  value,
  key,
  validation,
  setState,
  setValidation,
}) {
  if (value) setValidation(validation.filter((val) => val !== key));
  if (!value) setValidation((prev) => [...prev, key]);
  setState((prev) => ({ ...prev, [key]: value }));
}

export const timeCountdown = (sec) => {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export const handleDownload = async (fileUrl, fileName) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Download gagal. Silakan coba lagi.");
  }
};

export const handleCopy = async (text, alert) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(alert);
  } catch (error) {
    toast.error("Copy failed! ");
  }
};

export function CopyClipboard(val, id, setState) {
  navigator.clipboard.writeText(val).then(() => setState(id));
}

export function generateVariantCombination(combination, variant1, variant2) {
  const variant_1 = variant1?.filter((val) => combination?.code?.includes(val));
  const variant_2 = variant2?.filter((val) => combination?.code?.includes(val));
  if (variant_2) return `${variant_1}-${variant_2}`;
  return variant_1;
}

export function sortMainAddressOnTop(address) {
  const primary = address?.filter((val) => val?.IsMainAddress === 1) || [];
  const old = address?.filter((val) => val?.IsMainAddress !== 1) || [];
  const tmp = [...primary, ...old];
  return tmp;
}

export function generateThumbnail(url) {
  const getYouTubeVideoId = (url) => {
    const urlParts =
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/) ||
      url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/);
    return urlParts ? urlParts[1] : null;
  };

  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }
  const thumbnailUrl = `${process.env.NEXT_PUBLIC_ASSET_REVERSE}https://img.youtube.com/vi/${videoId}/az-trash.jpg`;
  return thumbnailUrl;
}

export function metaSearchParams(object) {
  // do not even touch it
  if (typeof object === "object") {
    return Object.entries(object)
      .map((val) => {
        if (typeof val[1] === "function") return "";
        if (val[1] || val[1]?.length) {
          if (Array.isArray(val[1]) && !val[1].length) {
            return "";
          }
          if (Array.isArray(val[1]) && val[1].length) {
            // LBM
            if (val[1].length === 1) return `${val[0]}=${val[1]},`;
            return `${val[0]}=${val[1]?.join(",")}`;
          }
          return `${val[0]}=${val[1]}`;
        }
        return "";
      })
      .filter((val) => val)
      .join("&");
  }
  if (typeof object === "string") {
    return Object.assign(
      {},
      ...object.split("&").map((val) => {
        if (!isNaN(Number(val?.split("=")[1])))
          return { [val?.split("=")[0]]: Number(val?.split("=")[1]) };
        if (val?.split("=")[0] !== "q" && val?.split("=")[1]?.includes(",")) {
          const arr = val?.split("=")[1]?.split(",");
          const newArr = arr?.map((a) => {
            if (!isNaN(Number(a))) return Number(a);
            return a;
          });
          return { [val?.split("=")[0]]: newArr.filter((a) => a) };
        }
        if (val?.split("=")[0] === "q")
          return {
            [val?.split("=")[0]]: val?.split("=")[1]?.replaceAll("%20", " "),
          };
        if (val?.split("=")[1] === "true" || val?.split("=")[1] === "false")
          return { [val?.split("=")[0]]: !!val?.split("=")[1] };
        return { [val?.split("=")[0]]: val?.split("=")[1] };
      })
    );
  }
  throw new Error("Input Failed");
}

export function mergerUnique(arr1, arr2, key) {
  const map = new Map();
  [...arr1, ...arr2].forEach((item) => {
    map.set(item[key], item);
  });
  return Array.from(map.values());
}
