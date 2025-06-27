import React, { useState } from 'react';
import './StaffRegistrationForm.css';
import companyLogo from './AYA Bank Production.png'; // Replace with your image path

const StaffRegistrationForm = () => {
  const organizations = [
    'AYA Bank PCL',
    'AYA Trust Securities Co., Ltd.',
    'AYA SOMPO Insurance Co., Ltd.',
    'Max Myanmar Holding Co., Ltd.',
    'Max (Myanmar) Construction Co., Ltd.',
    'Max (Myanmar) Hotel Co., Ltd.',
    'Max (Myanmar) Service Co., Ltd.',
    'Max Energy Co., Ltd.',
    'Max Highway Co., Ltd.',
    'Max Well Trading Co., Ltd.',
    'Max (Myanmar) Manufacturing Co., Ltd.',
    'Max Logistics Co., Ltd.',
    'Shwe Yaung Pya Agro Co., Ltd.',
    'Ayeyar Apex Construction Co., Ltd.'
  ];

  const [formData, setFormData] = useState({
    organization: '',
    employeeId: '',
    dateOfJoining: '',
    name: '',
    nrc: '',
    mobileNumber: '',
    ayaPayWallet: '', // New field
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'organization':
        if (!value) error = 'Organization is required';
        break;
      case 'employeeId':
        if (!value) error = 'Employee ID is required';
        else if (!/^[a-zA-Z0-9]{4,20}$/.test(value)) error = 'Invalid Employee ID format';
        break;
      case 'dateOfJoining':
        if (!value) error = 'Date of joining is required';
        else if (new Date(value) > new Date()) error = 'Future date not allowed';
        break;
      case 'name':
        if (!value) error = 'Full name is required';
        else if (value.length < 3) error = 'Name too short';
        break;
      case 'nrc':
        if (!value) error = 'NRC is required';
        else if (!/^[0-9]+\/[a-zA-Z]+\([a-zA-Z]\)[0-9]+$/.test(value)) error = 'Invalid NRC format (e.g., 12/ASN(N)123456)';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile number is required';
        else if (!/^(\+?95|0)?9\d{8,9}$/.test(value)) error = 'Invalid Mobile number (e.g., 09XXXXXXXX)';
        break;
      case 'ayaPayWallet': // New field validation
        if (!value) error = 'AYA Pay Wallet is required';
        else if (!/^(\+?95|0)?9\d{8,9}$/.test(value)) error = 'Invalid AYA Pay wallet number (e.g., 09XXXXXXXX)';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      if (key !== 'email' || formData[key]) {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmissionStatus({ 
        type: 'error', 
        message: 'Please fix the errors in the form' 
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Hidden iframe method
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden-form-target';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const form = document.createElement('form');
    form.action = 'https://script.google.com/macros/s/AKfycbzi5MvwlDZ4vyaeNIYWZp0OEn4ZRjAfvCqj7BvAw9hHs37Ldmch-AzO22HUfwLs3JUneg/exec';
    form.method = 'POST';
    form.target = 'hidden-form-target';
    form.enctype = 'application/x-www-form-urlencoded';
    
    // Add all form fields
    Object.entries(formData).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    
    // Submit and clean up
    document.body.appendChild(form);
    form.submit();
    
    // Show success popup
    setShowSuccessPopup(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        organization: '',
        employeeId: '',
        dateOfJoining: '',
        name: '',
        nrc: '',
        mobileNumber: '',
        ayaPayWallet: '',
        email: ''
      });
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <div className="modern-form-container">
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="popup-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#28a745" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </svg>
              <h3>Registration Successful!</h3>
            </div>
            <div className="popup-body">
              <p>Thank you for registering with AYA Mobile Banking 3.0.</p>
              <p>Your username and password will be sent via SMS within 3 to 5 working days.</p>
            </div>
            <button 
              className="popup-close-btn"
              onClick={() => setShowSuccessPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="modern-form-card">
        <div className="form-header-with-logo">
          <img src={companyLogo} alt="Company Logo" className="company-logo" />
          <div>
            <h1 className="form-main-title">AYA Mobile Banking (3.0) Registration for (Internal) Staffs </h1>
            <p className="form-subtitle">Please complete all required fields</p>
          </div>
        </div>
        
        {/* Status Messages */}
        {submissionStatus?.type === 'error' && (
          <div className="modern-alert error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            {submissionStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-staff-form">
          {/* Existing form fields... */}
          <div className={`modern-form-group ${errors.organization ? 'has-error' : ''}`}>
            <label htmlFor="organization">Organization</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
            >
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org}>{org}</option>
              ))}
            </select>
            {errors.organization && <span className="error-message">{errors.organization}</span>}
          </div>

          <div className={`modern-form-group ${errors.employeeId ? 'has-error' : ''}`}>
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="Enter employee ID"
            />
            {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}
          </div>

          <div className={`modern-form-group ${errors.dateOfJoining ? 'has-error' : ''}`}>
            <label htmlFor="dateOfJoining">Date of Joining</label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
            />
            {errors.dateOfJoining && <span className="error-message">{errors.dateOfJoining}</span>}
          </div>

          <div className={`modern-form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="Enter full name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className={`modern-form-group ${errors.nrc ? 'has-error' : ''}`}>
            <label htmlFor="nrc">NRC Number</label>
            <input
              type="text"
              id="nrc"
              name="nrc"
              value={formData.nrc}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="12/ABC(N)123456"
            />
            {errors.nrc && <span className="error-message">{errors.nrc}</span>}
          </div>
          {/* Mobile Number Field */}
          <div className={`modern-form-group ${errors.mobileNumber ? 'has-error' : ''}`}>
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="09XXXXXXXX"
            />
            {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
          </div>

          {/* New AYA Pay Wallet Field */}
          <div className={`modern-form-group ${errors.ayaPayWallet ? 'has-error' : ''}`}>
            <label htmlFor="ayaPayWallet">AYA Pay Wallet Number</label>
            <input
              type="text"
              id="ayaPayWallet"
              name="ayaPayWallet"
              value={formData.ayaPayWallet}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="09XXXXXXXX"
            />
            {errors.ayaPayWallet && <span className="error-message">{errors.ayaPayWallet}</span>}
          </div>

          {/* Email Field */}
          <div className={`modern-form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email Address (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="modern-form-control"
              placeholder="your.email@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Awareness Message */}
          <div className="awareness-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4361ee" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            <span>You will receive your username and password via SMS within 3 to 5 working days.</span>
          </div>

          <button 
            type="submit" 
            className="modern-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Submitting...
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;