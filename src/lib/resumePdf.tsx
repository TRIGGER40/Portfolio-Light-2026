import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import {
  EXPERIENCE_TIMELINE,
  AWARDS,
  CONTACT,
  MENTORSHIP,
} from "../data/portfolioData";

const EDUCATION = [
  {
    degree: "Bachelor of Design (B.Des)",
    school: "National Institute of Design, Amaravati, Andhra Pradesh",
    period: "2015 - 2019",
    focus: "Industrial Design, UI/UX, Product Design, Design Business",
  },
  {
    degree: "Sainik School Kazhakootam",
    school: "Thiruvananthapuram, Kerala",
    period: "2012 - 2014",
    focus: "Programming, Algorithms, Computing Fundamentals",
  },
];

const SKILLS = {
  design: [
    "User Experience Design", "End-to-End Product Design", "End-to-End Delivery", "UX Strategy",
    "Interaction Design", "User-Centered Design", "Information Architecture", "Design Systems",
    "Component Libraries", "Wireframes", "Prototyping", "High-Fidelity Mockups", "Journey Maps",
    "User Stories", "Acceptance Criteria", "User Research", "Evaluative Research",
    "Usability Testing", "A/B Testing", "Experimentation", "Visual Design", "Visual Hierarchy",
    "User Flows", "Design-to-Development Handoff",
    "Accessibility (WCAG AA)", "DesignOps", "Responsive Design", "Data-Driven Design",
  ],
  tools: [
    "Figma", "Adobe XD", "Framer",
    "Adobe Creative Suite", "Miro",
    "AI Workflow Tooling (Claude, Cursor)",
    "HTML", "CSS",
  ],
  domains: [
    "Enterprise UX", "AI / Gen-AI Products", "B2B & B2C Platforms",
    "Real-time Collaboration", "SaaS", "E-Commerce", "Mobile Platforms",
    "Conversion Optimization", "Growth Design",
  ],
  soft: [
    "Design Leadership", "Product Strategy", "Feature Prioritization", "Roadmap Planning",
    "Sprint Planning", "Release Alignment", "Technical Feasibility",
    "Stakeholder Management", "Cross-functional Collaboration",
    "Mentorship", "Agile / Scrum", "Design Sprints", "Design Reviews",
    "Cross-timezone Collaboration",
  ],
};

const RESUME_EXP = EXPERIENCE_TIMELINE.filter((e) =>
  ["adobe", "yuj", "bizongo", "adobe-xd-intern"].includes(e.id)
);

const EXP_LOCATIONS: Record<string, string> = {
  'adobe':           'Bangalore, India',
  'yuj':             'Pune, India',
  'bizongo':         'Bangalore, India',
  'adobe-xd-intern': 'Bangalore, India',
};

/* Month YYYY dates for ATS compatibility */
const EXP_DATES: Record<string, string> = {
  'adobe':           'May 2022 - Present',
  'yuj':             'May 2021 - May 2022',
  'bizongo':         'Nov 2019 - May 2021',
  'adobe-xd-intern': 'Jun 2019 - Nov 2019',
};
const TOP_AWARDS = AWARDS.slice(0, 6);

const C = {
  bg: "#FFFFFF",
  text: "#1a1a1a",
  textMed: "#444444",
  textLight: "#777777",
  textMuted: "#999999",
  accent: "#111111",
  border: "#e0e0e0",
  borderLight: "#eeeeee",
  tagBg: "#f5f5f5",
  cardBg: "#fafafa",
  link: "#0055cc",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.text,
    backgroundColor: C.bg,
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 40,
  },
  header: { alignItems: "center", marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", color: C.accent, marginBottom: 3 },
  titleText: { fontSize: 10, color: C.textLight, marginBottom: 8 },
  contactRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  contactText: { fontSize: 8, color: C.textMuted },
  contactLink: { fontSize: 8, color: C.link, textDecoration: "none" },
  contactDot: { fontSize: 8, color: C.textMuted },
  section: { marginTop: 12 },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: C.textMuted,
    marginBottom: 7,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: C.borderLight,
  },
  summaryText: { fontSize: 8.5, lineHeight: 1.6, color: C.textMed },
  expEntry: { marginBottom: 10 },
  expHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
  expRole: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: C.accent },
  expCompany: { fontSize: 8, color: C.textLight, marginTop: 1 },
  expPeriod: { fontSize: 8, color: C.textMuted },
  expBullet: { flexDirection: "row", marginBottom: 2, paddingLeft: 6 },
  expBulletDash: { fontSize: 8, color: C.textMuted, width: 8 },
  expBulletText: { fontSize: 8, lineHeight: 1.4, color: C.textMed, flex: 1 },
  /* Skills — single-column labeled rows for clean ATS extraction */
  skillLine: { flexDirection: "row", marginBottom: 4, flexWrap: "wrap" },
  skillLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.textLight, marginRight: 4 },
  skillValue: { fontSize: 8, color: C.textMed, flex: 1, lineHeight: 1.5 },
  eduEntry: { marginBottom: 7 },
  eduHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
  eduDegree: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.accent },
  eduSchool: { fontSize: 8, color: C.textLight, marginTop: 1 },
  eduPeriod: { fontSize: 8, color: C.textMuted },
  eduFocus: { fontSize: 8, color: C.textMed, marginTop: 1 },
  /* Awards — single-column list for clean ATS extraction */
  awardEntry: { marginBottom: 5 },
  awardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 1 },
  awardTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.accent },
  awardDate: { fontSize: 7, color: C.textMuted },
  awardIssuer: { fontSize: 7.5, color: C.textLight },
  mentorEntry: { marginBottom: 6 },
  mentorHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
  mentorRole: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.accent },
  mentorOrg: { fontSize: 8, color: C.textLight, marginTop: 1 },
  mentorPeriod: { fontSize: 8, color: C.textMuted },
  mentorDesc: { fontSize: 8, lineHeight: 1.4, color: C.textMed, marginTop: 1 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function ResumeDocument({ showPhone = false }: { showPhone?: boolean }) {
  return (
    <Document>
      {/* Page 1 — Header, Summary, Experience */}
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>Midhun Krishnakumar</Text>
          <Text style={s.titleText}>Lead Product Designer | AI-first Design | Enterprise UX</Text>
          <View style={s.contactRow}>
            <Text style={s.contactText}>{CONTACT.location}</Text>
            {showPhone && <Text style={s.contactDot}> | </Text>}
            {showPhone && <Text style={s.contactText}>{CONTACT.phone}</Text>}
            <Text style={s.contactDot}> | </Text>
            <Link src={`mailto:${CONTACT.email}`} style={s.contactLink}>{CONTACT.email}</Link>
            <Text style={s.contactDot}> | </Text>
            <Link src={CONTACT.linkedin} style={s.contactLink}>linkedin.com/in/midhunkrishnakumar</Link>
          </View>
        </View>

        <Section title="Professional Summary">
          <Text style={s.summaryText}>
            Senior UX Designer and Lead Product Designer with 7+ years delivering AI-first, user-centered design
            for enterprise SaaS platforms at scale. Currently Lead Designer for Adobe Connect, a real-time
            collaboration platform serving millions of users globally, with end-to-end delivery ownership spanning
            product strategy, roadmap planning, feature prioritization, design systems, and design-to-development
            handoff. Consistent record of data-driven, measurable impact: 50% reduction in onboarding friction,
            35% uplift in engagement, 80% drop in operational costs (QC automation). Skilled in cross-functional
            collaboration with Product and Engineering teams, shaping user stories and acceptance criteria,
            driving sprint planning and release alignment while balancing technical feasibility with conversion
            optimization. NID Andhra Pradesh alumnus with deep expertise in enterprise UX, B2B and B2C product
            design, and generative AI-assisted workflows.
          </Text>
        </Section>

        <Section title="Experience">
          {RESUME_EXP.map((exp) => (
            <View key={exp.id} style={s.expEntry} wrap={false}>
              <View style={s.expHeader}>
                <View>
                  <Text style={s.expRole}>{exp.role}</Text>
                  <Text style={s.expCompany}>{exp.company}, {EXP_LOCATIONS[exp.id]}</Text>
                </View>
                <Text style={s.expPeriod}>{EXP_DATES[exp.id] ?? exp.period.replace(/–/g, '-')}</Text>
              </View>
              {exp.highlights
                .filter((h) => !(exp.id === "adobe-xd-intern" && h.startsWith("User Testing")))
                .slice(0, 4)
                .map((h, i) => (
                  <View key={i} style={s.expBullet}>
                    <Text style={s.expBulletDash}>-</Text>
                    <Text style={s.expBulletText}>{h}</Text>
                  </View>
                ))}
            </View>
          ))}
        </Section>
      </Page>

      {/* Page 2 — Skills, Education, Awards, Mentorship */}
      <Page size="LETTER" style={s.page}>
        <Section title="Skills">
          {(Object.entries(SKILLS) as [string, string[]][]).map(([group, tags]) => (
            <View key={group} style={s.skillLine}>
              <Text style={s.skillLabel}>
                {group === "soft" ? "Leadership:" : group.charAt(0).toUpperCase() + group.slice(1) + ":"}
              </Text>
              <Text style={s.skillValue}>{tags.join(", ")}</Text>
            </View>
          ))}
        </Section>

        <Section title="Education">
          {EDUCATION.map((edu, i) => (
            <View key={i} style={s.eduEntry} wrap={false}>
              <View style={s.eduHeader}>
                <View>
                  <Text style={s.eduDegree}>{edu.degree}</Text>
                  <Text style={s.eduSchool}>{edu.school}</Text>
                </View>
                <Text style={s.eduPeriod}>{edu.period}</Text>
              </View>
              <Text style={s.eduFocus}>{edu.focus}</Text>
            </View>
          ))}
        </Section>

        <Section title="Awards & Recognition">
          {TOP_AWARDS.map((a) => (
            <View key={a.id} style={s.awardEntry} wrap={false}>
              <View style={s.awardHeader}>
                <Text style={s.awardTitle}>{a.title}</Text>
                <Text style={s.awardDate}>{a.date}</Text>
              </View>
              <Text style={s.awardIssuer}>{a.issuer}</Text>
            </View>
          ))}
        </Section>

        <Section title="Leadership">
          {MENTORSHIP.map((m) => (
            <View key={m.id} style={s.mentorEntry} wrap={false}>
              <View style={s.mentorHeader}>
                <View>
                  <Text style={s.mentorRole}>{m.role}</Text>
                  <Text style={s.mentorOrg}>{m.org}</Text>
                </View>
                <Text style={s.mentorPeriod}>{m.period.replace(/–/g, '-')}</Text>
              </View>
              <Text style={s.mentorDesc}>{m.description}</Text>
            </View>
          ))}
        </Section>

      </Page>
    </Document>
  );
}

export async function downloadResumePdf() {
  const blob = await pdf(<ResumeDocument showPhone={false} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Midhun Krishnakumar Resume 2026.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
