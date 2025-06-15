// Word families data for easy management
// You can add new word families here and they'll be automatically imported

const wordFamiliesData = [
  {
    name: 'AT',
    description: 'Words ending with -at sound',
    pattern: '_at',
    difficulty: 'easy',
    words: [
      { word: 'cat', example_sentence: 'The cat is sleeping on the mat.' },
      { word: 'bat', example_sentence: 'The baseball bat is made of wood.' },
      { word: 'hat', example_sentence: 'She wore a red hat to the party.' },
      { word: 'mat', example_sentence: 'Please wipe your feet on the mat.' },
      { word: 'rat', example_sentence: 'The rat ran through the maze.' },
      { word: 'fat', example_sentence: 'The fat cat ate too much food.' },
      { word: 'sat', example_sentence: 'She sat on the comfortable chair.' },
      { word: 'pat', example_sentence: 'Give the dog a gentle pat.' }
    ]
  },
  {
    name: 'AN',
    description: 'Words ending with -an sound',
    pattern: '_an',
    difficulty: 'easy',
    words: [
      { word: 'can', example_sentence: 'I can ride my bike to school.' },
      { word: 'man', example_sentence: 'The man walked his dog in the park.' },
      { word: 'pan', example_sentence: 'Cook the eggs in a frying pan.' },
      { word: 'ran', example_sentence: 'She ran as fast as she could.' },
      { word: 'fan', example_sentence: 'Turn on the fan to cool the room.' },
      { word: 'tan', example_sentence: 'His skin got tan from the sun.' },
      { word: 'van', example_sentence: 'The delivery van arrived on time.' },
      { word: 'plan', example_sentence: 'We need to make a plan for the trip.' }
    ]
  },
  {
    name: 'ING',
    description: 'Words ending with -ing sound',
    pattern: '_ing',
    difficulty: 'medium',
    words: [
      { word: 'sing', example_sentence: 'The birds sing beautiful songs.' },
      { word: 'ring', example_sentence: 'The phone will ring when someone calls.' },
      { word: 'king', example_sentence: 'The king ruled the kingdom wisely.' },
      { word: 'wing', example_sentence: 'The bird flapped its wing to fly.' },
      { word: 'bring', example_sentence: 'Please bring your homework to class.' },
      { word: 'thing', example_sentence: 'What is that strange thing over there?' },
      { word: 'spring', example_sentence: 'Flowers bloom in the spring season.' },
      { word: 'swing', example_sentence: 'The children love to swing at the playground.' }
    ]
  },
  {
    name: 'OP',
    description: 'Words ending with -op sound',
    pattern: '_op',
    difficulty: 'easy',
    words: [
      { word: 'hop', example_sentence: 'The bunny likes to hop around the yard.' },
      { word: 'top', example_sentence: 'The spinning top spun very fast.' },
      { word: 'pop', example_sentence: 'The balloon will pop if you squeeze it.' },
      { word: 'stop', example_sentence: 'Please stop at the red light.' },
      { word: 'shop', example_sentence: 'We went to shop for groceries.' },
      { word: 'drop', example_sentence: 'Be careful not to drop the glass.' }
    ]
  },
  {
    name: 'UG',
    description: 'Words ending with -ug sound',
    pattern: '_ug',
    difficulty: 'easy',
    words: [
      { word: 'bug', example_sentence: 'The little bug crawled on the leaf.' },
      { word: 'hug', example_sentence: 'Mom gave me a warm hug.' },
      { word: 'mug', example_sentence: 'I drink hot chocolate from my favorite mug.' },
      { word: 'rug', example_sentence: 'The soft rug feels nice under my feet.' },
      { word: 'tug', example_sentence: 'The dog likes to tug on the rope.' },
      { word: 'jug', example_sentence: 'Pour the milk from the jug.' }
    ]
  },
  {
    name: 'ET',
    description: 'Words ending with -et sound',
    pattern: '_et',
    difficulty: 'medium',
    words: [
      { word: 'pet', example_sentence: 'My pet dog loves to play fetch.' },
      { word: 'net', example_sentence: 'The fisherman cast his net into the water.' },
      { word: 'wet', example_sentence: 'My clothes got wet in the rain.' },
      { word: 'get', example_sentence: 'Can you get me a glass of water?' },
      { word: 'let', example_sentence: 'Please let me help you with that.' },
      { word: 'set', example_sentence: 'Set the table for dinner.' }
    ]
  },
  {
    name: 'ICK',
    description: 'Words ending with -ick sound',
    pattern: '_ick',
    difficulty: 'medium',
    words: [
      { word: 'pick', example_sentence: 'Pick your favorite color crayon.' },
      { word: 'kick', example_sentence: 'Kick the soccer ball into the goal.' },
      { word: 'sick', example_sentence: 'I stayed home because I felt sick.' },
      { word: 'tick', example_sentence: 'The clock goes tick-tock.' },
      { word: 'quick', example_sentence: 'The quick rabbit ran away.' },
      { word: 'stick', example_sentence: 'The dog fetched the stick.' },
      { word: 'thick', example_sentence: 'The book has thick pages.' }
    ]
  },
  {
    name: 'IGHT',
    description: 'Words ending with -ight sound',
    pattern: '_ight',
    difficulty: 'hard',
    words: [
      { word: 'light', example_sentence: 'Turn on the light so we can see.' },
      { word: 'night', example_sentence: 'The stars shine bright at night.' },
      { word: 'right', example_sentence: 'Turn right at the next corner.' },
      { word: 'sight', example_sentence: 'The sunset was a beautiful sight.' },
      { word: 'bright', example_sentence: 'The sun is very bright today.' },
      { word: 'fight', example_sentence: 'The knights would fight with swords.' }
    ]
  },
  // Add more word families here!
  {
    name: 'ALL',
    description: 'Words ending with -all sound',
    pattern: '_all',
    difficulty: 'medium',
    words: [
      { word: 'ball', example_sentence: 'The red ball bounced high.' },
      { word: 'call', example_sentence: 'Please call me when you get home.' },
      { word: 'fall', example_sentence: 'The leaves fall from the trees in autumn.' },
      { word: 'hall', example_sentence: 'Walk quietly down the hall.' },
      { word: 'mall', example_sentence: 'We went shopping at the mall.' },
      { word: 'tall', example_sentence: 'The giraffe is very tall.' },
      { word: 'wall', example_sentence: 'Hang the picture on the wall.' },
      { word: 'small', example_sentence: 'The mouse is very small.' }
    ]
  }
];

module.exports = wordFamiliesData; 