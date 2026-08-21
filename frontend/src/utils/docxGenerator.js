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

        if (exp.description) {
          children.push(
            new Paragraph({
              spaceAfter: 60,
              children: [
                new TextRun({
                  text: exp.description,
                  size: 20,
                }),
              ],
            })
          );
        }

        if (Array.isArray(exp.highlights)) {
          exp.highlights.forEach((hl) => {
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
