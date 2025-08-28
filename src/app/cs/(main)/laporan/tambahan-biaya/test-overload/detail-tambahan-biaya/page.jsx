"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { TEST_UUIDS } from "@/utils/testUUIDs";

const TestOverloadPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke UUID yang valid untuk testing overload details
    const validUUID = TEST_UUIDS.EXISTING_REPORT;
    router.replace(
      `/laporan/tambahan-biaya/${validUUID}/detail-tambahan-biaya`
    );
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-gray-600">
          Redirecting to test page for overload details...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          UUID: {TEST_UUIDS.EXISTING_REPORT}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Testing: 3.3 Get Overload Details API
        </p>
      </div>
    </div>
  );
};

export default TestOverloadPage;
