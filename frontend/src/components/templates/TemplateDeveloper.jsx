/**
 * TemplateDeveloper – GitHub/IDE style dark theme.
 */
const TemplateDeveloper = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#10b981'; // Default emerald
  const fontFamily = c.fontFamily || 'monospace';
  const isSidebar = c.layout === 'left';
  const isSidebarRight = c.layout === 'right';

  const containerStyle = {
    fontFamily,
    background: '#0d1117', // GitHub dark bg
    color: '#c9d1d9',      // GitHub dark text
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: isSidebar ? 'row' : isSidebarRight ? 'row-reverse' : 'column',
    minHeight: '100%',
    border: '1px solid #30363d',
    borderRadius: '6px',
    overflow: 'hidden'
  };

  const sidebarStyle = {
    flex: isSidebar || isSidebarRight ? '0 0 300px' : 'none',
    borderRight: isSidebar ? '1px solid #30363d' : 'none',
    borderLeft: isSidebarRight ? '1px solid #30363d' : 'none',
    borderBottom: (!isSidebar && !isSidebarRight) ? '1px solid #30363d' : 'none',
    padding: '2rem',
    background: '#0d1117',
  };

  const mainStyle = {
    flex: '1',
    padding: '2rem',
    background: '#0d1117',
  };

  return (
    <div style={{ background: '#010409', padding: '2rem 1rem' }}>
      <div style={containerStyle}>
        
        {/* Sidebar / Top Header */}
        <div style={sidebarStyle}>
          {p.profileImage && (
            <img
              src={p.profileImage}
              alt={p.title}
              style={{ width: '100%', maxWidth: (isSidebar || isSidebarRight) ? '250px' : '120px', height: 'auto', aspectRatio: '1/1', borderRadius: '50%', objectFit: 'cover', border: '1px solid #30363d', marginBottom: '1rem' }}
            />
          )}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#c9d1d9', margin: '0 0 0.5rem' }}>
            {p.title || 'developer_name'}
          </h1>
          <p style={{ color: '#8b949e', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {p.bio || 'Full-stack developer building open source.'}
          </p>

          {c.showContact !== false && (p.contactEmail || p.contactPhone || p.githubLink) && (
            <div style={{ borderTop: '1px solid #30363d', paddingTop: '1rem', fontSize: '0.9rem' }}>
              {p.contactEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#c9d1d9' }}>
                  <span style={{ color: '#8b949e' }}>✉</span> {p.contactEmail}
                </div>
              )}
              {p.contactPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: p.githubLink ? '0.5rem' : '0', color: '#c9d1d9' }}>
                  <span style={{ color: '#8b949e' }}>✆</span> {p.contactPhone}
                </div>
              )}
              {p.githubLink && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c9d1d9' }}>
                  <span style={{ color: '#8b949e' }}>🔗</span> <a href={p.githubLink.startsWith('http') ? p.githubLink : `https://${p.githubLink}`} target="_blank" rel="noopener noreferrer" style={{ color: '#58a6ff', textDecoration: 'none' }}>GitHub</a>
                </div>
              )}
            </div>
          )}

          {/* Skills integrated into sidebar if layout is sidebar */}
          {(isSidebar || isSidebarRight) && c.showSkills !== false && p.skills?.length > 0 && (
            <div style={{ borderTop: '1px solid #30363d', paddingTop: '1rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1rem', color: '#c9d1d9', marginBottom: '0.75rem', fontWeight: 600 }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.skills.map((s, i) => (
                  <span key={i} style={{ background: '#21262d', color: primaryColor, padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '1rem', border: '1px solid #363b42' }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={mainStyle}>
          
          {/* Projects (Repositories) */}
          {c.showProjects !== false && p.projects?.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#c9d1d9', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{color: primaryColor}}>■</span> Pinned Projects
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {p.projects.map((proj, i) => (
                  <div key={i} style={{ border: '1px solid #30363d', borderRadius: '6px', padding: '1rem', background: '#0d1117' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#8b949e' }}>🗂</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#58a6ff', margin: 0 }}>{proj.title}</h3>
                    </div>
                    {proj.imageUrl && (
                         <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid #30363d' }} />
                    )}
                    <p style={{ color: '#8b949e', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education as Contributions/Timeline */}
          {c.showEducation !== false && p.education?.length > 0 && (
            <section style={{ marginBottom: '2rem' }}>
               <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#c9d1d9', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{color: primaryColor}}>■</span> Experience & Education
                </h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid #30363d', marginLeft: '0.5rem', paddingLeft: '1rem' }}>
                {p.education.map((ed, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-1.35rem', top: '0.25rem', width: '10px', height: '10px', background: primaryColor, borderRadius: '50%', border: '2px solid #0d1117' }}></div>
                    <span style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '0.25rem', display: 'block' }}>{ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span>
                    <h3 style={{ fontSize: '1rem', color: '#c9d1d9', margin: '0 0 0.25rem' }}>{ed.degree || ed.text}</h3>
                    <p style={{ color: '#8b949e', fontSize: '0.9rem', margin: 0 }}>{ed.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills (if not sidebar layout) */}
          {(!isSidebar && !isSidebarRight) && c.showSkills !== false && p.skills?.length > 0 && (
             <section style={{ marginBottom: '2rem' }}>
               <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                 <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#c9d1d9', margin: 0 }}>Skills & Technologies</h2>
               </div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                 {p.skills.map((s, i) => (
                   <span key={i} style={{ background: '#21262d', color: primaryColor, padding: '0.3rem 0.75rem', fontSize: '0.8rem', borderRadius: '1rem', border: '1px solid #363b42' }}>
                     {s.name}
                   </span>
                 ))}
               </div>
             </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default TemplateDeveloper;
