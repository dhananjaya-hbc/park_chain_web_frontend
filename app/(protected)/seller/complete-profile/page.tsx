"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/lib/api/apiService";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, ShieldCheck, AlertCircle, Camera } from "lucide-react";

export default function CompleteProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiService.get("/users/profile");
        if (response.data) {
          const profile = response.data;
          
          // Pre-fill logic: 
          // If name starts with "Xaman User", keep it blank
          if (profile.fullName && !profile.fullName.startsWith("Xaman User")) {
            setName(profile.fullName);
          } else {
            setName("");
          }

          // If email ends with "@xaman.local", keep it blank
          if (profile.email && !profile.email.endsWith("@xaman.local")) {
            setEmail(profile.email);
          } else {
            setEmail("");
          }

          if (profile.phoneNumber) {
            setPhone(profile.phoneNumber);
          }

          if (profile.profileImageUrl) {
            setPreviewUrl(profile.profileImageUrl);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateFullName = (nameStr: string) => {
    // Allows letters, spaces, and periods (common in Sri Lankan names with initials)
    return /^[A-Za-z\s.]+$/.test(nameStr);
  };

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const validatePhone = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/[\s()-]/g, "");
    const slPhoneRegex = /^(?:\+94|0094|94|0)?(?:7[0-9]|11|2[1-7]|3[1-8]|4[157]|5[12457]|6[35-7]|81|91)\d{7}$/;
    return slPhoneRegex.test(cleaned);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Full Name is required.");
      return;
    }
    if (!validateFullName(trimmedName)) {
      setError("Please enter a valid Full Name (only letters, spaces, and dots are allowed).");
      return;
    }
    if (!trimmedEmail || !validateEmail(trimmedEmail)) {
      setError("A valid Email Address is required.");
      return;
    }
    if (!trimmedPhone) {
      setError("Phone Number is required.");
      return;
    }
    if (!validatePhone(trimmedPhone)) {
      setError("Please enter a valid Sri Lankan Phone Number (e.g. +94 77 123 4567 or 0771234567).");
      return;
    }
    if (!previewUrl && !profileImage) {
      setError("Profile image is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload profile image to Cloudinary if a new one is selected
      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const imgResponse = await fetch(`${baseUrl}/users/profile/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('park_chain_token') || ''}`,
          },
          body: formData,
        });

        if (!imgResponse.ok) {
          const imgErr = await imgResponse.json().catch(() => ({}));
          throw new Error(imgErr.error || "Failed to upload profile image.");
        }
      }

      // 2. Update user profile information
      await apiService.put("/users/profile", {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      });

      setSuccess("Profile updated successfully! Redirecting...");
      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-[#41ab5d] border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 text-sm animate-pulse">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a4d2e] to-[#41ab5d] rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6">
          <ShieldCheck size={200} />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Step 2: Profile Setup
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">
            Complete Your Seller Profile
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-lg">
            Your identity has been verified via KYC! Now, please provide your contact information to finalize setting up your account.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 leading-tight tracking-[0.5px]">
            Contact Information
          </h2>
          <span className="text-xs text-red-500 font-medium">* All fields required</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Profile Image Uploader */}
            <div className="flex flex-col items-center justify-center pb-4 border-b border-gray-50">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner flex items-center justify-center bg-gray-50 group-hover:border-[#41ab5d]/30 transition-all duration-300">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label htmlFor="profileImageInput" className="absolute bottom-0 right-0 bg-[#41ab5d] text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-[#368a4d] transition-all duration-300 hover:scale-105">
                  <Camera size={16} />
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Upload profile picture (Max 5MB)</p>
            </div>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !phone.trim()}
              className="py-6 px-8 text-sm font-semibold bg-[#41ab5d] hover:bg-[#368a4d] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving Profile...
                </>
              ) : (
                "Save & Continue"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
