import Link from "next/link";
import React from "react";

import { Alert } from "@/components/Alert/Alert";

const SuspendedAccountAlert = ({ status }) => {
  if (!status?.isSuspended) {
    return null;
  }

  return (
    <Alert variant="error" className="mb-6 px-6 py-4">
      <p>
        {status.suspensionMessage}{" "}
        <Link
          href="/support"
          className="font-medium text-[#176CF7] hover:text-[#1257C6]"
        >
          {status.contactSupport.linkText}
        </Link>
      </p>
    </Alert>
  );
};

export default SuspendedAccountAlert;
