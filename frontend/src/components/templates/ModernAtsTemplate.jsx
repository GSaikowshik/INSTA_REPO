import React from 'react';

const ModernAtsTemplate = ({ data = {} }) => {
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.technical_experience || [];
  const projList = data.projects || [];
  const eduList = data.education || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];
  const achievementsList = data.achievements || [];
  const leadershipList = data.leadership || data.leadership_activities || [];
  const additionalInfoList = data.additional_info || data.additionalInfo || [];

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-0 box-border mx-auto overflow-hidden text-[10.5px] leading-snug break-words flex flex-row">
      
      {/* LEFT SIDEBAR (30%) */}
      <div className="w-[32%] bg-slate-100 p-6 border-r border-slate-200 flex flex-col justify-between">
        <div className="space-y-4">
          {/* CONTACT INFO */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1 mb-2">Contact</h2>
            <div className="space-y-1 text-[10px] text-slate-800">
              {personal.email && <div className="break-all"><span className="font-semibold text-blue-900">Email:</span> {personal.email}</div>}
              {personal.phone && <div><span className="font-semibold text-blue-900">Phone:</span> {personal.phone}</div>}
              {personal.linkedin_url && <div className="break-all"><span className="font-semibold text-blue-900">LinkedIn:</span> {personal.linkedin_url}</div>}
              {personal.github_url && <div className="break-all"><span className="font-semibold text-blue-900">GitHub:</span> {personal.github_url}</div>}
            </div>
          </div>

          {/* EDUCATION */}
          {eduList.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1 mb-2">Education</h2>
              <div className="space-y-2">
                {eduList.map((edu, i) => (
                  <div key={i} className="text-[10px]">
                    <div className="font-bold text-slate-900">{edu.institution || edu.school}</div>
                    <div className="text-blue-700 text-[9.5px]">{edu.degree || edu.area}</div>
                    <div className="text-slate-500 text-[9px]">{edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || 'Present'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {skillList.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1 mb-2">Skills</h2>
              <div className="space-y-2">
                {skillList.map((skill, i) => (
                  <div key={i} className="text-[10px]">
                    <span className="font-bold text-slate-900 block mb-0.5">{skill.category || skill.name}:</span>
                    <span className="text-slate-700 leading-tight block">
                      {Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {certList.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1 mb-2">Certifications</h2>
              <ul className="list-disc pl-3.5 space-y-1 text-[10px] text-slate-800">
                {certList.map((c, i) => (
                  <li key={i}>
                    <span className="font-semibold text-slate-900">{c.name || c.title}</span> {c.issuer ? <span className="text-slate-600">({c.issuer})</span> : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* MAIN BODY (70%) */}
      <div className="w-[68%] p-6 flex flex-col space-y-4">
        {/* HEADER */}
        <div className="border-b-2 border-blue-700 pb-3">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900">{personal.full_name || personal.name || 'Your Name'}</h1>
          {personal.title && <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mt-0.5">{personal.title}</p>}
          {personal.summary && <p className="text-[10px] text-slate-600 mt-2 leading-relaxed">{personal.summary}</p>}
        </div>

        {/* WORK EXPERIENCE */}
        {expList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">Work Experience</h2>
            <div className="space-y-3">
              {expList.map((exp, i) => (
                <div key={i} className="text-[10.5px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.role || exp.position} <span className="font-normal text-slate-600">at</span> {exp.company || exp.organization}</span>
                    <span className="text-[9.5px] text-slate-500 font-normal">{exp.start_date || exp.startDate} – {exp.end_date || exp.endDate || 'Present'}</span>
                  </div>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-700 text-[10px]">
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
          </div>
        )}

        {/* PROJECTS */}
        {projList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">Projects</h2>
            <div className="space-y-3">
              {projList.map((proj, i) => (
                <div key={i} className="text-[10.5px]">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{proj.title || proj.name}</span>
                    <span className="text-[9.5px] text-slate-500 font-normal">{proj.date || proj.year || ''}</span>
                  </div>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-700 text-[10px]">
                    {proj.highlights?.map((h, j) => <li key={j}>{h}</li>)}
                    {proj.description && !proj.highlights && <li>{proj.description}</li>}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACHIEVEMENTS & HONORS */}
        {achievementsList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">Honors & Key Achievements</h2>
            <div className="space-y-2 text-slate-700 text-[10px]">
              {achievementsList.map((achievement, i) => {
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
                  <div key={i}>
                    {title && <div className="font-bold text-slate-900">{title}</div>}
                    {bullets.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                        {bullets.filter(Boolean).map((line, bIdx) => (
                          <li key={bIdx}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      typeof achievement === 'object' && achievement.description && typeof achievement.description === 'string' && (
                        <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
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
        {leadershipList.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">Leadership & Activities</h2>
            <div className="space-y-3">
              {leadershipList.map((item, i) => {
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
                  <div key={i} className="text-[10.5px]">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{org}</span>
                      {dateStr && <span className="text-[9.5px] text-slate-500 font-normal">{dateStr}</span>}
                    </div>
                    {role && <div className="text-blue-900 font-medium text-[10px]">{role}</div>}
                    {bullets.length > 0 && (
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 text-slate-700 text-[10px]">
                        {bullets.filter(Boolean).map((line, j) => (
                          <li key={j}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADDITIONAL INFORMATION */}
        {((Array.isArray(additionalInfoList) && additionalInfoList.length > 0) || (typeof additionalInfoList === 'object' && Object.keys(additionalInfoList).length > 0)) && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 border-b border-slate-200 pb-1 mb-2">Additional Information</h2>
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
                  <div key={index} className="mb-2 text-[10px] text-slate-700">
                    {label && <div className="font-bold text-slate-900">{label}</div>}
                    {bullets.length > 0 && (
                      <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
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
                <div key={index} className="mb-1 text-[10px] text-slate-700">
                  <span className="font-bold text-slate-900">{key}: </span>
                  <span className="opacity-80">{Array.isArray(val) ? val.join(', ') : val}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ModernAtsTemplate;
