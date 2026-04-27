import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import TemplateModern from '../components/templates/TemplateModern';
import TemplateMinimal from '../components/templates/TemplateMinimal';
import TemplateCreative from '../components/templates/TemplateCreative';
import TemplateDeveloper from '../components/templates/TemplateDeveloper';
import TemplateHeroProfile from '../components/templates/TemplateHeroProfile';
import TemplateSplitCreative from '../components/templates/TemplateSplitCreative';
import TemplateTimeline from '../components/templates/TemplateTimeline';
import FeedbackSection from '../components/FeedbackSection';
import { motion } from 'framer-motion';

const PublicPortfolio = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const printRef = useRef();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await api.getPortfolioById(id);
        setPortfolio(data);
      } catch (err) {
        setError('Portfolio not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  // PDF export using html2pdf.js
  // Strategy: temporarily disable ALL stylesheets during PDF rendering.
  // Since our templates use only inline styles, the PDF will look correct
  // while avoiding Tailwind v4's oklch() colors that crash html2canvas.
  const [exporting, setExporting] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      // 1. Clone the template content (firstChild avoids the wrapper's Tailwind classes)
      const original = printRef.current.firstChild;
      if (!original) throw new Error('Portfolio content not found');
      
      const clone = original.cloneNode(true);

      // 2. Create a standalone container off-screen
      const container = document.createElement('div');
      // Use all:initial to prevent Tailwind's oklch() colors from inheriting and crashing html2canvas
      container.style.cssText =
        'position:fixed;left:-9999px;top:0;width:800px;background:#fff;color:#000;font-family:sans-serif;all:initial;';
      container.appendChild(clone);
      document.body.appendChild(container);

      // 3. Generate PDF
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${portfolio.title || 'portfolio'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      
      await html2pdf().set(opt).from(container).save();

      // 4. Cleanup
      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center bg-[#111827] rounded-xl shadow-lg border border-gray-800 p-12">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-semibold text-white mb-2">Portfolio Not Found</h2>
          <p className="text-gray-400">The link may be broken or the portfolio was deleted.</p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    const props = { portfolio };
    switch (portfolio.template) {
      case 'minimal': return <TemplateMinimal {...props} />;
      case 'creative': return <TemplateCreative {...props} />;
      case 'developer': return <TemplateDeveloper {...props} />;
      case 'hero-profile': return <TemplateHeroProfile {...props} />;
      case 'split-creative': return <TemplateSplitCreative {...props} />;
      case 'timeline': return <TemplateTimeline {...props} />;
      default: return <TemplateModern {...props} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 space-y-8"
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleShare}
          className="px-4 py-2 rounded-lg bg-[#1f2937] border border-gray-700 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-all shadow-sm flex items-center gap-2"
        >
          🔗 Share
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleExportPDF}
          disabled={exporting}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
          {exporting ? '⏳ Exporting...' : '📄 Export PDF'}
        </motion.button>
      </div>

      {/* Portfolio content (used as PDF target) */}
      <div className="bg-[#111827] rounded-xl shadow-lg border border-gray-800 overflow-hidden" ref={printRef}>
        {renderTemplate()}
      </div>

      {/* Feedback Section */}
      <FeedbackSection portfolioId={id} />
    </motion.div>
  );
};

export default PublicPortfolio;
