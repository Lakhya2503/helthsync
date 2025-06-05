import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import auth from '../../supabase/auth';

const CreateBlogPost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    description: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    full_content: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.title || !formData.image || !formData.description || !formData.full_content) {
        throw new Error('All fields are required except date.');
      }

      const { data, error } = await auth.supabase
        .from('blog_posts')
        .insert([formData])
        .select();

      if (error) throw error;
      navigate('/blogs');
    } catch (err) {
      setError(err.message || 'Failed to create blog post. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Create New Post</h2>
          <p className="text-teal-600">Share your medical knowledge with our community</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  placeholder="Enter a compelling title"
                />
              </div>

              {/* Image URL Field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-32 object-cover rounded border border-gray-200"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+URL'}
                    />
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  rows="3"
                  placeholder="Write a brief summary (appears in blog listings)"
                  maxLength="200"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.description.length}/200 characters
                </p>
              </div>

              {/* Date Field */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Date
                </label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  placeholder="May 26, 2025"
                />
              </div>

              {/* Full Content Field */}
              <div>
                <label htmlFor="full_content" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="full_content"
                  name="full_content"
                  value={formData.full_content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all min-h-[200px]"
                  rows="10"
                  placeholder="Write your full article content here (supports Markdown)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${
                    loading
                      ? 'bg-teal-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-teal-200'
                  } flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish Article'
                  )}
                </button>
                <Link
                  to="/blogs"
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all text-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPost;