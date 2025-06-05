import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

        <title>Terms and Conditions | HealthSync</title>
        <meta name="description" content="HealthSync Medical Services Terms and Conditions" />

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By using HealthSync's medical services, you agree to comply with and be bound by these terms and conditions. 
              If you do not agree, please refrain from using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Medical Services</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>HealthSync provides telemedicine and in-person medical consultation services</li>
              <li>Our services do not replace emergency medical care</li>
              <li>For life-threatening conditions, please contact emergency services immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Privacy Policy</h2>
            <p className="mb-4">
              Your medical information is protected under HIPAA and our <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>. 
              We collect only necessary data to provide quality care.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete medical history</li>
              <li>Do not share login credentials with others</li>
              <li>Report any unauthorized access immediately</li>
              <li>Use services only for lawful purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Limitation of Liability</h2>
            <p className="mb-4">
              HealthSync shall not be liable for any indirect, incidental, or consequential damages arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Use or inability to use our services</li>
              <li>Unauthorized access to your data</li>
              <li>Any third-party services linked from our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Information</h2>
            <p>
              For questions about these terms, contact our support team at <a href="mailto:legal@healthsync.com" className="text-blue-600 hover:underline">legal@healthsync.com</a> 
              or through our <Link to="/contact-us" className="text-blue-600 hover:underline">contact form</Link>.
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              These terms may be updated periodically. Continued use of our services constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;