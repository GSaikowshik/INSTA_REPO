import React from 'react';

const TemplateExecutive = ({ data = {} }) => {
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
    <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 box-border mx-auto font-serif text-[10.5px] leading-snug break-words shadow-sm border border-slate-200">
      {/* CENTERED EXECUTIVE HEADER */}
      <header className="text-center border-b-2 border-slate-900 pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">
          {personal.full_name || personal.name || 'Your Full Name'}
        </h1>
        {personal.title && (
          <p className="text-xs italic font-semibold text-slate-700 mt-0.5 tracking-wide">
            {personal.title}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 mt-2 text-[10px] text-slate-700 font-sans">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="hover:underline">
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <>
              <span>•</span>
              <span>{personal.phone}</span>
            </>
          )}
          {personal.location && (
            <>
              <span>•</span>
              <span>{personal.location}</span>
            </>
          )}
          {personal.github_url && (
            <>
              <span>•</span>
              <a href={personal.github_url.startsWith('http') ? personal.github_url : `https://${personal.github_url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                GitHub
              </a>
            </>
          )}
          {personal.linkedin_url && (
            <>
              <span>•</span>
              <a href={personal.linkedin_url.startsWith('http') ? personal.linkedin_url : `https://${personal.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {personal.website_url && (
            <>
              <span>•</span>
              <a href={personal.website_url.startsWith('http') ? personal.website_url : `https://${personal.website_url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </header>

      {/* EXECUTIVE SUMMARY */}
      {summaryText && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-1.5">
            Executive Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-[10.5px] italic">{summaryText}</p>
        </section>
      )}

      {/* WORK EXPERIENCE (PRIORITIZED FOR EXECUTIVE TEMPLATE) */}
      {experiences?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{exp.company || exp.organization}</span>
                  <span className="text-[10px] font-normal text-slate-600 font-sans">
                    {exp.start_date || exp.startDate || ''} {exp.start_date || exp.end_date ? '–' : ''} {exp.end_date || exp.endDate || ''}
                  </span>
                </div>
                <div className="text-[11px] font-semibold italic text-slate-800 mb-1">{exp.role || exp.position}</div>
                {(() => {
                  const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
                    ? exp.bulletPoints
                    : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
                      ? exp.highlights
                      : (Array.isArray(exp.description)
                          ? exp.description
                          : (exp.description ? [exp.description] : []));
                  return bullets.length > 0 ? (
                    <ul className="list-disc list-inside text-[10.5px] text-slate-800 space-y-0.5 pl-1">
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
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-2">
            Key Initiatives & Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between font-bold text-slate-900 text-xs">
                  <span>{proj.title || proj.name || 'Project Title'}</span>
                  {(() => {
                    const ghUrl = proj.githubUrl || proj.repo_url || proj.github || proj.url;
                    const demoUrl = proj.liveUrl || proj.live_url || proj.link || proj.demo_url || proj.website;
                    if (!ghUrl && !demoUrl) return null;
                    return (
                      <div className="flex items-center gap-2 text-[10px] font-sans font-normal">
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
                    <ul className="list-disc list-inside text-[10.5px] text-slate-800 space-y-0.5 mt-0.5">
                      {bullets.filter(Boolean).map((line, bIdx) => (
                        <li key={bIdx}>{line}</li>
                      ))}
                    </ul>
                  );
                })()}
                {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 text-[9.5px] font-sans italic text-slate-600">
                    Technologies: {proj.technologies.filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {education?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-1.5">
            Education
          </h2>
          <div className="space-y-1.5">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.institution || edu.school}</span>
                  <div className="text-[10.5px] italic text-slate-800">
                    {edu.degree || edu.area || 'Degree'}{edu.field_of_study ? ` in ${edu.field_of_study}` : ''}
                  </div>
                </div>
                <div className="text-[10px] text-slate-600 font-sans shrink-0">
                  {edu.start_date || edu.startDate || ''} {edu.start_date || edu.end_date ? '–' : ''} {edu.end_date || edu.endDate || ''}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNICAL SKILLS */}
      {skills?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-1.5">
            Areas of Expertise & Skills
          </h2>
          <div className="space-y-1">
            {skills.map((sk, idx) => {
              const categoryName = sk.category || sk.name || 'Skills';
              const itemsList = Array.isArray(sk.items)
                ? sk.items.filter(Boolean)
                : (typeof sk.items === 'string' ? sk.items.split(/[\n,]/).map(s => s.trim()).filter(Boolean) : []);

              return (
                <div key={idx} className="text-[10.5px]">
                  <span className="font-bold text-slate-900">{categoryName}: </span>
                  <span className="text-slate-800">{itemsList.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certifications?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-1.5">
            Certifications & Credentials
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-[10.5px]">
                <span className="font-bold text-slate-900">{cert.name || cert.title}</span>
                {cert.issuer && <span className="italic text-slate-700"> — {cert.issuer}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-1.5">
            Honors & Executive Recognition
          </h2>
          <div className="space-y-2 text-[10.5px] text-slate-800">
            {achievements.map((ach, idx) => {
              const title = typeof ach === 'string' ? ach : (ach.title || ach.name || '');
              const bullets = (typeof ach === 'object' && ach !== null)
                ? ((Array.isArray(ach.bulletPoints) && ach.bulletPoints.length > 0)
                    ? ach.bulletPoints
                    : (Array.isArray(ach.highlights) && ach.highlights.length > 0
                        ? ach.highlights
                        : (Array.isArray(ach.description)
                            ? ach.description
                            : (ach.description ? [ach.description] : []))))
                : [];
              return (
                <div key={idx}>
                  {title && <div className="font-bold text-slate-900">{title}</div>}
                  {bullets.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-800 mt-0.5 pl-1">
                      {bullets.filter(Boolean).map((line, bIdx) => (
                        <li key={bIdx}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    typeof ach === 'object' && ach.description && typeof ach.description === 'string' && (
                      <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-slate-800 mt-0.5 pl-1">
                        <li>{ach.description}</li>
                      </ul>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* LEADERSHIP & ACTIVITIES */}
      {leadership?.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-2">
            Leadership & Board Activities
          </h2>
          {leadership.map((item, index) => {
            const org = item.organization || item.company || item.institution || item.label || '';
            const role = item.role || item.title || item.position || '';
            const start = item.startDate || item.start_date || '';
            const end = item.endDate || item.end_date || '';
            const dateStr = start || end ? `${start}${start && end ? ' – ' : ''}${end}` : '';
            const bullets = (Array.isArray(item.bulletPoints) && item.bulletPoints.length > 0)
              ? item.bulletPoints
              : (Array.isArray(item.highlights) && item.highlights.length > 0)
                ? item.highlights
                : (Array.isArray(item.description)
                    ? item.description
                    : (item.description ? [item.description] : []));

            return (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-[11.5px] font-bold text-slate-900">{org}</span>
                  {dateStr && <span className="text-[10px] text-slate-600 font-medium">{dateStr}</span>}
                </div>
                {role && <div className="text-[11px] font-semibold italic text-slate-800 mb-1">{role}</div>}
                {bullets.length > 0 && (
                  <ul className="list-disc list-inside text-[10.5px] text-slate-800 space-y-0.5 pl-1">
                    {bullets.filter(Boolean).map((line, dIdx) => (
                      <li key={dIdx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ADDITIONAL INFORMATION */}
      {((Array.isArray(additionalInfo) && additionalInfo.length > 0) || (typeof additionalInfo === 'object' && Object.keys(additionalInfo).length > 0)) && (
        <section className="mb-2">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 border-t-2 border-b border-slate-900 py-0.5 mb-2">
            Additional Information
          </h2>
          {Array.isArray(additionalInfo) ? (
            additionalInfo.map((item, index) => {
              const label = typeof item === 'object' ? (item.label || item.category || item.name || item.title || 'Details') : '';
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
              return (
                <div key={index} className="mb-2 text-xs text-slate-800">
                  {label && <div className="font-bold text-slate-900">{label}</div>}
                  {bullets.length > 0 && (
                    <ul className="list-disc list-inside text-[10.5px] text-slate-800 space-y-0.5 pl-1 mt-0.5">
                      {bullets.filter(Boolean).map((line, bIdx) => (
                        <li key={bIdx}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            <ul className="list-disc list-inside text-[10.5px] text-slate-800 space-y-0.5 pl-1 mt-0.5">
              {Object.entries(additionalInfo).map(([key, val], index) => (
                <li key={index} className="text-xs text-slate-800">
                  <span className="font-bold">{key}: </span>
                  <span className="opacity-80">{Array.isArray(val) ? val.join(', ') : val}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};

export default TemplateExecutive;
