import React, { useState, useMemo, useCallback } from 'react';
import { Clock, User, Search, X, Frown, ChevronDown, MoreVertical } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const News = ({
  newsItems = [],
  searchTerm = '',
  onSearchChange = () => {},
  onNewsDelete,
  onNewsEdit
}) => {
  const [sortBy, setSortBy] = useState('newest');
  const [expandedNewsId, setExpandedNewsId] = useState(null);

  const filteredNews = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return newsItems
      .filter(news => 
        news.title.toLowerCase().includes(term) ||
        news.content.toLowerCase().includes(term) ||
        news.authorName.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        const dateA = new Date(a.publishDate).getTime();
        const dateB = new Date(b.publishDate).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [newsItems, searchTerm, sortBy]);

  const toggleExpand = useCallback((id) => {
    setExpandedNewsId(prev => prev === id ? null : id);
  }, []);

  const formatDate = useCallback((dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      callback();
    }
  };

  if (!newsItems.length && !searchTerm) {
    return (
      <div className="text-center py-12">
        <Frown className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No news available</h3>
        <p className="mt-1 text-gray-500">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* News Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <label htmlFor="news-search" className="sr-only">Search news</label>
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
            aria-hidden="true" 
          />
          <input
            id="news-search"
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-8 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85]"
            aria-label="Search news articles"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <label htmlFor="sort-news" className="sr-only">Sort news</label>
            <select
              id="sort-news"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007E85] bg-white text-sm"
              aria-label="Sort news by date"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" 
              aria-hidden="true" 
            />
          </div>
        </div>
      </div>

      {/* News List */}
      {filteredNews.length > 0 ? (
        <ul className="space-y-4">
          {filteredNews.map(news => (
            <li 
              key={news.id} 
              className="border border-gray-200 rounded-lg hover:shadow-sm transition-all"
            >
              <article className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-gray-800 pr-2">
                    {news.title}
                  </h3>
                  
                  {(onNewsDelete || onNewsEdit) && (
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button 
                        className="flex items-center text-gray-400 hover:text-gray-600 p-1"
                        aria-label="News actions menu"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Menu.Button>
                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            {onNewsEdit && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => onNewsEdit(news)}
                                    className={`${
                                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Edit News
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                            {onNewsDelete && (
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => onNewsDelete(news.id)}
                                    className={`${
                                      active ? 'bg-gray-100 text-red-600' : 'text-red-500'
                                    } block w-full text-left px-4 py-2 text-sm`}
                                  >
                                    Delete News
                                  </button>
                                )}
                              </Menu.Item>
                            )}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500 mt-2 gap-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>{news.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={news.publishDate}>
                      {formatDate(news.publishDate)}
                    </time>
                  </div>
                </div>

                <div className="mt-3">
                  <p className={`text-gray-600 whitespace-pre-line ${
                    expandedNewsId === news.id ? '' : 'line-clamp-3'
                  }`}>
                    {news.content}
                  </p>
                  {
                    console.log(news)
                    
                  }
                  {news  && (
                    <button
                      onClick={() => toggleExpand(news.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => toggleExpand(news.id))}
                      className="mt-2 text-sm text-[#007E85] hover:underline focus:outline-none"
                      aria-expanded={expandedNewsId === news.id}
                    >
                      {expandedNewsId === news.id ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {news.tags && news.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {news.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <Frown className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No news found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'No news articles available'}
          </p>
          {searchTerm && (
            <button 
              onClick={handleClearSearch}
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default News;