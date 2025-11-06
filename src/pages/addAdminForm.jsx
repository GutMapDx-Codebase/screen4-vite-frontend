import React, { useState } from 'react';
import { Card, Input, Button, Form, message, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Cookies from "js-cookie";
import './css/AddCollectorForm.css'; // Reuse the same CSS

const AddAdminForm = () => {
  const { id } = useParams();
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/getadmin/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }
        const data = await response.json();

        console.log("Fetched admin data:", data);

        if (!data || typeof data !== "object") {
          console.error("Unexpected response format:", data);
          return;
        }

        const { password, ...filteredData } = data;

        setFormData((prev) => ({
          ...prev,
          ...filteredData,
          password: "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const token = Cookies.get("Token");
    // Only admin can access this page
    if (!token || token !== "dskgfsdgfkgsdfkjg35464154845674987dsf@53") {
      navigate("/");
      return;
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      let response;

      if (formData?._id) {
        response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/updateadmin/${formData._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
      } else {
        response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addadmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        message.success(formData?._id ? 'Admin updated successfully!' : 'Admin added successfully!');
        setFormData({ name: '', email: '', password: '' });
        navigate("/admins");
      } else {
        message.error(result.message || `Failed to ${formData?._id ? 'update' : 'add'} admin`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(`An error occurred while ${formData?._id ? 'updating' : 'adding'} admin`);
    }

    setIsLoading(false);
  };

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: formData.name || undefined,
      email: formData.email || undefined,
      password: formData.password || undefined,
    });
  }, [formData, form]);

  useEffect(() => {
    console.log("Updated admin state:", formData);
  }, [formData]);

  return (
    <div className="collector-form-container">
      <div className="collector-form-card">
        {/* Header Section */}
        <div className="collector-form-header">
          <div className="header-back-section">
            <Tooltip title="Back to Admins">
              <button 
                className="back-button"
                onClick={() => navigate('/admins')}
              >
                <span className="back-arrow">←</span>
                Back
              </button>
            </Tooltip>
          </div>
          
          <div className="header-content">
            <div className="header-icon">
              {formData?._id ? '✏️' : '👨‍💼'}
            </div>
            <div className="header-text">
              <h1 className="header-title">
                {formData?._id ? 'Update Admin' : 'Add New Admin'}
              </h1>
              <p className="header-subtitle">
                {formData?._id 
                  ? 'Update admin information and credentials' 
                  : 'Create a new admin account for the system'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <Form 
            layout="vertical" 
            form={form} 
            onFinish={handleSubmit}
            className="modern-form"
          >
            {/* Name Field */}
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter admin name' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input 
                className="modern-input"
                placeholder="Enter admin's full name"
                prefix={<span className="input-icon">👤</span>}
              />
            </Form.Item>

            {/* Email Field */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                className="modern-input"
                placeholder="Enter email address"
                prefix={<span className="input-icon">📧</span>}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password 
                className="modern-input password-input"
                placeholder="Enter secure password"
                prefix={<span className="input-icon">🔒</span>}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="submit-item">
              {!isloading ? (
                <button
                  className="submit-button"
                  type="submit"
                >
                  <span className="button-icon">
                    {formData?._id ? '🔄' : '➕'}
                  </span>
                  {formData?._id ? 'Update Admin' : 'Add Admin'}
                </button>
              ) : (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">
                    {formData?._id ? 'Updating...' : 'Adding Admin...'}
                  </span>
                </div>
              )}
            </Form.Item>
          </Form>
        </div>

        {/* Form Footer */}
        <div className="form-footer">
          <p className="footer-text">
            💡 Ensure all information is accurate before {formData?._id ? 'updating' : 'creating'} the admin account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddAdminForm;

