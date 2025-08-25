import { create } from "zustand";
import { persist } from "zustand/middleware";

import { generateDynamicPeriodOptions } from "@/lib/utils/generateDynamicPeriodOptions";

// Get the dynamic period options
const periodOptions = generateDynamicPeriodOptions();
// Set the first option ('Bulan Ini') as the default
const defaultPeriod = periodOptions[0];

export const useAnalyticsStore = create(
  persist(
    (set) => ({
      // 'period' now stores the unique identifier from the option's 'name' property
      period: defaultPeriod.name,
      // A new 'label' state to store the user-facing display text from the option's 'value'
      label: defaultPeriod.value,
      startDate: defaultPeriod.startDate,
      endDate: defaultPeriod.endDate,

      /**
       * Sets the selected period option in the store.
       * @param {object} option - The selected option object.
       * @param {string} option.name - The unique identifier for the period (e.g., 'Bulan Ini (Default)').
       * @param {string} option.value - The display label (e.g., 'Dalam Bulan Ini').
       * @param {string} option.startDate - The start date in 'YYYY-MM-DD' format.
       * @param {string} option.endDate - The end date in 'YYYY-MM-DD' format.
       */
      setPeriodOption: (option) => {
        set({
          period: option.name,
          label: option.value,
          startDate: option.startDate,
          endDate: option.endDate,
        });
      },
    }),
    {
      name: "analytics-storage",
      // Ensure all relevant state properties are persisted
      partialize: (state) => ({
        period: state.period,
        label: state.label,
        startDate: state.startDate,
        endDate: state.endDate,
      }),
    }
  )
);
