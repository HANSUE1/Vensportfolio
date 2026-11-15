// All portfolio content lives here. Edit text in this file; pages rebuild from it.
// Private details from the CV (address, phone, birthdate, references) are left out on purpose.

export const profile = {
  name: 'Venelle Ericka A. Matutina',
  shortName: 'Venelle Matutina',
  email: 'venellematutina@gmail.com',
  program: 'Bachelor of Education, Major in English',
  school: 'Philippine Normal University–Manila',
  gradYear: 2027,
};

export interface TeachingRole {
  slug: string;
  title: string;
  org: string;
  unit?: string;
  dates: string;
  learners: string;
  setting: string;
  summary: string;
  did: string[];
  skills: string[];
  preparation?: string;
  /** 2–3 sentences in Venelle's own voice. Rendered only when filled in. */
  reflection?: string;
}

export const teaching: TeachingRole[] = [
  {
    slug: 'literacy-tutor',
    title: 'Literacy Tutor',
    org: 'Phoenix Publishing House, Inc.',
    dates: 'May 2026 – Present',
    learners: 'Key Stage 1',
    setting: 'Reading and writing tutorial program',
    summary:
      'Assessing young readers and building their reading and writing skills through tailored materials and literacy stations.',
    did: [
      'Evaluated the literacy competence of Key Stage 1 students.',
      'Created flexible instructional materials, lesson plans, and strategies that reinforce reading and writing skills.',
      'Designed literacy station activities for creative, engaging sessions.',
    ],
    skills: ['Diagnostic reading assessment', 'Reading intervention', 'Materials design', 'Literacy stations'],
    preparation: "32 hours of training in the READ+ Tutors' Training Program",
  },
  {
    slug: 'field-study-teacher',
    title: 'Field Study Teacher',
    org: 'Philippine Normal University',
    unit: 'Faculty of General Education and Experiential Learning (FGEEL)',
    dates: 'June – September 2026',
    learners: 'Grade 6',
    setting: 'Field study classroom placement',
    summary:
      'Supporting lead teachers in a Grade 6 classroom, from managing group dynamics to assessing student work.',
    // TODO(Venelle): these bullets match the NSTP role word for word. Rewrite with Grade 6 specifics.
    did: [
      'Supported lead teachers in facilitating classroom activities and managing group dynamics for Grade 6 students.',
      'Developed instructional materials and supplementary homework to reinforce core learning objectives.',
      'Evaluated student performance through academic outputs and classroom exercises.',
      'Conducted systematic classroom observations and applied communicative approaches to maximize engagement.',
    ],
    skills: ['Classroom management', 'Communicative language teaching', 'Assessment', 'Classroom observation'],
  },
  {
    slug: 'cultural-buddy',
    title: 'Cultural Buddy',
    org: 'Philippine Normal University',
    unit: 'English Experiential Learning Program, Faculty of Language and Literature',
    dates: 'January – February 2026',
    learners: 'Taiwanese university students',
    setting: 'Visiting students from National Chi Nan University',
    summary: 'Turning morning lessons into afternoon practice for visiting Taiwanese students.',
    did: [
      'Facilitated English reinforcement sessions for students from National Chi Nan University, Taiwan.',
      "Synthesized morning lesson content into afternoon practice to strengthen students' communicative competence and vocabulary retention.",
      'Built collaborative ties through joint educational activities and cross-cultural knowledge sharing.',
    ],
    skills: ['Communicative competence', 'Vocabulary building', 'Cross-cultural facilitation'],
  },
  {
    slug: 'nstp-pre-service-teacher',
    title: 'Pre-service English Teacher',
    org: 'Epifanio Delos Santos Elementary School',
    unit: 'National Service Training Program (NSTP)',
    dates: 'May – June 2025',
    learners: 'Kindergarten',
    setting: 'Public elementary school',
    summary: 'A first classroom immersion: supporting kindergarten learners and their lead teachers.',
    did: [
      'Supported lead teachers in facilitating classroom activities and managing group dynamics for kindergarten students.',
      'Developed instructional materials and supplementary homework to reinforce core learning objectives.',
      'Evaluated student performance through academic outputs and classroom exercises.',
      'Conducted systematic classroom observations and applied communicative approaches to maximize engagement.',
    ],
    skills: ['Early-grade instruction', 'Classroom management', 'Assessment'],
  },
];

export interface LeadershipRole {
  title: string;
  org: string;
  dates: string;
  note: string;
}

export const leadership: LeadershipRole[] = [
  {
    title: 'Vice President, Internal',
    org: 'The Erudite Circle · Faculty of Language and Literature, PNU',
    dates: 'Jun 2026 – Present',
    note: 'Manages internal affairs and resolves issues in the organization’s day-to-day operations.',
  },
  {
    title: 'Undersecretary',
    org: 'International Volunteers’ and Leaders’ Body · Linkages and International Office, PNU',
    dates: 'Aug 2025 – May 2026',
    note: 'Kept social media trackers, volunteer data, attendance, and documents in order for international and local programs.',
  },
  {
    title: 'Class President, 3rd Year',
    org: 'Classroom Assembly · University Student Council, PNU',
    dates: 'Aug 2025 – May 2026',
    note: 'Primary liaison between students and faculty across Terms 1 to 3, handling communication and conflict resolution.',
  },
  {
    title: 'Class President, 2nd Year',
    org: 'Classroom Assembly · University Student Council, PNU',
    dates: 'Jan – Apr 2025',
    note: 'Led class officers and course representatives in planning major academic projects and capstones.',
  },
  {
    title: 'Class Secretary',
    org: 'Classroom Assembly (OBTEC 10) · University Student Council, PNU',
    dates: 'Sep 2023 – Jul 2024',
    note: 'Managed attendance, class records, and course documents in centralized digital sheets.',
  },
];

export const writing = {
  title: 'Research and Publication Committee Member',
  org: 'International Volunteers’ and Leaders’ Body · Linkages and International Office, PNU',
  // TODO(Venelle): the CV reads "December 2024 – August 2025, Present". Confirm the right range.
  dates: 'Dec 2024 – Present',
  forms: [
    {
      kicker: 'Features',
      title: 'Event articles',
      body: 'Journalistic articles documenting the organization’s international and local events for its digital platforms.',
    },
    {
      kicker: 'Records',
      title: 'Technical reports',
      body: 'Reports that record organizational activities so programs can be reviewed and repeated.',
    },
    {
      kicker: 'Editorial',
      title: 'Online presence',
      body: 'Editorial judgment and careful English that keep the organization’s public pages professional.',
    },
  ],
  // TODO(Venelle): add published pieces, e.g. { title: '...', outlet: 'InVoLB Facebook page', href: 'https://...' }
  articles: [] as { title: string; outlet: string; href: string }[],
};
