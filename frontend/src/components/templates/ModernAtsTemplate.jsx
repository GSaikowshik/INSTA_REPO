import React from 'react';

const ModernAtsTemplate = ({ data = {} }) => {
  const personal = data.personal_info || data.basics || {};
  const expList = data.experience || data.work_experience || data.technical_experience || [];
  const projList = data.projects || [];
  const eduList = data.education || [];
  const certList = data.certifications || [];
  const skillList = data.skills || [];

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
      </div>

    </div>
  );
};

export default ModernAtsTemplate;
