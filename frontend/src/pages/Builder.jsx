import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { openPdfInNewTab } from '../utils/pdfUtils';
import TemplateModern from '../components/templates/TemplateModern';
import TemplateMinimal from '../components/templates/TemplateMinimal';
import TemplateCreative from '../components/templates/TemplateCreative';
import TemplateDeveloper from '../components/templates/TemplateDeveloper';
import TemplateHeroProfile from '../components/templates/TemplateHeroProfile';
import TemplateSplitCreative from '../components/templates/TemplateSplitCreative';
import TemplateTimeline from '../components/templates/TemplateTimeline';

const PREDEFINED_SKILLS = [
  'React', 'Node.js', 'HTML', 'CSS', 'JavaScript',
  'MongoDB', 'Express', 'Tailwind CSS',
];

// Generate year options dynamically (2000 → current year)
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => (2000 + i).toString());

const emptyData = {
  title: '',
  bio: '',
  template: 'modern',
  contactEmail: '',
  contactPhone: '',
  githubLink: '',
  profileImage: '',
  skills: [],
  projects: [],
  education: [],
  experience: [],
  customizations: {
    primaryColor: '#4f46e5', // indigo-600
    fontFamily: 'sans-serif',
    layout: 'top',
    showSkills: true,
    showProjects: true,
    showEducation: true,
    showExperience: true,
    showContact: true,
  }
};

const Builder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [data, setData] = useState(emptyData);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [tab, setTab] = useState('info'); // info | design | skills | projects | education | preview
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [educationYearErrors, setEducationYearErrors] = useState({});
  const [experienceYearErrors, setExperienceYearErrors] = useState({});
  const [pdfErrors, setPdfErrors] = useState({});

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (id) {
      api.getPortfolioById(id).then(({ data }) => {
        if (!data.customizations) {
          data.customizations = emptyData.customizations;
        }
        setData(data);
      }).catch(console.error);
    } else {
      const sp = new URLSearchParams(location.search);
      const t = sp.get('template');
      if (t) {
        const colors = {
          'modern': '#3b82f6',
          'minimal': '#171717',
          'creative': '#ec4899',
          'developer': '#10b981',
          'hero-profile': '#f59e0b',
          'split-creative': '#7c3aed',
          'timeline': '#0ea5e9'
        };
        const fonts = {
          'modern': 'sans-serif',
          'minimal': 'serif',
          'creative': 'cursive, sans-serif',
          'developer': 'monospace',
          'hero-profile': 'sans-serif',
          'split-creative': 'sans-serif',
          'timeline': 'sans-serif'
        };
        setData(prev => ({ 
          ...prev, 
          template: t,
          customizations: {
            ...prev.customizations,
            primaryColor: colors[t] || '#4f46e5',
            fontFamily: fonts[t] || 'sans-serif'
          }
        }));
      }
    }
  }, [id, user, navigate, location.search]);

  // ─── Helpers ──────────────────────────
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));
  const updateCustomization = (field, value) => setData(prev => ({
    ...prev,
    customizations: { ...prev.customizations, [field]: value }
  }));

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => update(field, reader.result);
    reader.readAsDataURL(file);
  };

  // Skills
  const handleSkillSelect = (value) => {
    if (value === 'Other') {
      setShowCustomInput(true);
      setSelectedSkill('');
      return;
    }
    if (!value) return;
    const isDuplicate = data.skills.some(s => s.name.toLowerCase() === value.toLowerCase());
    if (isDuplicate) return;
    update('skills', [...data.skills, { name: value }]);
    setSelectedSkill('');
  };

  const addCustomSkill = () => {
    if (!customSkill.trim()) return;
    const isDuplicate = data.skills.some(s => s.name.toLowerCase() === customSkill.trim().toLowerCase());
    if (isDuplicate) { setCustomSkill(''); return; }
    update('skills', [...data.skills, { name: customSkill.trim() }]);
    setCustomSkill('');
    setShowCustomInput(false);
  };

  const removeSkill = (i) => update('skills', data.skills.filter((_, idx) => idx !== i));

  // Projects
  const addProject = () => update('projects', [...data.projects, { title: '', description: '', imageUrl: '', pdfUrl: '' }]);
  const updateProject = (i, field, value) => {
    const updated = [...data.projects];
    updated[i] = { ...updated[i], [field]: value };
    update('projects', updated);
  };
  const removeProject = (i) => update('projects', data.projects.filter((_, idx) => idx !== i));

  const handleProjectImage = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateProject(i, 'imageUrl', reader.result);
    reader.readAsDataURL(file);
  };

  const handleProjectPdf = (e, i) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate PDF only
    if (file.type !== 'application/pdf') {
      setPdfErrors(prev => ({ ...prev, [i]: 'Only PDF files are allowed' }));
      e.target.value = '';
      return;
    }
    setPdfErrors(prev => { const n = { ...prev }; delete n[i]; return n; });
    const reader = new FileReader();
    reader.onloadend = () => updateProject(i, 'pdfUrl', reader.result);
    reader.readAsDataURL(file);
  };

  // Education
  const addEducation = () => update('education', [...data.education, { degree: '', institution: '', year: '', startYear: '', endYear: '' }]);
  const updateEducation = (i, field, value) => {
    const updated = [...data.education];
    updated[i] = { ...updated[i], [field]: value };
    update('education', updated);
  };
  const removeEducation = (i) => update('education', data.education.filter((_, idx) => idx !== i));

  // Experience
  const addExperience = () => update('experience', [...data.experience, { title: '', company: '', description: '', startYear: '', endYear: '' }]);
  const updateExperience = (i, field, value) => {
    const updated = [...data.experience];
    updated[i] = { ...updated[i], [field]: value };
    update('experience', updated);
  };
  const removeExperience = (i) => update('experience', data.experience.filter((_, idx) => idx !== i));

  // Phone handler — digits only, validate on blur
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    update('contactPhone', digits);
    if (phoneError) setPhoneError('');
  };

  const handlePhoneBlur = () => {
    const val = data.contactPhone;
    if (!val) {
      setPhoneError('Contact number is required');
    } else if (!/^\d{10}$/.test(val)) {
      setPhoneError('Contact number must be exactly 10 digits');
    } else {
      setPhoneError('');
    }
  };

  // Email handler — validate on blur
  const handleEmailChange = (e) => {
    update('contactEmail', e.target.value);
    if (emailError) setEmailError('');
  };

  const handleEmailBlur = () => {
    const val = data.contactEmail;
    if (!val || !val.trim()) {
      setEmailError('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // Save
  const handleSave = async () => {
    let hasError = false;

    // Validate email (mandatory)
    if (!data.contactEmail || !data.contactEmail.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      setEmailError('Enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Validate phone (mandatory)
    if (!data.contactPhone) {
      setPhoneError('Contact number is required');
      hasError = true;
    } else if (!/^\d{10}$/.test(data.contactPhone)) {
      setPhoneError('Contact number must be exactly 10 digits');
      hasError = true;
    } else {
      setPhoneError('');
    }

    // Validate education year ranges
    const eduErrors = {};
    data.education.forEach((edu, i) => {
      if (edu.startYear && edu.endYear && parseInt(edu.startYear) > parseInt(edu.endYear)) {
        eduErrors[i] = 'End year must be ≥ start year';
        hasError = true;
      }
    });
    setEducationYearErrors(eduErrors);

    // Validate experience year ranges
    const expErrors = {};
    data.experience.forEach((exp, i) => {
      if (exp.startYear && exp.endYear && parseInt(exp.startYear) > parseInt(exp.endYear)) {
        expErrors[i] = 'End year must be ≥ start year';
        hasError = true;
      }
    });
    setExperienceYearErrors(expErrors);

    if (hasError) {
      setError('Please fix the highlighted errors before saving');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');
    
    // Ensure correct payload is sent to backend
    const payload = {
      ...data,
      title: data.title,
      bio: data.bio, // acts as description
      skills: data.skills,
      projects: data.projects,
      profileImage: data.profileImage, // acts as image
    };
    
    console.log('Request Body:', payload);

    try {
      if (id) {
        const res = await api.updatePortfolio(id, payload);
        console.log('Response:', res.data);
        setMessage('Portfolio updated!');
        setData(res.data); // Reload UI with saved data
      } else {
        const res = await api.createPortfolio(payload);
        console.log('Response:', res.data);
        setMessage('Portfolio created!');
        navigate(`/builder/${res.data._id}`, { replace: true });
        setData(res.data); // Reload UI with saved data
      }
    } catch (err) {
      console.error('Save Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error saving');
    } finally {
      setSaving(false);
      setTimeout(() => { setMessage(''); setError(''); }, 3000);
    }
  };

  // ─── Tab content renderers ────────────
  const inputClass =
    'w-full bg-[#1f2937] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-white placeholder-gray-500 shadow-sm';

  const renderInfo = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Portfolio Title</label>
        <input className={inputClass} placeholder="My Awesome Portfolio" value={data.title} onChange={(e) => update('title', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Bio / About</label>
        <textarea className={inputClass + ' min-h-[100px]'} placeholder="Tell the world about yourself..." value={data.bio} onChange={(e) => update('bio', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Contact Email <span className="text-red-400">*</span></label>
        <input
          className={inputClass + (emailError ? ' border-red-500 focus:ring-red-500' : '')}
          type="text"
          placeholder="you@example.com"
          value={data.contactEmail}
          onChange={handleEmailChange}
          onBlur={handleEmailBlur}
        />
        {emailError && <p className="text-red-400 text-xs mt-1">{emailError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Contact Phone <span className="text-red-400">*</span></label>
        <input
          className={inputClass + (phoneError ? ' border-red-500 focus:ring-red-500' : '')}
          type="tel"
          placeholder="1234567890"
          maxLength={10}
          value={data.contactPhone || ''}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
        />
        {phoneError && <p className="text-red-400 text-xs mt-1">{phoneError}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Link</label>
        <input className={inputClass} type="url" placeholder="https://github.com/yourusername" value={data.githubLink || ''} onChange={(e) => update('githubLink', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Profile Photo</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profileImage')} className="text-gray-400 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1f2937] file:text-gray-300 file:cursor-pointer hover:file:bg-gray-700 transition-all" />
        {data.profileImage && <img src={data.profileImage} alt="Profile" className="mt-3 h-20 w-20 rounded-full object-cover border border-gray-700 shadow-sm" />}
      </div>
    </div>
  );

  const renderDesign = () => (
    <div className="space-y-8">
      {/* Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">Change Template</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            {id: 'modern', name: 'Modern'},
            {id: 'minimal', name: 'Minimal'},
            {id: 'creative', name: 'Creative'},
            {id: 'developer', name: 'Developer'},
            {id: 'hero-profile', name: 'Hero Profile'},
            {id: 'split-creative', name: 'Split Creative'},
            {id: 'timeline', name: 'Timeline'}
          ].map(t => (
            <button
              key={t.id}
              onClick={() => update('template', t.id)}
              className={`py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                data.template === t.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#1f2937] border border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Colors & Fonts */}
        <div className="space-y-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">Style Preferences</label>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={data.customizations.primaryColor} 
                onChange={e => updateCustomization('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-gray-700 bg-[#1f2937] p-0.5"
              />
              <span className="text-sm font-mono text-gray-400">{data.customizations.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Font Style</label>
            <select 
              value={data.customizations.fontFamily}
              onChange={e => updateCustomization('fontFamily', e.target.value)}
              className={inputClass}
            >
              <option value="sans-serif">Modern (Sans-serif)</option>
              <option value="serif">Classic (Serif)</option>
              <option value="monospace">Developer (Monospace)</option>
              <option value="cursive, sans-serif">Playful (Cursive)</option>
              <option value="system-ui, -apple-system, sans-serif">System Native</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Layout Focus</label>
            <select 
              value={data.customizations.layout}
              onChange={e => updateCustomization('layout', e.target.value)}
              className={inputClass}
            >
              <option value="top">Top Header / Standard</option>
              <option value="left">Left Sidebar Style</option>
              <option value="right">Right Sidebar Style</option>
            </select>
          </div>
        </div>

        {/* Output sections toggles */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Visible Sections</label>
          {['showSkills', 'showProjects', 'showEducation', 'showExperience', 'showContact'].map((key) => (
            <label key={key} className="flex items-center cursor-pointer gap-3 p-3 rounded-lg border border-gray-800 hover:bg-[#1f2937] transition-colors bg-[#111827] shadow-sm">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={data.customizations[key]}
                  onChange={e => updateCustomization(key, e.target.checked)}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${data.customizations[key] ? 'bg-indigo-600' : 'bg-gray-700'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.customizations[key] ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="text-sm font-medium text-gray-300 capitalize">
                {key.replace('show', '')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkills = () => {
    const availableSkills = PREDEFINED_SKILLS.filter(
      skill => !data.skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
    );

    return (
      <div className="space-y-5">
        {/* Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select a Skill</label>
          <select
            className={inputClass}
            value={selectedSkill}
            onChange={(e) => handleSkillSelect(e.target.value)}
          >
            <option value="">— Choose a skill —</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
            <option value="Other">Other (custom)</option>
          </select>
        </div>

        {/* Custom skill input */}
        {showCustomInput && (
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Enter custom skill"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
            />
            <button
              onClick={addCustomSkill}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-sm whitespace-nowrap"
            >
              Add
            </button>
            <button
              onClick={() => { setShowCustomInput(false); setCustomSkill(''); }}
              className="px-3 py-2 rounded-lg bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-all shadow-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Selected skills chips */}
        <div className="flex flex-wrap gap-2">
          {data.skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1f2937] text-gray-300 text-sm border border-gray-700">
              {s.name}
              <button onClick={() => removeSkill(i)} className="ml-1 text-gray-500 hover:text-red-400 transition-colors">✕</button>
            </span>
          ))}
        </div>
        {data.skills.length === 0 && <p className="text-gray-400 text-sm text-center py-8">No skills added yet. Select from the dropdown above!</p>}
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6">
      {data.projects.map((p, i) => (
        <div key={i} className="bg-[#1f2937] rounded-xl p-6 border border-gray-700 shadow-sm transition-all space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-white">Project {i + 1}</h4>
            <button onClick={() => removeProject(i)} className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors">Remove</button>
          </div>
          <input className={inputClass} placeholder="Project Title" value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} />
          <textarea className={inputClass + ' min-h-[80px]'} placeholder="Description" value={p.description} onChange={(e) => updateProject(i, 'description', e.target.value)} />
          
          {/* Project Image */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">🖼️ Project Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleProjectImage(e, i)} className="text-gray-400 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#111827] file:text-gray-300 file:cursor-pointer hover:file:bg-gray-700 transition-all" />
            {p.imageUrl && <img src={p.imageUrl} alt="project" className="mt-2 rounded-lg max-h-40 object-cover shadow-sm border border-gray-700" />}
          </div>

          {/* Project PDF */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">📄 Project PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handleProjectPdf(e, i)}
              className="text-gray-400 text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#111827] file:text-gray-300 file:cursor-pointer hover:file:bg-gray-700 transition-all"
            />
            {pdfErrors[i] && <p className="text-red-400 text-xs mt-1">{pdfErrors[i]}</p>}
            {p.pdfUrl && (
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] text-gray-300 text-xs border border-gray-700">
                  📄 PDF uploaded
                </span>
                <button
                  type="button"
                  onClick={() => openPdfInNewTab(p.pdfUrl)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-medium transition-colors"
                >
                  Preview PDF
                </button>
                <button
                  type="button"
                  onClick={() => updateProject(i, 'pdfUrl', '')}
                  className="px-2 py-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-900/20 text-xs font-medium transition-colors"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <button onClick={addProject} className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all font-medium bg-[#111827] hover:bg-[#1f2937]">
        + Add Project
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {data.education.map((e, i) => (
        <div key={i} className="bg-[#1f2937] rounded-xl p-6 border border-gray-700 shadow-sm transition-all space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-white">Education {i + 1}</h4>
            <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors">Remove</button>
          </div>
          <input className={inputClass} placeholder="Degree / Course" value={e.degree} onChange={(ev) => updateEducation(i, 'degree', ev.target.value)} />
          <input className={inputClass} placeholder="Institution" value={e.institution} onChange={(ev) => updateEducation(i, 'institution', ev.target.value)} />
          <input className={inputClass} placeholder="Year (e.g. 2020 – 2024)" value={e.year} onChange={(ev) => updateEducation(i, 'year', ev.target.value)} />

          {/* Education Duration — Year Pickers */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">📅 Education Duration</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Start Year</label>
                <select
                  className={inputClass + (educationYearErrors[i] ? ' border-red-500 focus:ring-red-500' : '')}
                  value={e.startYear || ''}
                  onChange={(ev) => {
                    updateEducation(i, 'startYear', ev.target.value);
                    setEducationYearErrors(prev => { const n = { ...prev }; delete n[i]; return n; });
                  }}
                >
                  <option value="">— Select —</option>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">End Year</label>
                <select
                  className={inputClass + (educationYearErrors[i] ? ' border-red-500 focus:ring-red-500' : '')}
                  value={e.endYear || ''}
                  onChange={(ev) => {
                    updateEducation(i, 'endYear', ev.target.value);
                    setEducationYearErrors(prev => { const n = { ...prev }; delete n[i]; return n; });
                  }}
                >
                  <option value="">— Select —</option>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            {educationYearErrors[i] && <p className="text-red-400 text-xs mt-1">{educationYearErrors[i]}</p>}
          </div>
        </div>
      ))}
      <button onClick={addEducation} className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all font-medium bg-[#111827] hover:bg-[#1f2937]">
        + Add Education
      </button>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {data.experience.map((e, i) => (
        <div key={i} className="bg-[#1f2937] rounded-xl p-6 border border-gray-700 shadow-sm transition-all space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-white">Experience {i + 1}</h4>
            <button onClick={() => removeExperience(i)} className="text-red-400 hover:text-red-500 text-sm font-medium transition-colors">Remove</button>
          </div>
          <input className={inputClass} placeholder="Job Title" value={e.title} onChange={(ev) => updateExperience(i, 'title', ev.target.value)} />
          <input className={inputClass} placeholder="Company" value={e.company} onChange={(ev) => updateExperience(i, 'company', ev.target.value)} />
          <textarea className={inputClass + ' min-h-[80px]'} placeholder="Description" value={e.description} onChange={(ev) => updateExperience(i, 'description', ev.target.value)} />

          {/* Experience Duration — Year Pickers */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">📅 Experience (Years)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Start Year</label>
                <select
                  className={inputClass + (experienceYearErrors[i] ? ' border-red-500 focus:ring-red-500' : '')}
                  value={e.startYear || ''}
                  onChange={(ev) => {
                    updateExperience(i, 'startYear', ev.target.value);
                    setExperienceYearErrors(prev => { const n = { ...prev }; delete n[i]; return n; });
                  }}
                >
                  <option value="">— Select —</option>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">End Year</label>
                <select
                  className={inputClass + (experienceYearErrors[i] ? ' border-red-500 focus:ring-red-500' : '')}
                  value={e.endYear || ''}
                  onChange={(ev) => {
                    updateExperience(i, 'endYear', ev.target.value);
                    setExperienceYearErrors(prev => { const n = { ...prev }; delete n[i]; return n; });
                  }}
                >
                  <option value="">— Select —</option>
                  {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            {experienceYearErrors[i] && <p className="text-red-400 text-xs mt-1">{experienceYearErrors[i]}</p>}
          </div>
        </div>
      ))}
      <button onClick={addExperience} className="w-full py-4 rounded-xl border-2 border-dashed border-gray-700 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all font-medium bg-[#111827] hover:bg-[#1f2937]">
        + Add Experience
      </button>
    </div>
  );

  const renderPreview = () => {
    const props = { portfolio: data };
    switch (data.template) {
      case 'minimal': return <TemplateMinimal {...props} />;
      case 'creative': return <TemplateCreative {...props} />;
      case 'developer': return <TemplateDeveloper {...props} />;
      case 'hero-profile': return <TemplateHeroProfile {...props} />;
      case 'split-creative': return <TemplateSplitCreative {...props} />;
      case 'timeline': return <TemplateTimeline {...props} />;
      default: return <TemplateModern {...props} />;
    }
  };

  const tabs = [
    { key: 'info', label: '📝 Info' },
    { key: 'design', label: '🎨 Customize' },
    { key: 'skills', label: '🛠 Skills' },
    { key: 'projects', label: '📂 Projects' },
    { key: 'education', label: '🎓 Education' },
    { key: 'experience', label: '💼 Experience' },
    { key: 'preview', label: '👁 Preview' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-[#111827] p-2 rounded-xl shadow-sm border border-gray-800 justify-center">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-[110px] ${
              tab === t.key 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-transparent text-gray-400 hover:bg-[#1f2937] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#111827] border border-gray-800 shadow-sm rounded-2xl p-6 sm:p-8 min-h-[500px]">
        {tab === 'info' && renderInfo()}
        {tab === 'design' && renderDesign()}
        {tab === 'skills' && renderSkills()}
        {tab === 'projects' && renderProjects()}
        {tab === 'education' && renderEducation()}
        {tab === 'experience' && renderExperience()}
        {tab === 'preview' && (
           <div className="border border-gray-800 rounded-xl overflow-hidden bg-white text-gray-900">
             {renderPreview()}
           </div>
        )}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between bg-[#111827] px-6 py-4 border border-gray-800 rounded-xl shadow-sm sticky bottom-6 z-40">
        {error ? (
          <p className="text-sm font-medium text-red-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> {error}
          </p>
        ) : message ? (
          <p className="text-sm font-medium text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {message}
          </p>
        ) : (
          <p className="text-sm text-gray-400 font-medium">Don't forget to save your changes!</p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleSave}
          disabled={saving}
          className="ml-auto px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm disabled:opacity-50"
        >
          {saving ? '⏳ Saving...' : id ? 'Save Changes' : 'Create & Save'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Builder;
