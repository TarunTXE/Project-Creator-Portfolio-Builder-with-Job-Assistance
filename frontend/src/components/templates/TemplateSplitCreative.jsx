/**
 * TemplateSplitCreative – Strong split layout: colored left panel with
 * profile info, white right panel with projects. Canva-inspired contrast design.
 */
const TemplateSplitCreative = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#7c3aed';
  const fontFamily = c.fontFamily || 'sans-serif';

  const containerStyle = {
    fontFamily,
    display: 'flex',
    minHeight: '800px',
    borderRadius: '1rem',
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
  };

  // Left panel — colored
  const leftPanelStyle = {
    flex: '0 0 360px',
    background: `linear-gradient(180deg, ${primaryColor}, ${primaryColor}dd)`,
    color: '#ffffff',
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  };

  // Decorative shapes on left panel
  const decoStyle1 = {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    top: '-60px',
    right: '-60px',
  };
  const decoStyle2 = {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.04)',
    bottom: '40px',
    left: '-40px',
  };

  // Right panel — white
  const rightPanelStyle = {
    flex: '1',
    padding: '3rem 2.5rem',
    background: '#ffffff',
    overflowY: 'auto',
  };

  const profileImgStyle = {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '5px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    margin: '0 auto 1.5rem',
    display: 'block',
  };

  const sectionTitleStyle = {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '1.25rem',
    paddingBottom: '0.5rem',
    borderBottom: `3px solid ${primaryColor}`,
    display: 'inline-block',
  };

  return (
    <div style={containerStyle}>
      {/* ── Left Panel ── */}
      <div style={leftPanelStyle}>
        <div style={decoStyle1}></div>
        <div style={decoStyle2}></div>

        {/* Profile */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {p.profileImage ? (
            <img src={p.profileImage} alt={p.title} style={profileImgStyle} />
          ) : (
            <div style={{ ...profileImgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'rgba(255,255,255,0.15)' }}>
              {(p.title || 'U')[0].toUpperCase()}
            </div>
          )}

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.01em' }}>
            {p.title || 'Your Name'}
          </h1>
          <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.5)', margin: '0 auto 1rem' }}></div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: '0 0 2rem' }}>
            {p.bio || 'Creative professional with a passion for design and innovation.'}
          </p>
        </div>

        {/* Contact */}
        {c.showContact !== false && (p.contactEmail || p.contactPhone) && (
          <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontWeight: 600 }}>Contact</h3>
            {p.contactEmail && <p style={{ fontSize: '0.9rem', margin: '0 0 0.4rem', fontWeight: 500 }}>📧 {p.contactEmail}</p>}
            {p.contactPhone && <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>📱 {p.contactPhone}</p>}
          </div>
        )}

        {/* Skills as pill badges */}
        {c.showSkills !== false && p.skills?.length > 0 && (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontWeight: 600 }}>Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {p.skills.map((s, i) => (
                <span key={i} style={{
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {c.showEducation !== false && p.education?.length > 0 && (
          <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', marginBottom: '0.75rem', fontWeight: 600 }}>Education</h3>
            {p.education.map((ed, i) => (
              <div key={i} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '3px solid rgba(255,255,255,0.3)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem' }}>{ed.degree || ed.text}</h4>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(255,255,255,0.7)' }}>{ed.institution}</p>
                <p style={{ fontSize: '0.8rem', margin: '0.2rem 0 0', color: 'rgba(255,255,255,0.5)' }}>{ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right Panel ── */}
      <div style={rightPanelStyle}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>Portfolio</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>A showcase of my latest work and creative projects</p>
        </div>

        {/* Projects */}
        {c.showProjects !== false && p.projects?.length > 0 && (
          <section>
            <h2 style={sectionTitleStyle}>Projects</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {p.projects.map((proj, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1.5rem',
                  background: '#f8fafc',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  alignItems: 'stretch',
                }}>
                  {/* Project Image */}
                  {proj.imageUrl ? (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: '200px', minHeight: '140px', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '200px', minHeight: '140px', flexShrink: 0, background: `linear-gradient(135deg, ${primaryColor}25, ${primaryColor}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: primaryColor + '50' }}>
                      🎨
                    </div>
                  )}
                  {/* Project Info */}
                  <div style={{ padding: '1.25rem 1.25rem 1.25rem 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>{proj.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                    <div style={{ marginTop: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: `${primaryColor}15`, color: primaryColor, borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        View Project →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateSplitCreative;
