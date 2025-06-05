import React, { useState } from 'react';
import { 
  FaDatabase, FaInfoCircle, FaUserAlt, FaLock, FaBell, 
  FaPalette, FaThList, FaChevronDown, FaChevronUp, 
  FaCreditCard, FaCheck, FaCog, FaShieldAlt, 
  FaFileExport, FaTrashAlt, FaEnvelope
} from 'react-icons/fa';

const Setting = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('Default');
  const [fontSize, setFontSize] = useState('Medium');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleItemClick = (categoryIndex, itemIndex) => {
    setActiveItem(`${categoryIndex}-${itemIndex}`);
    console.log(`Selected: ${settingsCategories[categoryIndex].title} > ${settingsCategories[categoryIndex].items[itemIndex].label}`);
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    // In a real app, you would apply the theme here
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    // In a real app, you would adjust font sizes here
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const settingsCategories = [
    {
      title: "Account Settings",
      icon: <FaUserAlt className="text-blue-500" />,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      items: [
        { label: "Profile Information", icon: <FaUserAlt className="text-blue-400" /> },
        { label: "Change Password", icon: <FaLock className="text-green-400" /> },
        { label: "Email Preferences", icon: <FaEnvelope className="text-yellow-400" /> },
        { label: "Connected Accounts", icon: <FaCog className="text-purple-400" /> }
      ]
    },
    {
      title: "Privacy & Security",
      icon: <FaShieldAlt className="text-green-500" />,
      color: "bg-green-50",
      borderColor: "border-green-200",
      items: [
        { label: "Privacy Settings", icon: <FaShieldAlt className="text-green-400" /> },
        { label: "Two-Factor Authentication", icon: <FaLock className="text-blue-400" /> },
        { label: "Security Alerts", icon: <FaBell className="text-red-400" /> },
        { label: "Login History", icon: <FaDatabase className="text-indigo-400" /> }
      ]
    },
    {
      title: "Notifications",
      icon: <FaBell className="text-yellow-500" />,
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      items: [
        { label: "Email Notifications", icon: <FaEnvelope className="text-yellow-400" /> },
        { label: "Push Notifications", icon: <FaBell className="text-orange-400" /> },
        { label: "Sound Alerts", icon: <FaBell className="text-red-400" /> },
        { label: "Do Not Disturb", icon: <FaBell className="text-gray-400" /> }
      ]
    },
    {
      title: "Appearance",
      icon: <FaPalette className="text-purple-500" />,
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      items: [
        { label: "Theme", icon: <FaPalette className="text-purple-400" /> },
        { label: "Font Size", icon: <FaPalette className="text-blue-400" /> },
        { label: "Display Density", icon: <FaPalette className="text-green-400" /> },
        { label: "Accent Color", icon: <FaPalette className="text-red-400" /> }
      ]
    },
    {
      title: "Billing",
      icon: <FaCreditCard className="text-red-500" />,
      color: "bg-red-50",
      borderColor: "border-red-200",
      items: [
        { label: "Payment Methods", icon: <FaCreditCard className="text-red-400" /> },
        { label: "Billing History", icon: <FaDatabase className="text-blue-400" /> },
        { label: "Subscription Plan", icon: <FaCreditCard className="text-green-400" /> },
        { label: "Invoices", icon: <FaFileExport className="text-purple-400" /> }
      ]
    },
    {
      title: "Data Management",
      icon: <FaDatabase className="text-indigo-500" />,
      color: "bg-indigo-50",
      borderColor: "border-indigo-200",
      items: [
        { label: "Data Export", icon: <FaFileExport className="text-indigo-400" /> },
        { label: "Data Backup", icon: <FaDatabase className="text-blue-400" /> },
        { label: "Clear Cache", icon: <FaTrashAlt className="text-gray-400" /> },
        { label: "Account Deletion", icon: <FaTrashAlt className="text-red-400" /> }
      ]
    }
  ];

  const themes = ['Default', 'Ocean', 'Forest', 'Sunset', 'Midnight'];
  const fontSizes = ['Small', 'Medium', 'Large', 'Extra Large'];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 text-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <FaThList className="text-2xl text-blue-600" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsCategories.map((category, index) => (
          <div 
            key={index} 
            className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-200 ${category.borderColor} ${category.color}`}
          >
            <div 
              className="p-4 border-b flex items-center justify-between gap-3 cursor-pointer hover:bg-opacity-70 transition-colors"
              onClick={() => toggleCategory(index)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {category.icon}
                </span>
                <h2 className="font-semibold">{category.title}</h2>
              </div>
              {expandedCategory === index ? (
                <FaChevronUp className="text-gray-500" />
              ) : (
                <FaChevronDown className="text-gray-500" />
              )}
            </div>
            
            {expandedCategory === index && (
              <ul className="divide-y divide-gray-200">
                {category.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex} 
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      activeItem === `${index}-${itemIndex}` ? 
                        'bg-blue-50' : 
                        'hover:bg-white hover:bg-opacity-50'
                    }`}
                    onClick={() => handleItemClick(index, itemIndex)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {activeItem === `${index}-${itemIndex}` ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <span className="text-gray-400">→</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Expanded Settings Panel */}
      {activeItem && (
        <div className="mt-8 rounded-lg shadow-sm border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            {settingsCategories[activeItem.split('-')[0]].icon}
            {settingsCategories[activeItem.split('-')[0]].items[activeItem.split('-')[1]].label}
          </h2>
          
          {/* Dynamic content based on selected setting */}
          {activeItem === '3-0' && ( // Theme selection
            <div>
              <p className="mb-4">Choose your preferred theme:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {themes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`p-3 rounded-lg border ${selectedTheme === theme ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className={`h-16 rounded-md mb-2 ${getThemeColor(theme)}`}></div>
                    <span>{theme}</span>
                    {selectedTheme === theme && (
                      <div className="mt-1 text-blue-500">
                        <FaCheck />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeItem === '3-1' && ( // Font size selection
            <div>
              <p className="mb-4">Select your preferred font size:</p>
              <div className="flex flex-wrap gap-3">
                {fontSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={`px-4 py-2 rounded-md ${fontSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 border border-gray-200 rounded-md">
                <p className={`${getFontSizeClass(fontSize)}`}>
                  This is how text will appear at {fontSize.toLowerCase()} size.
                </p>
              </div>
            </div>
          )}

          {activeItem === '2-0' && ( // Email notifications
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-gray-600 text-sm">Receive important updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationsEnabled}
                    onChange={toggleNotifications}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span>System Updates</span>
                  <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span>Security Alerts</span>
                  <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span>Newsletter</span>
                  <input type="checkbox" checked={notificationsEnabled} onChange={toggleNotifications} />
                </div>
              </div>
            </div>
          )}

          {activeItem === '5-2' && ( // Clear cache
            <div className="text-center py-8">
              <FaTrashAlt className="mx-auto text-4xl text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Clear Application Cache</h3>
              <p className="text-gray-600 mb-6">This will remove temporary files and free up storage space.</p>
              <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                Clear Cache Now
              </button>
            </div>
          )}

          {/* Default content for other settings */}
          {!['3-0', '3-1', '2-0', '5-2'].includes(activeItem) && (
            <div className="py-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                {settingsCategories[activeItem.split('-')[0]].items[activeItem.split('-')[1]].icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {settingsCategories[activeItem.split('-')[0]].items[activeItem.split('-')[1]].label}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Configure your {settingsCategories[activeItem.split('-')[0]].items[activeItem.split('-')[1]].label.toLowerCase()} settings here.
              </p>
              <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Configure Settings
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 rounded-lg shadow-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaInfoCircle className="text-lg text-blue-500" />
          <h2 className="font-semibold">About & Help</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="mb-2"><strong>Version:</strong> 1.2.3</p>
            <p className="mb-2"><strong>Last Updated:</strong> June 15, 2023</p>
          </div>
          <div>
            <p className="mb-2">
              <strong>Help Center:</strong>{' '}
              <a href="#" className="text-blue-500 hover:underline">
                View Documentation
              </a>
            </p>
            <p>
              <strong>Contact Support:</strong>{' '}
              <a href="#" className="text-blue-500 hover:underline">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getThemeColor(theme) {
  switch(theme) {
    case 'Ocean': return 'bg-gradient-to-br from-blue-400 to-teal-400';
    case 'Forest': return 'bg-gradient-to-br from-green-500 to-emerald-600';
    case 'Sunset': return 'bg-gradient-to-br from-orange-400 to-pink-500';
    case 'Midnight': return 'bg-gradient-to-br from-indigo-700 to-gray-900';
    default: return 'bg-gradient-to-br from-blue-500 to-purple-500';
  }
}

function getFontSizeClass(size) {
  switch(size) {
    case 'Small': return 'text-sm';
    case 'Medium': return 'text-base';
    case 'Large': return 'text-lg';
    case 'Extra Large': return 'text-xl';
    default: return 'text-base';
  }
}

export default Setting;