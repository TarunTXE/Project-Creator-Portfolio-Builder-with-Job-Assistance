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

  // Fix missing exp.description
  // The structure is roughly: {exp.company}</p>\n </div>
  // Or {exp.company}</span>... </div>
  // We'll just look for exp.company and insert the description after it inside the same div.
  
  content = content.replace(
    /(exp\.company\}[^<]*<\/(?:p|span|div)>)/g,
    '$1\n                    {exp.description && <div style={{ marginTop: "0.5rem", fontSize: "0.95em", opacity: 0.85, whiteSpace: "pre-wrap" }}>{exp.description}</div>}'
  );

  fs.writeFileSync(filepath, content);
  console.log('Fixed desc', file);
}
