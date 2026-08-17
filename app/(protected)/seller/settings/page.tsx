"use client";

import React, { useState, useEffect } from "react";
import apiService from "@/lib/api/apiService";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  Copy,
  Check,
  Camera
} from "lucide-react";

export default function SellerSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiService.get("/users/profile");
        if (response.data) {
          const profile = response.data;
          
          if (profile.fullName) {
            setName(profile.fullName);
          }
          if (profile.email) {
            setEmail(profile.email);
          }
          if (profile.phoneNumber) {
            setPhone(profile.phoneNumber);
          }
          if (profile.walletAddress) {
            setWalletAddress(profile.walletAddress);
          }
          if (profile.profileImageUrl) {
            setPreviewUrl(profile.profileImageUrl);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load settings details. Please try again.");
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

  const handleCopyWallet = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type (image formats only)
      const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedImageTypes.includes(file.type)) {
        setError("Only image files (JPG, PNG, JPEG, WEBP) are allowed.");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB.");
        return;
      }

      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const cleanEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Full Name is required.");
      return;
    }
    if (!validateFullName(trimmedName)) {
      setError("Please enter a valid Full Name (only letters, spaces, and dots are allowed).");
      return;
    }
    if (!cleanEmail || !validateEmail(cleanEmail)) {
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

    try {
      setIsSubmitting(true);

      // 1. Upload profile image to Cloudinary if selected
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

      // 2. Update profile details
      await apiService.put("/users/profile", {
        name: trimmedName,
        email: cleanEmail,
        phone: trimmedPhone,
      });

      setSuccess("Settings updated successfully!");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-4 border-[#41ab5d] border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 text-sm animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1a4d2e] to-[#41ab5d] rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6">
          <ShieldCheck size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Account Settings
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-lg">
            Manage your seller profile information.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 tracking-[0.5px]">
            Profile Information
          </h2>
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
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-medium">Upload profile picture (Max 10MB)</p>
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
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50"
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
                  onChange={(e) => {
                    setEmail(e.target.value.replace(/\s/g, ''));
                    if (error) setError("");
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50"
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
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41ab5d]/20 focus:border-[#41ab5d] transition-all disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Connected Web3 Wallet (Like Admin Side) */}
            <div className="border-t border-gray-100 pt-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Connected Web3 Wallet</label>
              <div className="flex items-center gap-2 mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <code className="text-xs font-mono text-gray-700 flex-1 truncate break-all">
                  {walletAddress || "Not available"}
                </code>
                {walletAddress && (
                  <button
                    type="button"
                    onClick={handleCopyWallet}
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200/50 rounded-lg transition-colors flex-shrink-0"
                    title="Copy wallet address"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !phone.trim()}
              className="py-6 px-8 text-sm font-semibold bg-[#41ab5d] hover:bg-[#368a4d] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Saving Changes..." : "Save Profile Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
