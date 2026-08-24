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

      {/* PROFESSIONAL SUMMARY */}
      {summaryText && (
        <div className="mb-4">
          <p className="text-xs opacity-85 leading-relaxed">{summaryText}</p>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {expList.length > 0 && (
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
      )}

      {/* EDUCATION */}
      {eduList.length > 0 && (
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
      )}

      {/* KEY PROJECTS */}
      {projList.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Key Projects</h2>
          {projList.map((proj, i) => {
            const pLink = proj.link || proj.url || proj.githubUrl || proj.github || proj.website || proj.repo_url || proj.live_url || proj.project_url;
            const techList = proj.techStack || proj.technologies;
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
                            <a href={ghUrl.startsWith('http') ? ghUrl : `https://${ghUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                              GitHub
                            </a>
                          )}
                          {ghUrl && demoUrl && <span className="text-gray-400">|</span>}
                          {demoUrl && (
                            <a href={demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                              Live Demo
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <span className="text-[9.5px] text-gray-500 font-medium">{proj.date || proj.year || ''}</span>
                </div>
                <div className="mb-1">{proj.description}</div>
                {techList && Array.isArray(techList) && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {techList.map((tech, j) => (
                      <span key={j} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-md text-[9px] font-bold border border-gray-200">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certList.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Certifications</h2>
          <ul className="grid grid-cols-2 gap-y-1 gap-x-4 list-none mt-0.5">
            {certList.map((c, i) => {
              const cLink = c.link || c.url || c.credentialUrl || c.credential_url;
              return (
                <li key={i} className="flex flex-col">
                  <span className="font-bold">
                    {cLink ? (
                      <a href={cLink.startsWith('http') ? cLink : `https://${cLink}`} target="_blank" rel="noreferrer" className="text-black hover:underline">{c.name || c.title}</a>
                    ) : (c.name || c.title)}
                  </span>
                  <span className="text-gray-700">{c.issuer}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* TECHNICAL SKILLS */}
      {skillList.length > 0 && (
        <div>
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Technical Skills</h2>
          <div className="space-y-0.5">
            {skillList.map((skill, i) => (
              <div key={i}>
                <span className="font-bold">{skill.category || skill.name}: </span> 
                <span>{Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS & HONORS */}
      {Array.isArray(achievementsList) && achievementsList.length > 0 && (
        <div className="mb-4 mt-4">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Honors & Key Achievements</h2>
          <div className="space-y-2 text-[10.5px]">
            {achievementsList.map((achievement, index) => {
              const title = typeof achievement === 'string' ? achievement : (achievement.title || achievement.name || '');
              const bullets = (typeof achievement === 'object' && achievement !== null)
                ? ((Array.isArray(achievement.bulletPoints) && achievement.bulletPoints.length > 0)
                    ? achievement.bulletPoints
                    : (Array.isArray(achievement.highlights) && achievement.highlights.length > 0
                        ? achievement.highlights
                        : (Array.isArray(achievement.description)
                            ? achievement.description
                            : (achievement.description ? [achievement.description] : []))))
                : [];
              return (
                <div key={index}>
                  {title && <div className="font-bold">{title}</div>}
                  {bullets.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                      {bullets.filter(Boolean).map((line, bIdx) => (
                        <li key={bIdx}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    typeof achievement === 'object' && achievement.description && typeof achievement.description === 'string' && (
                      <ul className="list-disc pl-5 space-y-0.5 mt-0.5">
                        <li>{achievement.description}</li>
                      </ul>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LEADERSHIP & ACTIVITIES */}
      {leadershipList && leadershipList.length > 0 && (
        <div className="mb-4 mt-4">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Leadership & Activities</h2>
          {leadershipList.map((item, index) => {
            const org = item.organization || item.company || item.institution || item.label || '';
            const role = item.role || item.title || item.position || '';
            const start = item.startDate || item.start_date || '';
            const end = item.endDate || item.end_date || '';
            const dateStr = start || end ? `${start}${start && end ? ' - ' : ''}${end}` : '';
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
      )}

      {/* ADDITIONAL INFORMATION */}
      {((Array.isArray(additionalInfoList) && additionalInfoList.length > 0) || (typeof additionalInfoList === 'object' && Object.keys(additionalInfoList).length > 0)) && (
        <div className="mb-4 mt-4">
          <h2 className="text-[12px] font-bold uppercase mb-2 border-b-2 border-black pb-0.5">Additional Information</h2>
          {Array.isArray(additionalInfoList) ? (
            additionalInfoList.map((item, index) => {
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
                <div key={index} className="mb-2 text-xs">
                  {label && <div className="font-bold">{label}</div>}
                  {bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-0.5 mt-0.5 opacity-90">
                      {bullets.filter(Boolean).map((line, bIdx) => (
                        <li key={bIdx}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          ) : (
            Object.entries(additionalInfoList).map(([key, val], index) => (
              <div key={index} className="mb-1 text-xs">
                <span className="font-bold">{key}: </span>
                <span className="opacity-80">{Array.isArray(val) ? val.join(', ') : val}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SignatureTemplate;
