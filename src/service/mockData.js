const user = {
  token: 'test-token',
  user: {
    id: 1,
    email: 'test@email.com',
    cohortId: 1,
    role: 'STUDENT',
    firstName: 'Joe',
    lastName: 'Bloggs',
    bio: 'Lorem ipsum dolor sit amet.',
    githubUrl: 'https://github.com/vherus'
  }
};

const posts = [
  {
    id: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    createdAt: '19 February at 10:32',
    updatedAt: '19 February at 10:32',
    author: {
      id: 1,
      cohortId: 1,
      role: 'STUDENT',
      firstName: 'Sam',
      lastName: 'Fletcher',
      bio: 'Lorem ipsum dolor sit amet.',
      githubUrl: 'https://github.com/vherus'
    }
  },
  {
    id: 2,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    createdAt: '19 February at 09:56',
    updatedAt: '19 February at 10:32',
    author: {
      id: 2,
      cohortId: 1,
      role: 'STUDENT',
      firstName: 'Dolor',
      lastName: 'Lobortis',
      bio: 'Lorem ipsum dolor sit amet.',
      githubUrl: 'https://github.com/vherus'
    },
    comments: [
      {
        id: 2,
        name: 'Dana Sharwarma',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      },
      {
        id: 3,
        name: 'James Doakes',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      }
    ]
  }
];

const cohorts = [
  {
    name: 'Software Development',
    cohort: '4',
    students: [
      'Alice Johnson',
      'Bob Smith',
      'Charlie Brown',
      'David Lee',
      'Eva Green',
      'Frank White'
    ],
    teacher: 'John Smith',
    exercises: ['Modules: 2/17 completed', 'Units: 4/10 completed', 'Exercises: 34/58 completed']
  },
  {
    name: 'Data Science',
    cohort: '2',
    students: [
      'Grace Hopper',
      'Alan Turing',
      'Ada Lovelace',
      'Linus Torvalds',
      'Barbara Liskov',
      'Tim Berners-Lee'
    ],
    teacher: 'Marie Curie',
    exercises: ['Modules: 5/12 completed', 'Units: 3/8 completed', 'Exercises: 20/40 completed']
  },
  {
    name: 'Cybersecurity',
    cohort: '1',
    students: [
      'Kevin Mitnick',
      'Joanna Rutkowska',
      'Mikko Hyppönen',
      'Dan Kaminsky',
      'Katie Moussouris'
    ],
    teacher: 'Edward Snowden',
    exercises: ['Modules: 3/10 completed', 'Units: 6/12 completed', 'Exercises: 18/30 completed']
  },
  {
    name: 'AI & Machine Learning',
    cohort: '5',
    students: ['Yann LeCun', 'Geoffrey Hinton', 'Andrew Ng', 'Fei-Fei Li', 'Ian Goodfellow'],
    teacher: 'Demis Hassabis',
    exercises: ['Modules: 6/15 completed', 'Units: 5/10 completed', 'Exercises: 45/60 completed']
  },
  {
    name: 'Web Development',
    cohort: '3',
    students: ['Mark Zuckerberg', 'Larry Page', 'Sergey Brin', 'Elon Musk', 'Jack Dorsey'],
    teacher: 'Brendan Eich',
    exercises: ['Modules: 4/14 completed', 'Units: 2/7 completed', 'Exercises: 22/45 completed']
  }
];

const exercises = {
  data: [
    {
      id: 3,
      title: "Best Cohort (Nigel's Cohort)",
      courses: [
        // ---------------------------
        // 1. Software Development
        // ---------------------------
        {
          id: 1,
          title: 'Software Development',
          students: [
            {
              id: 45,
              firstName: 'Will',
              lastName: 'Perez',
              photo: 'https://mockmind-api.uifaces.co/content/human/136.jpg',
              progress: [
                { exerciseId: 101, completed: true },
                { exerciseId: 102, completed: false },
                { exerciseId: 103, completed: true },
                { exerciseId: 104, completed: false },
                { exerciseId: 105, completed: false },
                { exerciseId: 106, completed: true },
                { exerciseId: 107, completed: false },
                { exerciseId: 108, completed: false }
              ]
            }
          ],
          teachers: [
            {
              id: 6,
              firstName: 'Will',
              lastName: 'Rathnayake',
              photo: 'https://mockmind-api.uifaces.co/content/human/34.jpg'
            }
          ],
          modules: [
            {
              id: 11,
              name: 'ReactJS',
              units: [
                {
                  id: 21,
                  name: 'HTML Basics',
                  exercises: [
                    { id: 101, name: 'Intro to HTML' },
                    { id: 102, name: 'Headings & Paragraphs' },
                    { id: 103, name: 'Links & Images' },
                    { id: 108, name: 'Forms & Inputs' }
                  ]
                },
                {
                  id: 22,
                  name: 'CSS Basics',
                  exercises: [
                    { id: 109, name: 'Selectors' },
                    { id: 110, name: 'Box Model' },
                    { id: 111, name: 'Flexbox Layout' },
                    { id: 112, name: 'Grid Layout' }
                  ]
                },
                {
                  id: 24,
                  name: 'Conditional Rendering',
                  exercises: [
                    { id: 113, name: 'If Statements in JSX' },
                    { id: 114, name: 'Ternary Operator' },
                    { id: 115, name: 'Logical && Operator' },
                    { id: 116, name: 'Conditional Classes' }
                  ]
                }
              ]
            },
            {
              id: 12,
              name: 'Java',
              units: [
                {
                  id: 23,
                  name: 'Java Basics',
                  exercises: [
                    { id: 117, name: 'Hello World in Java' },
                    { id: 118, name: 'Variables & Data Types' },
                    { id: 119, name: 'Control Structures' },
                    { id: 120, name: 'Loops' },
                    { id: 121, name: 'Methods & Functions' }
                  ]
                }
              ]
            }
          ]
        },

        // ---------------------------
        // 2. Front-End Development
        // ---------------------------
        {
          id: 2,
          title: 'Front-End Development',
          students: [],
          teachers: [],
          modules: [
            {
              id: 13,
              name: 'JavaScript Essentials',
              units: [
                {
                  id: 25,
                  name: 'Fundamentals',
                  exercises: [
                    { id: 201, name: 'Variables' },
                    { id: 202, name: 'Functions' },
                    { id: 203, name: 'Objects' },
                    { id: 204, name: 'Arrays' },
                    { id: 205, name: 'Loops' }
                  ]
                },
                {
                  id: 26,
                  name: 'DOM Manipulation',
                  exercises: [
                    { id: 206, name: 'Query Selectors' },
                    { id: 207, name: 'Event Listeners' },
                    { id: 208, name: 'Changing Styles' },
                    { id: 209, name: 'Adding & Removing Elements' }
                  ]
                }
              ]
            },
            {
              id: 14,
              name: 'React Basics',
              units: [
                {
                  id: 27,
                  name: 'Components',
                  exercises: [
                    { id: 210, name: 'Functional Components' },
                    { id: 211, name: 'Props' },
                    { id: 212, name: 'State with useState' },
                    { id: 213, name: 'Event Handling' }
                  ]
                },
                {
                  id: 28,
                  name: 'Hooks',
                  exercises: [
                    { id: 214, name: 'useEffect Basics' },
                    { id: 215, name: 'Custom Hooks' },
                    { id: 216, name: 'useReducer' },
                    { id: 217, name: 'useContext' }
                  ]
                }
              ]
            }
          ]
        },

        // ---------------------------
        // 3. Data Analytics
        // ---------------------------
        {
          id: 3,
          title: 'Data Analytics',
          students: [],
          teachers: [],
          modules: [
            {
              id: 15,
              name: 'Python for Data',
              units: [
                {
                  id: 29,
                  name: 'Python Basics',
                  exercises: [
                    { id: 301, name: 'Variables & Strings' },
                    { id: 302, name: 'Lists & Tuples' },
                    { id: 303, name: 'Dictionaries' },
                    { id: 304, name: 'For & While Loops' },
                    { id: 305, name: 'Functions' }
                  ]
                },
                {
                  id: 30,
                  name: 'Data Analysis Libraries',
                  exercises: [
                    { id: 306, name: 'Intro to NumPy' },
                    { id: 307, name: 'Pandas Basics' },
                    { id: 308, name: 'Filtering DataFrames' },
                    { id: 309, name: 'GroupBy Operations' },
                    { id: 310, name: 'Merging DataFrames' }
                  ]
                }
              ]
            },
            {
              id: 16,
              name: 'Data Visualization',
              units: [
                {
                  id: 31,
                  name: 'Matplotlib',
                  exercises: [
                    { id: 311, name: 'Line Charts' },
                    { id: 312, name: 'Bar Charts' },
                    { id: 313, name: 'Scatter Plots' },
                    { id: 314, name: 'Pie Charts' }
                  ]
                },
                {
                  id: 32,
                  name: 'Seaborn',
                  exercises: [
                    { id: 315, name: 'Histograms' },
                    { id: 316, name: 'Boxplots' },
                    { id: 317, name: 'Heatmaps' },
                    { id: 318, name: 'Pairplots' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export { user, posts, cohorts, exercises };
