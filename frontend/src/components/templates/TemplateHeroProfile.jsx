/**
 * TemplateHeroProfile – Full-width banner with overlapping profile image,
 * bold name/title, and modern card grid. Canva-inspired hero layout.
 */
const TemplateHeroProfile = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#f59e0b';
  const fontFamily = c.fontFamily || 'sans-serif';

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

  const containerStyle = {
    fontFamily,
    background: '#ffffff',
    color: '#1e293b',
    borderRadius: '1rem',
    overflow: 'hidden',
    minHeight: '800px',
  };

  // Hero banner gradient
  const bannerStyle = {
    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor}88)`,
    height: '220px',
    position: 'relative',
  };

  // Decorative circles on the banner
  const decorCircle = (size, top, left, opacity) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'rgba(255,255,255,' + opacity + ')',
    top,
    left,
  });

  // Profile image overlapping the banner
  const profileWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '-70px',
    position: 'relative',
    zIndex: 2,
  };

  const profileImgStyle = {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '6px solid #ffffff',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    background: '#f1f5f9',
  };

  const nameStyle = {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#0f172a',
    marginTop: '1rem',
    textAlign: 'center',
    letterSpacing: '-0.02em',
  };

  const bioStyle = {
    fontSize: '1.05rem',
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0.75rem auto 0',
    lineHeight: 1.7,
  };

  const sectionTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const accentBar = {
    width: '40px',
    height: '4px',
    borderRadius: '2px',
    background: primaryColor,
  };

  return (
    <div style={containerStyle}>
      {/* Hero Banner */}
      <div style={bannerStyle}>
        <div style={decorCircle('100px', '-20px', '10%', '0.08')}></div>
        <div style={decorCircle('60px', '40px', '75%', '0.1')}></div>
        <div style={decorCircle('150px', '80px', '85%', '0.05')}></div>
        <div style={decorCircle('40px', '130px', '5%', '0.12')}></div>
      </div>

      {/* Profile section overlapping banner */}
      <div style={profileWrapperStyle}>
        {p.profileImage ? (
          <img src={p.profileImage} alt={p.title} style={profileImgStyle} />
        ) : (
          <div style={{ ...profileImgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: primaryColor }}>
            {(p.title || 'U')[0].toUpperCase()}
          </div>
        )}
        <h1 style={nameStyle}>{p.title || 'Your Name'}</h1>
        <p style={bioStyle}>{p.bio || 'A passionate professional ready to make an impact.'}</p>

        {/* Contact pills */}
        {c.showContact !== false && (p.contactEmail || p.contactPhone) && (
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {p.contactEmail && (
              <span style={{ padding: '0.5rem 1.25rem', background: `${primaryColor}15`, color: primaryColor, borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600, border: `1px solid ${primaryColor}30` }}>
                📧 {p.contactEmail}
              </span>
            )}
            {p.contactPhone && (
              <span style={{ padding: '0.5rem 1.25rem', background: `${primaryColor}15`, color: primaryColor, borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 600, border: `1px solid ${primaryColor}30` }}>
                📱 {p.contactPhone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div style={{ padding: '3rem 2.5rem 2.5rem' }}>

        {/* About section — short decorative block */}
        <section style={{ marginBottom: '2.5rem', background: '#f8fafc', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={sectionTitleStyle}>
            <div style={accentBar}></div>
            About Me
          </div>
          <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1rem', margin: 0 }}>
            {p.bio || 'Write a few sentences about who you are and what you do. This template is designed to showcase your personality and professional strengths.'}
          </p>
        </section>

        {/* Skills */}
        {c.showSkills !== false && p.skills?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={sectionTitleStyle}>
              <div style={accentBar}></div>
              Skills & Expertise
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {p.skills.map((s, i) => (
                <span key={i} style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '9999px',
                  background: i % 3 === 0 ? `${primaryColor}20` : i % 3 === 1 ? '#f0fdf4' : '#f0f9ff',
                  color: i % 3 === 0 ? primaryColor : i % 3 === 1 ? '#16a34a' : '#2563eb',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: `1px solid ${i % 3 === 0 ? primaryColor + '30' : i % 3 === 1 ? '#bbf7d0' : '#bfdbfe'}`,
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects — Modern Card Grid */}
        {c.showProjects !== false && p.projects?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={sectionTitleStyle}>
              <div style={accentBar}></div>
              Featured Projects
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {p.projects.map((proj, i) => (
                <div key={i} style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                  {proj.imageUrl ? (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '180px', background: `linear-gradient(135deg, ${primaryColor}30, ${primaryColor}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: primaryColor + '60' }}>
                      📂
                    </div>
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>{proj.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                    {proj.pdfUrl && (
                      <a href="#" onClick={(e) => { e.preventDefault(); openPdf(proj.pdfUrl); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', padding: '0.4rem 1rem', background: primaryColor, color: '#ffffff', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}>
                        📄 View PDF
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {c.showEducation !== false && p.education?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={sectionTitleStyle}>
              <div style={accentBar}></div>
              Education
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.education.map((ed, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.05rem' }}>{ed.degree || ed.text}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>{ed.institution}</p>
                  </div>
                  <span style={{ 
                    color: '#ffffff', 
                    background: primaryColor, 
                    padding: '0.3rem 1rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>{ed.startYear && ed.endYear ? `${ed.startYear} – ${ed.endYear}` : ed.startYear ? `${ed.startYear} – Present` : ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {c.showExperience !== false && p.experience?.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={sectionTitleStyle}>
              <div style={accentBar}></div>
              Experience
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {p.experience.map((exp, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f8fafc',
                  borderRadius: '0.75rem',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #e2e8f0',
                }}>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: '1.05rem' }}>{exp.title || exp.text}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>{exp.company}</p>
                    {exp.description && <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0', whiteSpace: 'pre-wrap' }}>{exp.description}</p>}
                  </div>
                  <span style={{ 
                    color: '#ffffff', 
                    background: primaryColor, 
                    padding: '0.3rem 1rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>{exp.startYear && exp.endYear ? `${exp.startYear} – ${exp.endYear}` : exp.startYear ? `${exp.startYear} – Present` : exp.years?.length > 0 ? exp.years.join(", ") : ""}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateHeroProfile;
