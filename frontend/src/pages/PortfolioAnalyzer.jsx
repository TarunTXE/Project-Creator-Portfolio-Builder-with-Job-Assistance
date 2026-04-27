import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const PortfolioAnalyzer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAndAnalyze = async () => {
      try {
        const { data } = await api.getPortfolioById(id);
        setPortfolio(data);
        setAnalysis(analyzePortfolio(data));
      } catch (err) {
        console.error('Failed to fetch portfolio', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [id, user, navigate]);

  const analyzePortfolio = (data) => {
    let score = 0;
    const checks = [];

    // Profile completeness (40 points)
    if (data.title?.trim()) { score += 10; checks.push({ label: 'Title is present', passed: true }); }
    else checks.push({ label: 'Add a portfolio title', passed: false });

    if (data.bio?.trim().length > 20) { score += 10; checks.push({ label: 'Bio is descriptive', passed: true }); }
    else checks.push({ label: 'Add a longer, descriptive bio', passed: false });

    if (data.contactEmail?.trim()) { score += 10; checks.push({ label: 'Contact email is provided', passed: true }); }
    else checks.push({ label: 'Add a contact email', passed: false });

    if (data.profileImage?.trim()) { score += 10; checks.push({ label: 'Profile image is uploaded', passed: true }); }
    else checks.push({ label: 'Upload a profile image', passed: false });

    // Skills (30 points)
    if (data.skills && data.skills.length >= 3) { score += 30; checks.push({ label: 'Has sufficient skills (3+)', passed: true }); }
    else if (data.skills && data.skills.length > 0) { score += 15; checks.push({ label: 'Has some skills (recommend 3+)', passed: true }); }
    else checks.push({ label: 'Add at least 3 skills', passed: false });

    // Projects (30 points)
    if (data.projects && data.projects.length >= 2) { score += 30; checks.push({ label: 'Has multiple projects (2+)', passed: true }); }
    else if (data.projects && data.projects.length === 1) { score += 15; checks.push({ label: 'Has one project (recommend 2+)', passed: true }); }
    else checks.push({ label: 'Add at least 2 projects', passed: false });

    const suggestions = [];

    if (!data.bio || data.bio.trim().length < 50) {
      suggestions.push("Expand your bio to provide more details about your background and passion.");
    }
    
    if (!data.projects || data.projects.length < 2) {
      suggestions.push("Add more projects (recommend at least 2) to showcase your practical experience.");
    }
    
    if (!data.skills || data.skills.length < 5) {
      suggestions.push("Add more skills (recommend at least 5) to highlight your technical expertise.");
    }
    
    const hasGithub = data.githubLink || data.github || (data.socialLinks && data.socialLinks.some(link => link.platform?.toLowerCase() === 'github' || link.url?.toLowerCase().includes('github.com')));
    if (!hasGithub) {
      suggestions.push("Add a GitHub link so recruiters and visitors can view your code.");
    }
    
    if (!data.profileImage || !data.profileImage.trim()) {
      suggestions.push("Upload a professional profile image to make your portfolio more personal.");
    }

    return { score, checks, suggestions };
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!portfolio || !analysis) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0f172a]">
        <p className="text-gray-400">Failed to load portfolio analysis.</p>
      </div>
    );
  }

  const { score, checks, suggestions } = analysis;
  
  let scoreColor = 'text-red-500';
  if (score >= 80) scoreColor = 'text-green-500';
  else if (score >= 50) scoreColor = 'text-yellow-500';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="bg-[#111827] rounded-2xl shadow-xl border border-gray-800 p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Portfolio Analyzer</h1>
        
        <div className="flex flex-col items-center mb-10">
          <div className={`text-6xl font-extrabold ${scoreColor} mb-2`}>
            {score}%
          </div>
          <p className="text-gray-400 font-medium">Overall Completion Score</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2">Analysis Breakdown</h2>
          <ul className="space-y-3">
            {checks.map((check, idx) => (
              <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#0f172a] border border-gray-800">
                {check.passed ? (
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                )}
                <span className={`text-sm ${check.passed ? 'text-gray-300' : 'text-gray-400 font-medium'}`}>
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
            <span className="text-amber-500">⚡</span> Suggestions for Improvement
          </h2>
          {suggestions.length === 0 ? (
            <div className="p-4 rounded-lg bg-green-900/20 border border-green-800 text-green-400 flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="font-medium text-sm">Portfolio looks great! Excellent work.</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#1f2937] border border-gray-700">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span className="text-sm text-gray-300">
                    {suggestion}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <button 
            onClick={() => navigate(`/builder/${id}`)}
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-sm"
          >
            Improve Portfolio
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-lg border border-gray-700 bg-[#1f2937] text-white font-medium hover:bg-gray-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioAnalyzer;
