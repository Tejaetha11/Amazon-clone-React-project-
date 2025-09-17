// pages/LoginSecurityPage/LoginSecurityPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks";
import { Link } from "react-router-dom";

export const LoginSecurityPage = () => {
  const { user, updateUser, logout } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8000/users/${user.id}`)
        .then(res => res.json())
        .then(profile => {
          setUserProfile(profile);
          setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || ''
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (field) => {
    setSaveStatus('Saving...');
    try {
      const updatedData = { ...userProfile, [field]: formData[field] };
      
      // Update in db.json
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const updated = await response.json();
        setUserProfile(updated);
        await updateUser(updated); // Update auth context
        setIsEditing(prev => ({ ...prev, [field]: false }));
        setSaveStatus('Saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      setSaveStatus('Error saving changes');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleCancel = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: userProfile[field] || ''
    }));
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus('Passwords do not match');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSaveStatus('Password must be at least 6 characters');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setSaveStatus('Updating password...');
    try {
      const updatedData = { ...userProfile, password: passwordData.newPassword };
      
      const response = await fetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        setUserProfile(updatedData);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
        setSaveStatus('Password updated successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      setSaveStatus('Error updating password');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl mb-4">Please sign in to access security settings</h1>
        <Link to="/login" className="bg-yellow-400 px-6 py-2 rounded hover:bg-yellow-500">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Login & security</h1>
        <p className="text-gray-600">Manage your account login information and security settings</p>
      </div>

      {/* Status Messages */}
      {saveStatus && (
        <div className={`mb-4 p-3 rounded ${
          saveStatus.includes('Error') || saveStatus.includes('do not match') || saveStatus.includes('must be') 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : saveStatus.includes('successfully') || saveStatus.includes('Saved')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-blue-100 text-blue-700 border border-blue-300'
        }`}>
          {saveStatus}
        </div>
      )}

      <div className="space-y-6">
        {/* Account & Login Info */}
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Account & Login Info</h2>
          
          {/* Name */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Name</h3>
                {isEditing.name ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('name')}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => handleCancel('name')}
                        className="border border-gray-300 px-4 py-1 rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{userProfile?.name || 'Not provided'}</p>
                )}
              </div>
              {!isEditing.name && (
                <button
                  onClick={() => setIsEditing(prev => ({ ...prev, name: true }))}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                {isEditing.email ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('email')}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => handleCancel('email')}
                        className="border border-gray-300 px-4 py-1 rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{userProfile?.email || 'Not provided'}</p>
                )}
              </div>
              {!isEditing.email && (
                <button
                  onClick={() => setIsEditing(prev => ({ ...prev, email: true }))}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Mobile phone number</h3>
                {isEditing.phone ? (
                  <div className="space-y-3">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave('phone')}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save changes
                      </button>
                      <button
                        onClick={() => handleCancel('phone')}
                        className="border border-gray-300 px-4 py-1 rounded text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">{userProfile?.phone || 'Not provided'}</p>
                )}
              </div>
              {!isEditing.phone && (
                <button
                  onClick={() => setIsEditing(prev => ({ ...prev, phone: true }))}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Password</h3>
                <p className="text-gray-600">••••••••</p>
              </div>
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full max-w-md border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

       
        {/* Sign Out Section */}
        <div className="border rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Sign Out</h2>
          <p className="text-gray-600 mb-4">
            Sign out of your account on this device. You'll need to sign in again to access your account.
          </p>
          <button
            onClick={logout}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
