export const sessions = [
  {
    id: 'ds-algorithms',
    subject: 'Computer Science 301',
    title: 'Data Structures & Algorithms',
    date: 'Jan 10, 2026',
    duration: '1h 23m',
    notesCount: 48,
    diagramsCount: 7,
    deadline: 'Assignment due Jan 15',
    notes: {
      'Binary Trees': 'A binary tree is a hierarchical data structure where each node has at most two children.',
      'Tree Traversals': 'Inorder, Preorder and Postorder are used to visit nodes in different orders.',
      'AVL Trees': 'AVL trees are self-balancing binary search trees that use rotations to maintain height balance.'
    },
    schedule: [
      { task: 'Review binary tree concepts', date: 'Jan 11' },
      { task: 'Practice AVL tree rotations', date: 'Jan 12' },
      { task: 'Complete coding assignment', date: 'Jan 15', urgent: true },
      { task: 'Prepare for quiz', date: 'Jan 18' }
    ]
  },
  {
    id: 'math-linear-algebra',
    subject: 'Mathematics 201',
    title: 'Linear Algebra',
    date: 'Jan 8, 2026',
    duration: '1h 45m',
    notesCount: 32,
    diagramsCount: 5,
    deadline: null
  }
];