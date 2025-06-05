import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import auth from '../../supabase/auth';
import Input from '../Input';
import Button from '../Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    topic: '',
    message: '',
    acceptedConditions: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const { firstName, lastName, email, phoneNumber, topic, message, acceptedConditions } = formData;
      if (!firstName || !lastName || !email || !phoneNumber || !topic || !message) {
        throw new Error('Please fill in all fields.');
      }
      if (!acceptedConditions) {
        throw new Error('You must accept the conditions to submit the form.');
      }

      const { data, error } = await auth.supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phoneNumber,
            topic,
            message,
            accepted_conditions: acceptedConditions,
          },
        ])
        .select();

      if (error) throw error;

      setSuccess('Your message has been submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        topic: '',
        message: '',
        acceptedConditions: false,
      });
    } catch (err) {
      setError(err.message || 'Failed to submit the form. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <div className="text-center mb-10">
            <h4 className="text-blue-600 font-semibold text-lg mb-2">Get In Touch</h4>
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Contact HealthSync Medical Support Team
            </h2>
            <p className="text-xl text-gray-600">
              Reach out for medical inquiries or support.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  type="text"
                  label="First Name"
                  placeholder="Enter Your First Name"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Enter Your Last Name"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  type="email"
                  label="Email"
                  placeholder="Enter Your Email"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter Your Phone Number"
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Input
                type="text"
                label="Choose a Topic"
                placeholder="Select One"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Type your Message...."
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <Input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500"
                  id="check"
                  name="acceptedConditions"
                  checked={formData.acceptedConditions}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="check" className="font-medium text-gray-700">
                  I accept the{' '}
                  <Link to="terms" className="text-blue-600 hover:underline">
                    terms and conditions
                  </Link>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Message'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;