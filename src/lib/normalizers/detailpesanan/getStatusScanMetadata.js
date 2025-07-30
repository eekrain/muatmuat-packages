export const getStatusScanMetadata = (statusScan = null) => {
  const splitStatus = statusScan?.split?.("_") || [];
  let hasScan = false;
  let statusTitle = "";
  let statusText = "";
  if (splitStatus.length < 3) return { hasScan, statusText, statusTitle };

  // Get index location if available
  const indexLocation = splitStatus.slice(-1)?.[0];
  const indexString = (i) => (!isNaN(Number(i)) ? ` ${i}` : "");

  // Get status title
  statusTitle = `QR Code Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;

  if (splitStatus[0] === "BELUM" && splitStatus[1] === "SCAN") {
    hasScan = false;
  } else if (splitStatus[0] === "SUDAH" && splitStatus[1] === "SCAN") {
    hasScan = true;
  }

  if (splitStatus[2] === "MUAT") {
    if (hasScan)
      statusText = `Sudah Scan di Lokasi Muat${indexString(indexLocation)}`;
    else statusText = `Belum Scan di Lokasi Muat${indexString(indexLocation)}`;
  } else {
    if (hasScan)
      statusText = `Sudah Scan di Lokasi Bongkar${indexString(indexLocation)}`;
    else
      statusText = `Belum Scan di Lokasi Bongkar${indexString(indexLocation)}`;
  }

  return {
    statusTitle,
    hasScan,
    statusText,
  };
};
