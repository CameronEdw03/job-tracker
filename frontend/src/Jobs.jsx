import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";


function Jobs() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8001/external-jobs?keyword=${keyword}&location=${location}`
      );
      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
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
              placeholder="Keyword (e.g. Marketing)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-none focus:border-black"
            />
            <input
              type="text"
              placeholder="Location (e.g. Berlin)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-none focus:border-black"
            />
          </div>
          <button
            onClick={fetchJobs}
            className="mt-4 w-full bg-blue-600 text-white  py-3 rounded-lg hover:bg-blue-900 transition-all duration-300 cursor-pointer"
          >
            Search Jobs
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-500">Loading jobs...</p>
        ) : jobs.length > 0 ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-4">
              🔎 Currently showing <span className="font-semibold">Europe-based jobs</span> from Arbeitnow
            </p>
            <ul className="space-y-4">
              {jobs.map((job, index) => (
                <li
                  key={index}
                  className="bg-white shadow rounded-lg p-4 hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company_name}</p>
                  <p className="text-gray-500 text-sm">
                    {job.location} — {job.job_type}
                  </p>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Job
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-500">
            No jobs found. Try searching above.
          </p>
        )}
      </main>
    </div>
  );
}

export default Jobs;
