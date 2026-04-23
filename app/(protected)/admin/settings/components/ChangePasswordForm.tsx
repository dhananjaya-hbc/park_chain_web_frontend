"use client";
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100 max-w-xl mx-auto mt-8 relative">
            <h2 className="text-xl font-bold text-black mb-6">Change Password</h2>
            
            {message.text && (
                <div className={`fixed bottom-8 right-8 z-[100] p-4 rounded-lg shadow-xl border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
                    message.type === 'error' 
                        ? 'bg-red-50 text-red-500 border-red-200' 
                        : 'bg-green-50 text-[#41ab5d] border-green-200'
                }`}>
                    <div className="flex items-center gap-2">
                        {message.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Old Password */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-black">
                            Old Password
                        </label>
                        {oldPassword && <CheckCircle2 className="w-5 h-5 text-white" fill="#41ab5d" />}
                    </div>
                    <div className={`flex items-center justify-between border-2 rounded-xl px-4 py-2.5 shadow-sm transition-colors ${oldPassword ? 'border-[#41ab5d]' : 'border-gray-200 focus-within:border-gray-400'}`}>
                        <input 
                            type={showOldPassword ? "text" : "password"} 
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="bg-transparent border-none outline-none w-full text-base text-black tracking-wider placeholder:tracking-normal placeholder:text-gray-400"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showOldPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="text-sm font-semibold text-black">
                        New Password
                    </label>
                    <div className={`flex items-center justify-between border-[1.5px] rounded-xl px-4 py-2.5 shadow-sm transition-colors ${newPassword && !isNewPasswordValid ? 'border-[#ff3134]' : newPassword && isNewPasswordValid ? 'border-[#41ab5d]' : 'border-gray-200 focus-within:border-gray-400'}`}>
                        <input 
                            type={showNewPassword ? "text" : "password"} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Create new password"
                            className="bg-transparent border-none outline-none w-full text-sm text-black placeholder:text-gray-400"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    
                    {newPassword.length > 0 && (
                        <div className="flex flex-col gap-3 mt-1">
                            <p className={`${isNewPasswordValid ? 'text-[#41ab5d]' : 'text-[#ff3134]'} text-xs font-semibold transition-colors`}>
                                {isNewPasswordValid ? 'Password meets all security requirements' : 'Please add all necessary characters to create safe password'}
                            </p>
                            
                            <ul className="flex flex-col gap-2">
                                <ValidationItem isValid={validations.length} text="Minimum characters 12" />
                                <ValidationItem isValid={validations.uppercase} text="One uppercase character" />
                                <ValidationItem isValid={validations.lowercase} text="One lowercase character" />
                                <ValidationItem isValid={validations.special} text="One special character" />
                                <ValidationItem isValid={validations.number} text="One number" />
                            </ul>
                        </div>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="text-sm font-semibold text-black">
                        Confirm New Password
                    </label>
                    <div className={`flex items-center justify-between border-2 rounded-xl px-4 py-2.5 shadow-sm transition-colors ${confirmPassword && !doPasswordsMatch ? 'border-[#ff3134]' : confirmPassword && doPasswordsMatch ? 'border-[#41ab5d]' : 'border-gray-200 focus-within:border-gray-400'}`}>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="bg-transparent border-none outline-none w-full text-sm text-black placeholder:text-gray-400"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {confirmPassword && !doPasswordsMatch && (
                        <p className="text-[#ff3134] text-xs font-semibold mt-1">Passwords do not match</p>
                    )}
                </div>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <button 
                        type="submit" 
                        disabled={isLoading || !oldPassword || !isNewPasswordValid || !doPasswordsMatch}
                        className={`w-full transition-colors border rounded-xl py-3 shadow-sm flex justify-center items-center ${
                            isLoading || !oldPassword || !isNewPasswordValid || !doPasswordsMatch 
                            ? 'bg-gray-300 border-gray-300 cursor-not-allowed' 
                            : 'bg-[#41ab5d] hover:bg-[#389a51] border-[#c7e9c0]'
                        }`}
                    >
                        <span className="text-base font-semibold text-white">
                            {isLoading ? 'Updating...' : 'Confirm New Password'}
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
        <li className="flex items-center gap-2.5">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isValid ? 'bg-[#41ab5d]' : 'bg-gray-400'}`} />
            <span className={`text-xs font-semibold transition-colors ${isValid ? 'text-[#41ab5d]' : 'text-gray-500'}`}>
                {text}
            </span>
        </li>
    );
}