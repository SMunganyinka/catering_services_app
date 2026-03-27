import React, { useState, useEffect } from 'react';
import { 
  Camera, Shield, AlertCircle, CheckCircle 
} from 'lucide-react';

interface ProfileSettingsProps {
  user: any; // Replace 'any' with your actual User type if you have one
  onLogout: () => void;
}

type TabName = 'details' | 'security' | 'avatar';

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabName>('details');
  
  // --- STATE ---
  const [message, setMessage] = useState({ type: 'success', text: '' });
  // FIXED: Removed duplicate 'const'
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    business_name: user.business_name || ''
  });

  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const API_URL = "http://127.0.0.1:8000";

  const token = localStorage.getItem("token");

  // --- HANDLERS ---

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'success', text: '' });

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // FIXED: Added 'Authorization' key
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Update local user state (you might pass a setUser prop if you have one)
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.detail || "Update failed" });
      }
    } catch (err) {
        setMessage({ type: 'error', text: "Network error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: 'success', text: '' });

    try {
      const res = await fetch(`${API_URL}/users/me/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await res.json();

      if (res.ok) {
        // FIXED: Removed stray quote in key 'text'
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ old_password: '', new_password: "" });
      } else {
        setMessage({ type: 'error', text: data.detail || "Incorrect old password" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Network error" });
    } finally {
      setIsSaving(false);
    }
  };

 const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    setMessage({ type: 'error', text: 'Please upload an image file.' });
    return;
  }

  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    setMessage({ type: 'error', text: 'File too large. Max 2MB.' });
    return;
  }

  // Create preview
  const objectUrl = URL.createObjectURL(file);
  setAvatarPreview(objectUrl);
  setIsUploading(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_URL}/users/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      setMessage({ type: 'success', text: "Avatar updated!" });
      
      // --- CRITICAL FIX STARTS HERE ---
      // 1. Check if the backend returned a new URL
      if (data.avatar_url) {
        // 2. Update the 'user' object directly.
        // Since 'user' is an object passed by reference from ClientDashboard,
        // updating it here updates it everywhere in the app instantly.
        user.avatar_url = data.avatar_url;
      }
      // --- CRITICAL FIX ENDS HERE ---
      
    } else {
      setMessage({ type: 'error', text: data.detail || "Upload failed" });
      setAvatarPreview(null);
    }
  } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Upload failed" });
  } finally {
    setIsUploading(false);
    // Clear input
    e.target.value = "";
  }
};

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      // FIXED: Corrected parenthesis placement
      const timer = setTimeout(() => setMessage({ type: 'success', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-stone-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800">Profile Settings</h2>
          <button 
            onClick={onLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>

        {message.text && (
          <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
            : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-stone-100">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 border-b-2 border-transparent hover:border-blue-500 font-medium text-sm transition-colors ${
                activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'text-stone-500'
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 border-b-2 border-transparent hover:border-blue-500 font-medium text-sm transition-colors ${
                activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'text-stone-500'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('avatar')}
              className={`pb-4 border-b-2 border-transparent hover:border-blue-500 font-medium text-sm transition-colors ${
                activeTab === 'avatar' ? 'border-blue-500 text-blue-600' : 'text-stone-500'
              }`}
            >
              Profile Picture
            </button>
          </div>
        </div>

        <div className="p-6">
          
          {/* TAB: PROFILE DETAILS */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails}>
              <div className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user.email} 
                    className="w-full px-4 py-3 rounded-lg bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-stone-400 ml-1 mt-1">Contact support to change your email.</p>
                </div>

                {/* Phone */}
                <div>
                  {/* FIXED: Typo 'stuff' -> 'stone' */}
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+250 788 000 000"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                {/* Business Name (Providers Only) - Conditionally Rendered */}
                {user.role === 'PROVIDER' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Business Name</label>
                    <input 
                      type="text" 
                      value={formData.business_name} 
                      onChange={e => setFormData({...formData, business_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3 mb-6">
                  <Shield size={20} className="text-blue-600" />
                  <div>
                    <h3 className="text-blue-900 font-bold text-sm">Update Password</h3>
                    <p className="text-blue-800 text-sm mt-1">
                      Ensure your new password is strong and unique to keep your account secure.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">Current Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter your current password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider ml-1">New Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="New password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          )}

          {/* TAB: AVATAR UPLOAD */}
          {activeTab === 'avatar' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                {/* Avatar Preview */}
                <div className="relative group cursor-pointer w-32 h-32">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar" 
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border-2 border-dashed border-stone-300">
                      <Camera className="text-stone-400" size={24} />
                    </div>
                  )}
                  {/* Hidden Input */}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                
                <div>
                  {/* FIXED: Added missing closing tag </p> */}
                  <p className="text-sm text-stone-600 mb-1">
                    Accepts JPG, PNG. Max size 2MB.
                  </p>
                  {isUploading && (
                      <p className="text-blue-600 text-sm font-medium mt-2">Uploading...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;