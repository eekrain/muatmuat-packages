import { Buffer } from "buffer";
import xior from "xior";

// Create a new xior instance pre-configured with Basic Authentication
const fetcherMuatransCS = xior.create({
  baseURL: process.env.NEXT_PUBLIC_MUATRANS_API,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for Basic Authentication
fetcherMuatransCS.interceptors.request.use(
  (config) => {
    // Credentials for Basic Auth
    const username = "az_muattrans";
    const password = "Zci01Y4zh2IHCupULvXbTdDM";

    // Encode credentials to Base64
    const token = Buffer.from(`${username}:${password}`, "utf8").toString(
      "base64"
    );

    // Set the Authorization header
    config.headers.Authorization = `Basic ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for consistent error handling
fetcherMuatransCS.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific server errors if needed
      if (error.response.status === 503) {
        console.warn(
          "Service Unavailable (503). Redirecting to maintenance page."
        );
        // This redirect might be better handled globally, but can be placed here for specificity.
        window.location.replace(
          `${process.env.NEXT_PUBLIC_INTERNAL_WEB}sistem`
        );
      }
    } else {
      console.error("Request setup error:", error.message);
    }
    // Re-throw the error to be handled by SWR or the calling function
    return Promise.reject(error);
  }
);

export { fetcherMuatransCS };
