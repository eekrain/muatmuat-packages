import { NextResponse } from "next/server";

import { MOCK_DATABASE } from "../data";

// This is the Next.js API Route Handler for search suggestions
export async function GET(request) {
  // Simulate a quick network delay for suggestions
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const view_type = searchParams.get("view_type") || "armada";
  const limit = parseInt(searchParams.get("limit") || "5");

  console.log("🔍 Search Suggestions API called:", {
    query,
    view_type,
    limit,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Don't return suggestions for very short queries
  if (query.trim().length < 2) {
    console.log("⚠️ Query too short, returning empty suggestions");
    return NextResponse.json({
      Message: { Code: 200, Text: "Query too short" },
      Data: { suggestions: [] },
      Type: "GET_SEARCH_SUGGESTIONS",
    });
  }

  const searchLower = query.toLowerCase();

  // Use a Map to store unique suggestions, preventing duplicates
  const uniqueSuggestions = new Map();

  // Select the correct dataset from our mock database
  const dataset = MOCK_DATABASE[view_type] || MOCK_DATABASE.armada;

  for (const item of dataset) {
    // Stop once we have enough suggestions
    if (uniqueSuggestions.size >= limit) break;

    // Logic for ARMADA view: suggest matching plates and drivers within schedules
    if (view_type === "armada") {
      if (item.licensePlate?.toLowerCase().includes(searchLower)) {
        if (!uniqueSuggestions.has(item.licensePlate)) {
          uniqueSuggestions.set(item.licensePlate, {
            type: "LICENSE_PLATE",
            value: item.licensePlate,
            label: `${item.licensePlate} - ${item.truckType || "Vehicle"}`,
            fleetID: `fleet-${item.licensePlate.toLowerCase().replace(/\s/g, "-")}`,
            matchCount: 1,
          });
        }
      }
      item.schedule?.forEach((task) => {
        if (task.driverName?.toLowerCase().includes(searchLower)) {
          if (!uniqueSuggestions.has(task.driverName)) {
            uniqueSuggestions.set(task.driverName, {
              type: "DRIVER_NAME",
              value: task.driverName,
              label: `${task.driverName} - Driver`,
              driverID: `driver-${task.driverName.toLowerCase().replace(/\s/g, "-")}`,
              matchCount: 1,
            });
          }
        }
      });
    }

    // Logic for DRIVER view: suggest matching drivers and plates within their schedules
    if (view_type === "driver") {
      if (item.driverName?.toLowerCase().includes(searchLower)) {
        if (!uniqueSuggestions.has(item.driverName)) {
          uniqueSuggestions.set(item.driverName, {
            type: "DRIVER_NAME",
            value: item.driverName,
            label: `${item.driverName} - Driver`,
            driverID: `driver-${item.driverName.toLowerCase().replace(/\s/g, "-")}`,
            matchCount: 1,
          });
        }
      }
      item.schedule?.forEach((task) => {
        if (task.licensePlate?.toLowerCase().includes(searchLower)) {
          if (!uniqueSuggestions.has(task.licensePlate)) {
            uniqueSuggestions.set(task.licensePlate, {
              type: "LICENSE_PLATE",
              value: task.licensePlate,
              label: `${task.licensePlate} - ${task.truckType || "Vehicle"}`,
              fleetID: `fleet-${task.licensePlate.toLowerCase().replace(/\s/g, "-")}`,
              matchCount: 1,
            });
          }
        }
      });
    }
  }

  const finalSuggestions = Array.from(uniqueSuggestions.values());

  console.log("✅ Search Suggestions generated:", {
    query,
    suggestionsCount: finalSuggestions.length,
    suggestions: finalSuggestions.map((s) => s.label),
  });

  const responseData = {
    Message: { Code: 200, Text: "Saran pencarian berhasil dimuat" },
    Data: { suggestions: finalSuggestions, cacheHit: true },
    Type: "GET_SEARCH_SUGGESTIONS",
  };

  return NextResponse.json(responseData);
}
