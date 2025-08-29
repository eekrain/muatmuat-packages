import useSWR from "swr";

import { fetcherMock, fetcherMuatrans } from "@/lib/axios";

const isMockCSMapsLocations = true;

export const fetcherCSMapsLocations = async (url, { arg } = {}) => {
  if (isMockCSMapsLocations) {
    const result = await fetcherMock.get(`/api/${url}`, arg ?? null);
    return result.data.data;
  }
  const result = await fetcherMuatrans.get(url, arg);
  return result.data.data;
};

export const useGetCSMapsLocations = (params = {}) => {
  // params example: { includeInactive: false, bounds: '-6.3,106.7,-6.1,106.9', zoom: 10 }
  // or bounds as array: { bounds: [-6.3,106.7,-6.1,106.9] }

  const buildQueryString = (p) => {
    const query = new URLSearchParams();

    if (p.includeInactive !== undefined) {
      query.set("includeInactive", String(p.includeInactive));
    }

    if (p.bounds) {
      const boundsStr = Array.isArray(p.bounds)
        ? p.bounds.join(",")
        : String(p.bounds);
      query.set("bounds", boundsStr);
    }

    if (p.zoom !== undefined) {
      query.set("zoom", String(p.zoom));
    }

    // add any other params directly
    Object.keys(p).forEach((k) => {
      if (["includeInactive", "bounds", "zoom"].includes(k)) return;
      const v = p[k];
      if (v !== undefined && v !== null && v !== "") {
        query.set(k, String(v));
      }
    });

    const qs = query.toString();
    return qs ? `v1/cs/maps/locations?${qs}` : `v1/cs/maps/locations`;
  };

  const apiPath = buildQueryString(params);
  const swrKey = params ? `csMapsLocations-${JSON.stringify(params)}` : null;

  return useSWR(swrKey, () => fetcherCSMapsLocations(apiPath, { arg: null }));
};
