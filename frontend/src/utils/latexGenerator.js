/**
 * Safely escapes special LaTeX reserved characters to prevent compilation errors.
 * Replaces \, &, %, $, #, _, {, }, ~, and ^ with their proper LaTeX equivalents.
 */
export function escapeLatex(str) {
  if (str === null || str === undefined) return '';
  const text = typeof str === 'string' ? str : String(str);
  return text.replace(/[\\&%$#_{}~^]/g, (match) => {
    switch (match) {
      case '\\':
        return '\\textbackslash{}';
      case '&':
        return '\\&';
      case '%':
        return '\\%';
      case '$':
        return '\\$';
      case '#':
        return '\\#';
      case '_':
        return '\\_';
      case '{':
        return '\\{';
      case '}':
        return '\\}';
      case '~':
        return '\\textasciitilde{}';
      case '^':
        return '\\textasciicircum{}';
      default:
        return match;
    }
  });
}

/**
 * Generates a clean, compilable LaTeX document string from structured resume data.
 * Dynamically aligns layout (single-column ATS vs split-column minipage) based on templateId.
 */
export function generateLatex(data, templateId = 'classic') {
  const personal = data?.personal_info || data?.basics || {};
  const experiences = data?.experiences || data?.experience || data?.work_experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const leadership = data?.leadership || data?.leadership_activities || [];
  const additionalInfo = data?.additional_info || data?.additionalInfo || [];

  const name = escapeLatex(personal.full_name || personal.name || 'Your Full Name');
  const title = escapeLatex(personal.title || personal.headline || '');
  const email = escapeLatex(personal.email || '');
  const phone = escapeLatex(personal.phone || '');
  const location = escapeLatex(personal.location || '');
  const summary = escapeLatex(personal.summary || personal.bio || '');
  const github = personal.github_url || personal.github || '';
  const linkedin = personal.linkedin_url || personal.linkedin || '';
  const website = personal.website_url || personal.website || '';

  const isSplitColumn = ['modern', 'modern-split', 'modern-ats', 'templateModern'].includes(templateId);

  // Build contact row
  const contactParts = [];
  if (email) contactParts.push(`\\href{mailto:${escapeLatex(personal.email)}}{${email}}`);
  if (phone) contactParts.push(phone);
  if (location) contactParts.push(location);
  if (github) contactParts.push(`\\href{${github}}{GitHub}`);
  if (linkedin) contactParts.push(`\\href{${linkedin}}{LinkedIn}`);
  if (website) contactParts.push(`\\href{${website}}{Portfolio}`);
  const contactLine = contactParts.join(' $|$ ');

  if (isSplitColumn) {
    // --- SPLIT-COLUMN MINIPAGE TEMPLATE ---
    let latex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{utf8}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{parskip}

\\definecolor{primary}{RGB}{37, 99, 235}
\\definecolor{darktext}{RGB}{30, 41, 59}
\\hypersetup{colorlinks=true, linkcolor=primary, urlcolor=primary}

\\titleformat{\\section}{\\bfseries\\color{primary}\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{4pt}
\\pagestyle{empty}

\\begin{document}

% --- HEADER ---
{\\LARGE \\bfseries ${name}} \\\\[2pt]
${title ? `{\\small \\bfseries \\color{primary} ${title}} \\\\[2pt]` : ''}
{\\footnotesize ${contactLine}} \\\\[6pt]
\\hrule
\\vspace{6pt}

% --- TWO COLUMN LAYOUT ---
\\noindent
\\begin{minipage}[t]{0.32\\textwidth}
\\raggedright

% LEFT: EDUCATION
${education.length > 0 ? `\\section*{Education}
` + education.map(edu => {
  const deg = escapeLatex(edu.degree || 'Degree');
  const field = escapeLatex(edu.field_of_study || edu.area || '');
  const inst = escapeLatex(edu.institution || edu.school || '');
  const start = escapeLatex(edu.start_date || edu.startDate || '');
  const end = escapeLatex(edu.end_date || edu.endDate || '');
  const gpa = escapeLatex(edu.gpa || '');
  return `\\textbf{${deg}${field ? ` in ${field}` : ''}} \\\\
{\\footnotesize ${inst}} \\\\
{\\scriptsize ${start}${start && end ? ' -- ' : ''}${end}${gpa ? ` $|$ GPA: ${gpa}` : ''}} \\\\[4pt]`;
}).join('\n') : ''}

% LEFT: SKILLS
${skills.length > 0 ? `\\section*{Skills}
` + skills.map(sk => {
  const cat = escapeLatex(sk.category || sk.name || 'Skills');
  const items = escapeLatex(Array.isArray(sk.items || sk.keywords) ? (sk.items || sk.keywords).filter(Boolean).join(', ') : (sk.items || sk.keywords || ''));
  return `\\textbf{${cat}:} \\\\
{\\footnotesize ${items}} \\\\[4pt]`;
}).join('\n') : ''}

% LEFT: CERTIFICATIONS
${certifications.length > 0 ? `\\section*{Certifications}
` + certifications.map(cert => {
  const cName = escapeLatex(cert.name || cert.title || 'Certification');
  const cIssuer = escapeLatex(cert.issuer || '');
  const cUrl = cert.credential_url || '';
  const nameStr = cUrl ? `\\href{${cUrl}}{${cName}}` : cName;
  return `\\textbf{${nameStr}} ${cIssuer ? `\\\\ {\\footnotesize ${cIssuer}}` : ''} \\\\[3pt]`;
}).join('\n') : ''}

% LEFT: ADDITIONAL INFO
${Array.isArray(additionalInfo) && additionalInfo.length > 0 ? `\\section*{Additional Info}
` + additionalInfo.map(item => {
  const label = escapeLatex(typeof item === 'object' ? (item.label || item.category || item.name || item.title || 'Details') : '');
  const bullets = (typeof item === 'object' && item !== null)
    ? ((Array.isArray(item.bulletPoints) && item.bulletPoints.length > 0)
        ? item.bulletPoints
        : (Array.isArray(item.highlights) && item.highlights.length > 0
            ? item.highlights
            : (Array.isArray(item.details)
                ? item.details
                : (Array.isArray(item.description)
                    ? item.description
                    : ((item.details || item.description) ? [item.details || item.description] : [])))))
    : [String(item)];
  let str = label ? `\\textbf{${label}:} \\\\\n` : '';
  if (bullets.length > 0) {
    str += `{\\footnotesize ${bullets.map(b => escapeLatex(String(b))).join(', ')}} \\\\[3pt]`;
  }
  return str;
}).join('\n') : ''}

\\end{minipage}%
\\hfill
\\vrule
\\hfill
\\begin{minipage}[t]{0.64\\textwidth}

% RIGHT: SUMMARY
${summary ? `\\section*{Summary}
{\\small ${summary}} \\\\[4pt]
` : ''}

% RIGHT: EXPERIENCE
${experiences.length > 0 ? `\\section*{Experience}
` + experiences.map(exp => {
  const expRole = escapeLatex(exp.role || exp.title || 'Role');
  const expCompany = escapeLatex(exp.company || exp.organization || 'Company');
  const expStart = escapeLatex(exp.start_date || exp.startDate || '');
  const expEnd = escapeLatex(exp.end_date || exp.endDate || '');
  const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
    ? exp.bulletPoints
    : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
      ? exp.highlights
      : (Array.isArray(exp.description)
          ? exp.description
          : (typeof exp.description === 'string' && exp.description.trim() ? exp.description.split('\n') : []));
  let str = `\\textbf{${expCompany}} \\hfill {\\footnotesize ${expStart}${expStart && expEnd ? ' -- ' : ''}${expEnd}} \\\\
{\\small \\textit{${expRole}}} \\\\\n`;
  if (bullets.length > 0) {
    str += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=1pt]\n`;
    bullets.forEach(b => {
      if (b) str += `  \\item {\\footnotesize ${escapeLatex(String(b))}}\n`;
    });
    str += `\\end{itemize}\\vspace{2pt}\n`;
  }
  return str;
}).join('\n') : ''}

% RIGHT: PROJECTS
${projects.length > 0 ? `\\section*{Projects}
` + projects.map(proj => {
  const pTitle = escapeLatex(proj.title || proj.name || 'Project');
  const pDesc = escapeLatex(proj.description || '');
  const bullets = (Array.isArray(proj.bulletPoints) && proj.bulletPoints.length > 0)
    ? proj.bulletPoints
    : (Array.isArray(proj.highlights) && proj.highlights.length > 0
        ? proj.highlights
        : (Array.isArray(proj.description) ? proj.description : []));
  let str = `\\textbf{${pTitle}} \\\\\n`;
  if (pDesc && typeof proj.description === 'string') str += `{\\footnotesize ${pDesc}} \\\\\n`;
  if (Array.isArray(bullets) && bullets.length > 0) {
    str += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=1pt]\n`;
    bullets.forEach(b => {
      if (b) str += `  \\item {\\footnotesize ${escapeLatex(String(b))}}\n`;
    });
    str += `\\end{itemize}\\vspace{2pt}\n`;
  }
  return str;
}).join('\n') : ''}

% RIGHT: ACHIEVEMENTS
${achievements.length > 0 ? `\\section*{Honors \\& Achievements}
` + achievements.map(ach => {
  const aTitle = escapeLatex(typeof ach === 'string' ? ach : (ach.title || ach.name || ''));
  const bullets = (typeof ach === 'object' && ach !== null)
    ? ((Array.isArray(ach.bulletPoints) && ach.bulletPoints.length > 0)
        ? ach.bulletPoints
        : (Array.isArray(ach.highlights) && ach.highlights.length > 0
            ? ach.highlights
            : (Array.isArray(ach.description)
                ? ach.description
                : (ach.description ? [ach.description] : []))))
    : [];
  let str = aTitle ? `\\textbf{${aTitle}} \\\\\n` : '';
  if (bullets.length > 0) {
    str += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=1pt]\n`;
    bullets.forEach(b => {
      if (b) str += `  \\item {\\footnotesize ${escapeLatex(String(b))}}\n`;
    });
    str += `\\end{itemize}\\vspace{2pt}\n`;
  }
  return str;
}).join('\n') : ''}

% RIGHT: LEADERSHIP
${leadership.length > 0 ? `\\section*{Leadership}
` + leadership.map(lead => {
  const org = escapeLatex(lead.organization || lead.company || lead.institution || '');
  const role = escapeLatex(lead.role || lead.title || lead.position || '');
  const start = escapeLatex(lead.startDate || lead.start_date || '');
  const end = escapeLatex(lead.endDate || lead.end_date || '');
  const bullets = (Array.isArray(lead.bulletPoints) && lead.bulletPoints.length > 0)
    ? lead.bulletPoints
    : (Array.isArray(lead.highlights) && lead.highlights.length > 0)
      ? lead.highlights
      : (Array.isArray(lead.description)
          ? lead.description
          : (lead.description ? [lead.description] : []));
  let str = `\\textbf{${org}} ${role ? `--- \\textit{${role}}` : ''} \\hfill {\\footnotesize ${start}${start && end ? ' -- ' : ''}${end}} \\\\\n`;
  if (bullets.length > 0) {
    str += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=1pt]\n`;
    bullets.forEach(b => {
      if (b) str += `  \\item {\\footnotesize ${escapeLatex(String(b))}}\n`;
    });
    str += `\\end{itemize}\\vspace{2pt}\n`;
  }
  return str;
}).join('\n') : ''}

\\end{minipage}

\\end{document}
`;
    return latex;
  }

  // --- STANDARD ATS / CLASSIC / MINIMAL / EXECUTIVE SINGLE-COLUMN ---
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
      const expRole = escapeLatex(exp.role || exp.title || 'Role');
      const expCompany = escapeLatex(exp.company || exp.organization || 'Company');
      const expStart = escapeLatex(exp.start_date || exp.startDate || '');
      const expEnd = escapeLatex(exp.end_date || exp.endDate || '');
      const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
        ? exp.bulletPoints
        : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
          ? exp.highlights
          : (Array.isArray(exp.description)
              ? exp.description
              : (typeof exp.description === 'string' && exp.description.trim() ? exp.description.split('\n') : []));

      latex += `\\noindent
\\textbf{${expRole}} \\hfill {\\small \\textbf{${expStart}${expStart && expEnd ? ' -- ' : ''}${expEnd}}} \\\\
{\\small \\textit{${expCompany}}} \\\\
`;
      if (Array.isArray(bullets) && bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=2pt]\n`;
        bullets.forEach((item) => {
          if (item) latex += `  \\item ${escapeLatex(String(item))}\n`;
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
      const field = escapeLatex(edu.field_of_study || edu.area || '');
      const inst = escapeLatex(edu.institution || edu.school || '');
      const eduStart = escapeLatex(edu.start_date || edu.startDate || '');
      const eduEnd = escapeLatex(edu.end_date || edu.endDate || '');
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
      const projTitle = escapeLatex(proj.title || proj.name || 'Project');
      const projDesc = escapeLatex(typeof proj.description === 'string' ? proj.description : '');
      const repoUrl = proj.repo_url || proj.github_url || '';
      const liveUrl = proj.live_url || proj.demo_url || '';

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

      const bullets = (Array.isArray(proj.bulletPoints) && proj.bulletPoints.length > 0)
        ? proj.bulletPoints
        : (Array.isArray(proj.highlights) && proj.highlights.length > 0
            ? proj.highlights
            : (Array.isArray(proj.description) ? proj.description : []));

      if (Array.isArray(bullets) && bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=*, noitemsep, topsep=2pt]\n`;
        bullets.forEach((pt) => {
          if (pt) latex += `  \\item ${escapeLatex(String(pt))}\n`;
        });
        latex += `\\end{itemize}\n`;
      }

      if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
        const techStr = escapeLatex(proj.technologies.filter(Boolean).join(', '));
        latex += `{\\small \\textbf{Technologies:} ${techStr}} \\\\[4pt]\n`;
      } else if (typeof proj.technologies === 'string' && proj.technologies.trim()) {
        latex += `{\\small \\textbf{Technologies:} ${escapeLatex(proj.technologies)}} \\\\[4pt]\n`;
      }
    });
  }

  // --- CERTIFICATIONS ---
  if (certifications.length > 0) {
    latex += `
\\section{Certifications}
`;
    certifications.forEach((cert) => {
      const certName = escapeLatex(cert.name || cert.title || 'Certification');
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

  // --- ACHIEVEMENTS ---
  if (achievements.length > 0) {
    latex += `
\\section{Honors \\& Key Achievements}
`;
    achievements.forEach((ach) => {
      const title = escapeLatex(typeof ach === 'string' ? ach : (ach.title || ach.name || ''));
      const bullets = (typeof ach === 'object' && ach !== null)
        ? ((Array.isArray(ach.bulletPoints) && ach.bulletPoints.length > 0)
            ? ach.bulletPoints
            : (Array.isArray(ach.highlights) && ach.highlights.length > 0
                ? ach.highlights
                : (Array.isArray(ach.description)
                    ? ach.description
                    : (ach.description ? [ach.description] : []))))
        : [];
      if (title) {
        latex += `\\noindent
\\textbf{${title}} \\\\[2pt]
`;
      }
      if (bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=15pt, itemsep=1pt, topsep=1pt]
`;
        bullets.filter(Boolean).forEach((pt) => {
          latex += `  \\item ${escapeLatex(String(pt))}\n`;
        });
        latex += `\\end{itemize}
`;
      } else if (typeof ach === 'object' && ach.description && typeof ach.description === 'string') {
        latex += `\\begin{itemize}[leftmargin=15pt, itemsep=1pt, topsep=1pt]
  \\item ${escapeLatex(ach.description)}
\\end{itemize}
`;
      }
    });
  }

  // --- SKILLS ---
  if (skills.length > 0) {
    latex += `
\\section{Technical Skills}
\\begin{description}[leftmargin=0pt, itemsep=2pt]
`;
    skills.forEach((sk) => {
      const cat = escapeLatex(sk.category || sk.name || 'Skills');
      const items = escapeLatex(Array.isArray(sk.items || sk.keywords) ? (sk.items || sk.keywords).filter(Boolean).join(', ') : (sk.items || sk.keywords || ''));
      latex += `  \\item[${cat}:] ${items}\n`;
    });
    latex += `\\end{description}
`;
  }

  // --- LEADERSHIP & ACTIVITIES ---
  if (leadership.length > 0) {
    latex += `
\\section{Leadership & Activities}
`;
    leadership.forEach((lead) => {
      const org = escapeLatex(lead.organization || lead.company || lead.institution || '');
      const role = escapeLatex(lead.role || lead.title || lead.position || '');
      const start = escapeLatex(lead.startDate || lead.start_date || '');
      const end = escapeLatex(lead.endDate || lead.end_date || '');
      const dateStr = start || end ? `${start}${start && end ? ' -- ' : ''}${end}` : '';

      latex += `\\noindent
\\textbf{${org}} ${role ? `--- \\textit{${role}}` : ''} \\hfill {\\small ${dateStr}} \\\\
`;
      const bullets = (Array.isArray(lead.bulletPoints) && lead.bulletPoints.length > 0)
        ? lead.bulletPoints
        : (Array.isArray(lead.highlights) && lead.highlights.length > 0)
          ? lead.highlights
          : (Array.isArray(lead.description)
              ? lead.description
              : (lead.description ? [lead.description] : []));

      if (bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=15pt, itemsep=1pt, topsep=1pt]
`;
        bullets.filter(Boolean).forEach((pt) => {
          latex += `  \\item ${escapeLatex(String(pt))}\n`;
        });
        latex += `\\end{itemize}
`;
      }
    });
  }

  // --- ADDITIONAL INFORMATION ---
  if (Array.isArray(additionalInfo) && additionalInfo.length > 0) {
    latex += `
\\section{Additional Information}
`;
    additionalInfo.forEach((item) => {
      const label = escapeLatex(typeof item === 'object' ? (item.label || item.category || item.name || item.title || 'Details') : '');
      const bullets = (typeof item === 'object' && item !== null)
        ? ((Array.isArray(item.bulletPoints) && item.bulletPoints.length > 0)
            ? item.bulletPoints
            : (Array.isArray(item.highlights) && item.highlights.length > 0
                ? item.highlights
                : (Array.isArray(item.details)
                    ? item.details
                    : (Array.isArray(item.description)
                        ? item.description
                        : ((item.details || item.description) ? [item.details || item.description] : [])))))
        : [String(item)];

      if (label) {
        latex += `\\noindent
\\textbf{${label}} \\\\[2pt]
`;
      }
      if (bullets.length > 0) {
        latex += `\\begin{itemize}[leftmargin=15pt, itemsep=1pt, topsep=1pt]
`;
        bullets.filter(Boolean).forEach((pt) => {
          latex += `  \\item ${escapeLatex(String(pt))}\n`;
        });
        latex += `\\end{itemize}
`;
      }
    });
  }

  latex += `
\\end{document}
`;

  return latex;
}
