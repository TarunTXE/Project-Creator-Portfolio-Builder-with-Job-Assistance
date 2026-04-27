import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { motion } from 'framer-motion';

const JobPortal = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('India');
  
  // State to hold the current applied filters
  const [appliedKeyword, setAppliedKeyword] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [appliedKeyword, selectedLocation]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (appliedKeyword) {
        params.keyword = appliedKeyword;
      }
      params.location = selectedLocation;
      const { data } = await api.getJobs(params);
      console.log('Fetched jobs data:', data); // Debug job data
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedKeyword(searchInput);
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedLocation === 'Global') return true;
    if (!job?.location) return false;
    
    const loc = String(job.location).toLowerCase();
    const sel = String(selectedLocation).toLowerCase();

    if (sel === 'usa') {
      return loc.includes('usa') || loc.includes('united states');
    }
    if (sel === 'uk') {
      return loc.includes('uk') || loc.includes('united kingdom');
    }
    
    return loc.includes(sel);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Header Card */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            💼 Job Portal
          </h1>
          <p className="text-gray-400 mt-1">
            Find your next opportunity — {filteredJobs.length} jobs found
          </p>
          <p className="text-indigo-400 text-sm mt-1 font-medium">
            📍 Showing jobs in {selectedLocation}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white bg-[#1f2937] shadow-sm"
          >
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Canada">Canada</option>
            <option value="Remote">Remote</option>
            <option value="Global">Global</option>
          </select>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white bg-[#1f2937] w-full shadow-sm placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-sm"
            >
              Search
            </motion.button>
          </form>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Fetching latest jobs...</p>
          </div>
        </div>
      ) : error ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center bg-[#111827] rounded-xl shadow-lg border border-red-900/50 p-12">
            <p className="text-6xl mb-4">😕</p>
            <h2 className="text-xl font-semibold text-white mb-2">Oops!</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      ) : (
        /* Jobs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-[#111827] rounded-xl shadow-lg border border-gray-800">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-400">Try changing your search keywords or location filter.</p>
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                key={`job-${index}`}
                className="bg-[#111827] shadow-lg rounded-xl p-6 border border-gray-800 flex flex-col h-full"
              >
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{job.title}</h3>
                  <p className="text-gray-400 font-medium mb-2 text-sm">🏢 {job.company}</p>
                  <p className="text-gray-500 text-sm mb-4 flex items-start gap-2">
                    <span>📍</span>
                    <span className="line-clamp-2">{job.location}</span>
                  </p>
                </div>

                <div className="border-t border-gray-800 my-4"></div>

                <motion.div whileHover={{ scale: 1.05 }}>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    Apply Now
                  </a>
                </motion.div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default JobPortal;
