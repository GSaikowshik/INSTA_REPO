import React from 'react';
import ClassicAtsTemplate from './ClassicAtsTemplate';

const AtsTemplateLibrary = ({ data = {}, templateId = 'template1' }) => {
  if (templateId === 'template1') {
    return <ClassicAtsTemplate data={data} />;
  }

  const themes = {
    template1: { name: 'Classic Professional', font: 'font-sans', headerAlign: 'text-center', primaryColor: 'text-black', borderColor: 'border-black border-b-2', headerNameStyle: 'text-3xl font-extrabold uppercase tracking-wide' },
    template2: { name: 'Modern Minimalist', font: 'font-sans', headerAlign: 'text-left', primaryColor: 'text-blue-700', borderColor: 'border-blue-200 border-b-2', headerNameStyle: 'text-3xl font-bold uppercase' },
    template3: { name: 'Tech Executive', font: 'font-serif', headerAlign: 'text-center', primaryColor: 'text-slate-900', borderColor: 'border-slate-900 border-b-4', headerNameStyle: 'text-2xl font-bold uppercase tracking-widest' },
    template4: { name: 'Startup Hustler', font: 'font-sans', headerAlign: 'text-left', primaryColor: 'text-purple-600', borderColor: 'border-purple-300 border-b', headerNameStyle: 'text-3xl font-black uppercase tracking-tighter' },
    template5: { name: 'The Developer', font: 'font-mono', headerAlign: 'text-left', primaryColor: 'text-emerald-700', borderColor: 'border-emerald-700 border-b border-dashed', headerNameStyle: 'text-2xl font-bold uppercase' },
    template6: { name: 'Corporate Grid', font: 'font-sans', headerAlign: 'text-right', primaryColor: 'text-navy-800', borderColor: 'border-gray-400 border-b-2', headerNameStyle: 'text-3xl font-bold uppercase' },
    template7: { name: 'Bold & Brash', font: 'font-sans', headerAlign: 'text-left', primaryColor: 'text-black', borderColor: 'border-black border-b-8', headerNameStyle: 'text-4xl font-black uppercase tracking-tight' },
    template8: { name: 'Academic Scholar', font: 'font-serif', headerAlign: 'text-center', primaryColor: 'text-red-900', borderColor: 'border-red-900 border-b', headerNameStyle: 'text-3xl font-bold' },
    template9: { name: 'Creative Portfolio', font: 'font-sans', headerAlign: 'text-center', primaryColor: 'text-pink-600', borderColor: 'border-pink-300 border-b', headerNameStyle: 'text-3xl font-extrabold uppercase' },
    template10: { name: 'Clean Slate', font: 'font-light', headerAlign: 'text-left', primaryColor: 'text-gray-700', borderColor: 'border-gray-200 border-b', headerNameStyle: 'text-3xl uppercase tracking-widest' }
  };

  const activeTheme = themes[templateId] || themes['template1'];
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.workExperience || data.technical_experience || data.experiences || data.work || [];
  const projList = data.projects || [];
  const eduList = data.education || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];
  const summaryText = data.summary || personal.summary || personal.bio || '';
  const leadershipList = data.leadership || data.leadership_activities || [];
  const additionalInfoList = data.additional_info || data.additionalInfo || [];

  return (
    <div className={`w-[210mm] min-h-[297mm] bg-white text-black p-8 box-border mx-auto overflow-hidden text-[10.5px] leading-snug break-words ${activeTheme.font}`}>
      
      {/* HEADER */}
      <div className={`mb-5 ${activeTheme.headerAlign}`}>
        <h1 className={`${activeTheme.headerNameStyle} ${activeTheme.primaryColor} mb-1`}>
          {personal.full_name || personal.name || 'Your Name'}
        </h1>
        <div className={`flex flex-wrap gap-x-4 gap-y-1 ${activeTheme.headerAlign === 'text-center' ? 'justify-center' : activeTheme.headerAlign === 'text-right' ? 'justify-end' : 'justify-start'} text-[10px] font-medium`}>
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="text-current no-underline hover:text-blue-600 transition-colors">
              {personal.email}
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone.replace(/[^0-9+]/g, '')}`} className="text-current no-underline hover:text-blue-600 transition-colors">
              {personal.phone}
            </a>
          )}
          {personal.location && <span>{personal.location}</span>}
          {personal.github_url && (
            <a href={personal.github_url.startsWith('http') ? personal.github_url : `https://${personal.github_url}`} target="_blank" rel="noopener noreferrer" className="text-current no-underline hover:text-blue-600 transition-colors">
              GitHub
            </a>
          )}
          {personal.linkedin_url && (
            <a href={personal.linkedin_url.startsWith('http') ? personal.linkedin_url : `https://${personal.linkedin_url}`} target="_blank" rel="noopener noreferrer" className="text-current no-underline hover:text-blue-600 transition-colors">
              LinkedIn
            </a>
          )}
          {personal.portfolio_url && (
            <a href={personal.portfolio_url.startsWith('http') ? personal.portfolio_url : `https://${personal.portfolio_url}`} target="_blank" rel="noopener noreferrer" className="text-current no-underline hover:text-blue-600 transition-colors">
              Portfolio
            </a>
          )}
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
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Work Experience</h2>
          {expList.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold w-full">
                <span className="text-[11px]">{exp.role || exp.position}</span>
                <span>{exp.start_date || exp.startDate} - {exp.end_date || exp.endDate || 'Present'}</span>
              </div>
              <div className="font-semibold italic mb-1">{exp.company || exp.organization}</div>
              <ul className="list-disc pl-5 space-y-0.5">
                {Array.isArray(exp.description) ? (
                  exp.description.filter(Boolean).map((line, dIdx) => <li key={dIdx}>{line}</li>)
                ) : exp.description ? (
                  <li>{exp.description}</li>
                ) : null}
                {exp.highlights?.map((h, j) => <li key={`h-${j}`}>{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {eduList.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Education</h2>
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
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Key Projects</h2>
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
                {(proj.techStack || proj.technologies) && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {(proj.techStack || proj.technologies).map((tech, j) => (
                      <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[9px] font-bold border border-gray-200">{tech}</span>
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
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Certifications</h2>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }} className="list-none mt-0.5">
            {certList.map((c, i) => {
              return (
                <li key={i} className="mb-0.5 flex flex-col">
                  <span className="font-bold">
                    {(() => {
                      const cLink = c.link || c.url || c.credentialUrl || c.credential_url;
                      return cLink ? (
                        <a href={cLink.startsWith('http') ? cLink : `https://${cLink}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                          {c.name || c.title}
                        </a>
                      ) : (
                        <span>{c.name || c.title}</span>
                      );
                    })()}
                  </span>
                  <span className="text-gray-700">{c.issuer}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {Array.isArray(data.achievements) && data.achievements.length > 0 && (
        <div className="mb-4">
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Honors & Achievements</h2>
          <ul className="list-disc pl-5 space-y-1">
            {data.achievements.map((ach, i) => {
              const title = typeof ach === 'string' ? ach : (ach.title || ach.name || '');
              const desc = typeof ach === 'object' ? ach.description : '';
              return (
                <li key={i}>
                  <strong>{title}</strong>{desc ? ` — ${desc}` : ''}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* TECHNICAL SKILLS */}
      {skillList.length > 0 && (
        <div>
          <h2 className={`text-[11px] font-bold uppercase mb-2 ${activeTheme.primaryColor} ${activeTheme.borderColor}`}>Technical Skills</h2>
          <div className="space-y-1">
            {skillList.map((skill, i) => (
              <div key={i}>
                <span className="font-bold">{skill.category || skill.name}: </span> 
                <span>{Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEADERSHIP & ACTIVITIES */}
      {leadershipList && leadershipList.length > 0 && (
        <div className="mb-4 mt-4">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme.primaryColor} ${activeTheme.borderColor} pb-1 mb-2`}>Leadership & Activities</h3>
          {leadershipList.map((item, index) => {
            const org = item.organization || item.company || item.institution || item.label || '';
            const role = item.role || item.title || item.position || '';
            const desc = item.description || (Array.isArray(item.highlights) ? item.highlights.join(' ') : '');
            return (
              <div key={index} className="mb-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{org}</span>
                  <span>{role}</span>
                </div>
                {desc && <p className="text-xs opacity-80 mt-1">{desc}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* ADDITIONAL INFORMATION */}
      {((Array.isArray(additionalInfoList) && additionalInfoList.length > 0) || (typeof additionalInfoList === 'object' && Object.keys(additionalInfoList).length > 0)) && (
        <div className="mb-4 mt-4">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${activeTheme.primaryColor} ${activeTheme.borderColor} pb-1 mb-2`}>Additional Information</h3>
          {Array.isArray(additionalInfoList) ? (
            additionalInfoList.map((item, index) => {
              const label = typeof item === 'object' ? (item.label || item.category || item.name || item.title || 'Details') : '';
              const val = typeof item === 'object' ? (item.value || item.details || item.description || '') : item;
              return (
                <div key={index} className="mb-1 text-xs">
                  {label && <span className="font-bold">{label}: </span>}
                  <span className="opacity-80">{val}</span>
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

export default AtsTemplateLibrary;
