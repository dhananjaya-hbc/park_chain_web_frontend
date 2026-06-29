"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound, AlertTriangle } from 'lucide-react';
import apiService from '@/lib/api/apiService'; 

export default function ChangePasswordForm() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Toggle visibility states
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation states
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        special: false,
        number: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Run dynamic validation whenever newPassword changes
    useEffect(() => {
        setValidations({
            length: newPassword.length >= 12,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            special: /[^A-Za-z0-9]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
        });
    }, [newPassword]);

    const isNewPasswordValid = Object.values(validations).every(Boolean);
    const doPasswordsMatch = newPassword === confirmPassword && newPassword !== '';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!oldPassword || !isNewPasswordValid || !doPasswordsMatch) {
            return;
        }

        if (oldPassword === newPassword) {
            setMessage({ type: 'error', text: 'New password cannot be the same as the old password' });
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await apiService.put('/auth/admin/change-password', {
                oldPassword: oldPassword,
                newPassword: newPassword
            });
            
            setMessage({ type: 'success', text: response.message || 'Password successfully updated!' });
            
            // Clear form on success
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            // Auto-hide the popup after 4 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 4000);
        } catch (error: any) {
            const errorMsg = error.message || 'Failed to update password. Please check your current password and try again.';
            
            setMessage({ type: 'error', text: errorMsg });
            
            // Auto-hide the error popup after 4 seconds
            setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 relative">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-green-50 text-[#197729] rounded-xl">
                    <KeyRound className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
                    <p className="text-xs text-gray-500">Secure your admin account by updating your credentials</p>
                </div>
            </div>
            
            {message.text && (
                <div className={`fixed bottom-8 right-8 z-[100] p-4 rounded-xl shadow-xl border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
                    message.type === 'error' 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-green-50 text-[#197729] border-green-200'
                }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#197729]" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500" />
                        )}
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Old Password */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Old Password
                        </label>
                        {oldPassword && <CheckCircle2 className="w-4 h-4 text-[#197729]" />}
                    </div>
                    <div className={`flex items-center justify-between border rounded-xl px-4 py-2.5 bg-gray-50/50 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#197729]/15 ${oldPassword ? 'border-[#197729]/50' : 'border-gray-200 focus-within:border-[#197729]'}`}>
                        <input 
                            type={showOldPassword ? "text" : "password"} 
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        New Password
                    </label>
                    <div className={`flex items-center justify-between border rounded-xl px-4 py-2.5 bg-gray-50/50 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#197729]/15 ${newPassword && !isNewPasswordValid ? 'border-red-400' : newPassword && isNewPasswordValid ? 'border-[#197729]/50' : 'border-gray-200 focus-within:border-[#197729]'}`}>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Create new password"
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    
                    {newPassword.length > 0 && (
                        <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className={`w-4 h-4 ${isNewPasswordValid ? 'text-[#197729]' : 'text-amber-500'}`} />
                                <p className={`text-xs font-semibold ${isNewPasswordValid ? 'text-[#197729]' : 'text-amber-700'}`}>
                                    {isNewPasswordValid ? 'Password meets all security requirements' : 'Password must satisfy the rules below:'}
                                </p>
                            </div>
                            
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                <ValidationItem isValid={validations.length} text="At least 12 characters" />
                                <ValidationItem isValid={validations.uppercase} text="One uppercase letter" />
                                <ValidationItem isValid={validations.lowercase} text="One lowercase letter" />
                                <ValidationItem isValid={validations.special} text="One special character" />
                                <ValidationItem isValid={validations.number} text="One digit (0-9)" />
                            </ul>
                        </div>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Confirm New Password
                    </label>
                    <div className={`flex items-center justify-between border rounded-xl px-4 py-2.5 bg-gray-50/50 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#197729]/15 ${confirmPassword && !doPasswordsMatch ? 'border-red-400' : confirmPassword && doPasswordsMatch ? 'border-[#197729]/50' : 'border-gray-200 focus-within:border-[#197729]'}`}>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {confirmPassword && !doPasswordsMatch && (
                        <p className="text-red-500 text-xs font-semibold mt-1">Passwords do not match</p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4 mt-3">
                    <button 
                        type="submit" 
                        disabled={isLoading || !oldPassword || !isNewPasswordValid || !doPasswordsMatch}
                        className={`w-full transition-all duration-200 font-medium rounded-xl py-3 text-sm flex justify-center items-center shadow-md ${
                            isLoading || !oldPassword || !isNewPasswordValid || !doPasswordsMatch 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none' 
                            : 'bg-[#197729] hover:bg-[#145f20] text-white hover:shadow-lg active:scale-[0.99]'
                        }`}
                    >
                        <span>
                            {isLoading ? 'Updating credentials...' : 'Confirm Password Update'}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper component for validation list items
function ValidationItem({ isValid, text }: { isValid: boolean; text: string }) {
    return (
        <li className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${isValid ? 'bg-green-100 border-green-200 text-[#197729]' : 'border-gray-200 text-gray-400'}`}>
                {isValid ? '✓' : '•'}
            </span>
            <span className={`transition-colors duration-300 ${isValid ? 'text-[#197729] font-medium' : 'text-gray-500'}`}>
                {text}
            </span>
        </li>
    );
}