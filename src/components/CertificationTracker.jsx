import React, { useState } from 'react';

const CertificationTracker = ({ darkMode, assessmentData, onSaveResults }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    category: '',
    status: 'active',
    description: ''
  });

  // Predefined certification categories
  const certificationCategories = [
    { value: 'cloud', label: 'Cloud Computing', icon: '☁️' },
    { value: 'security', label: 'Cybersecurity', icon: '🔒' },
    { value: 'data', label: 'Data & Analytics', icon: '📊' },
    { value: 'development', label: 'Software Development', icon: '💻' },
    { value: 'project', label: 'Project Management', icon: '📋' },
    { value: 'design', label: 'Design & UX', icon: '🎨' },
    { value: 'marketing', label: 'Digital Marketing', icon: '📱' },
    { value: 'business', label: 'Business Analysis', icon: '💼' },
    { value: 'networking', label: 'Networking', icon: '🌐' },
    { value: 'other', label: 'Other', icon: '📜' }
  ];

  // Popular certifications by category
  const popularCertifications = {
    cloud: [
      'AWS Certified Solutions Architect',
      'Microsoft Azure Fundamentals',
      'Google Cloud Professional',
      'AWS Certified Developer'
    ],
    security: [
      'CISSP',
      'CompTIA Security+',
      'Certified Ethical Hacker (CEH)',
      'CISM'
    ],
    data: [
      'Google Data Analytics Certificate',
      'Microsoft Certified: Data Analyst',
      'Tableau Desktop Specialist',
      'AWS Certified Big Data'
    ],
    development: [
      'Oracle Certified Java Programmer',
      'Microsoft Certified: Azure Developer',
      'Google Associate Android Developer',
      'Certified Kubernetes Administrator'
    ],
    project: [
      'PMP (Project Management Professional)',
      'Certified ScrumMaster (CSM)',
      'PRINCE2 Foundation',
      'Agile Certified Practitioner'
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const certification = {
      id: editingCert ? editingCert.id : Date.now(),
      ...formData,
      addedAt: editingCert ? editingCert.addedAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedCertifications;
    if (editingCert) {
      updatedCertifications = (assessmentData || []).map(cert => 
        cert.id === editingCert.id ? certification : cert
      );
    } else {
      updatedCertifications = [...(assessmentData || []), certification];
    }

    onSaveResults(updatedCertifications);
    resetForm();
  };

  const handleEdit = (certification) => {
    setEditingCert(certification);
    setFormData(certification);
    setShowAddForm(true);
  };

  const handleDelete = (certId) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      const updatedCertifications = (assessmentData || []).filter(cert => cert.id !== certId);
      onSaveResults(updatedCertifications);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      category: '',
      status: 'active',
      description: ''
    });
    setShowAddForm(false);
    setEditingCert(null);
  };

  const getCategoryIcon = (category) => {
    const cat = certificationCategories.find(c => c.value === category);
    return cat ? cat.icon : '📜';
  };

  const getCategoryLabel = (category) => {
    const cat = certificationCategories.find(c => c.value === category);
    return cat ? cat.label : 'Other';
  };

  const getStatusColor = (status, expiryDate) => {
    if (status === 'expired') return 'text-red-500';
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return 'text-red-500';
      if (daysUntilExpiry < 30) return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry < 30) return `Expires in ${daysUntilExpiry} days`;
    if (daysUntilExpiry < 365) return `Expires in ${Math.ceil(daysUntilExpiry / 30)} months`;
    return 'Valid';
  };

  const renderCertificationForm = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {editingCert ? 'Edit Certification' : 'Add New Certification'}
        </h4>
        <button
          onClick={resetForm}
          className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Certification Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Issuing Organization *
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="e.g., Amazon Web Services"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Issue Date *
            </label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select Category</option>
              {certificationCategories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Credential ID
            </label>
            <input
              type="text"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Certification ID or Badge Number"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Credential URL
            </label>
            <input
              type="url"
              name="credentialUrl"
              value={formData.credentialUrl}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Brief description of the certification and skills covered..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className={`px-4 py-2 rounded-md transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {editingCert ? 'Update Certification' : 'Add Certification'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderCertificationList = () => (
    <div className="space-y-4">
      {(assessmentData || []).map(cert => (
        <div 
          key={cert.id}
          className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="text-3xl">{getCategoryIcon(cert.category)}</div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {cert.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getCategoryLabel(cert.category)}
                  </span>
                </div>
                
                <p className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {cert.issuer}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {cert.expiryDate && (
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                      </span>
                      <span className={`ml-2 font-medium ${getStatusColor(cert.status, cert.expiryDate)}`}>
                        ({getExpiryStatus(cert.expiryDate)})
                      </span>
                    </div>
                  )}
                  
                  {cert.credentialId && (
                    <div>
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        ID: {cert.credentialId}
                      </span>
                    </div>
                  )}
                  
                  {cert.credentialUrl && (
                    <div>
                      <a 
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        View Credential
                      </a>
                    </div>
                  )}
                </div>
                
                {cert.description && (
                  <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {cert.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(cert)}
                className={`p-2 rounded transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-blue-400' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                title="Edit certification"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(cert.id)}
                className={`p-2 rounded transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-red-400' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
                title="Delete certification"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
      <div className="text-6xl mb-4">🏆</div>
      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        No Certifications Yet
      </h3>
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Start building your professional credentials by adding your certifications
      </p>
      <button
        onClick={() => setShowAddForm(true)}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Add Your First Certification
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Certification Tracker
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track and showcase your professional certifications
          </p>
        </div>
        
        {!showAddForm && (assessmentData && assessmentData.length > 0) && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Add Certification
          </button>
        )}
      </div>

      {/* Statistics */}
      {assessmentData && assessmentData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {assessmentData.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Certifications
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {assessmentData.filter(cert => cert.status === 'active').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Active
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {assessmentData.filter(cert => {
                if (!cert.expiryDate) return false;
                const expiry = new Date(cert.expiryDate);
                const now = new Date();
                const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                return daysUntilExpiry > 0 && daysUntilExpiry < 90;
              }).length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Expiring Soon
            </div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {new Set(assessmentData.map(cert => cert.category)).size}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Categories
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && renderCertificationForm()}

      {/* Certifications List */}
      {assessmentData && assessmentData.length > 0 ? renderCertificationList() : !showAddForm && renderEmptyState()}
    </div>
  );
};

export default CertificationTracker;
