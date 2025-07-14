export const getStatusScanMetadata = (statusScan = null) => {
  const splitStatus = statusScan?.split?.("_") || [];
  let hasScan = false;
  let statusTitle = "";
  let statusText = "";
  if (splitStatus.length < 3) return { hasScan, statusText, statusTitle };

  statusTitle = `QR Code Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;

  if (splitStatus[0] === "BELUM" && splitStatus[1] === "SCAN") {
    hasScan = false;
  } else if (splitStatus[0] === "SUDAH" && splitStatus[1] === "SCAN") {
    hasScan = true;
  }

  if (hasScan) {
    statusText = `Sudah Scan di Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;
  } else {
    statusText = `Belum Scan di Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;
  }

  return {
    statusTitle: statusTitle,
    hasScan,
    statusText: statusText,
  };
};
