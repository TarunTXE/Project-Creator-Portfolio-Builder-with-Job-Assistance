/**
 * TemplateMinimal – Clean, simple, lots of whitespace.
 */
const TemplateMinimal = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#475569';
  const fontFamily = c.fontFamily || 'serif';

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
    color: '#171717',
    maxWidth: '850px',
    margin: '0 auto',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: isSidebar ? 'row' : isSidebarRight ? 'row-reverse' : 'column',
    gap: '4rem',
  };

  const headerStyle = {
    flex: isSidebar || isSidebarRight ? '0 0 250px' : 'none',
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100%', padding: '2rem 0' }}>
      <div style={containerStyle}>
        
        {/* Header/Sidebar */}
        <div style={headerStyle}>
          {p.profileImage && (
            <img
              src={p.profileImage}
              alt={p.title}
              style={{ width: '100%', maxWidth: '150px', height: '150px', borderRadius: '0', objectFit: 'cover', marginBottom: '2rem', filter: 'grayscale(100%)' }}
            />
          )}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, margin: '0 0 1rem', color: primaryColor, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{p.title || 'Your Name'}</h1>
          <p style={{ margin: 0, color: '#525252', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 300 }}>{p.bio || 'Minimalist bio here.'}</p>
          
          {(isSidebar || isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone) && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3a3a3', marginBottom: '1rem' }}>Contact</h3>
              {p.contactEmail && <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#525252' }}>{p.contactEmail}</p>}
              {p.contactPhone && <p style={{ margin: 0, fontSize: '0.9rem', color: '#525252' }}>{p.contactPhone}</p>}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: '1' }}>
          
          {/* Projects */}
          {c.showProjects !== false && p.projects?.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#a3a3a3', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Works</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {p.projects.map((proj, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {proj.imageUrl && (
                      <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 400, margin: '0 0 0.5rem', color: primaryColor }}>{proj.title}</h3>
                      <p style={{ color: '#525252', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                    {proj.pdfUrl && (
                      <a href="#" onClick={(e) => { e.preventDefault(); openPdf(proj.pdfUrl); }} style={{ display: 'inline-block', marginTop: '0.75rem', color: primaryColor, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' }}>
                        📄 View PDF
                      </a>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {c.showSkills !== false && p.skills?.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#a3a3a3', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capabilities</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {p.skills.map((s, i) => (
                  <span key={i} style={{ padding: '0.5rem 1rem', background: '#f5f5f5', color: '#171717', fontSize: '0.9rem', fontWeight: 400 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {c.showExperience !== false && p.experience?.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#a3a3a3', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {p.experience.map((exp, i) => (
                  <div key={i}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.25rem', color: primaryColor }}>{exp.title || exp.text}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#737373', fontSize: '0.95rem' }}>
                      <span>{exp.company}</span>
                    {exp.description && <div style={{ marginTop: "0.5rem", fontSize: "0.95em", opacity: 0.85, whiteSpace: "pre-wrap" }}>{exp.description}</div>}
                      <span>{exp.startYear && exp.endYear ? `${exp.startYear} – ${exp.endYear}` : exp.startYear ? `${exp.startYear} – Present` : exp.years?.length > 0 ? exp.years.join(", ") : ""}</span>
                      {exp.description && <p style={{ fontSize: "0.9em", marginTop: "0.5rem", opacity: 0.9 }}>{exp.description}</p>}
                </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {c.showEducation !== false && p.education?.length > 0 && (
            <section style={{ marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#a3a3a3', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Background</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {p.education.map((ed, i) => (
                  <div key={i}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 0.25rem', color: primaryColor }}>{ed.degree || ed.text}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#737373', fontSize: '0.95rem' }}>
                      <span>{ed.institution}</span>
                      <span>{ed.startYear && ed.endYear ? `${ed.startYear} – ${ed.endYear}` : ed.startYear ? `${ed.startYear} – Present` : ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact (Top/Column Layout) */}
          {(!isSidebar && !isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone) && (
            <section style={{ borderTop: '1px solid #e5e5e5', paddingTop: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#a3a3a3', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Get in touch</h2>
              {p.contactEmail && <p style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#171717' }}>{p.contactEmail}</p>}
              {p.contactPhone && <p style={{ fontSize: '1.1rem', margin: 0, color: '#171717' }}>{p.contactPhone}</p>}
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateMinimal;
