/**
 * TemplateModern – A vibrant, gradient-heavy modern portfolio layout.
 * Supports customizations and a card-based aesthetic.
 */
const TemplateModern = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#3b82f6';
  const fontFamily = c.fontFamily || 'sans-serif';

  // Convert base64 data URL to Blob URL for PDF viewing
  const openPdf = (dataUrl) => {
    try {
      const parts = dataUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const raw = atob(parts[1]);
      const arr = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
      window.open(URL.createObjectURL(new Blob([arr], { type: mime })), '_blank');
    } catch { window.open(dataUrl, '_blank'); }
  };
  const isSidebar = c.layout === 'left';
  const isSidebarRight = c.layout === 'right';

  const containerStyle = {
    fontFamily,
    background: '#ffffff',
    color: '#0f172a',
    borderRadius: '1rem',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: isSidebar ? 'row' : isSidebarRight ? 'row-reverse' : 'column',
    minHeight: '800px',
  };

  const heroStyle = {
    background: `linear-gradient(135deg, ${primaryColor}dd, ${primaryColor})`,
    padding: isSidebar || isSidebarRight ? '4rem 2rem' : '4rem 2rem',
    textAlign: 'center',
    color: '#ffffff',
    flex: isSidebar || isSidebarRight ? '0 0 320px' : 'none',
  };

  const contentStyle = {
    padding: '2.5rem 2rem',
    flex: '1',
  };

  return (
    <div style={containerStyle}>
      {/* Hero */}
      <div style={heroStyle}>
        {p.profileImage && (
          <img
            src={p.profileImage}
            alt={p.title}
            style={{ width: '8rem', height: '8rem', borderRadius: '50%', margin: '0 auto 1.5rem', border: '4px solid rgba(255,255,255,0.8)', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
        )}
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{p.title || 'Your Name'}</h1>
        <p style={{ marginTop: '1rem', color: '#f8fafc', fontSize: '1.1rem', lineHeight: 1.5 }}>
          {p.bio || 'Your professional summary and bio goes here…'}
        </p>
        
        {/* Contact info inside Hero if Sidebar */}
        {(isSidebar || isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone || p.githubLink) && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem' }}>
             {p.contactEmail && <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📧 {p.contactEmail}</p>}
             {p.contactPhone && <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>📱 {p.contactPhone}</p>}
             {p.githubLink && <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>🔗 <a href={p.githubLink.startsWith('http') ? p.githubLink : `https://${p.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>GitHub</a></p>}
          </div>
        )}
      </div>

      <div style={contentStyle}>
        {/* Skills */}
        {c.showSkills !== false && p.skills?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: primaryColor, borderBottom: `2px solid ${primaryColor}33`, paddingBottom: '0.5rem' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {p.skills.map((s, i) => (
                <span key={i} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', background: `${primaryColor}1a`, color: primaryColor, fontSize: '0.9rem', fontWeight: 600, border: `1px solid ${primaryColor}40` }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {c.showProjects !== false && p.projects?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: primaryColor, borderBottom: `2px solid ${primaryColor}33`, paddingBottom: '0.5rem' }}>Projects</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {p.projects.map((proj, i) => (
                <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  {proj.imageUrl && (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '12rem', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.1rem' }}>{proj.title}</h3>
                    <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.5 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                    {proj.pdfUrl && (
                      <a href="#" onClick={(e) => { e.preventDefault(); openPdf(proj.pdfUrl); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', padding: '0.4rem 1rem', background: `${primaryColor}15`, color: primaryColor, borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', border: `1px solid ${primaryColor}30`, cursor: 'pointer' }}>
                        📄 View PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {c.showExperience !== false && p.experience?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: primaryColor, borderBottom: `2px solid ${primaryColor}33`, paddingBottom: '0.5rem' }}>Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.experience.map((exp, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.1rem' }}>{exp.title || exp.text}</h3>
                    <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>{exp.company}</p>
                    {exp.description && <div style={{ marginTop: "0.5rem", fontSize: "0.95em", opacity: 0.85, whiteSpace: "pre-wrap" }}>{exp.description}</div>}
                  </div>
                  <span style={{ color: primaryColor, backgroundColor: `${primaryColor}1a`, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>{exp.startYear && exp.endYear ? `${exp.startYear} – ${exp.endYear}` : exp.startYear ? `${exp.startYear} – Present` : exp.years?.length > 0 ? exp.years.join(", ") : ""}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {c.showEducation !== false && p.education?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: primaryColor, borderBottom: `2px solid ${primaryColor}33`, paddingBottom: '0.5rem' }}>Education</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.education.map((ed, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.1rem' }}>{ed.degree || ed.text}</h3>
                    <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>{ed.institution}</p>
                  </div>
                  <span style={{ color: primaryColor, backgroundColor: `${primaryColor}1a`, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700 }}>{ed.startYear && ed.endYear ? `${ed.startYear} – ${ed.endYear}` : ed.startYear ? `${ed.startYear} – Present` : ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact (Top Layout) */}
        {(!isSidebar && !isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone || p.githubLink) && (
          <section style={{ textAlign: 'center', paddingTop: '2rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: primaryColor }}>Contact</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {p.contactEmail && <p style={{ color: '#475569', margin: 0, fontSize: '1rem', fontWeight: 500 }}>📧 {p.contactEmail}</p>}
              {p.contactPhone && <p style={{ color: '#475569', margin: 0, fontSize: '1rem', fontWeight: 500 }}>📱 {p.contactPhone}</p>}
              {p.githubLink && <p style={{ color: '#475569', margin: 0, fontSize: '1rem', fontWeight: 500 }}>🔗 <a href={p.githubLink.startsWith('http') ? p.githubLink : `https://${p.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>GitHub</a></p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateModern;
