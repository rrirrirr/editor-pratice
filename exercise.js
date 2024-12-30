#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const CONFIG_FILE = 'config.json';
const EXERCISES_DIR = 'exercises';
const PRACTICE_FILE = 'practice.js';

const DEFAULT_CONFIG = {
  editor: "hx",
  terminal: "alacritty",
  terminals: {
    "alacritty": ["alacritty", "--command"],
    "gnome-terminal": ["gnome-terminal", "--"],
    "konsole": ["konsole", "-e"],
    "kitty": ["kitty"],
    "xterm": ["xterm", "-e"]
  }
};

let config = null;
let startTime = null;
let watcher = null;
let updateInterval = null;
let lastContent = '';
let keystrokes = 0;
let testTimings = new Map();
let testKeystrokes = new Map();
let lastCompletedTestTime = startTime;  // Track when last test was completed
let lastCompletedTestKeys = 0;          // Track keys when last test completed
let testCompletionTimes = new Map();    // Track how long each test took


function initConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
      config = DEFAULT_CONFIG;
    } else {
      const configData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
      config = {
        ...DEFAULT_CONFIG,
        ...configData,
        terminals: {
          ...DEFAULT_CONFIG.terminals,
          ...(configData.terminals || {})
        }
      };
    }
  } catch (error) {
    console.error('Error initializing config:', error.message);
    config = DEFAULT_CONFIG;
  }
}

function openInTerminal(editor, file) {
  if (!config?.terminals?.[config.terminal]) {
    console.error('Invalid terminal configuration');
    return false;
  }

  try {
    if (config.terminal === 'alacritty') {
      const child = spawn('alacritty', ['--print-events', '--command', editor, file], {
        stdio: ['ignore', 'pipe', 'ignore']
      });

      child.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          if (line.includes('KeyboardInput') && line.includes('state: Pressed')) {
            keystrokes++;
          }
        }
      });

      return true;
    }

    const terminalCmd = config.terminals[config.terminal];
    const child = spawn(terminalCmd[0], [...terminalCmd.slice(1), editor, file], {
      stdio: 'ignore',
      detached: true,
      shell: false
    });
    child.unref();
    return true;

  } catch (error) {
    console.error('Error opening terminal:', error.message);
    return false;
  }
}

async function validateExercise(fileName, exercise, timerOnly = false) {
  try {
    const content = fs.readFileSync(fileName, 'utf8');
    const result = await exercise.validate(content);
    const now = Date.now();

    process.stdout.write('\x1Bc');
    console.log('=== Progress ===');
    console.log('Total time:', ((now - startTime) / 1000).toFixed(1) + 's');
    console.log('Total keys:', keystrokes + '\n');

    const percentage = Math.round((result.passedTests / result.totalTests) * 100);
    const bar = '█'.repeat(Math.round((percentage / 100) * 20)) + '░'.repeat(20 - Math.round((percentage / 100) * 20));
    console.log(bar + ' ' + percentage + '%\n');

    if (result.tests) {
      for (const test of result.tests) {
        const status = test.passed ? '✓' : '✗';
        let timeStr = '';


        if (test.passed) {
          if (!testCompletionTimes.has(test.title)) {
            const duration = now - lastCompletedTestTime;
            const keysDelta = keystrokes - lastCompletedTestKeys;
            timeStr = ` (+${(duration / 1000).toFixed(1)}s, +${keysDelta} keys)`;

            testCompletionTimes.set(test.title, { duration, keystrokes: keysDelta });
            lastCompletedTestTime = now;
            lastCompletedTestKeys = keystrokes;
          } else {
            const testData = testCompletionTimes.get(test.title)
            timeStr = ` (+${(testData.duration / 1000).toFixed(1)}s, +${testData.keystrokes} keys)`;
          }
        }
        console.log(`${status} ${test.title}${timeStr}`);
        if (test.message) {
          console.log('  ' + test.message);
        }
      }
    }

    if (!timerOnly && result.error) {
      console.log('\nError:', result.error);
    }

    if (result.isComplete) {
      console.log('\n🎉 All tests passing! Time: ' +
        ((now - startTime) / 1000).toFixed(1) + 's');
      cleanup();
      process.exit(0);
    }
  } catch (error) {
    if (!timerOnly) {
      console.error('File read error:', error.message);
    }
  }
}

function cleanup() {
  if (watcher) watcher.close();
  if (updateInterval) clearInterval(updateInterval);
}

function checkFileChange(fullPath, exercise) {
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content !== lastContent) {
      lastContent = content;
      validateExercise(fullPath, exercise, false);
    }
  } catch (error) {
    // Ignore read errors during file saves
  }
}

async function start(exercisePath, editorCmd, terminalCmd) {
  try {
    if (editorCmd) config.editor = editorCmd;
    if (terminalCmd) config.terminal = terminalCmd;

    const exercise = await import(path.resolve(exercisePath));
    if (!exercise.generate || !exercise.validate) {
      throw new Error('Exercise must export generate() and validate()');
    }

    const fullPath = path.resolve(PRACTICE_FILE);
    fs.writeFileSync(fullPath, exercise.generate());
    lastContent = exercise.generate();
    startTime = Date.now();
    keystrokes = 0;
    testTimings.clear();
    testKeystrokes.clear();
    testCompletionTimes.clear();
    lastCompletedTestTime = Date.now();  // Add this
    lastCompletedTestKeys = 0;           // And this

    if (!openInTerminal(config.editor, fullPath)) {
      console.error('Failed to open editor');
      process.exit(1);
    }

    updateInterval = setInterval(() => validateExercise(fullPath, exercise, true), 50);
    watcher = fs.watch(fullPath, (eventType) => {
      if (eventType === 'change') checkFileChange(fullPath, exercise);
    });

    process.on('SIGINT', () => { cleanup(); process.exit(0); });
    process.on('SIGTERM', () => { cleanup(); process.exit(0); });

    console.log('\nStarted practice: ' + PRACTICE_FILE);
    console.log('Editor:', config.editor);
    console.log('Terminal:', config.terminal);
    validateExercise(fullPath, exercise, false);

  } catch (error) {
    console.error('Error:', error.message);
    cleanup();
    process.exit(1);
  }
}

async function showExerciseInfo(exercise) {
  console.clear();
  const width = process.stdout.columns || 80;
  console.log('╭' + '─'.repeat(width - 2) + '╮');
  console.log(`│ ${exercise.title.padEnd(width - 4)} │`);
  console.log('├' + '─'.repeat(width - 2) + '┤');

  if (exercise.description) {
    const lines = exercise.description.split('\n');
    lines.forEach(line => {
      console.log(`│ ${line.padEnd(width - 4)} │`);
    });
  }

  console.log('╰' + '─'.repeat(width - 2) + '╯');
  console.log('\nPress Enter to start or Esc to go back');

  return new Promise((resolve) => {
    const handler = (key) => {
      if (key === '\r') {
        process.stdin.removeListener('data', handler);
        resolve(true);
      } else if (key === '\u001b') {
        process.stdin.removeListener('data', handler);
        resolve(false);
      }
    };
    process.stdin.on('data', handler);
  });
}

async function showMenu() {
  if (!fs.existsSync(EXERCISES_DIR)) {
    console.error(`Directory '${EXERCISES_DIR}' not found`);
    process.exit(1);
  }

  const files = fs.readdirSync(EXERCISES_DIR)
    .filter(f => f.endsWith('.js'))
    .map(async f => {
      const exercise = await import(path.resolve(EXERCISES_DIR, f));
      return {
        file: f,
        title: exercise.title || f,
        description: exercise.description || ''
      };
    });

  const exercises = await Promise.all(files);
  let selectedIndex = 0;

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  const render = () => {
    console.clear();
    console.log('=== Exercise Menu ===\n');
    exercises.forEach((ex, i) => {
      const prefix = i === selectedIndex ? '> ' : '  ';
      console.log(`${prefix}${ex.title}`);
    });
    console.log('\nUse arrow keys to select, Enter to start, Ctrl+C to quit');
  };

  render();

  return new Promise((resolve) => {
    process.stdin.on('data', (key) => {
      if (key === '\u0003') { // Ctrl+C
        process.exit();
      } else if (key === '\u001B[A') { // Up arrow
        selectedIndex = (selectedIndex - 1 + exercises.length) % exercises.length;
        render();
      } else if (key === '\u001B[B') { // Down arrow
        selectedIndex = (selectedIndex + 1) % exercises.length;
        render();
      } else if (key === '\r') { // Enter
        showExerciseInfo(exercises[selectedIndex]).then(shouldStart => {
          if (shouldStart) {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            resolve(exercises[selectedIndex].file);
          } else {
            render();
          }
        });
      }
    });
  });
}

const main = async () => {
  initConfig();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const file = await showMenu();
    start(path.join(EXERCISES_DIR, file));
  } else {
    const [exercisePath, ...restArgs] = args;
    let editor = null;
    let terminal = null;

    for (let i = 0; i < restArgs.length; i += 2) {
      if (restArgs[i] === '-e' && restArgs[i + 1]) {
        editor = restArgs[i + 1];
      } else if (restArgs[i] === '-t' && restArgs[i + 1]) {
        terminal = restArgs[i + 1];
      }
    }

    if (!fs.existsSync(exercisePath)) {
      console.error('Exercise file not found:', exercisePath);
      process.exit(1);
    }

    start(exercisePath, editor, terminal);
  }
};

main();
