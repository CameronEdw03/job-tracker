import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

function Jobs() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Get API URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (location.trim()) params.append('location', location.trim());
      
      const queryString = params.toString();
      const url = `${API_BASE_URL}/external-jobs${queryString ? `?${queryString}` : ''}`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setJobs(data.data || []);
      
      // Show message if no jobs found
      if (!data.data || data.data.length === 0) {
        setError('No jobs found matching your criteria. Try different keywords or location.');
      }
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs. Please check your connection and try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount (show some initial results)
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle search on Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchJobs();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600">Job Tracker</h2>
        <nav className="mt-20">
          <ul className="space-y-30">
            <li>
              <button
                className="block w-full text-left p-2 transiton-all duration-300 hover:scale-105 hover:font-semibold cursor-pointer flex items-center text-stone-500"
                onClick={() => navigate('/')}
              >
               <span className='mr-2 text-stone-400'><MdSpaceDashboard size={18}/></span> Dashboard
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left p-2 font-semibold  flex items-center text-blue-500 "
                onClick={() => navigate('/jobs')}
              >
               <span className='mr-2 text-blue-500'><FaSearch size={16} /></span> Job Search
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center ml-20">
             <span className='mr-2 text-blue-500'><FaSearch size={20}/></span>Job Search
          </h1>
          <p className='text-gray-500 ml-20'>Search For Jobs In Your Area</p>
        </header>
        
        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Keyword (e.g. Marketing, Developer, Designer)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-none focus:border-black"
            />
            <input
              type="text"
              placeholder="Location (e.g. Berlin, Remote, Germany)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-none focus:border-black"
            />
          </div>
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-900 transition-all duration-300 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-500">
                🔎 Currently showing <span className="font-semibold">{jobs.length} Europe-based jobs</span> from Arbeitnow
              </p>
              {(keyword || location) && (
                <p className="text-xs text-gray-400 mt-1">
                  Filtered by: {keyword && `"${keyword}"`} {keyword && location && ' + '} {location && `in ${location}`}
                </p>
              )}
            </div>
            <ul className="space-y-4">
              {jobs.map((job, index) => (
                <li
                  key={job.id || index}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                      {job.title}
                    </h3>
                    {job.salary && (
                      <span className="text-green-600 font-medium text-sm ml-4">
                        {job.salary}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-1">{job.company_name}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.job_type}</span>
                    {job.created_at && (
                      <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                    )}
                  </div>

                  {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.slice(0, 5).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {job.tags.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.tags.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {job.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {job.description.substring(0, 150)}...
                    </p>
                  )}
                  
                  <div className="flex gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Job →
                    </a>
                    <button
                      onClick={() => {
                        // You can add functionality to save this job to the user's tracked jobs
                        console.log('Add to tracker:', job);
                        // For now, just show an alert
                        alert('Feature coming soon: Add job to your tracker!');
                      }}
                      className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors duration-200"
                    >
                      + Add to Tracker
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">
              Ready to find your next opportunity?
            </p>
            <p className="text-gray-400">
              Use the search form above to find jobs that match your skills and location.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Jobs;