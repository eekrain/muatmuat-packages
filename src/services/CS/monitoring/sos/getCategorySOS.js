import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";

const useMockData = true;

export const mockSOSCategories = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS categories retrieved successfully",
    },
    Data: {
      categories: [
        {
          id: "cat001",
          categoryName: "Mesin",
          description: "Masalah terkait mesin kendaraan",
          priority: "high",
          averageResolutionTime: "2 jam 30 menit",
          isActive: true,
        },
        {
          id: "cat002",
          categoryName: "Ban",
          description: "Masalah terkait ban kendaraan",
          priority: "medium",
          averageResolutionTime: "1 jam 45 menit",
          isActive: true,
        },
        {
          id: "cat003",
          categoryName: "Elektronik",
          description: "Masalah terkait sistem elektronik",
          priority: "medium",
          averageResolutionTime: "3 jam 15 menit",
          isActive: true,
        },
        {
          id: "cat004",
          categoryName: "Kecelakaan",
          description: "Kecelakaan lalu lintas",
          priority: "critical",
          averageResolutionTime: "4 jam 20 menit",
          isActive: true,
        },
        {
          id: "cat005",
          categoryName: "Lainnya",
          description: "Masalah lain yang tidak terkategorikan",
          priority: "low",
          averageResolutionTime: "2 jam 00 menit",
          isActive: true,
        },
        {
          id: "cat006",
          categoryName: "Medis",
          description: "Masalah kesehatan sopir atau penumpang",
          priority: "critical",
          averageResolutionTime: "3 jam 45 menit",
          isActive: true,
        },
        {
          id: "cat007",
          categoryName: "Bahan Bakar",
          description: "Masalah terkait bahan bakar kendaraan",
          priority: "medium",
          averageResolutionTime: "1 jam 30 menit",
          isActive: true,
        },
        {
          id: "cat008",
          categoryName: "Cuaca",
          description: "Masalah terkait kondisi cuaca buruk",
          priority: "low",
          averageResolutionTime: "2 jam 15 menit",
          isActive: true,
        },
      ],
      total: 8,
    },
    Type: "SOS_CATEGORIES",
  },
};

export const mockSOSCategoriesFiltered = {
  data: {
    Message: {
      Code: 200,
      Text: "SOS categories retrieved successfully",
    },
    Data: {
      categories: [
        {
          id: "cat001",
          categoryName: "Mesin",
          description: "Masalah terkait mesin kendaraan",
          priority: "high",
          averageResolutionTime: "2 jam 30 menit",
          isActive: true,
        },
        {
          id: "cat004",
          categoryName: "Kecelakaan",
          description: "Kecelakaan lalu lintas",
          priority: "critical",
          averageResolutionTime: "4 jam 20 menit",
          isActive: true,
        },
        {
          id: "cat006",
          categoryName: "Medis",
          description: "Masalah kesehatan sopir atau penumpang",
          priority: "critical",
          averageResolutionTime: "3 jam 45 menit",
          isActive: true,
        },
      ],
      total: 3,
    },
    Type: "SOS_CATEGORIES",
  },
};

export const mockSOSCategoriesEmpty = {
  data: {
    Message: {
      Code: 200,
      Text: "No SOS categories found",
    },
    Data: {
      categories: [],
      total: 0,
    },
    Type: "SOS_CATEGORIES_EMPTY",
  },
};

export const getCategorySOS = async (params = {}) => {
  const { priority = "", isActive = true } = params;

  let result;

  if (useMockData) {
    // Simulate filter results based on parameters
    let filteredCategories = [...mockSOSCategories.data.Data.categories];

    // Apply priority filter
    if (priority && priority.trim() !== "") {
      filteredCategories = filteredCategories.filter(
        (category) => category.priority === priority
      );
    }

    // Apply active filter
    if (isActive !== undefined) {
      filteredCategories = filteredCategories.filter(
        (category) => category.isActive === isActive
      );
    }

    // Sort by priority (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    filteredCategories.sort(
      (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
    );

    // Determine which mock data to use based on filters
    if (filteredCategories.length === 0) {
      result = mockSOSCategoriesEmpty.data;
    } else if (priority === "critical") {
      result = mockSOSCategoriesFiltered.data;
      result.data.Data.categories = filteredCategories;
      result.data.Data.total = filteredCategories.length;
    } else {
      result = mockSOSCategories.data;
      result.data.Data.categories = filteredCategories;
      result.data.Data.total = filteredCategories.length;
    }
  } else {
    try {
      result = await fetcherMuatrans.get(`/v1/cs/sos/categories`, {
        params: { priority, isActive },
      });
    } catch (error) {
      // Handle error response
      return {
        data: {
          Message: {
            Code: error.response?.status || 500,
            Text:
              error.response?.data?.Message?.Text ||
              "Failed to retrieve SOS categories",
          },
          Data: {
            categories: [],
            total: 0,
          },
          Type: "SOS_CATEGORIES_ERROR",
        },
        raw: error.response,
      };
    }
  }

  return {
    data: result?.data || {},
    raw: result,
  };
};

export const useGetCategorySOS = (params = {}) => {
  const { priority, isActive, ...otherParams } = params;

  const { data, error, isLoading, mutate } = useSWR(
    [`getCategorySOS`, params],
    () => getCategorySOS(params),
    {
      refreshInterval: 600000, // Refresh every 10 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data?.data || {},
    raw: data?.raw,
    isLoading,
    isError: !!error,
    mutate,
  };
};
