import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPortfolios();
  }, [user, navigate]);

  const fetchPortfolios = async () => {
    try {
      const { data } = await api.getPortfolios();
      setPortfolios(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Removed window.confirm because browsers sometimes suppress it, causing the button to be unresponsive.
    try {
      console.log(`[Dashboard] Attempting to delete portfolio with ID: ${id}`);
      await api.deletePortfolio(id);
      console.log(`[Dashboard] Successfully deleted portfolio from backend.`);
      setPortfolios((prev) => {
        const updated = prev.filter((p) => p._id !== id);
        console.log(`[Dashboard] UI State updated. Remaining portfolios: ${updated.length}`);
        return updated;
      });
    } catch (err) {
      console.error('[Dashboard] Error deleting portfolio:', err);
      alert(err.response?.data?.message || 'Failed to delete portfolio. Check console for details.');
    }
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/portfolio/${id}`;
    
    const copyFallback = () => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        // Prevent keyboard from showing on mobile
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          alert('Link copied to clipboard!');
        } else {
          window.prompt('Please copy this link manually:', url);
        }
      } catch (err) {
        console.error('Fallback copy failed', err);
        window.prompt('Please copy this link manually:', url);
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => copyFallback());
    } else {
      copyFallback();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Header Card */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, <span className="text-indigo-400">{user?.name}</span>
          </h1>
          <p className="text-gray-400 mt-1">Manage your portfolios</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/choose-template"
            className="inline-flex px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm items-center gap-2"
          >
            <span className="text-xl">+</span> New Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Portfolio Cards */}
      {portfolios.length === 0 ? (
        <div className="text-center py-20 bg-[#111827] rounded-xl shadow-lg border border-gray-800">
          <p className="text-6xl mb-4">📁</p>
          <h3 className="text-lg font-semibold text-white mb-2">No portfolios yet</h3>
          <p className="text-gray-400 mb-6">Create your first portfolio to get started!</p>
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <Link
              to="/choose-template"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm block"
            >
              Create Portfolio
            </Link>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <motion.div
              key={portfolio._id}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-[#111827] rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{portfolio.title}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#1f2937] text-gray-300 capitalize">
                    {portfolio.template}
                  </span>
                </div>
              </div>

              {/* Bio preview */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{portfolio.bio}</p>

              {/* Stats row */}
              <div className="flex gap-4 text-xs text-gray-500 mb-6">
                <span>🛠 {portfolio.skills?.length || 0} skills</span>
                <span>📂 {portfolio.projects?.length || 0} projects</span>
                <span>👁️ {portfolio.views ?? 0} views</span>
              </div>

              <div className="mt-auto">
                {/* Divider */}
                <div className="border-t border-gray-800 mb-4"></div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/builder/${portfolio._id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-[#1f2937] text-gray-300 hover:bg-gray-700 border border-gray-700 text-sm font-medium transition-colors min-w-[70px]"
                >
                  ✏️ Edit
                </Link>
                <Link
                  to={`/analyzer/${portfolio._id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 text-sm font-medium transition-colors min-w-[70px]"
                >
                  📊 Analyze
                </Link>
                <button
                  type="button"
                  onClick={() => handleShare(portfolio._id)}
                  className="flex-1 text-center py-2 rounded-lg bg-[#1f2937] text-gray-300 hover:bg-gray-700 border border-gray-700 text-sm font-medium transition-colors min-w-[70px]"
                >
                  🔗 Share
                </button>
                <Link
                  to={`/portfolio/${portfolio._id}`}
                  className="flex-1 text-center py-2 rounded-lg bg-[#1f2937] text-gray-300 hover:bg-gray-700 border border-gray-700 text-sm font-medium transition-colors min-w-[70px]"
                >
                  👁 View
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(portfolio._id)}
                  className="px-3 py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800 text-sm font-medium transition-colors flex items-center justify-center shrink-0"
                >
                  🗑
                </button>
              </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
