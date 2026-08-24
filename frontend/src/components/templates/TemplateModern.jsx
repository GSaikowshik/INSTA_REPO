import React from 'react';

const TemplateModern = ({ data = {} }) => {
  const personal = data?.personal_info || data?.basics || {};
  const summaryText = data?.summary || personal.summary || personal.bio || '';
  const experiences = data?.experiences || data?.experience || data?.work || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const certifications = data?.certifications || [];
  const achievements = data?.achievements || [];
  const leadership = data?.leadership || data?.leadership_activities || [];
  const additionalInfo = data?.additional_info || data?.additionalInfo || [];

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 box-border mx-auto font-sans text-[10.5px] leading-relaxed break-words shadow-sm border border-slate-200 grid grid-cols-3">
      {/* LEFT COLUMN: Dark Sidebar (1 Column) */}
      <div className="col-span-1 bg-slate-800 text-white p-6 space-y-5 flex flex-col justify-start">
        {/* PERSONAL HEADER & CONTACT */}
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-white leading-tight">
            {personal.full_name || personal.name || 'Your Full Name'}
          </h1>
          {personal.title && (
            <p className="text-xs font-semibold text-indigo-400 mt-1 uppercase tracking-wider">
              {personal.title}
            </p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-700 space-y-2 text-[10px] text-slate-300">
            {personal.email && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Email</span>
                <a href={`mailto:${personal.email}`} className="text-indigo-300 hover:underline break-all">
                  {personal.email}
                </a>
              </div>
            )}
            {personal.phone && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Phone</span>
                <span>{personal.phone}</span>
              </div>
            )}
            {personal.location && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Location</span>
                <span>{personal.location}</span>
              </div>
            )}
            {personal.github_url && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">GitHub</span>
                <a href={personal.github_url.startsWith('http') ? personal.github_url : `https://${personal.github_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline break-all">
                  {personal.github_url.replace('https://', '')}
                </a>
              </div>
            )}
            {personal.linkedin_url && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">LinkedIn</span>
                <a href={personal.linkedin_url.startsWith('http') ? personal.linkedin_url : `https://${personal.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline break-all">
                  {personal.linkedin_url.replace('https://', '')}
                </a>
              </div>
            )}
            {personal.website_url && (
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Portfolio</span>
                <a href={personal.website_url.startsWith('http') ? personal.website_url : `https://${personal.website_url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline break-all">
                  {personal.website_url.replace('https://', '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* TECHNICAL SKILLS */}
        {skills?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-700">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 border-b border-slate-700 pb-1">
              Technical Skills
            </h2>
            <div className="space-y-2">
              {skills.map((sk, idx) => {
                const categoryName = sk.category || sk.name || 'Skills';
                const itemsList = Array.isArray(sk.items)
                  ? sk.items.filter(Boolean)
                  : (typeof sk.items === 'string' ? sk.items.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);

                return (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-bold text-white block">
                      {categoryName}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {itemsList.map((skillToken, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-1.5 py-0.5 bg-slate-700/80 text-slate-200 rounded text-[9px] font-medium"
                        >
                          {skillToken}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-700">
            <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 border-b border-slate-700 pb-1">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, idx) => {
                const issueDate = cert.issue_date || cert.date || '';
                return (
                  <div key={idx} className="text-[10px] leading-tight">
                    <div className="font-bold text-white">{cert.name || cert.title}</div>
                    {cert.issuer && <div className="text-slate-400 text-[9.5px]">{cert.issuer}</div>}
                    {issueDate && <div className="text-slate-400 text-[9px]">{issueDate}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: White Content Container (2 Columns) */}
      <div className="col-span-2 bg-white text-slate-900 p-6 space-y-4 flex flex-col">
        {/* PROFESSIONAL SUMMARY */}
        {summaryText && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-[10.5px]">{summaryText}</p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experiences?.length > 0 && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Work Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{exp.role || exp.position}</span>
                    <span className="text-[9.5px] text-slate-500 font-medium">
                      {exp.start_date || exp.startDate || ''} {exp.start_date || exp.end_date ? '–' : ''} {exp.end_date || exp.endDate || ''}
                    </span>
                  </div>
                  <div className="text-[10.5px] font-semibold text-indigo-700 mb-1">{exp.company || exp.organization}</div>
                  {(() => {
                    const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
                      ? exp.bulletPoints
                      : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
                        ? exp.highlights
                        : (Array.isArray(exp.description)
                            ? exp.description
                            : (exp.description ? [exp.description] : []));
                    return bullets.length > 0 ? (
                      <ul className="list-disc list-inside text-[10.5px] text-slate-700 space-y-0.5 pl-1">
                        {bullets.filter(Boolean).map((line, dIdx) => (
                          <li key={dIdx}>{line}</li>
                        ))}
                      </ul>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* KEY PROJECTS */}
        {projects?.length > 0 && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
              Key Projects
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{proj.title || proj.name || 'Project Title'}</span>
                    {(() => {
                      const ghUrl = proj.githubUrl || proj.repo_url || proj.github || proj.url;
                      const demoUrl = proj.liveUrl || proj.live_url || proj.link || proj.demo_url || proj.website;
                      if (!ghUrl && !demoUrl) return null;
                      return (
                        <div className="flex items-center gap-2 text-[10px]">
                          {ghUrl && (
                            <a
                              href={ghUrl.startsWith('http') ? ghUrl : `https://${ghUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              GitHub
                            </a>
                          )}
                          {ghUrl && demoUrl && <span className="text-gray-400 text-[10px]">|</span>}
                          {demoUrl && (
                            <a
                              href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  {(() => {
                    const bullets = Array.isArray(proj.highlights) && proj.highlights.length > 0
                      ? proj.highlights
                      : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0
                          ? proj.bullet_points
                          : (proj.description ? (Array.isArray(proj.description) ? proj.description : [proj.description]) : []));

                    if (bullets.length === 0) return null;

                    return (
                      <ul className="list-disc list-inside text-[10.5px] text-slate-700 space-y-0.5 mt-0.5">
                        {bullets.filter(Boolean).map((line, bIdx) => (
                          <li key={bIdx}>{line}</li>
                        ))}
                      </ul>
                    );
                  })()}
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.technologies.map(
                        (tech, tIdx) =>
                          tech && (
                            <span key={tIdx} className="px-1.5 py-0.2 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9px] font-medium">
                              {tech}
                            </span>
                          )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education?.length > 0 && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree || edu.area || 'Degree'}</span>
                    {edu.field_of_study && <span> in {edu.field_of_study}</span>}
                    <div className="text-[10.5px] text-indigo-700 font-medium">{edu.institution || edu.school}</div>
                  </div>
                  <div className="text-[9.5px] text-slate-500 font-medium shrink-0">
                    {edu.start_date || edu.startDate || ''} {edu.start_date || edu.end_date ? '–' : ''} {edu.end_date || edu.endDate || ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements?.length > 0 && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
              Honors & Key Achievements
            </h2>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-700">
              {achievements.map((ach, idx) => {
                const title = typeof ach === 'string' ? ach : (ach.title || ach.name || '');
                const desc = typeof ach === 'object' ? ach.description : '';
                return (
                  <li key={idx}>
                    <span className="font-bold text-slate-900">{title}</span>
                    {desc && <span className="text-slate-700 font-medium"> — {desc}</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* LEADERSHIP & ACTIVITIES */}
        {leadership?.length > 0 && (
          <section className="pb-2 border-b border-slate-200">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Leadership & Activities
            </h2>
            {leadership.map((item, index) => {
              const org = item.organization || item.company || item.institution || item.label || '';
              const role = item.role || item.title || item.position || '';
              const desc = item.description || (Array.isArray(item.highlights) ? item.highlights.join(' ') : '');
              return (
                <div key={index} className="mb-2">
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>{org}</span>
                    <span>{role}</span>
                  </div>
                  {desc && <p className="text-xs opacity-80 mt-1 text-slate-700">{desc}</p>}
                </div>
              );
            })}
          </section>
        )}

        {/* ADDITIONAL INFORMATION */}
        {((Array.isArray(additionalInfo) && additionalInfo.length > 0) || (typeof additionalInfo === 'object' && Object.keys(additionalInfo).length > 0)) && (
          <section className="mb-2">
            <h2 className="text-[10.5px] font-extrabold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Additional Information
            </h2>
            {Array.isArray(additionalInfo) ? (
              additionalInfo.map((item, index) => {
                const label = typeof item === 'object' ? (item.label || item.category || item.name || item.title || 'Details') : '';
                const val = typeof item === 'object' ? (item.value || item.details || item.description || '') : item;
                return (
                  <div key={index} className="mb-1 text-xs text-slate-800">
                    {label && <span className="font-bold">{label}: </span>}
                    <span className="opacity-80">{val}</span>
                  </div>
                );
              })
            ) : (
              Object.entries(additionalInfo).map(([key, val], index) => (
                <div key={index} className="mb-1 text-xs text-slate-800">
                  <span className="font-bold">{key}: </span>
                  <span className="opacity-80">{Array.isArray(val) ? val.join(', ') : val}</span>
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default TemplateModern;
