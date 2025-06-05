import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';
import { TiArrowBack } from "react-icons/ti";
import { FiCalendar, FiUser } from "react-icons/fi";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authuser = useSelector((state) => state.auth.user);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!authuser || !authuser.email) {
          setError('Please log in to view this blog.');
          navigate('/login');
          return;
        }

        const { data, error } = await auth.supabase
          .from('blog_posts')
          .select('id, title, image, description, full_content, date, created_at')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Blog not found.');

        setBlog(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch blog.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    console.log(blog);
    

    fetchBlog();
  }, [id, authuser, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="max-w-md p-8 bg-white rounded-xl shadow-lg">
        <p className="text-red-500 text-lg mb-6">{error}</p>
        {error.includes('log in') && (
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium shadow-md hover:shadow-teal-200"
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );

  if (!blog) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md p-8 bg-white rounded-xl shadow-lg text-center">
        <p className="text-gray-600 text-lg">Blog not found.</p>
        <button
          onClick={() => navigate('/blogs')}
          className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2"
        >
          <TiArrowBack /> Back to Blogs
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blogs')}
          className="mb-6 px-5 py-2.5 flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-300"
        >
          <TiArrowBack className="text-xl" />
          Back to all articles
        </button>

        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={blog.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white">{blog.title}</h1>
            </div>
          </div>

          {/* Meta Information */}
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-teal-600" />
              <span>{new Date(blog.date || blog.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="p-6 md:p-8">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">{blog.description}</p>
            <div className="prose max-w-none text-gray-700">
              {blog.full_content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-6 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
            >
              <TiArrowBack /> Back to Blogs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;