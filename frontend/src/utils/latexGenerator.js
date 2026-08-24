/**
 * Escapes special LaTeX characters to prevent compilation errors.
 */
function escapeLatex(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Generates a clean, compilable LaTeX document string from structured parsed_data JSON.
 */
export function generateLatex(data) {
  const personal = data?.personal_info || {};
  const experiences = data?.experiences || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];

  const name = escapeLatex(personal.full_name || 'Your Full Name');
  const title = escapeLatex(personal.title || '');
  const email = escapeLatex(personal.email || '');
  const phone = escapeLatex(personal.phone || '');
  const location = escapeLatex(personal.location || '');
  const summary = escapeLatex(personal.summary || '');
  const github = personal.github_url || '';
  const linkedin = personal.linkedin_url || '';
  const website = personal.website_url || '';

  // Build contact row
  const contactParts = [];
  if (email) contactParts.push(`\\href{mailto:${personal.email}}{${email}}`);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);
  if (github) contactParts.push(`\\href{${github}}{GitHub}`);
  if (linkedin) contactParts.push(`\\href{${linkedin}}{LinkedIn}`);
  if (website) contactParts.push(`\\href{${website}}{Portfolio}`);
  const contactLine = contactParts.join(' $|$ ');

  let latex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{utf8}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\definecolor{primary}{RGB}{79, 70, 229}
\\hypersetup{colorlinks=true, linkcolor=primary, urlcolor=primary}

\\titleformat{\\section}{\\large\\bfseries\\color{primary}\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}
\\pagestyle{empty}

\\begin{document}

% --- HEADER ---
\\begin{center}
    {\\LARGE \\bfseries ${name}} \\\\ [3pt]
    ${title ? `{\\small \\bfseries \\color{primary} ${title}} \\\\[3pt]` : ''}
    {\\small ${contactLine}}
\\end{center}
\\vspace{-5pt}
`;

  // --- SUMMARY ---
  if (summary) {
    latex += `
\\section{Executive Summary}
${summary}
`;
  }

  // --- EXPERIENCE ---
  if (experiences.length > 0) {
    latex += `
\\section{Work Experience}
`;
    experiences.forEach((exp) => {
      const expRole = escapeLatex(exp.role || 'Role');
      const expCompany = escapeLatex(exp.company || 'Company');
      const expStart = escapeLatex(exp.start_date || '');
      const expEnd = escapeLatex(exp.end_date || '');
      const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
        ? exp.bulletPoints
        : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
          ? exp.highlights
          : (Array.isArray(exp.description)
              ? exp.description
              : (typeof exp.description === 'string' && exp.description.trim() ? [exp.description] : []));

      latex += `\\noindent
\\textbf{${expRole}} \\hfill {\\small \\textbf{${expStart}${expStart && expEnd ? ' -- ' : ''}${expEnd}}} \\\\
{\\small \\textit{${expCompany}}} \\\\
`;
      if (Array.isArray(bullets) && bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=2pt]\n`;
        bullets.forEach((item) => {
          if (item) latex += `  \\item ${escapeLatex(item)}\n`;
        });
        latex += `\\end{itemize}\n\\vspace{4pt}\n`;
      }
    });
  }

  // --- EDUCATION ---
  if (education.length > 0) {
    latex += `
\\section{Education}
`;
    education.forEach((edu) => {
      const degree = escapeLatex(edu.degree || 'Degree');
      const field = escapeLatex(edu.field_of_study || '');
      const inst = escapeLatex(edu.institution || '');
      const eduStart = escapeLatex(edu.start_date || '');
      const eduEnd = escapeLatex(edu.end_date || '');
      const gpa = escapeLatex(edu.gpa || '');

      latex += `\\noindent
\\textbf{${degree}${field ? ` in ${field}` : ''}} \\hfill {\\small ${eduStart}${eduStart && eduEnd ? ' -- ' : ''}${eduEnd}} \\\\
{\\small \\textit{${inst}}${gpa ? ` $|$ GPA: ${gpa}` : ''}} \\\\[4pt]
`;
    });
  }

  // --- PROJECTS ---
  if (projects.length > 0) {
    latex += `
\\section{Key Projects}
`;
    projects.forEach((proj) => {
      const projTitle = escapeLatex(proj.title || 'Project');
      const projDesc = escapeLatex(proj.description || '');
      const repoUrl = proj.repo_url || '';
      const liveUrl = proj.live_url || '';

      const projectLinks = [];
      if (repoUrl) projectLinks.push(`\\href{${repoUrl}}{Code}`);
      if (liveUrl) projectLinks.push(`\\href{${liveUrl}}{Demo}`);
      const linksStr = projectLinks.length > 0 ? ` \\hfill {\\small [${projectLinks.join(' | ')}]}` : '';

      latex += `\\noindent
\\textbf{${projTitle}}${linksStr} \\\\
`;
      if (projDesc) {
        latex += `{\\small ${projDesc}} \\\\\n`;
      }
      if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
        const techStr = escapeLatex(proj.technologies.filter(Boolean).join(', '));
        latex += `{\\small \\textbf{Technologies:} ${techStr}} \\\\[4pt]\n`;
      }
    });
  }

  // --- CERTIFICATIONS ---
  if (certifications.length > 0) {
    latex += `
\\section{Certifications}
`;
    certifications.forEach((cert) => {
      const certName = escapeLatex(cert.name || 'Certification');
      const certIssuer = escapeLatex(cert.issuer || '');
      const certIssueDate = escapeLatex(cert.issue_date || cert.date || '');
      const certExpDate = escapeLatex(cert.expiration_date || '');
      const credUrl = cert.credential_url || '';

      const dateStr = certIssueDate && certExpDate ? `${certIssueDate} -- ${certExpDate}` : certIssueDate || certExpDate;
      const nameStr = credUrl ? `\\href{${credUrl}}{${certName}}` : certName;

      latex += `\\noindent
\\textbf{${nameStr}} ${certIssuer ? `--- \\textit{${certIssuer}}` : ''} \\hfill {\\small ${dateStr}} \\\\[3pt]
`;
    });
  }

  // --- SKILLS ---
  if (skills.length > 0) {
    latex += `
\\section{Technical Skills}
\\begin{description}[leftmargin=0pt, itemsep=2pt]
`;
    skills.forEach((sk) => {
      const cat = escapeLatex(sk.category || 'Skills');
      const items = escapeLatex(Array.isArray(sk.items) ? sk.items.filter(Boolean).join(', ') : sk.items || '');
      latex += `  \\item[${cat}:] ${items}\n`;
    });
    latex += `\\end{description}
`;
  }

  latex += `
\\end{document}
`;

  return latex;
}
