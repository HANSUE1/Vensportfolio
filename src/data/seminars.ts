export const themes = {
  research: 'Research & Writing',
  pedagogy: 'Pedagogy',
  ai: 'AI in Education',
  volunteer: 'Volunteerism',
  international: 'International',
  civic: 'Civic & Wellness',
} as const;

export type Theme = keyof typeof themes;

export interface Seminar {
  year: number;
  title: string;
  org: string;
  theme: Theme;
  /** Multi-day programs are grouped into one entry. */
  sessions?: number;
}

export const seminars: Seminar[] = [
  // 2026
  { year: 2026, title: 'Phase 1 – World University Ranking for Innovation 2027 Writeshop: Innovation, Case Development, Rewriting, and Alignment', org: 'LIO, PNU', theme: 'research' },
  { year: 2026, title: 'The VolunTOUR (SEAMEO Tour Guiding): Exploring Culture, Inspiring Service', org: 'LIO, InVoLB, PNU', theme: 'volunteer' },
  { year: 2026, title: 'InVoLB Charged with Volunteerism: Volume 2', org: 'InVoLB', theme: 'volunteer' },
  { year: 2026, title: 'Local Benchmarking Activity with Mahasarakham University, Thailand', org: 'LIO', theme: 'international' },
  { year: 2026, title: 'International Benchmarking Activity with Mahasarakham University, Thailand', org: 'LIO', theme: 'international' },
  { year: 2026, title: 'InVoLB Charged with Volunteerism: Volume 1', org: 'InVoLB', theme: 'volunteer' },
  { year: 2026, title: 'PATNURO – Classroom-Based Action Research', org: 'FGEEL', theme: 'research' },
  { year: 2026, title: 'PATNURO – Classroom Management and Positive Discipline Lecture', org: 'FGEEL', theme: 'pedagogy' },
  { year: 2026, title: 'Deeply Rooted with InVoLB: Nurturing Volunteers Grounded in Service and Action – Capacity Building', org: 'LIO, InVoLB', theme: 'volunteer', sessions: 4 },
  { year: 2026, title: "READ+ Tutors' Training Program (32 hours)", org: 'Phoenix Publishing House, Inc.', theme: 'pedagogy' },
  { year: 2026, title: 'University Research Forum: From Excellence to Impact – 34 Years of Transforming Teacher Education', org: 'PNU', theme: 'research' },
  { year: 2026, title: 'IGNITE Ep3: Methodological Perspectives in Language, Literature, and Linguistics Research', org: 'PNU', theme: 'research' },
  // 2025
  { year: 2025, title: 'DLSU DEALleads: Symposium on Asian Englishes', org: 'De La Salle University', theme: 'research' },
  { year: 2025, title: 'Pedagogy and Reflective Teaching Practices using AI', org: 'Regional English Language Office (RELO)', theme: 'ai' },
  { year: 2025, title: 'IGNITE Ep1 & Ep2: Sparking Ideas and Strategies for Language, Linguistics, and Literature Research', org: 'PNU', theme: 'research', sessions: 2 },
  { year: 2025, title: 'World University Ranking for Innovation 2025 Writing Workshop', org: 'LIO, PNU', theme: 'research', sessions: 3 },
  { year: 2025, title: 'Education at the Crossroads: Disruption, Innovation, and Transformation in the Age of AI', org: 'International Conference on Education Futures (ICEF)', theme: 'ai', sessions: 3 },
  { year: 2025, title: 'InVoLB in Motion: Ethical Leadership and Tech-Supported Volunteerism in Action – Capacity Building', org: 'LIO, InVoLB', theme: 'volunteer', sessions: 3 },
  { year: 2025, title: 'The Hour of Code: AI Ready ASEAN Programme', org: 'FLL, PNU', theme: 'ai' },
  { year: 2025, title: 'Hour of Code Campaign: AI Ready ASEAN Programme', org: 'AI Ready ASEAN, ASEAN Foundation, Break the Fake Movement, Google.org', theme: 'ai' },
  { year: 2025, title: 'CHARGED with Volunteerism: Volume 1', org: 'LIO, InVoLB', theme: 'volunteer' },
  { year: 2025, title: 'Pinoy Boluntirs’ Big Collab: Cultivating Cultural Ties through International Ambassadorship', org: 'LIO, InVoLB', theme: 'international' },
  { year: 2025, title: 'PeerVocacy: Empowering Advocacies Through Education ft. ASEAN Alliance’s #OutdateTheHate', org: 'PNU Peers, ASEAN Alliance, Rotaract Club of Metro Manila', theme: 'volunteer' },
  // 2024
  { year: 2024, title: 'KKKabataan, Bantay sa Pambansang Teritoryo – 161st Andres Bonifacio Day', org: 'Kabataan sa Kartilya Katipunan', theme: 'civic' },
  // 2023
  { year: 2023, title: 'NSTP Plenary: NSTP and Its Role in Promoting Civic Engagement towards the Philippine Youth Development Plan', org: 'PNU', theme: 'civic' },
  { year: 2023, title: 'NSTP Plenary: Embracing Holistic Wellness', org: 'PNU', theme: 'civic' },
  { year: 2023, title: 'Navigating the College Journey: Maintaining Mental Health Throughout College Life', org: 'PNU', theme: 'civic' },
];

export const totalSessions = seminars.reduce((n, s) => n + (s.sessions ?? 1), 0);

export const themeCounts = Object.fromEntries(
  (Object.keys(themes) as Theme[]).map((t) => [t, seminars.filter((s) => s.theme === t).length]),
) as Record<Theme, number>;
