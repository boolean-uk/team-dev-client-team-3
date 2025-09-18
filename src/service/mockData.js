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

export { user, posts, cohorts };
