export const title = "Exercise: 1";
export const description = `An exercise focusing on text selection and navigations techniques:

GOALS:
- Select and modify text at different scopes (char, word, line, block, function, comment)
- Navigate efficiently between points in text
- Use multiple cursors strategically`

export function generate() {
  return `// Text Selection Exercise
// Complete each task using efficient selection techniques

const config = {
  // Task 1: Change each 'old' to 'new' in this block
  username: "super_mega_old_ultra_cool_user",
  password: "epic_old_secret_pass",
  database: "hyper_turbo_old_db",
  hostname: "quantum_old_host",
  apiKey: "ninja_old_key_2024",
  endpoint: "cosmic_old_api", 
  region: "mega_old_zone_1",
  cluster: "power_old_cluster",
  backup: "ultra_old_backup",
  mirror: "super_old_mirror",
  cache: "turbo_old_cache"
};

// Task 2: Remove all line comments and block comments without touching code
// This is a check
function validateInput(input) { // Input validator
  const cleaned = input.trim(); // Remove whitespace
  const length = cleaned.length; // Get length
  return length > 0; // Return result
  /* This is a block comment
     that spans multiple lines
     and needs to be removed */
  function processData(data) {
    /* Validate data */
    if (!data) return null;
    /* Transform input */
    return data.map(x => x * 2);
  }
  /* Another block
     spanning comment */
  const transform = (x) => {
    /* Process x */
    return x + 1;
  }
}

// Task 3: Remove content between START/END markers, keep empty lines

// ===== START =====
const items = ["one", "two", "three"];
const numbers = [1, 2, 3];
const active = true;
// ===== END =====

const keepThis = true;

// ===== START =====
const temps = [20, 21, 22];
const ready = false;
const status = "pending";
// ===== END =====

const keepThisAlso = true;

// ===== START =====
const x = 100;
const y = 200;
const visible = true;
// ===== END =====

const andThis = true;

// ===== START =====
const a = 1;
const b = 2;
const enabled = true;
// ===== END =====

// Task 4: Fix capitalization (uppercase first letter only)
const animals = {
  GIRAFFE: "tall",
  ELEPHANT: "large",
  PENGUIN: "small",
  KANGAROO: "jumpy",
  DOLPHIN: "smart",
  CHEETAH: "fast",
  OCTOPUS: "clever",
  PANDA: "cute",
  TIGER: "fierce",
  KOALA: "sleepy",
  ZEBRA: "striped",
  MONKEY: "agile",
  LION: "proud",
  EAGLE: "sharp",
  BEAR: "strong"
};

// Task 5: Delete only functions between markers
// ===== START =====
function processItem() { return true; }
const notAFunction = 42;
function validateData() { return false; }
let anotherVar = "hello";
function transformInput() { return null; }
function generateReport() { return []; }
const keepMe = true;
function cleanupData() { return {}; }
function exportResults() { return "done"; }
// ===== END =====

// Task 6: Add quotes around each key
const settings = {
  darkMode: true,
  fontSize: 14,
  language: "en",
  notifications: false,
  theme: "default",
  contrast: "high",
  timeout: 5000,
  retries: 3,
  caching: true,
  compression: "gzip",
  logging: "verbose",
  metrics: true,
  tracing: false,
  sampling: 0.1,
  bufferSize: 1024
};

// Task 7: Add quotes to values that aren't already strings
const props = {
  width: 100,
  height: 200,
  format: "json",
  color: blue,
  type: "normal",
  border: solid,
  mode: "dark",
  radius: 10,
  style: "modern",
  shape: circle,
  size: "large",
  pattern: dots,
  theme: "classic",
  texture: smooth,
  format: raw,
  level: "max",
  state: active,
  phase: "beta",
  option: default,
  env: "prod"
};

// Task 8: Delete text between 'from' and last 'here' in each line. Including from and here
const text1 = "delete from_super_long_text_with_random_stuff_here and more text here";
const text2 = "testing from_another_long_string_of_text_here_with_extras here now";
const text3 = "check from_random_string_with_lots_of_characters_here_plus_more";
const text4 = "verify_from_more_text_that_needs_to_be_removed_here_and_cleaned here";
const text5 = "final from_last_string_with_different_content_here_to_delete";`;
}

export function validate(content) {
  const tests = [
    {
      title: "Change 'old' to 'new'",
      passed: ["new_ultra_cool_user", "epic_new_secret_pass", "hyper_turbo_new_db",
        "quantum_new_host", "ninja_new_key_2024", "cosmic_new_api",
        "mega_new_zone_1", "power_new_cluster", "ultra_new_backup",
        "super_new_mirror", "turbo_new_cache"]
        .every(s => content.includes(s)),
      message: "Replace all 'old' with 'new' in each string"
    },
    {
      title: "Remove all comments",
      passed: !content.includes("// This is a check") &&
        !content.includes("// Input validator") &&
        !content.includes("// Remove whitespace") &&
        !content.includes("// Get length") &&
        !content.includes("// Return result") &&
        !content.includes("/* This is a block comment") &&
        !content.includes("/* Validate data */") &&
        !content.includes("/* Transform input */") &&
        !content.includes("/* Another block") &&
        !content.includes("/* Process x */") &&
        content.includes("function validateInput"),
      message: "Remove all single-line and block comments while keeping code"
    },
    {
      title: "Remove START/END blocks",
      passed: content.includes("const keepThis = true;") &&
        content.includes("const keepThisAlso = true;") &&
        content.includes("const andThis = true;") &&
        !content.includes('["one", "two", "three"]') &&
        !content.includes('[20, 21, 22]') &&
        !content.includes('const x = 100') &&
        !content.includes('const a = 1'),
      message: "Remove all content between START/END markers while keeping other lines"
    },
    {
      title: "Fix animal capitalization",
      passed: ["Giraffe", "Elephant", "Penguin", "Kangaroo", "Dolphin",
        "Cheetah", "Octopus", "Panda", "Tiger", "Koala",
        "Zebra", "Monkey", "Lion", "Eagle", "Bear"]
        .every(s => content.includes(s + ':')),
      message: "Convert animal names to proper case (first letter capital)"
    },
    {
      title: "Remove only functions",
      passed: content.includes("const notAFunction = 42") &&
        content.includes('let anotherVar = "hello"') &&
        content.includes("const keepMe = true") &&
        !content.includes("function processItem") &&
        !content.includes("function validateData") &&
        !content.includes("function transformInput") &&
        !content.includes("function generateReport") &&
        !content.includes("function cleanupData") &&
        !content.includes("function exportResults"),
      message: "Remove only function definitions between markers"
    },
    {
      title: "Add quotes to keys",
      passed: ['"darkMode"', '"fontSize"', '"language"', '"notifications"', '"theme"',
        '"contrast"', '"timeout"', '"retries"', '"caching"', '"compression"',
        '"logging"', '"metrics"', '"tracing"', '"sampling"', '"bufferSize"']
        .every(s => content.includes(s + ':')),
      message: "Add quotes around all object keys"
    },
    {
      title: "Add quotes to unquoted values",
      passed: content.includes('color: "blue"') &&
        content.includes('border: "solid"') &&
        content.includes('shape: "circle"') &&
        content.includes('pattern: "dots"') &&
        content.includes('texture: "smooth"') &&
        content.includes('format: "raw"') &&
        content.includes('state: "active"') &&
        content.includes('option: "default"') &&
        // Verify already-quoted strings remain
        content.includes('format: "json"') &&
        content.includes('type: "normal"') &&
        content.includes('mode: "dark"') &&
        content.includes('style: "modern"'),
      message: "Add quotes around values that aren't already quoted strings"
    },
    {
      title: "Delete between words",
      passed: content.includes('const text1 = "delete "') &&
        content.includes('const text2 = "testing  now"') &&
        content.includes('const text3 = "check _plus_more"') &&
        content.includes('const text4 = "verify_"') &&
        content.includes('const text5 = "final _to_delete"'),
      message: "Delete text between 'from' and last 'here' in each line"
    }
  ];

  return {
    isComplete: tests.every(t => t.passed),
    passedTests: tests.filter(t => t.passed).length,
    totalTests: tests.length,
    tests
  };
}
