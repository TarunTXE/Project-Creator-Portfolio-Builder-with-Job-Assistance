/**
 * TemplateTimeline – Vertical timeline layout. Sections appear as
 * timeline blocks with a central timeline spine. Minimal, modern, and stylish.
 */
const TemplateTimeline = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#0ea5e9';
  const fontFamily = c.fontFamily || 'sans-serif';

  const containerStyle = {
    fontFamily,
    background: '#fafbfc',
    color: '#1e293b',
    borderRadius: '1rem',
    overflow: 'hidden',
    minHeight: '800px',
  };

  // Header area
  const headerStyle = {
    background: '#ffffff',
    padding: '3.5rem 2rem 2.5rem',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
  };

  const profileImgStyle = {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `4px solid ${primaryColor}`,
    boxShadow: `0 0 0 6px ${primaryColor}20`,
    margin: '0 auto 1.5rem',
    display: 'block',
  };

  // Timeline wrapper
  const timelineWrapperStyle = {
    position: 'relative',
    padding: '3rem 2rem 2rem',
    maxWidth: '700px',
    margin: '0 auto',
  };

  // The central vertical line
  const timelineLineStyle = {
    position: 'absolute',
    left: '28px',
    top: '0',
    bottom: '0',
    width: '3px',
    background: `linear-gradient(to bottom, ${primaryColor}, ${primaryColor}40, transparent)`,
    borderRadius: '2px',
  };

  // Each timeline node
  const timelineNodeStyle = {
    position: 'relative',
    paddingLeft: '55px',
    marginBottom: '2.5rem',
  };

  // The dot on the timeline
  const dotStyle = (isBig) => ({
    position: 'absolute',
    left: isBig ? '17px' : '20px',
    top: '8px',
    width: isBig ? '25px' : '19px',
    height: isBig ? '25px' : '19px',
    borderRadius: '50%',
    background: primaryColor,
    border: '4px solid #fafbfc',
    boxShadow: `0 0 0 3px ${primaryColor}30`,
    zIndex: 2,
  });

  // Section label badge
  const sectionBadgeStyle = {
    display: 'inline-block',
    padding: '0.3rem 1rem',
    borderRadius: '9999px',
    background: `${primaryColor}15`,
    color: primaryColor,
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  };

  // Card style for content
  const cardStyle = {
    background: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  return (
    <div style={containerStyle}>
      {/* ── Header ── */}
      <div style={headerStyle}>
        {p.profileImage ? (
          <img src={p.profileImage} alt={p.title} style={profileImgStyle} />
        ) : (
          <div style={{ ...profileImgStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: `${primaryColor}10`, color: primaryColor }}>
            {(p.title || 'U')[0].toUpperCase()}
          </div>
        )}
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
          {p.title || 'Your Name'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto' }}>
          {p.bio || 'Creative professional telling stories through a timeline.'}
        </p>

        {/* Contact */}
        {c.showContact !== false && (p.contactEmail || p.contactPhone) && (
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            {p.contactEmail && (
              <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: primaryColor }}>✉</span> {p.contactEmail}
              </span>
            )}
            {p.contactPhone && (
              <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: primaryColor }}>✆</span> {p.contactPhone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Timeline ── */}
      <div style={timelineWrapperStyle}>
        <div style={timelineLineStyle}></div>

        {/* Skills Node */}
        {c.showSkills !== false && p.skills?.length > 0 && (
          <div style={timelineNodeStyle}>
            <div style={dotStyle(true)}></div>
            <div style={sectionBadgeStyle}>Skills & Expertise</div>
            <div style={cardStyle}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.skills.map((s, i) => (
                  <span key={i} style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: '9999px',
                    background: i % 2 === 0 ? `${primaryColor}12` : '#f1f5f9',
                    color: i % 2 === 0 ? primaryColor : '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: `1px solid ${i % 2 === 0 ? primaryColor + '25' : '#e2e8f0'}`,
                  }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects — each project is a timeline card */}
        {c.showProjects !== false && p.projects?.length > 0 && (
          <>
            <div style={timelineNodeStyle}>
              <div style={dotStyle(true)}></div>
              <div style={sectionBadgeStyle}>Projects</div>
            </div>
            {p.projects.map((proj, i) => (
              <div key={i} style={timelineNodeStyle}>
                <div style={dotStyle(false)}></div>
                <div style={{
                  ...cardStyle,
                  overflow: 'hidden',
                  padding: 0,
                }}>
                  {proj.imageUrl && (
                    <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  )}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>{proj.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Education timeline */}
        {c.showEducation !== false && p.education?.length > 0 && (
          <>
            <div style={timelineNodeStyle}>
              <div style={dotStyle(true)}></div>
              <div style={sectionBadgeStyle}>Education</div>
            </div>
            {p.education.map((ed, i) => (
              <div key={i} style={timelineNodeStyle}>
                <div style={dotStyle(false)}></div>
                <div style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>{ed.degree || ed.text}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>{ed.institution}</p>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      background: `${primaryColor}15`,
                      color: primaryColor,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>{ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* End dot */}
        <div style={{ position: 'relative', paddingLeft: '55px', paddingBottom: '1rem' }}>
          <div style={{
            position: 'absolute',
            left: '22px',
            top: '4px',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            background: '#e2e8f0',
            border: '4px solid #fafbfc',
            zIndex: 2,
          }}></div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic' }}>— End of timeline —</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateTimeline;
