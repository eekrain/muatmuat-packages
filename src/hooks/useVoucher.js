import { useEffect, useState } from "react";

import api from "@/lib/axios";

export const useVouchers = (token) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    api
      .get("/v1/orders/vouchers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setVouchers(res.data.Data.vouchers))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [token]);

  return { vouchers, loading, error };
};
