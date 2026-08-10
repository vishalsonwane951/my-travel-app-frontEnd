import React, { useState, useRef } from 'react';
import { FiX, FiEdit, FiUser, FiMail, FiPhone, FiMapPin, FiCamera, FiSave, FiLogOut } from 'react-icons/fi';

const ProfilePopup = ({ user, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [profileImage, setProfileImage] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    onSave({ ...formData, avatar: profileImage });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-indigo-600 p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
          >
            <FiX size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white text-center">My Profile</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-500" size={36} />
                  </div>
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-all shadow-md"
                  >
                    <FiCamera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-4 text-xl font-semibold text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              />
            ) : (
              <h3 className="mt-4 text-xl font-semibold text-gray-800">{formData.name}</h3>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <ProfileField 
              icon={<FiMail />}
              label="Email"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleInputChange}
              type="email"
            />
            <ProfileField 
              icon={<FiPhone />}
              label="Phone"
              name="phone"
              value={formData.phone}
              isEditing={isEditing}
              onChange={handleInputChange}
              type="tel"
            />
            <ProfileField 
              icon={<FiMapPin />}
              label="Address"
              name="address"
              value={formData.address}
              isEditing={isEditing}
              onChange={handleInputChange}
              type="textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      address: user?.address || ''
                    });
                    setProfileImage(user?.avatar || '');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiSave className="mr-2" />
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiEdit className="mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({ icon, label, name, value, isEditing, onChange, type = 'text' }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center text-gray-500 mb-1">
        <span className="mr-2">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows="3"
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
          />
        )
      ) : (
        <p className="text-gray-800 whitespace-pre-line">{value || 'Not provided'}</p>
      )}
    </div>
  );
};

export default ProfilePopup;