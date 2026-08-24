import React from 'react';

const ClassicAtsTemplate = ({ data = {} }) => {
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.workExperience || data.technical_experience || data.experiences || [];
  const eduList = data.education || [];
  const projList = data.projects || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];
  const summaryText = data.summary || personal.summary || personal.bio || '';
  const leadershipList = data.leadership || data.leadership_activities || [];
  const additionalInfoList = data.additional_info || data.additionalInfo || [];


  const sectionOrder = data.sectionOrder || [
    'summary',
    'experience',
    'projects',
    'education',
    'certifications',
    'skills',
    'leadership',
    'achievements',
    'additionalInfo'
  ];

  const renderSummary = () => {
    if (!summaryText) return null;
    return (
      <div className="mb-4">
        <p className="text-xs opacity-85 leading-relaxed">{summaryText}</p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!expList || expList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Work Experience
        </h2>
        {expList.map((exp, i) => (
          <div key={i} className="mb-3.5">
            <div className="flex justify-between items-end w-full">
              <span className="text-[11.5px] font-bold text-gray-900">{exp.role || exp.position}</span>
              <span className="text-[9.5px] text-gray-500 font-medium">{exp.start_date || exp.startDate} – {exp.end_date || exp.endDate || 'Present'}</span>
            </div>
            <div className="text-indigo-700 font-medium mb-1.5 text-[10.5px]">{exp.company || exp.organization}</div>
            <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
              {(() => {
                const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
                  ? exp.bulletPoints
                  : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
                    ? exp.highlights
                    : (Array.isArray(exp.description)
                        ? exp.description
                        : (exp.description ? [exp.description] : []));
                return bullets.filter(Boolean).map((line, j) => (
                  <li key={`h-${j}`} className="pl-1">{line}</li>
                ));
              })()}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (!eduList || eduList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6"/></svg>
          Education
        </h2>
        {eduList.map((edu, i) => (
          <div key={i} className="mb-2.5">
            <div className="flex justify-between items-end w-full">
              <span className="text-[11px] text-gray-900">
                <span className="font-bold">{edu.degree || edu.area}</span>
                {edu.studyType && <span> in {edu.studyType}</span>}
              </span>
              <span className="text-[9.5px] text-gray-500 font-medium">{edu.start_date || edu.startDate} – {edu.end_date || edu.endDate || 'Present'}</span>
            </div>
            <div className="text-indigo-700 font-medium">{edu.institution || edu.school}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!projList || projList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <span className="font-mono text-[13px] leading-none font-bold">&lt;/&gt;</span>
          Key Projects
        </h2>
        {projList.map((proj, i) => {
          const repoUrl = proj.githubUrl || proj.repo_url || proj.github || proj.url;
          const demoUrl = proj.liveUrl || proj.live_url || proj.link || proj.demo_url || proj.website;
          const techList = proj.techStack || proj.technologies;
          
          return (
            <div key={i} className="mb-3.5">
              <div className="flex justify-between items-end w-full mb-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11.5px] font-bold text-gray-900">
                    {proj.title || proj.name}
                  </span>
                  <div className="flex items-center gap-2 text-[9px] font-medium">
                    {repoUrl && (
                      <a href={repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-gray-500 hover:text-indigo-700 transition-colors">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        Repo
                      </a>
                    )}
                    {demoUrl && (
                      <a href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-gray-500 hover:text-indigo-700 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        Demo
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-[9.5px] text-gray-500 font-medium">{proj.date || proj.year || ''}</span>
              </div>
              <div className="mb-1.5 text-gray-700">{proj.description}</div>
              {techList && Array.isArray(techList) && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {techList.map((tech, j) => (
                    <span key={j} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[9px] font-medium border border-gray-200 shadow-sm">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certList || certList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
          Certifications
        </h2>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {certList.map((c, i) => {
            const cLink = c.link || c.url || c.credentialUrl || c.credential_url;
            return (
              <div key={i} className="flex flex-col">
                <span className="font-bold text-[11px] text-gray-900">
                  {cLink ? (
                    <a href={cLink.startsWith('http') ? cLink : `https://${cLink}`} target="_blank" rel="noreferrer" className="hover:text-indigo-700 hover:underline">{c.name || c.title}</a>
                  ) : (c.name || c.title)}
                </span>
                <span className="text-indigo-700 font-medium text-[10px]">{c.issuer}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!Array.isArray(data.achievements) || data.achievements.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
          Honors & Key Achievements
        </h2>
        <div className="space-y-2 text-gray-700">
          {data.achievements.map((ach, i) => {
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
              <div key={i} className="text-[10.5px]">
                {title && <div className="font-bold text-gray-900">{title}</div>}
                {bullets.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-700 mt-0.5">
                    {bullets.filter(Boolean).map((line, bIdx) => (
                      <li key={`ach-${bIdx}`} className="pl-1">{line}</li>
                    ))}
                  </ul>
                ) : (
                  typeof ach === 'object' && ach.description && typeof ach.description === 'string' && (
                    <ul className="list-disc pl-4 space-y-0.5 text-gray-700 mt-0.5">
                      <li className="pl-1">{ach.description}</li>
                    </ul>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!skillList || skillList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          Technical Skills
        </h2>
        <div className="space-y-1">
          {skillList.map((skill, i) => (
            <div key={i} className="text-[10.5px]">
              <span className="font-bold text-gray-900">{skill.category || skill.name}: </span> 
              <span className="text-gray-700">{Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeadership = () => {
    if (!leadershipList || leadershipList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Leadership & Activities
        </h2>
        {leadershipList.map((item, index) => {
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
            <div key={index} className="mb-3.5">
              <div className="flex justify-between items-end w-full">
                <span className="text-[11.5px] font-bold text-gray-900">{org}</span>
                {dateStr && <span className="text-[9.5px] text-gray-500 font-medium">{dateStr}</span>}
              </div>
              {role && <div className="text-indigo-700 font-medium mb-1.5 text-[10.5px]">{role}</div>}
              {bullets.length > 0 && (
                <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                  {bullets.filter(Boolean).map((line, j) => (
                    <li key={`lead-${j}`} className="pl-1">{line}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAdditionalInfo = () => {
    if (!((Array.isArray(additionalInfoList) && additionalInfoList.length > 0) || (typeof additionalInfoList === 'object' && Object.keys(additionalInfoList).length > 0))) return null;
    return (
      <div className="mb-4">
        <h2 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-800 border-b border-indigo-200 pb-1 mb-2.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Additional Information
        </h2>
        {Array.isArray(additionalInfoList) ? (
          additionalInfoList.map((item, index) => {
            const label = typeof item === 'object' && item !== null ? (item.category || item.label || item.name || item.title || '') : '';
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
              <div key={index} className="mb-3.5">
                {label && <div className="text-[11.5px] font-bold text-gray-900 mb-1">{label}</div>}
                {bullets.length > 0 && (
                  <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
                    {bullets.filter(Boolean).map((line, bIdx) => (
                      <li key={`add-${bIdx}`} className="pl-1">{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          <ul className="list-disc pl-4 space-y-0.5 text-gray-700">
            {Object.entries(additionalInfoList).map(([key, val], index) => (
              <li key={index} className="pl-1">
                <span className="font-bold text-gray-900">{key}: </span>
                <span>{Array.isArray(val) ? val.join(', ') : val}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-8 box-border mx-auto font-sans text-[10.5px] leading-relaxed break-words text-gray-800">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-2">
          {personal.full_name || personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-medium text-indigo-700">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:underline">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1 hover:underline">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {personal.phone}
            </a>
          )}
          {personal.location && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {personal.location}
            </span>
          )}
          {personal.github_url && (
            <a href={personal.github_url.startsWith('http') ? personal.github_url : `https://${personal.github_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              GitHub
            </a>
          )}
          {personal.linkedin_url && (
            <a href={personal.linkedin_url.startsWith('http') ? personal.linkedin_url : `https://${personal.linkedin_url}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* DYNAMIC ORDERED SECTIONS */}
      {sectionOrder.map((secKey) => {
        switch (secKey) {
          case 'summary':
            return <React.Fragment key="summary">{renderSummary()}</React.Fragment>;
          case 'experience':
          case 'experiences':
            return <React.Fragment key="experience">{renderExperience()}</React.Fragment>;
          case 'projects':
            return <React.Fragment key="projects">{renderProjects()}</React.Fragment>;
          case 'education':
            return <React.Fragment key="education">{renderEducation()}</React.Fragment>;
          case 'certifications':
            return <React.Fragment key="certifications">{renderCertifications()}</React.Fragment>;
          case 'skills':
            return <React.Fragment key="skills">{renderSkills()}</React.Fragment>;
          case 'leadership':
          case 'leadership_activities':
            return <React.Fragment key="leadership">{renderLeadership()}</React.Fragment>;
          case 'achievements':
            return <React.Fragment key="achievements">{renderAchievements()}</React.Fragment>;
          case 'additionalInfo':
          case 'additional_info':
            return <React.Fragment key="additionalInfo">{renderAdditionalInfo()}</React.Fragment>;
          default:
            return null;
        }
      })}

    </div>
  );
};

export default ClassicAtsTemplate;
