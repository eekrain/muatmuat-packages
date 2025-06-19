import { useEffect, useState } from "react";

import { fetcherMuatrans } from "@/lib/axios";

export const useVouchers = (token) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetcherMuatrans
      .get("/v1/orders/vouchers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVouchers(res.data.Data.vouchers))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [token]);

  return { vouchers, loading, error };
};
