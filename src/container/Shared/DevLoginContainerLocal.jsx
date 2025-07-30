"use client";

import { useState } from "react";

import xior from "xior";

import { useTokenActions } from "@/store/Auth/tokenStore";

// Helper to determine input type
const getInputType = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input) ? "email" : "phone";
};

const DevLoginContainer = ({ onSuccessRedirect = "/manajemen-armada" }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useTokenActions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { emailOrPhone, password } = formData;

    // Validate email/phone
    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Email or phone number is required";
    } else {
      const inputType = getInputType(emailOrPhone);

      if (inputType === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailOrPhone)) {
          newErrors.emailOrPhone = "Please enter a valid email address";
        }
      } else {
        const phoneDigits = emailOrPhone.replace(/\D/g, "");
        if (phoneDigits.length < 10 || phoneDigits.length > 15) {
          newErrors.emailOrPhone =
            "Please enter a valid phone number (10-15 digits)";
        }
      }
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Determine if input is email or phone
      const isEmail = /\S+@\S+\.\S+/.test(formData.emailOrPhone);

      // First API call to do_login_user
      const form = new FormData();
      // Send as 'email' or 'phone' based on input format
      if (isEmail) {
        form.append("email", formData.emailOrPhone);
      } else {
        form.append("phone", formData.emailOrPhone);
      }
      // Encode password to base64
      const encodedPassword = btoa(formData.password);
      form.append("password", encodedPassword);

      const firstResponse = await xior.post(
        "https://general-az.assetlogistik.com/api/do_login_user",
        form,
        {
          headers: {
            "User-Agent": "insomnia/11.2.0",
          },
        }
      );

      console.log("First API response:", firstResponse.data);

      // Extract token from first response
      const token = firstResponse.data?.Data?.Token;

      if (!token) {
        throw new Error("No token received from login");
      }

      // Second API call to muatparts auth
      const secondPayload = { email: formData.emailOrPhone, token: token };

      const secondResponse = await xior.post(
        "https://api-az.assetlogistik.com/v1/muatparts/auth/login/mp",
        secondPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "insomnia/11.2.0",
          },
        }
      );

      console.log("Second API response:", secondResponse.data);

      // Set tokens in the store - check for correct path based on API response
      if (
        secondResponse.data?.Data?.accessToken &&
        secondResponse.data?.Data?.refreshToken
      ) {
        setToken({
          accessToken: secondResponse.data.Data.accessToken,
          refreshToken: secondResponse.data.Data.refreshToken,
        });
      } else if (
        secondResponse.data?.data?.accessToken &&
        secondResponse.data?.data?.refreshToken
      ) {
        setToken({
          accessToken: secondResponse.data.data.accessToken,
          refreshToken: secondResponse.data.data.refreshToken,
        });
      } else {
        throw new Error("Invalid token response from server");
      }

      // Add delay before redirect
      await new Promise((resolve) => setTimeout(resolve, 500));

      window.location.replace(onSuccessRedirect);
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general:
          error.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk Pakai Akun general-az Kamu!
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="emailOrPhone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email or Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                placeholder="Enter your email or phone number"
                value={formData.emailOrPhone}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="username"
                className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.emailOrPhone ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "cursor-not-allowed bg-gray-100" : ""}`}
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                autoComplete="current-password"
                className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "cursor-not-allowed bg-gray-100" : ""}`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <div>
                <p className="text-sm text-red-500">{errors.general}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-md px-4 py-2 font-medium text-white transition-colors ${
                  isLoading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DevLoginContainer;
