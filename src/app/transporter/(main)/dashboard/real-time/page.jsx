import React from "react";

import UserJourney from "@/container/Transporter/Dashboard/UserJourney";

function Page() {
  return (
    <div className="pt-8">
      <h1 className="px-6 text-xl font-bold text-neutral-900">
        Dashboard Analytics
      </h1>
      <UserJourney />
    </div>
  );
}

export default Page;
