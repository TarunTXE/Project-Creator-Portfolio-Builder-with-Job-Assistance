import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src/components/templates');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // Fix Projects
  content = content.replace(
    /(<p[^>]*>\{proj\.description\}<\/p>)/g,
    '$1\n                    {proj.years?.length > 0 && <span style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "0.5rem", display: "block" }}>{proj.years.join(", ")}</span>}'
  );

  // Fix Education
  content = content.replace(/\{ed\.year\}/g, '{ed.years?.length > 0 ? ed.years.join(", ") : ed.year}');
  content = content.replace(/\{ed\.degree\}/g, '{ed.degree || ed.text}');

  // Inject Experience section before Education
  const eduRegex = /\{\/\*\s*Education\s*\*\/\}([\s\S]*?)(\{\/\*\s*Contact|\{\/\*\s*Experience)/;
  const match = content.match(eduRegex);
  
  if (match && !content.includes('p.experience?.length > 0')) {
    let eduBlock = match[1];
    
    let expBlock = eduBlock
      .replace(/showEducation/g, 'showExperience')
      .replace(/p\.education/g, 'p.experience')
      .replace(/ed, i/g, 'exp, i')
      .replace(/ed\./g, 'exp.')
      .replace(/>Education</g, '>Experience<')
      .replace(/>Background</g, '>Experience<')
      .replace(/>Experience & Education</g, '>Experience<')
      .replace(/exp\.degree \|\| exp\.text/g, 'exp.title || exp.text')
      .replace(/exp\.institution/g, 'exp.company')
      .replace(/exp\.years\?\.length > 0 \? exp\.years\.join\(\", \"\) : exp\.year/g, 'exp.years?.length > 0 ? exp.years.join(\", \") : \"\"');
      
    // Add exp.description
    expBlock = expBlock.replace(
      /(<\/div>\s*<\/div>\s*\)\)})/,
      '  {exp.description && <p style={{ fontSize: "0.9em", marginTop: "0.5rem", opacity: 0.9 }}>{exp.description}</p>}\n                $1'
    );

    const replacement = '{/* Experience */}' + expBlock + '{/* Education */}';
    content = content.replace('{/* Education */}', replacement);
  }

  fs.writeFileSync(filepath, content);
  console.log('Patched', file);
}
