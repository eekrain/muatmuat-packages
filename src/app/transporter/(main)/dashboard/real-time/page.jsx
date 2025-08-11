"use client";

import React from "react";

import LoadingStatic from "@/components/Loading/LoadingStatic";
import RealtimeDashboardPage from "@/container/Transporter/Dashboard/Realtime/Main/RealtimeDashboardPage";
import UserJourney from "@/container/Transporter/Dashboard/UserJourney";
import { useGetUserJourneyStatus } from "@/services/Transporter/dashboard/getUserJourneyStatus";

function Page() {
  const { data, isLoading, error } = useGetUserJourneyStatus();

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
      {data?.allStepsCompleted === true ? (
        <RealtimeDashboardPage />
      ) : (
        <UserJourney journeyStatus={data} />
      )}
    </div>
  );
}

export default Page;
