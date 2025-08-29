"use client";

import { Download } from "lucide-react";

import Button from "@/components/Button/Button";

function ButtonDownloadDO() {
  return (
    <Button
      variant="muattrans-primary-secondary"
      iconLeft={<Download size={16} />}
    >
      Unduh DO
    </Button>
  );
}

export default ButtonDownloadDO;
