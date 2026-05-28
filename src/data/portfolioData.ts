export const QUICK_TAGS = [
  "Adobe Connect",
  "AI Initiatives",
  "Enterprise UX",
  "Design Systems",
  "Breakout Rooms",
  "Notifications",
  "UX Northstar",
] as const;

export const SEARCH_PROMPTS = [
  "What has Midhun built at Adobe?",
  "Show AI projects",
  "Why hire this designer?",
  "Tell me about enterprise experience",
  "Show leadership experience",
  "What are his impact metrics?",
  "Tell me about Design Systems work",
] as const;

export interface CaseStudySection {
  title: string;
  content: string | string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  category: string;
  opportunity: string;
  actions: string[];
  outcomes: string[];
  metrics?: string[];
  timeFrame: string;
  tags: string[];
  link?: string;
  thumbnail?: string;
  /** Additional sections matching original portfolio page structure */
  sections?: CaseStudySection[];
  /** Mark as featured — appears in the Featured section of AllWorksPage */
  featured?: boolean;
  /** Short card description for featured cards on AllWorksPage */
  cardDesc?: string;
  /** Single key metric string shown as a pill on cards and case study pages */
  metric?: string;
  /** Hero image path (with leading /) for MinimalCaseStudyPage */
  heroImage?: string;
  /** External CTA link for MinimalCaseStudyPage (e.g. Figma prototype) */
  viewWorksLink?: string;
  /** Back navigation path used in MinimalCaseStudyPage */
  backTo?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  highlights: string[];
  tags: string[];
  stats?: string[];
  link?: string;
  /** Short paragraph describing what was done at this company */
  summary?: string;
}

export interface AIWork {
  id: string;
  title: string;
  description: string;
  impact: string[];
  tags: string[];
}

export interface ImpactMetric {
  label: string;
  value: string;
  context: string;
  projectId?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "almvc",
    title: "Building Adobe's native virtual classroom",
    company: "Adobe",
    category: "0→1 Product",
    opportunity: "Adobe Learning Manager had no native virtual classroom. As lead designer, I drove the 0→1 build of the full live session experience: joining flows, breakout room orchestration, AI-assisted engagement, and post-session recording, for an enterprise product serving corporate and academic users at scale.",
    actions: ["0→1 product UX direction", "Built joining & exit flows from scratch", "AI-assisted engagement systems", "Breakout orchestration and recording intelligence"],
    outcomes: ["First native virtual classroom inside Adobe Learning Manager", "Full session lifecycle owned end-to-end", "AI-assisted engagement shipped as a core feature", "Recording viewer built as a structured learning asset"],
    metrics: ["New launch", "5+ feature areas built from scratch"],
    timeFrame: "6 Months",
    tags: ["Adobe Learning Manager", "Enterprise UX", "AI"],
    link: "https://midhunkrishnakumar-portfolio.vercel.app/work/almvc",
    thumbnail: "Projectcard-images/ALMVC hero image.webp",
    featured: true,
    cardDesc: "Adobe Learning Manager had no native virtual classroom. 0→1 build of the full live session experience: joining flows, breakout orchestration, AI-assisted engagement, and a structured recording viewer.",
    metric: "5+ workflow areas built from scratch",
    heroImage: "/Projectcard-images/ALMVC hero image.webp",
    backTo: "/work/all?company=Adobe",
  },
  {
    id: "quiz-pod",
    title: "Real-time quiz delivery inside a live session",
    company: "Adobe",
    category: "Feature Design",
    opportunity: "Hosts needed to assess participant engagement mid-session without leaving the room or switching tools. I designed Quiz Pod as a net-new feature within Adobe Connect's live pod ecosystem, enabling quiz creation and delivery inside an active session. Host efficiency improved by 50%.",
    actions: ["Designed Quiz pod as new feature", "Leveraged Connect's customizable pod architecture", "Mobile-friendly approach"],
    outcomes: ["Create and conduct quiz within seconds", "A quick way to assess students", "Mobile friendly approach"],
    metrics: ["50% boost in host efficiency", "90% faster quiz creation vs. manual"],
    timeFrame: "3 Weeks",
    tags: ["Adobe Connect", "Enterprise UX"],
    link: "https://www.midhunkrishnakumar.info/adobe-connect-quiz-pod",
    thumbnail: "Projectcard-images/quiz pod.webp",
    featured: true,
    cardDesc: "Hosts needed to assess participant engagement mid-session without leaving the room or switching tools. Quiz Pod was designed as a net-new feature inside the live pod ecosystem.",
    metric: "90% faster quiz creation",
    heroImage: "/Projectcard-images/quiz pod.webp",
    backTo: "/work/all?company=Adobe",
  },
  {
    id: "event-joining",
    title: "Cutting session entry friction by 50%",
    company: "Adobe",
    category: "UX Redesign",
    opportunity: "The pre-session device setup screen was a known drop-off point for first-time users. I redesigned the device preference flow to retain previous settings and surface controls more clearly, reducing setup time by 50% for both new and returning participants.",
    actions: ["Redesigned device preference flow", "Retained earlier device setups for easy joining", "Simplified preference scanning"],
    outcomes: ["Retaining earlier device setups for easy joining", "Reduced time spent on device preference screen by 50%", "Users able to scan faster and understand their device preferences", "Mobile friendly approach"],
    metrics: ["50% reduction in setting up time", "2x faster room entry for returning users"],
    timeFrame: "4 Sprints; 8 Weeks",
    tags: ["Adobe Connect", "Enterprise UX", "Notifications"],
    link: "https://www.midhunkrishnakumar.info/event-joining-experience",
    thumbnail: "Projectcard-images/joining screen.webp",
    featured: true,
    cardDesc: "The pre-session device setup screen was a known drop-off point for first-time users. Redesigned the device preference flow to retain previous settings and surface controls more clearly.",
    metric: "50% reduction in setup time",
    heroImage: "/Projectcard-images/joining screen.webp",
    backTo: "/work/all?company=Adobe",
  },
  {
    id: "connect-homepage",
    title: "Revamping Adobe Connect homepage",
    company: "Adobe",
    category: "UX",
    opportunity: "Adobe Connect Central is the creation and management hub for all webinars and trainings. The existing interface lacked hierarchy, discoverability, and modern usability standards.",
    actions: ["Redesigned creation and management hub", "Customisable widget interface", "Improved content hierarchy"],
    outcomes: [
      "35% increase in user engagement post-launch.",
      "28% faster navigation to key actions.",
      "Customisable widget interface tailored to user workflows.",
      "Sleeker, modernised look with improved content hierarchy.",
    ],
    metrics: ["35% increase in user engagement", "28% faster navigation to key actions"],
    timeFrame: "8 Sprints; 16 Weeks",
    tags: ["Adobe Connect", "Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/adobe",
    thumbnail: "Projectcard-images/Connect central revamp.webp",
    metric: "35% increase in engagement",
    heroImage: "/Projectcard-images/Connect central revamp.webp",
    backTo: "/work/all?company=Adobe",
  },
  {
    id: "adobe-visual-design",
    title: "Visual design works at Adobe",
    company: "Adobe",
    category: "UX",
    opportunity: "Core UI revamps across Adobe Connect to modernise the visual language, improve consistency with Adobe Spectrum, and elevate the overall design quality for enterprise users.",
    actions: ["Core UI revamps across Adobe Connect", "Figma prototypes for design exploration"],
    outcomes: [
      "25% reduction in UI support tickets after visual revamps.",
      "100% of active Connect users impacted through shipped UI updates.",
      "Stronger alignment with Adobe Spectrum design system.",
      "Established a visual foundation for future AI-powered features.",
    ],
    metrics: ["25% reduction in UI support tickets", "Positive business impact"],
    timeFrame: "Ongoing",
    tags: ["Adobe Connect", "Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/adobe",
    thumbnail: "Projectcard-images/visual revamp.webp",
    metric: "Positive business impact",
    heroImage: "/Projectcard-images/visual revamp.webp",
    backTo: "/work/all?company=Adobe",
    viewWorksLink: "https://www.figma.com/proto/a4yZ9Jxsyqdu0jAdka0h8m/Visual-design-projects?page-id=0%3A1&node-id=28-12185&viewport=-1868%2C-3809%2C0.32&t=hnTglz0kPoWtwOtl-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=28%3A12185",
  },
  {
    id: "mobile-revamp",
    title: "Adobe Connect Mobile App Revamp",
    company: "Adobe",
    category: "UX",
    opportunity: "The Adobe Connect mobile experience was lagging behind modern user expectations, with outdated UX patterns and broken core journeys. Critical entry points such as onboarding, login, and calendar workflows created friction, limiting adoption despite strong in-room capabilities.",
    actions: [
      "Proactively identified the UX gap and initiated a product-wide conversation",
      "Aligned stakeholders and secured leadership buy-in for a full overhaul",
      "Drove a complete UX redesign focused on intuitive navigation and mobile-first learning",
      "Streamlined key user journeys including session discovery and joining",
    ],
    outcomes: [
      "Increased mobile usage from 11% to 23% post-launch, more than doubling adoption.",
      "Improved first-time user experience and session join success rates.",
      "Streamlined key user journeys: session discovery, joining, and calendar workflows.",
      "Established a scalable foundation for future mobile enhancements.",
    ],
    metrics: ["Mobile usage doubled: 11% → 23%", "Improved session join success rates"],
    timeFrame: "3 Weeks",
    tags: ["Adobe Connect", "Mobile UX", "Enterprise UX"],
    thumbnail: "Projectcard-images/Mobile revamp.webp",
    metric: "Mobile usage: 11% → 23%",
    heroImage: "/Projectcard-images/Mobile revamp.webp",
    backTo: "/work/all?company=Adobe",
  },
  {
    id: "bizongo-ums",
    title: "Managing users effectively",
    company: "Bizongo",
    category: "UX",
    opportunity: "User Management System was handled entirely from the backend until 2020. Bringing all features to the front end and making it intuitive for admins without engineering dependency was the core challenge.",
    actions: ["Redesigned UMS for front-end management", "Simplified data hierarchy", "Created intuitive UI for roles, permissions, users, and companies"],
    outcomes: [
      "50% faster user onboarding for new team members.",
      "30% reduction in operational errors across user management tasks.",
      "Zero engineering dependency for user admin operations.",
      "Intuitive UI enabled non-technical admins to onboard without formal training.",
    ],
    metrics: ["30% reduction in operational errors", "50% faster user onboarding", "Zero engineering dependency for user admin"],
    timeFrame: "1 Sprint; 2 Weeks",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongoums",
    thumbnail: "Projectcard-images/Bizongo UMS.webp",
    metric: "50% faster user onboarding",
    heroImage: "/Projectcard-images/Bizongo UMS.webp",
    backTo: "/work/all?company=Bizongo",
    sections: [
      {
        title: "The Challenge",
        content:
          "User Management System (UMS) was handled entirely from the backend until 2020. The challenge was to bring all management features upfront and make the experience as intuitive as possible for new users to onboard quickly, reducing dependency on technical teams for day-to-day user administration.",
      },
      {
        title: "Approach",
        content: [
          "Redesigned UMS for front-end management, moving control from backend to a self-service interface",
          "Simplified data hierarchy to make roles, permissions, users, and companies easier to understand and manage",
          "Created intuitive UI flows for Add/Edit/Delete operations across User Roles & Permissions, Users, and Companies",
          "Designed for non-technical admins to perform user management without training",
        ],
      },
      {
        title: "Solution",
        content: [
          "One-stop interface for managing user roles, permissions, users, and companies",
          "Clear visual hierarchy and navigation for complex data relationships",
          "Bulk actions and filters to reduce repetitive administrative tasks",
          "Audit-friendly structure with clear ownership and visibility",
        ],
      },
      {
        title: "Impact",
        content: [
          "Simplified existing data with the new hierarchy, making it easier for teams to understand and maintain",
          "User management maintenance time reduced significantly",
          "Easily Add/Delete User Roles & Permissions; Users; Companies without engineering support",
          "Intuitive UI enabled new users to onboard and manage without formal training",
          "Improved vendor product adoption and user adoption without needing to train",
        ],
      },
      {
        title: "Outcomes",
        content: [
          "Reduced product onboarding time by 50%",
          "Improved user adoption without requiring training sessions",
          "User management shifted from engineering to business teams",
          "Consistent, scalable pattern for future admin features",
        ],
      },
    ],
  },
  {
    id: "bizongo-qc",
    title: "80% faster warehouse quality checks",
    company: "Bizongo",
    category: "Workflow Redesign",
    opportunity: "Manual inward quality checks were slow and error-prone, adding operational cost to every inbound delivery. I redesigned the QC workflow inside the DCMS to reflect how floor executives actually work, cutting check time by 80% across 1,000+ daily operations users.",
    actions: ["Revamped existing DCMS structure", "Modified QC processes to fit the real scenario", "Designed for executives to complete QC faster"],
    outcomes: ["80% reduction in QC time at warehouses", "Modified existing QC processes to fit in the real scenario", "Reduced Warehouse cost + Increased efficiency"],
    metrics: ["80% reduction in QC time", "Significant warehouse cost savings", "1,000+ daily operations users impacted"],
    timeFrame: "2 Sprints; 4 Weeks",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongoqc",
    thumbnail: "Projectcard-images/QC improvement.webp",
    featured: true,
    cardDesc: "Manual inward quality checks were slow and error-prone. Redesigned the QC workflow inside Bizongo DCMS to reflect how floor executives actually work.",
    metric: "80% reduction in QC time",
    heroImage: "/Projectcard-images/QC improvement.webp",
    backTo: "/work/all?company=Bizongo",
  },
  {
    id: "bizongo-artwork-flow",
    title: "Seamless approval workflow creation",
    company: "Bizongo",
    category: "UX",
    opportunity: "Artwork Flow's workflow setup UI had evolved organically and needed to become more intuitive as the product scaled to hundreds of teams managing complex approval chains.",
    actions: ["Redesigned workflow setup for Artwork Flow", "Divided approval tasks into stages", "Improved stage settings visibility"],
    outcomes: [
      "60% reduction in workflow setup time.",
      "Drag and drop adoption across 200+ teams.",
      "Visibility of stage settings upfront reduced back-and-forth.",
      "Better scalability as teams grew and approval chains became more complex.",
    ],
    metrics: ["60% reduction in workflow setup time", "Drag & drop adoption across 200+ teams"],
    timeFrame: "1 Sprint; 2 Weeks",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongo",
    thumbnail: "Projectcard-images/Seamless approval workflow.webp",
    metric: "60% less workflow setup time",
    heroImage: "/Projectcard-images/Seamless approval workflow.webp",
    backTo: "/work/all?company=Bizongo",
  },
  {
    id: "bizongo-contracts",
    title: "Modular contract / T&C creation",
    company: "Bizongo",
    category: "UX",
    opportunity: "Bizongo handles hundreds of clients with distinct terms. Creating customised contracts with minimal effort while keeping everything trackable and audit-ready was critical at scale.",
    actions: ["Designed one-stop contract creation flow", "Enabled tracking and maintaining all contracts", "Built signoff feature for new contracts"],
    outcomes: [
      "70% faster contract creation compared to the previous process.",
      "100+ active client contracts managed in one place.",
      "Sign-off feature enabled fully digital contract closure.",
      "Modular clause builder allowed reuse across contract types.",
    ],
    metrics: ["70% faster contract creation", "100+ active client contracts managed"],
    timeFrame: "1 Sprint; 2 Weeks",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongo",
    thumbnail: "Projectcard-images/Digital contract creation.webp",
    metric: "70% faster contract creation",
    heroImage: "/Projectcard-images/Digital contract creation.webp",
    backTo: "/work/all?company=Bizongo",
  },
  {
    id: "yuj-heuristics",
    title: "Heuristics Evaluation Improvement",
    company: "YUJ Designs",
    category: "UX",
    opportunity: "Design evaluations at YUJ needed to be more systematic and repeatable. Ad-hoc heuristic reviews were inconsistent across client projects, reducing their credibility and impact.",
    actions: ["Implemented structured evaluation framework", "Research to implementation of features"],
    outcomes: [
      "40% improvement in heuristic evaluation scores across reviewed products.",
      "30% faster task completion for end users after implementing recommendations.",
      "Structured evaluation framework reused across multiple client engagements.",
      "Findings directly translated into actionable redesign priorities.",
    ],
    metrics: ["40% improvement in heuristic scores", "30% faster task completion for end users"],
    timeFrame: "2021",
    tags: ["Enterprise UX", "UX Northstar"],
    link: "https://www.midhunkrishnakumar.info/yuj",
    thumbnail: "Projectcard-images/Heuristics evaluation.webp",
    metric: "40% better heuristic scores",
    heroImage: "/Projectcard-images/Heuristics evaluation.webp",
    backTo: "/work/all",
  },
  {
    id: "bizongo-ecom",
    title: "$2M in PPE sales. Shipped in 4 weeks.",
    company: "Bizongo",
    category: "B2B Platform",
    opportunity: "When PPE kit demand surged in early 2020, Bizongo needed a procurement experience that non-specialist buyers could navigate under pressure. I designed a purpose-built B2B portal with B2C-grade clarity, launched in under 4 weeks, generating over $2M in sales.",
    actions: ["Designed dedicated E-com portal for PPE Kits", "Compressed complex B2B flows into accessible experience", "Created COVID-19 resources knowledge section"],
    outcomes: ["Sold $2M+ worth of PPE Kits", "Compressed complex B2B flows", "Accessibility and easy to browse", "Giving knowledge on COVID-19 resources"],
    metrics: ["$2M+ in PPE kit sales", "10,000+ orders fulfilled", "Launched in under 4 weeks"],
    timeFrame: "2 Sprints; 4 Weeks",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongo-ecom",
    thumbnail: "Projectcard-images/PPE.webp",
    featured: true,
    cardDesc: "When PPE kit demand surged in early 2020, designed a purpose-built B2B portal with B2C-grade clarity. Launched in under 4 weeks, generating over $2M in sales.",
    metric: "$2M+ in PPE kit sales",
    heroImage: "/Projectcard-images/PPE.webp",
    backTo: "/work/all?company=Bizongo",
  },
  {
    id: "bizongo-design-system",
    title: "Managing and updating design system",
    company: "Bizongo",
    category: "Design Systems",
    opportunity: "Bizongo's design system was derived from Ant Design but needed significant modification to fit B2B use cases, with proper documentation and component coverage across 5 product verticals.",
    actions: ["Created major component documentation", "Researched best design elements", "Added illustrations for Design System", "Modified Ant Design to fit use-cases"],
    outcomes: [
      "50%+ reduction in feature development time through reusable components.",
      "60% faster designer onboarding with comprehensive documentation.",
      "Unified visual language across 5 product verticals.",
      "Forecasted and incorporated latest design trends into the system.",
    ],
    metrics: ["50%+ reduction in feature dev time", "60% faster designer onboarding", "Unified 5 product verticals"],
    timeFrame: "1+ yr",
    tags: ["Enterprise UX", "Design Systems"],
    link: "https://www.midhunkrishnakumar.info/bizongo",
    thumbnail: "Projectcard-images/Maintaining design systems.webp",
    metric: "50%+ reduction in feature dev time",
    heroImage: "/Projectcard-images/Maintaining design systems.webp",
    backTo: "/work/all?company=Bizongo",
  },
  {
    id: "nid-ui-ux-course",
    title: "UI/UX Course & Workshops",
    company: "NID Andhra Pradesh",
    category: "Mentorship",
    opportunity: "Guiding third-year design students at NID Andhra Pradesh in UI/UX methodologies through coursework, workshops, and hands-on project work to bridge the gap between theory and practice.",
    actions: [
      "Visiting faculty for 3rd year students",
      "Workshops on UX design methodologies",
      "Design workshops and collaborative team activities",
      "Mentored student UX projects end-to-end",
    ],
    outcomes: [
      "30+ students mentored through structured coursework and workshops.",
      "7+ end-to-end UX projects shipped by students under mentorship.",
      "3 structured design workshops conducted on UX research and prototyping.",
      "Students equipped with practical skills directly applicable to industry roles.",
    ],
    metrics: ["7+ end-to-end UX projects shipped", "30+ students mentored", "3 design workshops conducted"],
    timeFrame: "2022",
    tags: ["Mentorship", "Leadership"],
    link: "https://www.midhunkrishnakumar.info/nid-ap",
    thumbnail: "images/case-studies/nid-ui-ux-course.webp",
    metric: "30+ students mentored",
    heroImage: "/images/case-studies/nid-ui-ux-course.webp",
    backTo: "/work/all",
  },
  {
    id: "iit-branding",
    title: "Branding for Local Poultry Farmers",
    company: "IIT Guwahati",
    category: "Internship",
    opportunity: "Creating a complete branding and marketing presence for local poultry farmers to help them expand into Tier-1 cities. The challenge was building brand trust and accessibility for a traditionally unbranded market.",
    actions: ["Created branding for local poultry farmers", "Designed E-Com website and shop", "Marketing guidelines to expand into Tier-1 cities"],
    outcomes: [
      "Full brand identity delivered: logo, colour system, typography.",
      "E-commerce site and retail packaging designed end-to-end.",
      "Marketing guidelines prepared for entry into 3 Tier-1 cities.",
      "Positioned local produce as premium with a modern brand narrative.",
    ],
    metrics: ["Full brand identity delivered", "E-commerce site + retail packaging designed", "Market-ready for 3 Tier-1 cities"],
    timeFrame: "2 months",
    tags: ["Brand Strategy", "E-Commerce", "Marketing"],
    link: "https://www.midhunkrishnakumar.info/iit",
    thumbnail: "Projectcard-images/POULTRY BRANDING.webp",
    metric: "Full brand identity delivered",
    heroImage: "/Projectcard-images/POULTRY BRANDING.webp",
    backTo: "/work/all",
  },
  {
    id: "npol-ctd-probe",
    title: "XCTD Probe Interface Design",
    company: "NPOL DRDO",
    category: "Internship",
    opportunity: "Designing a re-usable CTD (Conductivity, Temperature, Depth) probe structure for naval applications at the Naval Physical and Oceanographic Laboratory under DRDO. The challenge was designing under strict operational and safety constraints.",
    actions: ["Designed re-usable CTD probe structure", "Worked on CAD and Structural design softwares", "Design inducted into Indian Navy"],
    outcomes: [
      "Design inducted into the Indian Navy in April 2018.",
      "Structural validation passed on first review.",
      "Re-usable probe structure reduced per-deployment cost significantly.",
      "Early exposure to designing under defence-grade constraints shaped a systems-first design approach.",
    ],
    metrics: ["Design inducted into Indian Navy", "Structural validation passed on first review"],
    timeFrame: "2 months",
    tags: ["Product Design", "CAD", "Defence"],
    link: "https://www.midhunkrishnakumar.info/npol",
    thumbnail: "Projectcard-images/npol-ctd-probe.webp",
    metric: "Inducted design into Navy",
    heroImage: "/Projectcard-images/npol-ctd-probe.webp",
    backTo: "/work/all",
  },
];

// Projects with dedicated case study pages that don't follow /work/:id
const DEDICATED_ROUTES: Record<string, string> = {
  'almvc':         '/work/almvc',
  'quiz-pod':      '/work/quiz',
  'event-joining': '/work/joining',
  'bizongo-qc':    '/work/qc',
  'bizongo-ecom':  '/work/ppe',
  'npol-ctd-probe':'/work/drdo-xctd',
};

// Single source of truth — falls back to /work/:id for all other projects
export function getProjectRoute(id: string): string {
  return DEDICATED_ROUTES[id] ?? `/work/${id}`;
}

export const FEATURED_PROJECT_IDS = [
  "almvc",
  "event-joining",
  "bizongo-qc",
  "connect-homepage",
] as const;

export const AWARDS: Award[] = [
  {
    id: "product-sheriff-sep-2025",
    title: "Product Sheriff of the Month",
    issuer: "Adobe Connect All Hands",
    date: "Sep 2025",
    description: "Recognized for handling and championing UI revamp changes on short notice, guiding the team with clarity, and delivering high-quality experiences under tight timelines.",
  },
  {
    id: "extreme-ownership-q1-2025",
    title: "Extreme Ownership",
    issuer: "Adobe · DALP Awards Q1 2025",
    date: "Feb 2025",
    description: "Awarded for driving innovation in Adobe Connect, shaping its product vision, championing exceptional UX, and leading multiple AI features aligned with the latest industry standards.",
  },
  {
    id: "extreme-ownership-q3-2024",
    title: "Extreme Ownership",
    issuer: "Adobe · DALP Awards Q3 2024",
    date: "Nov 2024",
    description: "Honored for exceptional contributions to AI initiatives within Adobe Connect, driving impactful solutions, full accountability, and AI integrations that exceed user expectations.",
  },
  {
    id: "kudos-2023",
    title: "Kudos Award",
    issuer: "Adobe Design India",
    date: "Jan 2023",
    description: "Peer recognition Q1 2023: for being super-efficient, collaborative, resourceful, and going beyond core work in product, website & marketing. Explored how new technology shapes the future of the space.",
  },
  {
    id: "bravo-2022",
    title: "Bravo Award",
    issuer: "Adobe Design India",
    date: "Oct 2022",
    description: "Team recognition Q4 2022: for the incredibly infectious energy, passion for the product, and extending the same energy into executing for the brand team in DesignMix.",
  },
  {
    id: "most-enthusiastic-2021",
    title: "Most Enthusiastic Person",
    issuer: "Bizongo · BGEP Awards 2021",
    date: "Jan 2022",
    description: "The person who is very enthusiastic about new challenges, has a never say die attitude, looks to solve problems, and creates a positive impact on the team.",
  },
  {
    id: "spot-award-2021",
    title: "SPOT Award",
    issuer: "Bizongo · BGEP Quarterly Awards",
    date: "Nov 2021",
    description: "Team recognition for UX across PODs: Supply Chain, Cataloguing, Artwork Flow. Outstanding work on user-flows, Parallel stage, Printer workflow, and E-sign feature.",
  },
  {
    id: "star-of-the-week-2021",
    title: "Star of the Week",
    issuer: "Bizongo",
    date: "Oct 2021",
    description: "Handled new design flows and AR 2.0 feature flows across Partner Hub, GoPartner and GoOps meticulously in a very short period. Collaborated well with stakeholders.",
  },
  {
    id: "upscaling-award-2021",
    title: "Upscaling Award",
    issuer: "Bizongo · Individual contribution",
    date: "Jun 2021",
    description: "For the great effort put in to design experiences for Kranti COVID-19 Website.",
  },
  {
    id: "extra-mile-2020",
    title: "Extra Mile Award",
    issuer: "Bizongo · Quarterly BGEP Awards",
    date: "Jul 2020",
    description: "Worked round-the-clock for bringing out designs for new PPE flows on the main Bizongo website and COVID partnership pages, in really tight deadlines.",
  },
  {
    id: "spot-award-2020",
    title: "SPOT Award",
    issuer: "Bizongo · Quarterly BGEP Awards",
    date: "May 2020",
    description: "For bringing infectious energy and spirit to the team. Great job on the quick, effective work for the COVID website. Feedback received: 'Great sense of product development and ideation'.",
  },
];

export const EXPERIENCE_TIMELINE: Experience[] = [
  {
    id: "adobe",
    company: "Adobe Inc.",
    role: "Lead Designer, Adobe Connect",
    period: "May 2022 – Present",
    duration: "Since May 2022",
    stats: [
      "50% less first-time device setup friction",
      "40% faster content creation (AI-driven)",
      "Positive business impact through UI revamps",
    ],
    highlights: [
      "Designed Gen AI-powered content workflows for Adobe Connect, reducing host asset creation effort by 40% and accelerating event preparation",
      "Led end-to-end product design of the Quiz Pod, enabling real-time quiz creation and delivery that improved host efficiency by 50%",
      "Redesigned the onboarding and device setup flow, reducing first-time user friction by 50% and improving adoption rates",
      "Drove the platform homepage redesign with a customizable widget system, increasing user engagement by 35%",
      "Led a data-informed, platform-wide UI design system refresh, establishing consistent interaction patterns and reducing UI-related support tickets by 25%",
    ],
    tags: ["Enterprise UX", "AI Product Design", "Design Systems", "Real-time Collaboration", "Notifications & Engagement"],
    link: "https://www.midhunkrishnakumar.info/adobe",
    summary: "Driving AI-first product innovation for a large-scale collaboration platform, embedding generative and assistive intelligence into core user workflows. Operating at the intersection of design, product, and engineering to define new interaction paradigms, accelerate decision-making, and deliver differentiated, high-impact user experiences.",
  },
  {
    id: "yuj",
    company: "YUJ Designs",
    role: "UX Design Consultant",
    period: "2021 – 2022",
    duration: "1 year",
    stats: [
      "25% improvement in client satisfaction",
      "20+ deliverables across client projects",
      "25% faster iteration cycles",
    ],
    highlights: [
      "Conducted end-to-end UX design for enterprise clients across B2B domains, streamlining complex workflows and reducing task completion time by 30%",
      "Facilitated structured design presentations and stakeholder workshops, improving cross-functional alignment by 40% across client engagements",
      "Built reusable design system components that increased cross-project design consistency by 35%",
      "Delivered production-ready designs under tight timelines, reducing iteration cycles by 25%",
    ],
    tags: ["Enterprise UX", "UX Strategy", "Interaction Design", "Stakeholder Collaboration", "Design Thinking"],
    link: "https://www.midhunkrishnakumar.info/yuj",
    summary: "Drove end-to-end UX for global clients in a fast-paced consulting environment, solving complex, cross-domain problems through research-led design. Partnered with stakeholders to reframe ambiguous business requirements into clear product directions, delivering scalable and intuitive user experiences.",
  },
  {
    id: "bizongo",
    company: "Bizongo",
    role: "UX Designer",
    period: "2020 – 2021",
    duration: "1 year",
    stats: [
      "20% improvement in platform efficiency",
      "1,000+ daily operations users",
      "30% reduction in operational errors",
    ],
    highlights: [
      "Redesigned supply chain and procurement workflows through user research and information architecture restructuring, reducing operational errors by 30%",
      "Improved platform usability through iterative design and usability testing, boosting task completion speed by 25%",
      "Streamlined repetitive workflows via feature enhancements, reducing manual actions by 40% and increasing operational efficiency",
      "Ran usability testing cycles and incorporated feedback into design sprints, improving user satisfaction scores by 35%",
    ],
    tags: ["B2B UX", "Product Design", "User Flows", "Information Architecture", "Data-driven Design"],
    link: "https://www.midhunkrishnakumar.info/bizongo",
    summary: "Owned UX for critical supply chain and procurement workflows, transforming complex, data-intensive systems into streamlined, high-efficiency experiences. Influenced product direction through rapid prototyping and deep cross-functional collaboration, improving usability, consistency, and operational effectiveness at scale.",
  },
  {
    id: "adobe-xd-intern",
    company: "Adobe Inc. (Adobe XD Team)",
    role: "UX Design Intern",
    period: "2019",
    duration: "2019",
    stats: ["Came up with 130+ iterations on design system manager"],
    highlights: [
      "Solved real product challenges within Adobe XD, improving prototype fidelity and interaction clarity by 30%",
      "Delivered production-ready design outputs that reduced design-to-engineering handoff errors by 25%",
      "Applied findings from usability testing sessions to improve core workflows, increasing task success rate by 20%",
      "Collaborated with cross-functional design and engineering teams to explore interaction patterns and refine user workflows within Adobe XD's product ecosystem",
    ],
    tags: ["UX Fundamentals", "Interaction Design", "Prototyping & Wireframing", "User Flows", "Visual Design"],
    summary: "Contributed to the design of a leading design tool, working on core product experiences within a high-impact product team. Collaborated with designers and engineers to explore interaction patterns and refine user workflows, building a strong foundation in product thinking, craft, and design systems.",
  },
  {
    id: "nid-faculty",
    company: "National Institute of Design, Andhra Pradesh",
    role: "Visiting Faculty",
    period: "Jan 2022 – May 2022",
    duration: "2 months",
    stats: ["7+ student UX projects", "Design workshops & team activities"],
    highlights: [
      "Guided 3rd year students in UI/UX course",
      "Conducted workshops on UX design methodologies",
      "Continues to guide budding UX aspirants",
    ],
    tags: ["Mentorship", "Leadership"],
    summary: "Mentored and guided design students on UX thinking, interaction design, and real-world problem solving. Brought industry context into academia, shaping how students approach complex design challenges with structured thinking, critique, and execution rigor.",
  },
  {
    id: "think-ethical",
    company: "Think Ethical, Bangalore",
    role: "Founder Mentor",
    period: "2019 – Present",
    duration: "Ongoing",
    highlights: [
      "Mentorship for emerging designers and design aspirants",
      "Design talks and self upscaling sessions",
    ],
    tags: ["Mentorship", "Leadership"],
    link: "http://www.thinkethical.in/",
  },
];

export const AI_WORK_ITEMS: AIWork[] = [
  {
    id: "ai-blog",
    title: "AI Blog Generator",
    description: "Explored and designed intelligent workflow for AI-assisted content generation, reducing manual effort and enabling rapid customization.",
    impact: ["Reduced content creation effort", "One-click customization", "Cost reduction"],
    tags: ["AI Initiatives", "Adobe Connect"],
  },
  {
    id: "gen-ai-pods",
    title: "Gen AI Product Explorations",
    description: "Product explorations integrating Gen AI image and content generators into enterprise workflows.",
    impact: ["Workflow augmentation", "Asset library optimization", "Scalable content"],
    tags: ["AI Initiatives", "Enterprise UX"],
  },
  {
    id: "intelligent-workflows",
    title: "Intelligent Workflow Contributions",
    description: "Contributions to AI-driven features in Adobe Connect, focusing on automation and smart defaults.",
    impact: ["Reduced repetitive tasks", "Smarter defaults", "Enhanced productivity"],
    tags: ["AI Initiatives", "Adobe Connect", "Enterprise UX"],
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  { label: "First-time Device Setup Friction", value: "50%", context: "Joining experience at Adobe Connect", projectId: "event-joining" },
  { label: "Host Efficiency (Quiz Pod)", value: "50%", context: "Adobe Connect", projectId: "quiz-pod" },
  { label: "User Engagement", value: "35%", context: "Homepage revamp at Adobe Connect", projectId: "connect-homepage" },
  { label: "UI Support Tickets", value: "25%", context: "Core UI revamp at Adobe Connect", projectId: "adobe-visual-design" },
  { label: "Operational Errors", value: "30%", context: "Supply chain workflows at Bizongo", projectId: "bizongo-ums" },
  { label: "QC Time", value: "80%", context: "Bizongo warehouses", projectId: "bizongo-qc" },
  { label: "Stakeholder Alignment", value: "40%", context: "Client collaborations at YUJ Designs", projectId: "yuj-heuristics" },
  { label: "Asset Creation Effort", value: "40%", context: "Gen AI explorations at Adobe", projectId: "gen-ai" },
  { label: "Workflow Setup Time", value: "60%", context: "Artwork Flow at Bizongo", projectId: "bizongo-artwork-flow" },
  { label: "Feature Dev Time", value: "50%", context: "Design system at Bizongo", projectId: "bizongo-design-system" },
];

export interface CareerStage {
  id: string;
  stage: string;
  period: string;
  focus: string;
  /** Expanded copy for the detail panel */
  details: string;
}

export const CAREER_EVOLUTION: CareerStage[] = [
  {
    id: "computer-science",
    stage: "Computer Science",
    period: "2012-2014",
    focus: "Programming, algorithms, and computing fundamentals",
    details:
      "Early grounding in computer science: programming, algorithms, and systems thinking, that later complemented a move into design and product work.",
  },
  {
    id: "industrial",
    stage: "Industrial Design",
    period: "2015-2019",
    focus: "NID: UI/UX, Product Design, Design Business",
    details:
      "Foundation at NID in industrial and product design. UI/UX, physical product craft, and design business, building a systems-first mindset before moving fully into digital experience design.",
  },
  {
    id: "ux",
    stage: "UX design",
    period: "2019-2021",
    focus: "Bizongo, YUJ: Research to implementation",
    details:
      "End-to-end UX across B2B and enterprise: research, flows, and shipping with Bizongo and YUJ. From discovery to handoff, balancing speed with clarity for complex supply-chain and client products.",
  },
  {
    id: "b2b",
    stage: "B2B systems",
    period: "2021-2022",
    focus: "ERP, Design Systems, cross-pod ownership",
    details:
      "Deep work on large-scale B2B systems: ERP surfaces, design systems, and owning outcomes across pods. Patterns, consistency, and stakeholder alignment at the core of every release.",
  },
  {
    id: "b2c",
    stage: "B2C products",
    period: "2022-2024",
    focus: "Adobe Connect: product UX for hosts and participants",
    details:
      "Design for broad, consumer-grade clarity inside an enterprise product, covering joining flows, engagement, and surfaces that scale to diverse users without losing polish.",
  },
  {
    id: "ai-first",
    stage: "AI first products",
    period: "2024-2026",
    focus: "Adobe Connect: Gen AI, intelligent workflows",
    details:
      "Leading AI-first product evolution for Adobe Connect: Gen AI explorations, intelligent workflows, and measurable impact on hosts and admins. Design that keeps pace with fast-moving AI capabilities.",
  },
];

export const MENTORSHIP = [
  {
    id: "nid",
    role: "Visiting Faculty",
    org: "National Institute of Design, Andhra Pradesh",
    period: "2022",
    description: "Guided third-year students in a UI/UX course and conducted workshops on UX design methodologies. Continues to mentor budding UX aspirants.",
    tags: ["Leadership", "Teaching"],
  },
  {
    id: "think-ethical",
    role: "Founder Mentor",
    org: "Think Ethical, Bangalore",
    period: "2019 – Present",
    description: "Mentoring emerging designers through design talks and upskilling sessions. Brought in industry leaders for fireside chat sessions with students.",
    tags: ["Leadership", "Mentorship", "Collaboration"],
  },
  {
    id: "adobe-mentor",
    role: "UX Guide",
    org: "Adobe Inc.",
    period: "2022 – Present",
    description: "Guides and mentors budding UX enthusiasts. Leads design project management. Conducted seminars and workshops within the office and at colleges.",
    tags: ["Leadership", "Mentorship", "Adobe Connect"],
  },
];

export const CONTACT = {
  email: "midhun2k14@gmail.com",
  linkedin: "https://www.linkedin.com/in/midhunkrishnakumar",
  resume: "https://www.midhunkrishnakumar.info/_files/ugd/410795_5be92ebc3d0c4ea5ab2aeb565b3eb965.pdf",
  location: "Bangalore, India",
  phone: "8893860226",
};
