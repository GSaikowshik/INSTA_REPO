import React from 'react';

const DefaultAtsTemplate = ({ data = {} }) => {
  // Aggressive fallbacks to ensure absolutely no data is ever missed
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.workExperience || data.technical_experience || [];
  const projList = data.projects || [];
  const eduList = data.education || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];
  const summaryText = data.summary || personal.summary || personal.bio || '';
  const leadershipList = data.leadership || data.leadership_activities || [];
  const additionalInfoList = data.additional_info || data.additionalInfo || [];

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white text-black p-8 box-border mx-auto overflow-hidden text-[10.5px] leading-snug font-sans">
      
      {/* HEADER (Strict Left/Right Flexbox to prevent overlap) */}
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[60%]">
          <h1 className="text-2xl font-bold uppercase text-black">{personal.full_name || personal.name || 'Your Name'}</h1>
          <div className="mt-1 text-black">
            {personal.linkedin_url && <div>LinkedIn: {personal.linkedin_url.replace('https://', '')}</div>}
            {personal.github_url && <div>GitHub: {personal.github_url.replace('https://', '')}</div>}
          </div>
        </div>
        <div className="text-right text-black">
          {personal.email && <div>Email: {personal.email}</div>}
          {personal.phone && <div>Mobile: {personal.phone}</div>}
          {personal.portfolio_url && <div>Portfolio: {personal.portfolio_url.replace('https://', '')}</div>}
        </div>
      </div>

      {/* PROFESSIONAL SUMMARY */}
      {summaryText && (
        <div className="mb-4">
          <p className="text-xs opacity-85 leading-relaxed">{summaryText}</p>
        </div>
      )}

      {/* EDUCATION */}
      {eduList.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5 text-black">Education</h2>
          {eduList.map((edu, i) => (
            <div key={i} className="mb-1 text-black">
              <div className="flex justify-between font-bold w-full">
                <span>{edu.institution || edu.school}</span>
                <span>{edu.start_date || edu.startDate} - {edu.end_date || edu.endDate || 'Present'}</span>
              </div>
              <p>{edu.degree || edu.area}</p>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {skillList.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5 text-black">Skills Summary</h2>
          <ul className="list-disc pl-5 space-y-0.5 text-black">
            {skillList.map((skill, i) => (
              <li key={i}>
                <span className="font-bold">{skill.category || skill.name}: </span> 
                {Array.isArray(skill.items || skill.keywords) ? (skill.items || skill.keywords).join(', ') : (skill.items || skill.keywords)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {expList.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5 text-black">Work Experience</h2>
          {expList.map((exp, i) => (
            <div key={i} className="mb-2 text-black">
              <div className="flex justify-between font-bold w-full">
                <span>{exp.role || exp.position} | {exp.company || exp.organization}</span>
                <span>{exp.start_date || exp.startDate} - {exp.end_date || exp.endDate || 'Present'}</span>
              </div>
              <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                {exp.highlights?.map((h, j) => <li key={j}>{h}</li>)}
                {exp.description && !exp.highlights && <li>{exp.description}</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS */}
      {projList.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5 text-black">Projects</h2>
          {projList.map((proj, i) => (
            <div key={i} className="mb-2 text-black">
              <div className="flex justify-between font-bold w-full">
                <span>{proj.title || proj.name}</span>
                <span>{proj.date || proj.year || ''}</span>
              </div>
              <ul className="list-disc pl-5 mt-0.5 space-y-0.5">
                {proj.highlights?.map((h, j) => <li key={j}>{h}</li>)}
                {proj.description && !proj.highlights && <li>{proj.description}</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* CERTIFICATIONS */}
      {certList.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5 text-black">Certification</h2>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }} className="list-disc pl-4 mt-0.5 text-black">
            {certList.map((c, i) => (
              <li key={i} className="mb-0.5">
                <span className="font-bold">{c.name || c.title}</span> {c.issuer ? `(${c.issuer})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* LEADERSHIP & ACTIVITIES */}
      {leadershipList && leadershipList.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-blue-800 border-b pb-1 mb-2">Leadership & Activities</h3>
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
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-blue-800 border-b pb-1 mb-2">Additional Information</h3>
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

export default DefaultAtsTemplate;
