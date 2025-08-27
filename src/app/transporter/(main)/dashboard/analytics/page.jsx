"use client";

import React from "react";

import { useGetUserJourneyStatus } from "@/services/Transporter/dashboard/getUserJourneyStatus";

import LoadingStatic from "@/components/Loading/LoadingStatic";

import Analytics from "@/container/Transporter/Dashboard/Analytics/Analytics";
import UserJourney from "@/container/Transporter/Dashboard/UserJourney";

function Page() {
  const { data, isLoading, error } = useGetUserJourneyStatus();

  console.log("user journey:", data);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingStatic />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8 text-center text-error-500">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="pt-8">
      {data?.isComplete === true ? (
        <Analytics />
      ) : (
        <UserJourney journeyStatus={data} />
      )}
    </div>
  );
}

export default Page;
