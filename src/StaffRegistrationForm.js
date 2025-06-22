import React, { useState } from 'react';
import './StaffRegistrationForm.css';

const StaffRegistrationForm = () => {
  const organizations = [
    'AYA Trust',
    'AYA Sompo',
    'AMI Life Assurance',
    'Hotel Max',
    'Max Energy',
    'Max Highway',
    'Max Myanmar Construction',
    'Max Cement',
    'Max Well Trading',
    'Max Logistics',
    'Shwe Yaung Pya Agro'
  ];

  const [formData, setFormData] = useState({
    organization: '',
    employeeId: '',
    dateOfJoining: '',
    name: '',
    nrc: '',
    mobileNumber: '',
    email: ''
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Required fields validation
    const requiredFields = {
      organization: 'Please select your organization',
      employeeId: 'Employee ID is required',
      dateOfJoining: 'Date of joining is required',
      name: 'Full name is required',
      nrc: 'NRC number is required',
      mobileNumber: 'Mobile number is required'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        setSubmissionStatus({ type: 'error', message });
        return false;
      }
    }

    // Myanmar mobile number validation
    if (!/^(\+?95|0)?9\d{8,9}$/.test(formData.mobileNumber)) {
      setSubmissionStatus({ 
        type: 'error', 
        message: 'Please enter a valid Myanmar mobile number (e.g., 09XXXXXXXX)' 
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbxAil5cYXOnjJBoWmL0JEz8nYJmjepW-Ssfj7gL5ZjYrKSpmjz5P0w52HYLm8tBAjFG6w/exec';
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Submission failed');
      }

      // Reset form on success
      setFormData({
        organization: '',
        employeeId: '',
        dateOfJoining: '',
        name: '',
        nrc: '',
        mobileNumber: '',
        email: ''
      });

      setSubmissionStatus({ 
        type: 'success', 
        message: 'Registration submitted successfully!' 
      });

    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus({ 
        type: 'error', 
        message: 'Failed to submit. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Mobile 3.0 Staff Registration</h1>
          <p>Please fill in the form to register for Mobile Banking 3.0</p>
        </div>
        
        {/* Status Messages */}
        {submissionStatus?.type === 'success' && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            {submissionStatus.message}
          </div>
        )}
        
        {submissionStatus?.type === 'error' && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            {submissionStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="staff-form">
          <div className="form-group">
            <label htmlFor="organization">Organization *</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Select Organization</option>
              {organizations.map((org, index) => (
                <option key={index} value={org}>{org}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employeeId">Employee ID *</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your employee ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfJoining">Date of Joining *</label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nrc">NRC Number *</label>
            <input
              type="text"
              id="nrc"
              name="nrc"
              value={formData.nrc}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="e.g., 12/ABC(N)123456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="09XXXXXXXX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address (Optional)</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="your.email@example.com"
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Submitting...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;