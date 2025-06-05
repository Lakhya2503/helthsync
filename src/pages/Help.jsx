import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiHome } from 'react-icons/fi';

const Help = () => {
  const [expandedSections, setExpandedSections] = useState({
    visits: true,
    patientList: false,
    consultation: false,
    calendar: false,
    events: false,
    news: false,
    blogs: false,
    contact: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Help Center</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <FiHome /> Back to Home
          </Link>
        </div>
      </header>

      {/* Help Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Introduction */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-6 border-l-4 border-indigo-500">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Welcome to the Help Center</h3>
          <p className="text-gray-600">
            This help page provides guidance on using the features of your medical dashboard. 
            Click on each section below to expand it and learn more about specific features.
          </p>
        </section>

        {/* Visits for Today */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('visits')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Visits for Today</h3>
            {expandedSections.visits ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.visits && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The "Visits for Today" section shows the total number of patient visits for the current day (May 26, 2025). 
                It includes a breakdown of new and old patients, along with their respective trends.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5">
                <li>The pie chart visually represents the distribution of new and old patients.</li>
                <li><span className="font-medium text-green-600">New Patients</span>: 40 (51% increase).</li>
                <li><span className="font-medium text-blue-600">Old Patients</span>: 64 (20% decrease).</li>
              </ul>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700 font-medium">Tip:</p>
                <p className="text-blue-600">Hover over the chart segments to see exact numbers and percentages.</p>
              </div>
            </div>
          )}
        </section>

        {/* Patient List */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('patientList')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Patient List</h3>
            {expandedSections.patientList ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.patientList && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Patient List displays your scheduled patients for the day, including their names, visit types, and appointment times.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5">
                <li>Each entry shows the patient's initials, name, visit type (e.g., Weekly visit, Routine Checkup), and time.</li>
                <li>Use this section to quickly review your schedule.</li>
                <li>Click on a patient's name to view their full details in the Consultation section.</li>
              </ul>
              <div className="mt-4 flex gap-4">
                <div className="flex-1 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-purple-700 font-medium">Quick Action:</p>
                  <p className="text-purple-600">Double-click a patient to start a consultation immediately.</p>
                </div>
                <div className="flex-1 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-yellow-700 font-medium">Filter:</p>
                  <p className="text-yellow-600">Use the search bar to find specific patients quickly.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Consultation */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('consultation')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Consultation</h3>
            {expandedSections.consultation ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.consultation && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Consultation section provides details about a selected patient's medical history, symptoms, observations, and prescriptions.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-700 mb-2">Patient Information</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>View patient details like name, age, and gender</li>
                    <li>Access contact information and medical history</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-2">Medical Data</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>Check symptoms and last checked date</li>
                    <li>Review observations and notes from previous visits</li>
                  </ul>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-medium text-red-700 mb-2">Prescriptions</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>Review prescribed medications and their dosages</li>
                  <li>Check start and end dates for each medication</li>
                  <li>View special instructions for each prescription</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Calendar */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('calendar')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Calendar</h3>
            {expandedSections.calendar ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.calendar && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Calendar helps you manage your appointments and schedule.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5 mb-4">
                <li>Navigate between months using the arrow buttons.</li>
                <li>Days with appointments have a red dot underneath.</li>
                <li>Click on a day to view its appointments at the bottom (e.g., on May 26, 2025, you have a "Patient Checkup" at 9:15 AM).</li>
                <li>Today (May 26, 2025) is highlighted in blue.</li>
              </ul>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-indigo-700 font-medium">Pro Tip:</p>
                <p className="text-indigo-600">
                  Drag and drop appointments to reschedule them. Right-click on a day to add a new appointment.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Events */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('events')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Upcoming Events</h3>
            {expandedSections.events ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.events && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Upcoming Events section lists your scheduled events, such as meetings or conferences.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5">
                <li>Each event includes the title, date, and time.</li>
                <li>Events are color-coded by type (conferences, meetings, etc.).</li>
                <li>Click "View All" to see more events (if available).</li>
                <li>Click on an event to see detailed information or to edit it.</li>
              </ul>
            </div>
          )}
        </section>

        {/* News */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('news')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Daily Read (News)</h3>
            {expandedSections.news ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.news && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Daily Read section provides the latest news articles relevant to your medical practice.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5">
                <li>Each news item includes a title and an image.</li>
                <li>Stay updated with medical advancements and insights.</li>
                <li>Click on a news item to read the full article in a new tab.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Blogs */}
        <section className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('blogs')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Blogs</h3>
            {expandedSections.blogs ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.blogs && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-4">
                The Blogs page offers in-depth articles on medical topics.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 pl-5">
                <li>Access the Blogs page from the header link on the Dashboard.</li>
                <li>Each blog post includes a title, image, date, and description.</li>
                <li>Click "Read More" to view the full article (coming soon).</li>
                <li>Use the category filters to find articles on specific topics.</li>
              </ul>
            </div>
          )}
        </section>

        {/* Contact Support */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-indigo-50"
            onClick={() => toggleSection('contact')}
          >
            <h3 className="text-lg font-semibold text-indigo-700">Contact Support</h3>
            {expandedSections.contact ? <FiChevronUp className="text-indigo-700" /> : <FiChevronDown className="text-indigo-700" />}
          </div>
          {expandedSections.contact && (
            <div className="p-6 pt-0">
              <p className="text-gray-600 mb-6">
                Our support team is available to help you with any questions or issues you may encounter.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FiMail className="text-blue-600 text-xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Email Support</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <a 
                    href="mailto:support@medicaldashboard.com" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Email Us
                  </a>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FiPhone className="text-green-600 text-xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-800">Phone Support</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Call us for immediate assistance during business hours.
                  </p>
                  <a 
                    href="tel:+18005551234" 
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Call Now
                  </a>
                </div>
              </div>
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="font-medium text-yellow-800 mb-2">Business Hours:</p>
                <p className="text-yellow-700">Monday - Friday: 8:00 AM - 6:00 PM (EST)</p>
                <p className="text-yellow-700">Saturday: 9:00 AM - 2:00 PM (EST)</p>
                <p className="text-yellow-700">Sunday: Closed</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Help;