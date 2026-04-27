/**
 * TemplateCreative – Colorful sections, unique angled layout.
 */
const TemplateCreative = ({ portfolio, theme }) => {
  const p = portfolio;
  const c = p.customizations || {};
  const primaryColor = theme?.primary || c.primaryColor || '#ec4899'; // default pink
  const fontFamily = c.fontFamily || 'cursive, sans-serif';
  const isSidebar = c.layout === 'left';
  const isSidebarRight = c.layout === 'right';

  const containerStyle = {
    fontFamily,
    background: '#ffffff',
    color: '#1f2937',
    maxWidth: '1000px',
    margin: '0 auto',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: isSidebar ? 'row' : isSidebarRight ? 'row-reverse' : 'column',
    minHeight: '100%',
  };

  const heroBg = {
    background: primaryColor,
    color: '#ffffff',
    padding: isSidebar || isSidebarRight ? '4rem 2rem' : '5rem 2rem 6rem',
    position: 'relative',
    flex: isSidebar || isSidebarRight ? '0 0 350px' : 'none',
    clipPath: (!isSidebar && !isSidebarRight) ? 'polygon(0 0, 100% 0, 100% 85%, 0 100%)' : 'none',
    borderRight: isSidebar ? `10px solid rgba(0,0,0,0.1)` : 'none',
    borderLeft: isSidebarRight ? `10px solid rgba(0,0,0,0.1)` : 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Hero */}
      <div style={heroBg}>
        {p.profileImage && (
          <img
            src={p.profileImage}
            alt={p.title}
            style={{ width: '9rem', height: '9rem', borderRadius: '2rem', transform: 'rotate(-5deg)', margin: '0 auto 2rem', display: 'block', border: '5px solid white', objectFit: 'cover' }}
          />
        )}
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          {p.title || 'Your Name'}
        </h1>
        <div style={{ width: '50px', height: '5px', background: 'white', margin: '1.5rem auto' }}></div>
        <p style={{ fontSize: '1.2rem', textAlign: 'center', fontWeight: 500, lineHeight: 1.6, padding: '0 1rem' }}>
          {p.bio || 'I build creative and awesome things.'}
        </p>

        {(isSidebar || isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone) && (
          <div style={{ marginTop: '3rem', background: 'rgba(0,0,0,0.1)', padding: '1.5rem', borderRadius: '1rem' }}>
             <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 1rem', textTransform: 'uppercase' }}>Hit me up</h3>
             {p.contactEmail && <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{p.contactEmail}</p>}
             {p.contactPhone && <p style={{ fontSize: '1rem', marginBottom: 0, fontWeight: 'bold' }}>{p.contactPhone}</p>}
          </div>
        )}
      </div>

      <div style={{ padding: '3rem 2rem 4rem', flex: '1', position: 'relative', zIndex: 1, marginTop: (!isSidebar && !isSidebarRight) ? '-2rem' : '0' }}>
        
        {/* Skills */}
        {c.showSkills !== false && p.skills?.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '1.5rem', display: 'inline-block', position: 'relative' }}>
              Superpowers
              <span style={{ position: 'absolute', bottom: '2px', left: 0, width: '100%', height: '8px', background: `${primaryColor}40`, zIndex: -1 }}></span>
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {p.skills.map((s, i) => (
                <span key={i} style={{ padding: '0.75rem 1.5rem', background: '#f3f4f6', color: '#111827', fontSize: '1rem', fontWeight: 700, borderRadius: '2rem', boxShadow: '4px 4px 0px rgba(0,0,0,0.05)', transform: i % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)' }}>
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {c.showProjects !== false && p.projects?.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '1.5rem', display: 'inline-block', position: 'relative' }}>
              My Lab
              <span style={{ position: 'absolute', bottom: '2px', left: 0, width: '100%', height: '8px', background: `${primaryColor}40`, zIndex: -1 }}></span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {p.projects.map((proj, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', gap: '1.5rem', background: '#ffffff', border: '3px solid #f3f4f6', borderRadius: '1.5rem', padding: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {proj.imageUrl && (
                    <div style={{ flex: '1 1 200px' }}>
                      <img src={proj.imageUrl} alt={proj.title} style={{ width: '100%', height: '100%', minHeight: '150px', objectFit: 'cover', borderRadius: '1rem' }} />
                    </div>
                  )}
                  <div style={{ flex: '2 1 300px', padding: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#111827' }}>{proj.title}</h3>
                    <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{proj.description}</p>
                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {c.showExperience !== false && p.experience?.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '1.5rem', display: 'inline-block', position: 'relative' }}>
              Academia
              <span style={{ position: 'absolute', bottom: '2px', left: 0, width: '100%', height: '8px', background: `${primaryColor}40`, zIndex: -1 }}></span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {p.experience.map((exp, i) => (
                <div key={i} style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: '1.5rem', position: 'relative' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: primaryColor, position: 'absolute', left: '-8px', top: '5px' }}></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#111827' }}>{exp.title || exp.text}</h3>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '1rem' }}>{exp.company} <span style={{ opacity: 0.5 }}>• {exp.years?.length > 0 ? exp.years.join(", ") : ""}</span></p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {c.showEducation !== false && p.education?.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: primaryColor, marginBottom: '1.5rem', display: 'inline-block', position: 'relative' }}>
              Academia
              <span style={{ position: 'absolute', bottom: '2px', left: 0, width: '100%', height: '8px', background: `${primaryColor}40`, zIndex: -1 }}></span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {p.education.map((ed, i) => (
                <div key={i} style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: '1.5rem', position: 'relative' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: primaryColor, position: 'absolute', left: '-8px', top: '5px' }}></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#111827' }}>{ed.degree || ed.text}</h3>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '1rem' }}>{ed.institution} <span style={{ opacity: 0.5 }}>• {ed.years?.length > 0 ? ed.years.join(", ") : ed.year}</span></p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {(!isSidebar && !isSidebarRight) && c.showContact !== false && (p.contactEmail || p.contactPhone) && (
          <section style={{ background: '#111827', color: 'white', padding: '3rem 2rem', borderRadius: '1.5rem', textAlign: 'center', marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Let s talk</h2>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
              {p.contactEmail && <p style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>{p.contactEmail}</p>}
              {p.contactPhone && <p style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>{p.contactPhone}</p>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateCreative;
