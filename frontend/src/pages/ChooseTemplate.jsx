import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TemplateModern from '../components/templates/TemplateModern';
import TemplateMinimal from '../components/templates/TemplateMinimal';
import TemplateCreative from '../components/templates/TemplateCreative';
import TemplateDeveloper from '../components/templates/TemplateDeveloper';
import TemplateHeroProfile from '../components/templates/TemplateHeroProfile';
import TemplateSplitCreative from '../components/templates/TemplateSplitCreative';
import TemplateTimeline from '../components/templates/TemplateTimeline';

const mockPortfolio = {
  title: 'John Doe',
  bio: 'Full-stack developer passionate about building web applications. I love working with React, Node.js, and everything in between.',
  contactEmail: 'john@example.com',
  contactPhone: '+91 98765 43210',
  profileImage: '',
  skills: [
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'JavaScript' },
    { name: 'Python' },
    { name: 'MongoDB' },
  ],
  projects: [
    {
      title: 'Portfolio Creator',
      description: 'A web app for creating stunning portfolios with customizable templates.',
      imageUrl: '',
    },
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and admin dashboard.',
      imageUrl: '',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'IIT Delhi',
      year: '2020 – 2024',
    },
  ],
  customizations: {
    fontFamily: 'sans-serif',
    layout: 'top',
    showSkills: true,
    showProjects: true,
    showEducation: true,
    showContact: true,
  },
};

const themes = {
  blue: { primary: '#3b82f6' },
  purple: { primary: '#a855f7' },
  pink: { primary: '#ec4899' },
  green: { primary: '#22c55e' },
  orange: { primary: '#f97316' },
  neutral: { primary: '#64748b' },
  indigo: { primary: '#6366f1' }
};

const templatesList = [
  {
    id: 'modern',
    name: 'Modern Flex',
    themeKey: 'blue',
    description: 'A vibrant card-based layout with clean gradient styles. Best for designers or marketers.',
    color: 'from-blue-500 to-indigo-600',
    wrapperStyle: 'bg-indigo-500/10 border-t-indigo-500',
    Component: TemplateModern,
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    themeKey: 'neutral',
    description: 'Clean, elegant, whitespace-heavy. Perfect for writers or minimalists.',
    color: 'from-gray-700 to-gray-900',
    wrapperStyle: 'bg-gray-100/10 border-t-gray-400',
    Component: TemplateMinimal,
  },
  {
    id: 'creative',
    name: 'Creative Pop',
    themeKey: 'pink',
    description: 'Colorful angled sections that stand out. Great for illustrators or creatives.',
    color: 'from-pink-500 to-rose-600',
    wrapperStyle: 'bg-pink-500/10 border-t-pink-500',
    Component: TemplateCreative,
  },
  {
    id: 'developer',
    name: 'Dev Terminal',
    themeKey: 'green',
    description: 'Dark-themed Github/IDE aesthetic. Built for software engineers.',
    color: 'from-emerald-500 to-teal-600',
    wrapperStyle: 'bg-green-500/10 border-t-green-500',
    Component: TemplateDeveloper,
  },
  {
    id: 'hero-profile',
    name: 'Hero Profile',
    themeKey: 'purple',
    description: 'Full-width banner with overlapping profile image. Bold, Canva-inspired hero layout.',
    color: 'from-amber-400 to-orange-500',
    wrapperStyle: 'bg-purple-500/10 border-t-purple-500',
    Component: TemplateHeroProfile,
  },
  {
    id: 'split-creative',
    name: 'Split Creative',
    themeKey: 'indigo',
    description: 'Strong two-panel split layout with colored sidebar and white content area.',
    color: 'from-violet-500 to-purple-600',
    wrapperStyle: 'bg-blue-500/10 border-t-blue-500',
    Component: TemplateSplitCreative,
  },
  {
    id: 'timeline',
    name: 'Timeline Portfolio',
    themeKey: 'blue',
    description: 'Vertical timeline layout with sections as timeline blocks. Minimal and modern.',
    color: 'from-sky-400 to-cyan-500',
    wrapperStyle: 'bg-gray-300/10 border-t-gray-300',
    Component: TemplateTimeline,
  },
];

const ChooseTemplate = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleSelect = () => {
    if (!selected) return;
    navigate(`/builder?template=${selected}`);
  };

  const openPreview = (tpl) => {
    setPreviewTemplate(tpl);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const useTemplate = (templateId) => {
    navigate(`/builder?template=${templateId}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Header Card */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-800 p-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">Choose Your Portfolio Template</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Pick from 7 professionally designed templates. Customize everything later in the builder.
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesList.map((tpl) => (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            key={tpl.id}
            className={`
              relative cursor-pointer rounded-xl p-6 border-x border-b border-t-4 transition-all duration-300 hover:shadow-xl
              ${tpl.wrapperStyle}
              ${selected === tpl.id ? 'ring-2 ring-indigo-500 border-x-transparent border-b-transparent' : 'border-x-gray-800 border-b-gray-800'}
            `}
            onClick={() => setSelected(tpl.id)}
          >
            <div className="mb-4 h-48 rounded-lg overflow-hidden border border-gray-700 bg-white relative">
              <div className="w-[400%] h-[400%] scale-[0.25] origin-top-left overflow-hidden pointer-events-none absolute top-0 left-0">
                <tpl.Component portfolio={{ ...mockPortfolio, template: tpl.id }} theme={themes[tpl.themeKey]} />
              </div>
            </div>
            
            {selected === tpl.id && (
              <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full p-1 shadow-sm z-10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
              </div>
            )}
            
            <h3 className="text-lg font-semibold text-white mb-1">{tpl.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{tpl.description}</p>

            {/* Divider */}
            <div className="border-t border-gray-800 mb-4"></div>

            {/* Preview & Use buttons */}
            <div className="flex gap-2 mt-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview(tpl);
                }}
                className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-300 bg-[#1f2937] hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                👁 Preview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  useTemplate(tpl.id);
                }}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
              >
                Use Template
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center border-t border-gray-800 pt-8">
        <motion.div whileHover={{ scale: selected ? 1.05 : 1 }}>
          <button
            onClick={handleSelect}
            disabled={!selected}
            className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-[#1f2937] disabled:text-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {selected ? 'Continue with Selected Template →' : 'Select a template'}
          </button>
        </motion.div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111827] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-800"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-white">{previewTemplate.name}</h3>
                <p className="text-sm text-gray-400">Template Preview</p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => useTemplate(previewTemplate.id)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Use This Template
                </motion.button>
                <button
                  onClick={closePreview}
                  className="p-2 rounded-lg hover:bg-[#1f2937] text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body — Scrollable Preview */}
            <div className="flex-1 overflow-y-auto bg-gray-900 p-4">
              <div className="border border-gray-700 rounded-xl overflow-hidden bg-white text-gray-900 shadow-sm">
                <previewTemplate.Component portfolio={{ ...mockPortfolio, template: previewTemplate.id }} theme={themes[previewTemplate.themeKey]} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ChooseTemplate;
