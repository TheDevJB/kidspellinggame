const db = {
  users: [
    {
      id: 1,
      username: 'demo_student',
      name: 'Demo Student',
      grade: 'kindergarten',
      avatar: 'bear',
      totalPoints: 150,
      streakDays: 3,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  ],

  userProgress: [
    {
      userId: 1,
      module: 'colors',
      grade: 'pre-k',
      completedLessons: ['basic-colors', 'color-matching'],
      currentLesson: 'color-mixing',
      totalScore: 85,
      timeSpent: 1200,
      lastUpdated: new Date().toISOString()
    }
  ],

  colorLessons: [
    {
      id: 1,
      name: 'basic-colors',
      title: 'Basic Colors',
      grade: 'pre-k',
      difficulty: 'easy',
      type: 'identification',
      colors: [
        { name: 'red', hex: '#FF0000', audio: 'red.mp3' },
        { name: 'blue', hex: '#0000FF', audio: 'blue.mp3' },
        { name: 'yellow', hex: '#FFFF00', audio: 'yellow.mp3' },
        { name: 'green', hex: '#00FF00', audio: 'green.mp3' }
      ],
      activities: ['color-click', 'color-name', 'color-match']
    },
    {
      id: 2,
      name: 'color-mixing',
      title: 'Color Mixing',
      grade: 'kindergarten',
      difficulty: 'medium',
      type: 'interactive',
      mixingRules: [
        { colors: ['red', 'yellow'], result: 'orange' },
        { colors: ['blue', 'yellow'], result: 'green' },
        { colors: ['red', 'blue'], result: 'purple' }
      ]
    }
  ],

  spellingWords: [
    { id: 1, word: 'cat', grade: 'pre-k', difficulty: 'easy', family: 'at', hint: 'A small furry pet', sentence: 'The cat is sleeping.', audio: 'cat.mp3' },
    { id: 2, word: 'bat', grade: 'pre-k', difficulty: 'easy', family: 'at', hint: 'Flies at night', sentence: 'The bat hangs upside down.', audio: 'bat.mp3' },
    { id: 3, word: 'hat', grade: 'pre-k', difficulty: 'easy', family: 'at', hint: 'You wear it on your head', sentence: 'I like your red hat.', audio: 'hat.mp3' },
    
    { id: 4, word: 'jump', grade: 'kindergarten', difficulty: 'easy', family: 'ump', hint: 'Hop up and down', sentence: 'Can you jump high?', audio: 'jump.mp3' },
    { id: 5, word: 'play', grade: 'kindergarten', difficulty: 'medium', family: 'ay', hint: 'Have fun', sentence: 'Let\'s play outside today.', audio: 'play.mp3' },
    
    { id: 6, word: 'friend', grade: '1st', difficulty: 'medium', family: 'end', hint: 'Someone you like', sentence: 'My best friend is kind.', audio: 'friend.mp3' },
    { id: 7, word: 'school', grade: '1st', difficulty: 'medium', family: 'ool', hint: 'Where you learn', sentence: 'I go to school every day.', audio: 'school.mp3' },
    
    { id: 8, word: 'rainbow', grade: '2nd', difficulty: 'hard', family: 'ow', hint: 'Colorful arc in sky', sentence: 'We saw a beautiful rainbow after the rain.', audio: 'rainbow.mp3' },
    { id: 9, word: 'butterfly', grade: '2nd', difficulty: 'hard', family: 'ly', hint: 'Colorful flying insect', sentence: 'The butterfly landed on the flower.', audio: 'butterfly.mp3' },
    
    { id: 10, word: 'wonderful', grade: '3rd', difficulty: 'hard', family: 'ful', hint: 'Amazing, great', sentence: 'What a wonderful surprise!', audio: 'wonderful.mp3' },
    { id: 11, word: 'playground', grade: '3rd', difficulty: 'hard', family: 'ound', hint: 'Where kids play at school', sentence: 'The playground has swings and slides.', audio: 'playground.mp3' },
    
    { id: 12, word: 'adventure', grade: '4th', difficulty: 'expert', family: 'ure', hint: 'Exciting journey', sentence: 'Reading books takes you on an adventure.', audio: 'adventure.mp3' },
    { id: 13, word: 'imagination', grade: '4th', difficulty: 'expert', family: 'tion', hint: 'Creative thinking', sentence: 'Use your imagination to write stories.', audio: 'imagination.mp3' },
    
    { id: 14, word: 'responsibility', grade: '5th', difficulty: 'expert', family: 'ity', hint: 'Being accountable', sentence: 'Taking care of pets is a big responsibility.', audio: 'responsibility.mp3' },
    { id: 15, word: 'extraordinary', grade: '5th', difficulty: 'expert', family: 'ary', hint: 'Very unusual, special', sentence: 'She has extraordinary talent in music.', audio: 'extraordinary.mp3' }
  ],

  wordFamilies: [
    { id: 1, family: 'at', grade: 'pre-k', words: ['cat', 'bat', 'hat', 'mat', 'rat', 'fat'], color: '#FF6B6B' },
    { id: 2, family: 'an', grade: 'pre-k', words: ['can', 'man', 'pan', 'ran', 'fan', 'tan'], color: '#4ECDC4' },
    
    { id: 3, family: 'ump', grade: 'kindergarten', words: ['jump', 'bump', 'pump', 'dump'], color: '#45B7D1' },
    { id: 4, family: 'ay', grade: 'kindergarten', words: ['play', 'day', 'way', 'say', 'may'], color: '#96CEB4' },
    
    { id: 5, family: 'end', grade: '1st', words: ['friend', 'send', 'bend', 'mend'], color: '#FFEAA7' },
    { id: 6, family: 'ool', grade: '1st', words: ['school', 'cool', 'pool', 'tool'], color: '#DDA0DD' },
    
    { id: 7, family: 'ful', grade: '3rd', words: ['wonderful', 'helpful', 'colorful', 'peaceful'], color: '#98D8C8' },
    { id: 8, family: 'tion', grade: '4th', words: ['imagination', 'creation', 'vacation', 'celebration'], color: '#F7DC6F' }
  ],

  sentenceActivities: [
    {
      id: 1,
      grade: 'kindergarten',
      type: 'word-order',
      scrambledWords: ['The', 'cat', 'is', 'sleeping'],
      correctSentence: 'The cat is sleeping.',
      hint: 'Start with "The"',
      image: 'sleeping-cat.jpg'
    },
    {
      id: 2,
      grade: '1st',
      type: 'fill-blank',
      sentence: 'I _____ to school every day.',
      options: ['go', 'went', 'going'],
      correct: 'go',
      hint: 'Present tense'
    },
    {
      id: 3,
      grade: '2nd',
      type: 'capitalization',
      sentence: 'my friend sarah lives in texas.',
      correctSentence: 'My friend Sarah lives in Texas.',
      errors: ['my', 'sarah', 'texas'],
      rule: 'Capitalize names and places'
    }
  ],

  capitalizationRules: [
    {
      id: 1,
      grade: 'kindergarten',
      rule: 'first-letter',
      title: 'Start sentences with capital letters',
      examples: [
        { wrong: 'the dog is happy.', correct: 'The dog is happy.' },
        { wrong: 'cats like to play.', correct: 'Cats like to play.' }
      ]
    },
    {
      id: 2,
      grade: '1st',
      rule: 'names',
      title: 'Capitalize people\'s names',
      examples: [
        { wrong: 'My name is john.', correct: 'My name is John.' },
        { wrong: 'sarah is my friend.', correct: 'Sarah is my friend.' }
      ]
    },
    {
      id: 3,
      grade: '2nd',
      rule: 'places',
      title: 'Capitalize place names',
      examples: [
        { wrong: 'I live in texas.', correct: 'I live in Texas.' },
        { wrong: 'We visited new york.', correct: 'We visited New York.' }
      ]
    }
  ],

  achievements: [
    {
      id: 1,
      name: 'Color Master',
      description: 'Identified all basic colors correctly',
      icon: '🌈',
      points: 50,
      requirement: { type: 'colors', count: 10 }
    },
    {
      id: 2,
      name: 'Spelling Bee',
      description: 'Spelled 25 words correctly',
      icon: '🐝',
      points: 100,
      requirement: { type: 'spelling', count: 25 }
    },
    {
      id: 3,
      name: 'Sentence Builder',
      description: 'Built 10 perfect sentences',
      icon: '🏗️',
      points: 75,
      requirement: { type: 'sentences', count: 10 }
    },
    {
      id: 4,
      name: 'Week Warrior',
      description: 'Played for 7 days in a row',
      icon: '🔥',
      points: 200,
      requirement: { type: 'streak', count: 7 }
    }
  ],

  avatars: [
    { id: 1, name: 'bear', displayName: 'Friendly Bear', unlockLevel: 1, image: 'bear.png' },
    { id: 2, name: 'cat', displayName: 'Curious Cat', unlockLevel: 5, image: 'cat.png' },
    { id: 3, name: 'owl', displayName: 'Wise Owl', unlockLevel: 10, image: 'owl.png' },
    { id: 4, name: 'fox', displayName: 'Clever Fox', unlockLevel: 15, image: 'fox.png' },
    { id: 5, name: 'rabbit', displayName: 'Speedy Rabbit', unlockLevel: 20, image: 'rabbit.png' },
    { id: 6, name: 'dragon', displayName: 'Magic Dragon', unlockLevel: 50, image: 'dragon.png' }
  ],

  mathProblems: [
    { id: 1, question: '2 + 2', answer: 4, type: 'addition', difficulty: 'easy' },
    { id: 2, question: '5 - 3', answer: 2, type: 'subtraction', difficulty: 'easy' },
    { id: 3, question: '3 × 4', answer: 12, type: 'multiplication', difficulty: 'medium' }
  ]
};

module.exports = db;
