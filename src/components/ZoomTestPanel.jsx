import { useState } from "react";

import { testScenarios } from "@/services/Transporter/monitoring/testScenarios";

export const ZoomTestPanel = ({
  onApplyScenario,
  currentZoom,
  calculatedZoom,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded bg-blue-500 px-4 py-2 text-white shadow-lg"
      >
        Test Zoom Levels
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-lg bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">Zoom Test Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mb-3 rounded bg-gray-100 p-2 text-sm">
        <div>
          Current Zoom:{" "}
          <span className="font-mono font-bold">{currentZoom}</span>
        </div>
        <div>
          Calculated Zoom:{" "}
          <span className="font-mono font-bold">{calculatedZoom}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-gray-600">
          Test Scenarios:
        </div>
        {Object.keys(testScenarios).map((scenario) => (
          <button
            key={scenario}
            onClick={() => onApplyScenario(scenario)}
            className="w-full rounded border border-gray-300 px-3 py-1.5 text-left text-sm hover:bg-gray-50"
          >
            {scenario.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      <div className="mt-3 border-t pt-3">
        <div className="text-xs text-gray-500">
          <div>Zoom 15-18: Street level</div>
          <div>Zoom 11-14: City level</div>
          <div>Zoom 8-10: Regional</div>
          <div>Zoom 5-7: Country</div>
          <div>Zoom 3-4: Continent</div>
        </div>
      </div>
    </div>
  );
};
