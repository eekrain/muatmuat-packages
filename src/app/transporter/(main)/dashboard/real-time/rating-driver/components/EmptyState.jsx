// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx
"use client";

import { useRouter } from "next/navigation";

import DataEmpty from "@/components/DataEmpty/DataEmpty";

// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx

// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx

// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx

// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx

// app/(shipper)/dashboard/real-time/rating-driver/components/EmptyState.jsx

const EmptyState = ({ data }) => {
  const router = useRouter();

  if (!data) return null;

  return (
    <div className="flex h-full items-center justify-center">
      <DataEmpty
        title={data.title}
        subtitle={data.subtitle}
        buttonText={data.actionButton.text}
        onButtonClick={() => router.push(data.actionButton.url)}
        buttonProps={{
          variant: "muattrans-primary",
        }}
      />
    </div>
  );
};

export default EmptyState;
