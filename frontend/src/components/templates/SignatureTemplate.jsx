import React from 'react';

const SignatureTemplate = ({ data = {} }) => {
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.workExperience || data.technical_experience || data.experiences || [];
  const eduList = data.education || [];
  const projList = data.projects || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];
  const summaryText = data.summary || personal.summary || personal.bio || '';
  const achievementsList = data.achievements || [];
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
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Work Experience</h2>
        {expList.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold w-full">
              <span className="text-[11px]">{exp.role || exp.position}</span>
              <span>{exp.start_date || exp.startDate} - {exp.end_date || exp.endDate || 'Present'}</span>
            </div>
            <div className="font-semibold italic mb-1">{exp.company || exp.organization}</div>
            <ul className="list-disc pl-5 space-y-0.5">
              {(() => {
                const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
                  ? exp.bulletPoints
                  : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
                    ? exp.highlights
                    : (Array.isArray(exp.description)
                        ? exp.description
                        : (exp.description ? [exp.description] : []));
                return bullets.filter(Boolean).map((h, j) => <li key={j}>{h}</li>);
              })()}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!projList || projList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Key Projects</h2>
        {projList.map((proj, i) => {
          return (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline font-bold w-full mb-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-900">
                    {proj.title || proj.name}
                  </span>
                  {(() => {
                    const ghUrl = proj.githubUrl || proj.repo_url || proj.github || proj.url;
                    const demoUrl = proj.liveUrl || proj.live_url || proj.link || proj.demo_url || proj.website;
                    if (!ghUrl && !demoUrl) return null;
                    return (
                      <div className="flex items-center gap-1.5 text-[9.5px] font-normal">
                        {ghUrl && (
                          <a href={ghUrl.startsWith('http') ? ghUrl : `https://${ghUrl}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                            [GitHub]
                          </a>
                        )}
                        {ghUrl && demoUrl && <span className="text-gray-400">|</span>}
                        {demoUrl && (
                          <a href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                            [Live Demo]
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <span className="text-[9.5px] text-gray-600 font-normal">{proj.date || proj.year || ''}</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-gray-700 mb-1.5">
                {(() => {
                  const bullets = (Array.isArray(proj.bulletPoints) && proj.bulletPoints.length > 0)
                    ? proj.bulletPoints
                    : (Array.isArray(proj.highlights) && proj.highlights.length > 0)
                      ? proj.highlights
                      : (Array.isArray(proj.bullet_points) && proj.bullet_points.length > 0)
                        ? proj.bullet_points
                        : (Array.isArray(proj.description)
                            ? proj.description
                            : (proj.description ? [proj.description] : []));
                  return bullets.filter(Boolean).map((line, j) => (
                    <li key={`p-${j}`} className="pl-1">{line}</li>
                  ));
                })()}
              </ul>
              {(proj.techStack || proj.technologies) && (
                <div className="text-[9.5px] opacity-80">
                  <span className="font-semibold">Technologies:</span> {Array.isArray(proj.techStack || proj.technologies) ? (proj.techStack || proj.technologies).join(', ') : (proj.techStack || proj.technologies)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEducation = () => {
    if (!eduList || eduList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Education</h2>
        {eduList.map((edu, i) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between font-bold w-full">
              <span>{edu.degree || edu.area}</span>
              <span>{edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || 'Present'}</span>
            </div>
            <div>{edu.institution || edu.school}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderCertifications = () => {
    if (!certList || certList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Certifications</h2>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }} className="list-none mt-0.5">
          {certList.map((c, i) => (
            <li key={i} className="mb-0.5 flex flex-col">
              <span className="font-bold">
                {(() => {
                  const cLink = c.link || c.url || c.credentialUrl || c.credential_url;
                  return cLink ? (
                    <a href={cLink.startsWith('http') ? cLink : `https://${cLink}`} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
                      {c.name || c.title}
                    </a>
                  ) : (
                    <span>{c.name || c.title}</span>
                  );
                })()}
              </span>
              <span className="text-gray-700">{c.issuer}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!Array.isArray(achievementsList) || achievementsList.length === 0) return null;
    return (
      <div className="mb-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Honors & Achievements</h2>
        <div className="space-y-2">
          {achievementsList.map((ach, i) => {
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
                {title && <div className="font-bold">{title}</div>}
                {bullets.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                    {bullets.filter(Boolean).map((line, bIdx) => (
                      <li key={bIdx}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  typeof ach === 'object' && ach.description && typeof ach.description === 'string' && (
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      <li>{ach.description}</li>
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
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Technical Skills</h2>
        <div className="space-y-1">
          {skillList.map((skill, i) => (
            <div key={i}>
              <span className="font-bold">{skill.category || skill.name}: </span> 
              <span>{Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeadership = () => {
    if (!leadershipList || leadershipList.length === 0) return null;
    return (
      <div className="mb-4 mt-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Leadership & Activities</h2>
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
            <div key={index} className="mb-3">
              <div className="flex justify-between font-bold w-full">
                <span className="text-[11px]">{org}</span>
                {dateStr && <span>{dateStr}</span>}
              </div>
              {role && <div className="font-semibold italic mb-1">{role}</div>}
              {bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-0.5">
                  {bullets.filter(Boolean).map((line, j) => (
                    <li key={j}>{line}</li>
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
      <div className="mb-4 mt-4">
        <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Additional Information</h2>
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
              <div key={index} className="mb-3">
                {label && <div className="font-bold text-[11px] mb-1">{label}</div>}
                {bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-0.5">
                    {bullets.filter(Boolean).map((line, bIdx) => (
                      <li key={bIdx}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })
        ) : (
          <ul className="list-disc pl-5 space-y-0.5">
            {Object.entries(additionalInfoList).map(([key, val], index) => (
              <li key={index} className="text-xs">
                <span className="font-bold">{key}: </span>
                <span>{Array.isArray(val) ? val.join(', ') : val}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 box-border mx-auto font-sans text-[10.5px] leading-snug break-words">
      
      {/* HEADER - Centered */}
      <div className="text-center mb-5">
        <h1 className="text-3xl font-extrabold uppercase tracking-wide mb-1">
          {personal.full_name || personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10.5px] font-medium">
          {personal.email && <a href={`mailto:${personal.email}`} className="text-black hover:underline">{personal.email}</a>}
          {personal.phone && <a href={`tel:${personal.phone.replace(/[^0-9+]/g, '')}`} className="text-black hover:underline">{personal.phone}</a>}
          {personal.location && <span>{personal.location}</span>}
          {personal.github_url && <a href={personal.github_url.startsWith('http') ? personal.github_url : `https://${personal.github_url}`} target="_blank" rel="noreferrer" className="text-black hover:underline">GitHub</a>}
          {personal.linkedin_url && <a href={personal.linkedin_url.startsWith('http') ? personal.linkedin_url : `https://${personal.linkedin_url}`} target="_blank" rel="noreferrer" className="text-black hover:underline">LinkedIn</a>}
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

export default SignatureTemplate;
