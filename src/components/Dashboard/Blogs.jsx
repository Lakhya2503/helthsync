import { Button } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import auth from '../../supabase/auth';

const Blogs = () => {
  const navigate = useNavigate();
  const authuser = useSelector((state) => state.auth.user);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!authuser || !authuser.email) {
          setError('Please log in to view blogs.');
          navigate('/login');
          return;
        }

        const { data, error } = await auth.supabase
          .from('blog_posts')
          .select('id, title, image, description, date, created_at,full_content')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBlogPosts(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch blogs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [authuser, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-50 rounded-[10px]">
      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Medical Insights</h2>
            <p className="text-teal-600">Latest research and health advice from professionals</p>
          </div>
          {authuser && (
            <Button
              className="mt-4 md:mt-0 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-md hover:shadow-teal-200 transition-all duration-300 capitalize text-lg"
              onClick={() => navigate('/create-blog')}
            >
              Write a Blog
            </Button>
          )}
        </div>
        
        {blogPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-600 text-lg mb-4">No blogs found yet.</p>
            {authuser && (
              <Link 
                to="/create-blog" 
                className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300"
              >
                Be the first to write one!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-teal-600 transition-colors duration-300">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-300 group"
                  >
                    Read More
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;