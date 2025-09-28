import axios from 'axios';

const USE_GROQ = !!process.env.GROQ_API_KEY;

function mockGenerateQuiz({ subject, grade, counts = { easy: 3, medium: 2, hard: 1 } }) {
  const bank = getQuestionBank(subject);
  const build = (diff) => bank[diff] && bank[diff].length ? bank[diff] : fallbackBank(subject)[diff];
  const pick = (arr, n) => arr.slice(0, Math.max(0, n));

  const questions = [
    ...pick(build('easy'), counts.easy || 0),
    ...pick(build('medium'), counts.medium || 0),
    ...pick(build('hard'), counts.hard || 0),
  ].map((q) => ({ ...q, subject }));

  return { title: `${subject} Quiz (${grade})`, subject, grade, questions };
}

function getQuestionBank(subject = '') {
  const s = subject.toLowerCase();
  if (s.includes('html')) return htmlBank();
  if (s.includes('javascript') || s === 'js') return jsBank();
  if (s.includes('react')) return reactBank();
  if (s.includes('python')) return pythonBank();
  if (s.includes('math') || s.includes('algebra') || s.includes('geometry')) return mathBank();
  if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('bio')) return scienceBank();
  return fallbackBank(subject);
}

function fallbackBank(subject) {
  // generic bank with realistic structure
  return {
    easy: [
      { text: `Which option best relates to ${subject}?`, options: ['Definition', 'Irrelevant', 'Random', 'None'], correctAnswer: 'Definition', difficulty: 'easy' },
      { text: `Basic concept in ${subject}?`, options: ['Core idea', 'Decoration', 'Noise', 'Error'], correctAnswer: 'Core idea', difficulty: 'easy' },
      { text: `Identify a common term in ${subject}.`, options: ['Term', 'City', 'Animal', 'Month'], correctAnswer: 'Term', difficulty: 'easy' },
    ],
    medium: [
      { text: `A standard practice in ${subject} is?`, options: ['Best practice', 'Guessing', 'Ignoring data', 'Copying blindly'], correctAnswer: 'Best practice', difficulty: 'medium' },
      { text: `What usually improves results in ${subject}?`, options: ['Review mistakes', 'Avoid feedback', 'Skip basics', 'Always rush'], correctAnswer: 'Review mistakes', difficulty: 'medium' },
    ],
    hard: [
      { text: `A challenging concept in ${subject} is?`, options: ['Advanced technique', 'Typing fast', 'Using dark mode', 'Changing fonts'], correctAnswer: 'Advanced technique', difficulty: 'hard' },
    ],
  };
}

function htmlBank() {
  return {
    easy: [
      { text: 'Which tag defines a top-level heading?', options: ['<h1>', '<p>', '<div>', '<span>'], correctAnswer: '<h1>', difficulty: 'easy' },
      { text: 'Which attribute sets an image source?', options: ['src', 'href', 'alt', 'type'], correctAnswer: 'src', difficulty: 'easy' },
      { text: 'Which tag creates a hyperlink?', options: ['<a>', '<link>', '<nav>', '<button>'], correctAnswer: '<a>', difficulty: 'easy' },
    ],
    medium: [
      { text: 'Which element groups navigation links?', options: ['<nav>', '<section>', '<aside>', '<header>'], correctAnswer: '<nav>', difficulty: 'medium' },
      { text: 'Which tag best represents independent content?', options: ['<article>', '<span>', '<b>', '<em>'], correctAnswer: '<article>', difficulty: 'medium' },
    ],
    hard: [
      { text: 'Which attribute improves accessibility by describing images?', options: ['alt', 'title', 'name', 'role'], correctAnswer: 'alt', difficulty: 'hard' },
    ],
  };
}

function jsBank() {
  return {
    easy: [
      { text: 'Which keyword declares a block-scoped variable?', options: ['let', 'var', 'function', 'def'], correctAnswer: 'let', difficulty: 'easy' },
      { text: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Simple Object Notation', 'Joined Script Output Network', 'None'], correctAnswer: 'JavaScript Object Notation', difficulty: 'easy' },
      { text: 'Which operator checks strict equality?', options: ['===', '==', '=', '=>'], correctAnswer: '===', difficulty: 'easy' },
    ],
    medium: [
      { text: 'What is a Promise used for?', options: ['Async operations', 'Styling', 'HTML parsing', 'Database schema'], correctAnswer: 'Async operations', difficulty: 'medium' },
      { text: 'Which method creates a new array from mapping each element?', options: ['map', 'forEach', 'reduce', 'filter'], correctAnswer: 'map', difficulty: 'medium' },
    ],
    hard: [
      { text: 'Which feature avoids callback hell?', options: ['async/await', 'var hoisting', 'global scope', 'eval'], correctAnswer: 'async/await', difficulty: 'hard' },
    ],
  };
}

function reactBank() {
  return {
    easy: [
      { text: 'What hook manages component state?', options: ['useState', 'useClass', 'useData', 'useVar'], correctAnswer: 'useState', difficulty: 'easy' },
      { text: 'JSX must return a single parent element. True or False?', options: ['True', 'False', 'Only in dev', 'Only in prod'], correctAnswer: 'True', difficulty: 'easy' },
      { text: 'Which prop passes data to a component?', options: ['props', 'state', 'context', 'hooks'], correctAnswer: 'props', difficulty: 'easy' },
    ],
    medium: [
      { text: 'Which hook handles side effects?', options: ['useEffect', 'useMemo', 'useRef', 'useId'], correctAnswer: 'useEffect', difficulty: 'medium' },
      { text: 'Which hook memoizes expensive calculations?', options: ['useMemo', 'useCallback', 'useEffect', 'useLayoutEffect'], correctAnswer: 'useMemo', difficulty: 'medium' },
    ],
    hard: [
      { text: 'Which hook returns a memoized callback?', options: ['useCallback', 'useMemo', 'useReducer', 'useSyncExternalStore'], correctAnswer: 'useCallback', difficulty: 'hard' },
    ],
  };
}

function pythonBank() {
  return {
    easy: [
      { text: 'Which keyword defines a function?', options: ['def', 'func', 'fn', 'lambda'], correctAnswer: 'def', difficulty: 'easy' },
      { text: 'How do you create a list?', options: ['[1,2,3]', '(1,2,3)', '{1,2,3}', '<1,2,3>'], correctAnswer: '[1,2,3]', difficulty: 'easy' },
      { text: 'Which keyword starts a loop over items?', options: ['for', 'foreach', 'loop', 'iterate'], correctAnswer: 'for', difficulty: 'easy' },
    ],
    medium: [
      { text: 'What is a dictionary literal?', options: ['{"a":1}', '["a",1]', '("a",1)', '<a:1>'], correctAnswer: '{"a":1}', difficulty: 'medium' },
      { text: 'Which tool manages project dependencies?', options: ['pip', 'npm', 'gradle', 'cargo'], correctAnswer: 'pip', difficulty: 'medium' },
    ],
    hard: [
      { text: 'Which keyword defines a generator?', options: ['yield', 'generate', 'spawn', 'produce'], correctAnswer: 'yield', difficulty: 'hard' },
    ],
  };
}

function mathBank() {
  return {
    easy: [
      { text: 'What is 7 + 5?', options: ['12', '10', '13', '11'], correctAnswer: '12', difficulty: 'easy' },
      { text: 'The area of a rectangle is length × width. True?', options: ['True', 'False', 'Only for squares', 'Never'], correctAnswer: 'True', difficulty: 'easy' },
      { text: 'Which is a prime number?', options: ['13', '15', '21', '1'], correctAnswer: '13', difficulty: 'easy' },
    ],
    medium: [
      { text: 'Solve: 3x = 21. x = ?', options: ['7', '6', '9', '3'], correctAnswer: '7', difficulty: 'medium' },
      { text: 'Area of a circle with r=3?', options: ['9π', '6π', '3π', 'π/3'], correctAnswer: '9π', difficulty: 'medium' },
    ],
    hard: [
      { text: 'Derivative of x^3 is?', options: ['3x^2', 'x^2', '3x', 'x^3'], correctAnswer: '3x^2', difficulty: 'hard' },
    ],
  };
}

function scienceBank() {
  return {
    easy: [
      { text: 'Water freezes at what temperature (°C)?', options: ['0', '32', '100', '-10'], correctAnswer: '0', difficulty: 'easy' },
      { text: 'Which gas do plants primarily take in?', options: ['CO2', 'O2', 'N2', 'He'], correctAnswer: 'CO2', difficulty: 'easy' },
      { text: 'The center of an atom is called?', options: ['Nucleus', 'Cell', 'Core', 'Neutron'], correctAnswer: 'Nucleus', difficulty: 'easy' },
    ],
    medium: [
      { text: 'Force equals mass times what?', options: ['Acceleration', 'Velocity', 'Energy', 'Time'], correctAnswer: 'Acceleration', difficulty: 'medium' },
      { text: 'Table salt is mostly?', options: ['NaCl', 'KCl', 'H2SO4', 'HCl'], correctAnswer: 'NaCl', difficulty: 'medium' },
    ],
    hard: [
      { text: 'What particle has a negative charge?', options: ['Electron', 'Proton', 'Neutron', 'Positron'], correctAnswer: 'Electron', difficulty: 'hard' },
    ],
  };
}

function mockEvaluate(quiz, answers) {
  let score = 0;
  const evaluated = answers.map((a) => {
    const q = quiz.questions[a.questionIndex];
    const isCorrect = q && a.answer === q.correctAnswer;
    if (isCorrect) score += 1;
    return { ...a, isCorrect, feedback: isCorrect ? 'Correct' : 'Review this topic' };
  });
  const maxScore = answers.length;
  const tips = score === maxScore ? ['Great job! Keep practicing.', 'Try a harder quiz next time.'] : [
    'Focus on reviewing incorrect answers.',
    'Practice with medium difficulty questions in weak areas.',
  ];
  return { evaluated, score, maxScore, tips };
}

function mockHint(quiz, questionIndex) {
  const q = quiz.questions[questionIndex];
  if (!q) return 'No such question';
  return `Think about the key concept behind: ${q.text.slice(0, 40)}...`;
}

async function groqChat(messages) {
  const apiKey = process.env.GROQ_API_KEY;
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const model = process.env.GROQ_MODEL || 'llama3-70b-8192';
  const { data } = await axios.post(
    url,
    { model, messages, temperature: 0.2 },
    { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
  );
  return data.choices?.[0]?.message?.content || '';
}

export const aiService = {
  async generateQuiz(payload) {
    if (!USE_GROQ) return mockGenerateQuiz(payload);
    const { subject, grade, counts } = payload;
    const system = { role: 'system', content: 'You are a quiz generator. Output STRICT JSON only. Do not include markdown fences.' };
    const schema = {
      title: `${subject} Quiz (${grade})`,
      subject,
      grade,
      questions: [
        { text: 'string', options: ['string','string','string','string'], correctAnswer: 'one of options', difficulty: 'easy|medium|hard' }
      ]
    };
    const user = { role: 'user', content: `Create a multiple-choice quiz in JSON with this schema: ${JSON.stringify(schema)}. Subject: "${subject}". Grade: "${grade}". Distribute number of questions by difficulty according to counts: ${JSON.stringify(counts)}. Ensure each question has 4 realistic options, exactly one correctAnswer matching one of the options, and difficulty tagged as easy/medium/hard. Respond with ONLY valid JSON.` };
    const content = await groqChat([system, user]);
    try {
      return JSON.parse(content);
    } catch (e) {
      return mockGenerateQuiz(payload);
    }
  },

  async evaluate(quiz, answers) {
    if (!USE_GROQ) return mockEvaluate(quiz, answers);
    const system = { role: 'system', content: 'Evaluate quiz answers. Return JSON {evaluated:[{questionIndex, answer, isCorrect, feedback}], score, maxScore, tips:["...", "..."]}'};
    const user = { role: 'user', content: `Quiz: ${JSON.stringify(quiz)}\nAnswers: ${JSON.stringify(answers)}\nRespond with ONLY JSON.` };
    const content = await groqChat([system, user]);
    try {
      return JSON.parse(content);
    } catch (e) {
      return mockEvaluate(quiz, answers);
    }
  },

  async hint(quiz, questionIndex) {
    if (!USE_GROQ) return mockHint(quiz, questionIndex);
    const system = { role: 'system', content: 'Provide a short helpful hint for a quiz question.' };
    const user = { role: 'user', content: `Question: ${JSON.stringify(quiz.questions[questionIndex])}. Keep it short.` };
    const content = await groqChat([system, user]);
    return content?.trim() || mockHint(quiz, questionIndex);
  },
};
