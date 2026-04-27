import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const rotateX = useTransform(y, [-1, 1], [5, -5]);
  const rotateY = useTransform(x, [-1, 1], [-5, 5]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#0f172a]"
    >
      {/* Hero Section */}
      <motion.section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, perspective: 1000 }}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 flex items-center justify-center bg-[#111827] border border-gray-800 shadow-lg rounded-2xl py-16 px-6 mx-6 my-10"
      >
        <div className="text-center max-w-3xl pointer-events-none">
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Build Your Dream Portfolio
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Create stunning, professional portfolios in minutes. Choose from multiple templates,
            customize every detail, share with a unique link, and export to PDF — all for free.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap pointer-events-auto">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/dashboard"
                  className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-sm transition-colors"
                >
                  Go to Dashboard →
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/register"
                    className="inline-block px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-sm transition-colors"
                  >
                    Get Started Free →
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 rounded-lg bg-[#1f2937] border border-gray-700 text-gray-300 font-medium shadow-sm transition-colors hover:bg-gray-800"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🖌️', title: 'Multiple Templates', desc: 'Choose from Modern, Classic, and Minimal styles that look professional.' },
            { icon: '⚡', title: 'Live Preview', desc: 'See changes in real-time as you edit your portfolio sections.' },
            { icon: '🔗', title: 'Shareable Link', desc: 'Each portfolio gets a unique URL you can share with anyone.' },
            { icon: '📄', title: 'PDF Export', desc: 'Download your portfolio as a beautifully formatted A4 PDF.' },
            { icon: '🛡️', title: 'Secure Auth', desc: 'JWT-based authentication keeps your data safe and private.' },
            { icon: '💼', title: 'Job Portal', desc: 'Find remote jobs in India and get matched based on your skills.' },
          ].map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-[#111827] border border-gray-800 rounded-xl shadow-lg p-6"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-semibold text-white mt-3">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm border-t border-gray-800 bg-[#0f172a]">
        © 2026 Portfolio Creator — Built by Group 11 with 💙
      </footer>
    </motion.div>
  );
};

export default Home;
