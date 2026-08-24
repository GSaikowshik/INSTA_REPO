import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  BorderStyle,
  AlignmentType,
} from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generates and triggers download of a structured Microsoft Word (.docx) resume file.
 */
export async function exportToDocx(data) {
  try {
    const personal = data?.personal_info || {};
    const experiences = data?.experiences || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const projects = data?.projects || [];
    const certifications = data?.certifications || [];
    const achievements = data?.achievements || [];
    const leadership = data?.leadership || data?.leadership_activities || [];
    const additionalInfo = data?.additional_info || data?.additionalInfo || [];

    const children = [];

    // --- HEADER ---
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: personal.full_name || 'Your Full Name',
            bold: true,
            size: 32, // 16pt
            color: '0F172A',
          }),
        ],
      })
    );

    if (personal.title) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: personal.title,
              bold: true,
              size: 24, // 12pt
              color: '4F46E5',
            }),
          ],
        })
      );
    }

    // Contact Row
    const contactRuns = [];
    if (personal.email) {
      contactRuns.push(new TextRun({ text: personal.email, size: 20 }));
    }
    if (personal.phone) {
      if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: '  |  ', size: 20, color: '94A3B8' }));
      contactRuns.push(new TextRun({ text: personal.phone, size: 20 }));
    }
    if (personal.location) {
      if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: '  |  ', size: 20, color: '94A3B8' }));
      contactRuns.push(new TextRun({ text: personal.location, size: 20 }));
    }

    if (contactRuns.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spaceAfter: 200,
          children: contactRuns,
        })
      );
    }

    // Helper function for section headings
    const createSectionHeading = (title) => {
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spaceBefore: 300,
        spaceAfter: 100,
        border: {
          bottom: {
            color: '4F46E5',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            color: '4F46E5',
          }),
        ],
      });
    };

    // --- SUMMARY ---
    if (personal.summary) {
      children.push(createSectionHeading('Executive Summary'));
      children.push(
        new Paragraph({
          spaceAfter: 150,
          children: [
            new TextRun({
              text: personal.summary,
              size: 20,
            }),
          ],
        })
      );
    }

    // --- EXPERIENCE ---
    if (experiences.length > 0) {
      children.push(createSectionHeading('Work Experience'));
      experiences.forEach((exp) => {
        children.push(
          new Paragraph({
            spaceBefore: 100,
            children: [
              new TextRun({
                text: exp.role || 'Role',
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: `  (${exp.start_date || ''}${exp.start_date || exp.end_date ? ' - ' : ''}${exp.end_date || ''})`,
                size: 18,
                italics: true,
                color: '64748B',
              }),
            ],
          })
        );

        if (exp.company) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.company,
                  bold: true,
                  size: 20,
                  color: '4F46E5',
                }),
              ],
            })
          );
        }

        const bullets = (Array.isArray(exp.bulletPoints) && exp.bulletPoints.length > 0)
          ? exp.bulletPoints
          : (Array.isArray(exp.highlights) && exp.highlights.length > 0)
            ? exp.highlights
            : (Array.isArray(exp.description)
                ? exp.description
                : (typeof exp.description === 'string' && exp.description.trim() ? [exp.description] : []));

        if (Array.isArray(bullets)) {
          bullets.forEach((hl) => {
            if (hl) {
              children.push(
                new Paragraph({
                  bullet: { level: 0 },
                  children: [new TextRun({ text: hl, size: 20 })],
                })
              );
            }
          });
        }
      });
    }

    // --- EDUCATION ---
    if (education.length > 0) {
      children.push(createSectionHeading('Education'));
      education.forEach((edu) => {
        children.push(
          new Paragraph({
            spaceBefore: 100,
            children: [
              new TextRun({
                text: `${edu.degree || 'Degree'}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}`,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: `  (${edu.start_date || ''}${edu.start_date || edu.end_date ? ' - ' : ''}${edu.end_date || ''})`,
                size: 18,
                italics: true,
                color: '64748B',
              }),
            ],
          })
        );

        if (edu.institution) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  size: 20,
                  color: '4F46E5',
                }),
                edu.gpa
                  ? new TextRun({
                      text: ` | GPA: ${edu.gpa}`,
                      size: 18,
                      color: '64748B',
                    })
                  : new TextRun(''),
              ],
            })
          );
        }
      });
    }

    // --- PROJECTS ---
    if (projects.length > 0) {
      children.push(createSectionHeading('Key Projects'));
      projects.forEach((proj) => {
        children.push(
          new Paragraph({
            spaceBefore: 100,
            children: [
              new TextRun({
                text: proj.title || 'Project Title',
                bold: true,
                size: 22,
              }),
            ],
          })
        );

        if (proj.description) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: proj.description, size: 20 })],
            })
          );
        }

        if (Array.isArray(proj.technologies) && proj.technologies.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${proj.technologies.filter(Boolean).join(', ')}`,
                  size: 18,
                  italics: true,
                  color: '64748B',
                }),
              ],
            })
          );
        }
      });
    }

    // --- CERTIFICATIONS ---
    if (certifications.length > 0) {
      children.push(createSectionHeading('Certifications'));
      certifications.forEach((cert) => {
        const issueDate = cert.issue_date || cert.date || '';
        const expDate = cert.expiration_date || '';
        const dateStr = issueDate && expDate ? `${issueDate} - ${expDate}` : issueDate || expDate;

        children.push(
          new Paragraph({
            spaceBefore: 80,
            children: [
              new TextRun({
                text: cert.name || 'Certification Name',
                bold: true,
                size: 20,
              }),
              cert.issuer
                ? new TextRun({
                    text: ` - ${cert.issuer}`,
                    size: 20,
                    color: '4F46E5',
                  })
                : new TextRun(''),
              dateStr
                ? new TextRun({
                    text: `  (${dateStr})`,
                    size: 18,
                    italics: true,
                    color: '64748B',
                  })
                : new TextRun(''),
            ],
          })
        );
      });
    }

    // --- ACHIEVEMENTS & HONORS ---
    if (achievements.length > 0) {
      children.push(createSectionHeading('Honors & Key Achievements'));
      achievements.forEach((ach) => {
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

        if (title) {
          children.push(
            new Paragraph({
              spaceBefore: 60,
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 22,
                }),
              ],
            })
          );
        }

        if (bullets.length > 0) {
          bullets.filter(Boolean).forEach((pt) => {
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: String(pt), size: 20 })],
              })
            );
          });
        } else if (typeof ach === 'object' && ach.description && typeof ach.description === 'string') {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: ach.description, size: 20 })],
            })
          );
        }
      });
    }

    // --- SKILLS ---
    if (skills.length > 0) {
      children.push(createSectionHeading('Technical Skills'));
      skills.forEach((sk) => {
        const items = Array.isArray(sk.items) ? sk.items.filter(Boolean).join(', ') : sk.items || '';
        children.push(
          new Paragraph({
            spaceBefore: 60,
            children: [
              new TextRun({
                text: `${sk.category || 'Skills'}: `,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: items,
                size: 20,
              }),
            ],
          })
        );
      });
    }

    // --- LEADERSHIP & ACTIVITIES ---
    if (leadership.length > 0) {
      children.push(createSectionHeading('Leadership & Activities'));
      leadership.forEach((lead) => {
        const org = lead.organization || lead.company || lead.institution || '';
        const role = lead.role || lead.title || lead.position || '';
        const start = lead.startDate || lead.start_date || '';
        const end = lead.endDate || lead.end_date || '';
        const dateStr = start || end ? `${start}${start && end ? ' - ' : ''}${end}` : '';

        children.push(
          new Paragraph({
            spaceBefore: 120,
            children: [
              new TextRun({
                text: org,
                bold: true,
                size: 22,
              }),
              dateStr
                ? new TextRun({
                    text: `\t${dateStr}`,
                    size: 18,
                    color: '64748B',
                  })
                : new TextRun(''),
            ],
          })
        );

        if (role) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: role,
                  italics: true,
                  size: 20,
                  color: '4F46E5',
                }),
              ],
            })
          );
        }

        const bullets = (Array.isArray(lead.bulletPoints) && lead.bulletPoints.length > 0)
          ? lead.bulletPoints
          : (Array.isArray(lead.highlights) && lead.highlights.length > 0)
            ? lead.highlights
            : (Array.isArray(lead.description)
                ? lead.description
                : (lead.description ? [lead.description] : []));

        bullets.filter(Boolean).forEach((pt) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: String(pt), size: 20 })],
            })
          );
        });
      });
    }

    // --- ADDITIONAL INFORMATION ---
    if (Array.isArray(additionalInfo) && additionalInfo.length > 0) {
      children.push(createSectionHeading('Additional Information'));
      additionalInfo.forEach((item) => {
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

        if (label) {
          children.push(
            new Paragraph({
              spaceBefore: 60,
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  size: 22,
                }),
              ],
            })
          );
        }

        bullets.filter(Boolean).forEach((pt) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text: String(pt), size: 20 })],
            })
          );
        });
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${(personal.full_name || 'Resume').replace(/\s+/g, '_')}_Resume.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('DOCX Export Error:', error);
    alert('Failed to export DOCX: ' + error.message);
  }
}
