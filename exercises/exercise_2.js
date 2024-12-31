export const title = "Exercise 2 - Word navigation and transform";
export const description = "Practice efficient word navigation and text manipulation:\n- Jump between specific marked words\n- Remove or transform different surrounding patterns\n- Keep the mystical text intact\n\nWords to find are surrounded by various brackets/quotes.";

const fluffDictionary = {
  adjectives: [
    'ancient', 'mysterious', 'glowing', 'forgotten', 'enchanted', 'cursed',
    'sacred', 'hidden', 'magical', 'celestial', 'shadowy', 'ethereal',
    'frozen', 'burning', 'twisted', 'shimmering', 'haunted', 'blessed',
    'forbidden', 'arcane', 'mystic', 'spectral', 'radiant', 'corrupt'
  ],
  nouns: [
    'crystal', 'relic', 'tome', 'artifact', 'scroll', 'grimoire',
    'sigil', 'amulet', 'stone', 'shard', 'blade', 'chalice',
    'orb', 'crown', 'staff', 'ring', 'portal', 'mirror',
    'rune', 'gem', 'altar', 'temple', 'void', 'shrine'
  ],
  verbs: [
    'whispers', 'glows', 'pulses', 'echoes', 'manifests', 'resonates',
    'radiates', 'flickers', 'hums', 'floats', 'swirls', 'shimmers',
    'emerges', 'fades', 'burns', 'freezes', 'hovers', 'ripples',
    'morphs', 'distorts', 'warps', 'bends', 'shifts', 'twists'
  ]
};

function generateFluffPhrase(minWords = 1, maxWords = 3) {
  const words = [];
  const count = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));

  for (let i = 0; i < count; i++) {
    const type = Math.random() < 0.33 ? 'adjectives' :
      Math.random() < 0.66 ? 'nouns' : 'verbs';
    words.push(fluffDictionary[type][Math.floor(Math.random() * fluffDictionary[type].length)]);
  }
  return words.join(' ');
}

function getRandomSurroundings(word) {
  const surroundings = [
    ['[', ']'],
    ['{', '}'],
    ['<', '>'],
    ['(', ')'],
    ['"', '"'],
    ['`', '`']
  ];

  if (word === 'NOTHING') {
    return `_${word}_`;
  }

  const numLayers = Math.floor(Math.random() * 2) + 1;
  let result = `_${word}_`;
  for (let i = 0; i < numLayers; i++) {
    const [left, right] = surroundings[Math.floor(Math.random() * surroundings.length)];
    result = `${left}${result}${right}`;
  }
  return result;
}

export function generate() {
  const targetWords = ['BRACKET', 'QUOTE', 'ANGLE', 'DIV', 'PAREN', 'CURLY', 'BACKTICK'];
  const wordCounts = {};
  targetWords.forEach(w => wordCounts[w] = 0);
  wordCounts.NOTHING = 0;

  const lines = [];
  for (let i = 0; i < 30; i++) {
    const lineWords = [];
    const numTargetWords = Math.floor(Math.random() * 3) + 1; // 1-3 target words per line

    lineWords.push(generateFluffPhrase(1, 3));

    for (let j = 0; j < numTargetWords; j++) {
      const word = Math.random() < 0.3 ? 'NOTHING' :
        targetWords[Math.floor(Math.random() * targetWords.length)];
      wordCounts[word]++;

      lineWords.push(getRandomSurroundings(word));
      lineWords.push(generateFluffPhrase(1, 3));
    }

    lines.push(lineWords.join(' '));
  }

  global.wordCounts = wordCounts;
  return lines.join('\n');
}

export function validate(content) {
  const tests = [];
  const surroundingMap = {
    'BRACKET': ['[', ']'],
    'QUOTE': ['"', '"'],
    'ANGLE': ['<', '>'],
    'DIV': ['<div>', '</div>'],
    'PAREN': ['(', ')'],
    'CURLY': ['{', '}'],
    'BACKTICK': ['`', '`']
  };

  // Check NOTHING has no surroundings
  if (global.wordCounts.NOTHING > 0) {
    const nothingCount = (content.match(/NOTHING/g) || []).length;
    const surroundedNothings = (content.match(/[[\]{}()<>"'`_]NOTHING[[\]{}()<>"'`_]/g) || []).length;

    tests.push({
      title: `Remove surroundings from NOTHING (${global.wordCounts.NOTHING} instances)`,
      passed: nothingCount === global.wordCounts.NOTHING && surroundedNothings === 0,
      message: "NOTHING words should appear without any surroundings"
    });
  }

  Object.entries(global.wordCounts).forEach(([word, count]) => {
    if (word !== 'NOTHING' && count > 0) {
      const [left, right] = surroundingMap[word];
      const pattern = new RegExp(`${left}${word}${right}`, 'g');
      const matches = content.match(pattern);

      tests.push({
        title: `Convert ${word} to ${left}${word}${right} (${count} instances)`,
        passed: matches?.length === count,
        message: `Found ${matches?.length || 0} of ${count} expected`
      });
    }
  });

  return {
    isComplete: tests.every(t => t.passed),
    passedTests: tests.filter(t => t.passed).length,
    totalTests: tests.length,
    tests
  };
}
