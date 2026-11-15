// All portfolio content lives here. Edit text in this file; pages rebuild from it.
// Private details from the CV (address, phone, birthdate, references) are left out on purpose.
// In summaries, wrap key phrases in **double asterisks** to make them bold.

export const profile = {
  name: 'Venelle Ericka A. Matutina',
  first: 'Venelle',
  last: 'Matutina',
  email: 'venellematutina@gmail.com',
  role: 'Pre-service English teacher',
  location: 'Metro Manila',
  program: 'Bachelor of Education, Major in English',
  school: 'Philippine Normal University–Manila',
  gradYear: 2027,
};

/** Generated cover art. Drop public/work/<slug>.jpg to replace it with a photo. */
export interface Cover {
  word: string;
  note: string;
  bg: string;
  ink: string;
  pattern: 'dots' | 'lines' | 'grid' | 'none';
}

export interface Work {
  slug: string;
  title: string;
  role: string;
  org: string;
  unit?: string;
  dates: string;
  learners: string;
  setting: string;
  summary: string;
  tags: string[];
  overview: string;
  did: { title: string; body: string }[];
  skills: string[];
  preparation?: string;
  /** 2–3 sentences in Venelle's own voice. Rendered only when filled in. */
  reflection?: string;
  cover: Cover;
}

export const works: Work[] = [
  {
    slug: 'literacy-tutor',
    title: 'Building early readers at Phoenix Publishing House',
    role: 'Literacy Tutor',
    org: 'Phoenix Publishing House, Inc.',
    dates: 'May 2026 – Present',
    learners: 'Key Stage 1',
    setting: 'Reading and writing tutorial program',
    summary:
      'Assessing young readers and building their reading and writing skills through **tailored lesson plans** and **literacy station activities**.',
    tags: ['Reading intervention', 'Lesson design', 'Literacy stations'],
    overview:
      'A tutorial program for Key Stage 1 learners, where every session starts from what each child can already read and write.',
    did: [
      { title: 'Assess first', body: 'Evaluated the literacy competence of Key Stage 1 students to find where each learner needed support.' },
      { title: 'Design to fit', body: 'Created flexible instructional materials, lesson plans, and strategies that reinforce reading and writing skills.' },
      { title: 'Make it playful', body: 'Designed literacy station activities so sessions stay creative and engaging for young learners.' },
    ],
    skills: ['Diagnostic reading assessment', 'Reading intervention', 'Materials design', 'Literacy stations'],
    preparation: "32 hours of training in the READ+ Tutors' Training Program",
    cover: { word: 'Read.', note: 'key stage 1', bg: '#ece6ff', ink: '#4b2bd1', pattern: 'lines' },
  },
  {
    slug: 'field-study-teacher',
    title: 'Teaching alongside a Grade 6 classroom',
    role: 'Field Study Teacher',
    org: 'Philippine Normal University',
    unit: 'Faculty of General Education and Experiential Learning (FGEEL)',
    dates: 'June – September 2026',
    learners: 'Grade 6',
    setting: 'Field study classroom placement',
    summary:
      'Supported lead teachers in a Grade 6 classroom, from **managing group dynamics** to **assessing student work**, using communicative approaches to keep students engaged.',
    tags: ['Classroom management', 'Assessment', 'Communicative teaching'],
    overview:
      'A field study placement working beside lead teachers in a Grade 6 classroom for a full term.',
    // TODO(Venelle): these bullets match the NSTP role word for word. Rewrite with Grade 6 specifics.
    did: [
      { title: 'Facilitate', body: 'Supported lead teachers in facilitating classroom activities and managing group dynamics for Grade 6 students.' },
      { title: 'Reinforce', body: 'Developed instructional materials and supplementary homework to reinforce core learning objectives.' },
      { title: 'Assess', body: 'Evaluated student performance through academic outputs and classroom exercises.' },
      { title: 'Observe', body: 'Conducted systematic classroom observations and applied communicative approaches to maximize engagement.' },
    ],
    skills: ['Classroom management', 'Communicative language teaching', 'Assessment', 'Classroom observation'],
    cover: { word: 'Grade 6', note: 'field study', bg: '#dff3ee', ink: '#0f6b5c', pattern: 'grid' },
  },
  {
    slug: 'cultural-buddy',
    title: 'English practice for visiting Taiwanese students',
    role: 'Cultural Buddy',
    org: 'Philippine Normal University',
    unit: 'English Experiential Learning Program, Faculty of Language and Literature',
    dates: 'January – February 2026',
    learners: 'University students from Taiwan',
    setting: 'Visiting students from National Chi Nan University',
    summary:
      'Turned morning lessons into **afternoon practice sessions** that strengthened students’ **communicative competence and vocabulary retention**.',
    tags: ['Communicative competence', 'Vocabulary', 'Cross-cultural'],
    overview:
      'An experiential English program for students from National Chi Nan University, Taiwan, pairing each group with PNU cultural buddies.',
    did: [
      { title: 'Reinforce', body: 'Facilitated English reinforcement sessions for students from National Chi Nan University.' },
      { title: 'Synthesize', body: "Turned morning lesson content into afternoon practice to strengthen students' communicative competence and vocabulary retention." },
      { title: 'Connect', body: 'Built collaborative ties through joint educational activities and cross-cultural knowledge sharing.' },
    ],
    skills: ['Communicative competence', 'Vocabulary building', 'Cross-cultural facilitation'],
    cover: { word: 'Hello!', note: 'taiwan × philippines', bg: '#ffe3d6', ink: '#d2400a', pattern: 'dots' },
  },
  {
    slug: 'nstp-pre-service-teacher',
    title: 'A first classroom: kindergarten at EDSES',
    role: 'Pre-service English Teacher',
    org: 'Epifanio Delos Santos Elementary School',
    unit: 'National Service Training Program (NSTP)',
    dates: 'May – June 2025',
    learners: 'Kindergarten',
    setting: 'Public elementary school',
    summary:
      'A first classroom immersion: supporting **kindergarten learners** and their lead teachers with **materials, activities, and assessment**.',
    tags: ['Early-grade instruction', 'Classroom management', 'Assessment'],
    overview:
      'Pre-service teaching under the National Service Training Program, in a public elementary school kindergarten class.',
    did: [
      { title: 'Facilitate', body: 'Supported lead teachers in facilitating classroom activities and managing group dynamics for kindergarten students.' },
      { title: 'Reinforce', body: 'Developed instructional materials and supplementary homework to reinforce core learning objectives.' },
      { title: 'Assess', body: 'Evaluated student performance through academic outputs and classroom exercises.' },
      { title: 'Observe', body: 'Conducted systematic classroom observations and applied communicative approaches to maximize engagement.' },
    ],
    skills: ['Early-grade instruction', 'Classroom management', 'Assessment'],
    cover: { word: 'abc', note: 'kindergarten', bg: '#fff1c7', ink: '#8a5a00', pattern: 'dots' },
  },
  {
    slug: 'research-and-publication',
    title: 'Writing the record for an international volunteer body',
    role: 'Research and Publication Committee Member',
    org: 'International Volunteers’ and Leaders’ Body (InVoLB)',
    unit: 'Linkages and International Office, PNU',
    // TODO(Venelle): the CV reads "December 2024 – August 2025, Present". Confirm the right range.
    dates: 'Dec 2024 – Present',
    learners: 'Readers of InVoLB’s digital platforms',
    setting: 'University international office',
    summary:
      'Authored **journalistic articles and technical reports** documenting international and local events, keeping the organization’s **online presence professional**.',
    tags: ['Journalistic writing', 'Technical reports', 'Editorial'],
    overview:
      'Writing for InVoLB, the international volunteer body of PNU’s Linkages and International Office.',
    did: [
      { title: 'Report', body: 'Authored journalistic articles and technical reports documenting organizational events for digital platforms.' },
      { title: 'Volunteer', body: 'Volunteered in international and local activities, supporting organizational programs and cross-cultural initiatives.' },
      { title: 'Edit', body: 'Applied careful English and editorial judgment to keep the organization’s online presence professional.' },
    ],
    skills: ['Journalistic writing', 'News reporting', 'Editorial judgment'],
    cover: { word: 'Stories', note: 'involb · lio', bg: '#e2eeff', ink: '#1a3362', pattern: 'lines' },
  },
];

export interface LeadershipRole {
  id: string;
  title: string;
  org: string;
  dates: string;
  points: string[];
  cover: Cover;
}

export const leadership: LeadershipRole[] = [
  {
    id: 'erudite-circle',
    title: 'Vice President, Internal',
    org: 'The Erudite Circle · Faculty of Language and Literature, PNU',
    dates: 'Jun 2026 – Present',
    points: [
      'Manages the internal affairs of the program organization.',
      'Coordinates and resolves issues and concerns in the organization’s internal operations.',
    ],
    cover: { word: 'VP', note: 'erudite circle', bg: '#fbe0ec', ink: '#b0346a', pattern: 'none' },
  },
  {
    id: 'involb-undersecretary',
    title: 'Undersecretary',
    org: 'International Volunteers’ and Leaders’ Body · Linkages and International Office, PNU',
    dates: 'Aug 2025 – May 2026',
    points: [
      'Maintained social media trackers, volunteer data, and member activity records.',
      'Managed social media posting and attendance tracking for international, local, and organizational events.',
      'Safeguarded organizational documents and synchronized logistics for leadership initiatives.',
    ],
    cover: { word: 'Records', note: 'involb', bg: '#e2eeff', ink: '#1a3362', pattern: 'grid' },
  },
  {
    id: 'class-president-3',
    title: 'Class President, 3rd Year',
    org: 'Classroom Assembly · University Student Council, PNU',
    dates: 'Aug 2025 – May 2026',
    points: [
      'Primary liaison between the student body and faculty across Terms 1 to 3, handling communication and conflict resolution.',
      'Fostered a collaborative environment for academic and extracurricular excellence.',
    ],
    cover: { word: 'Pres.', note: '3rd year', bg: '#ece6ff', ink: '#4b2bd1', pattern: 'dots' },
  },
  {
    id: 'class-president-2',
    title: 'Class President, 2nd Year',
    org: 'Classroom Assembly · University Student Council, PNU',
    dates: 'Jan – Apr 2025',
    points: [
      'Directed class officers and course representatives in planning major academic projects and capstones.',
      'Streamlined communication between students and faculty.',
    ],
    cover: { word: 'Pres.', note: '2nd year', bg: '#dff3ee', ink: '#0f6b5c', pattern: 'lines' },
  },
  {
    id: 'class-secretary',
    title: 'Class Secretary',
    org: 'Classroom Assembly (OBTEC 10) · University Student Council, PNU',
    dates: 'Sep 2023 – Jul 2024',
    points: [
      'Managed attendance, class records, and course documents for Terms 1 to 3.',
      'Coordinated directly with professors to streamline academic requirements.',
      'Organized centralized digital sheets and databases for transparent class records.',
    ],
    cover: { word: 'Notes', note: 'obtec 10', bg: '#fff1c7', ink: '#8a5a00', pattern: 'lines' },
  },
];

export const education = [
  {
    school: 'Philippine Normal University–Manila',
    years: '2023 – Present',
    detail: 'Bachelor’s in English Education · expected 2027',
    honor: 'Dean’s Lister, Terms 1–3, A.Y. 2024–2025',
  },
  {
    school: 'NU-Nazareth School',
    years: '2018 – 2020',
    detail: 'Senior High School, Humanities and Social Sciences',
    honor: 'With Honors',
  },
  {
    school: 'NU-Nazareth School',
    years: '2014 – 2018',
    detail: 'Junior High School',
    honor: 'With Honors',
  },
];
