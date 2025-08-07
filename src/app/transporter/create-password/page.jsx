"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isFormValid = password.length >= 8 && password === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // TODO: Implement API call to save password
    console.log("Password created successfully");
    // router.push("/transporter/login");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "" });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary-700">
      {/* Background meteors - Top Left */}
      <div className="absolute left-0 top-0">
        <Image
          src="/img/meteor-atas.png"
          alt="Meteor decoration"
          width={234}
          height={229}
          className="object-contain"
        />
      </div>

      {/* Background meteors - Bottom Right */}
      <div className="absolute bottom-0 right-0">
        <Image
          src="/img/meteor-bawah.png"
          alt="Meteor decoration"
          width={234}
          height={223}
          className="object-contain"
        />
      </div>

      {/* Logo Header */}
      <div className="absolute left-1/2 top-[34px] z-10 -translate-x-1/2">
        <div className="flex flex-col items-center">
          <IconComponent
            src="/img/muatmuat.png"
            width={200}
            height={36}
            loader={false}
          />
          <p className="mt-5 text-xs font-bold text-white">
            Jalan Mudah Bersama
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Icon Mail */}
        <div className="mb-8">
          <Image
            src="/img/icon-mail-verification.png"
            alt="Email verification success"
            width={209}
            height={221}
            className="object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* Title and Description */}
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Verifikasi Email Berhasil
            </h1>
            <p className="max-w-[411px] text-base font-medium leading-[19px] text-white">
              Email kamu berhasil didaftarkan, mohon buat password untuk akun kamu dibawah
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-[18px]">
              {/* Password Input */}
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  errorMessage={errors.password}
                  className="w-full"
                  appearance={{
                    containerClassName: "h-12 bg-white border-white hover:border-white focus-within:border-white",
                    inputClassName: "text-neutral-900 placeholder-neutral-500 pr-12",
                  }}
                  icon={{
                    left: (
                      <IconComponent
                        src="/icons/lock.svg"
                        width={24}
                        height={24}
                        className="text-muat-trans-primary-600"
                      />
                    ),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 z-10"
                >
                  <IconComponent
                    src={showPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                    width={24}
                    height={24}
                    className="text-muat-trans-primary-600"
                  />
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative w-full">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  errorMessage={errors.confirmPassword}
                  className="w-full"
                  appearance={{
                    containerClassName: "h-12 bg-white border-white hover:border-white focus-within:border-white",
                    inputClassName: "text-neutral-900 placeholder-neutral-500 pr-12",
                  }}
                  icon={{
                    left: (
                      <IconComponent
                        src="/icons/lock.svg"
                        width={24}
                        height={24}
                        className="text-muat-trans-primary-600"
                      />
                    ),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 z-10"
                >
                  <IconComponent
                    src={showConfirmPassword ? "/icons/eye-open.svg" : "/icons/eye-closed.svg"}
                    width={24}
                    height={24}
                    className="text-muat-trans-primary-600"
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-10 w-[205px] rounded-3xl text-sm font-semibold"
                variant={isFormValid ? "muattrans-primary" : undefined}
              >
                Lanjutkan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}