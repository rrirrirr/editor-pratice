# Editor Practice

A tool to practice and track editor skills through timed exercises.

## Installation
```bash
git clone <repo>
cd editor-practice
bun install
```

## Usage
```bash
# Show exercise menu
bun exercise.js

# Run specific exercise
bun exercise.js exercises/multicursor1.js

# Use different editor/terminal
bun exercise.js -e vim -t alacritty
```

## Configuration
The `config.json` file contains your editor and terminal preferences:
```json
{
  "editor": "hx",
  "terminal": "alacritty",
  "terminals": {
    "alacritty": ["alacritty", "--command"],
    "gnome-terminal": ["gnome-terminal", "--"],
    "konsole": ["konsole", "-e"],
    "kitty": ["kitty"],
    "xterm": ["xterm", "-e"]
  }
}
```

- `editor`: Your preferred text editor command
- `terminal`: Your terminal emulator (from the terminals list)
- `terminals`: Command line arguments for each supported terminal

Note: Keystroke tracking only works with Alacritty.

## Creating Exercises
Create a JS file in `exercises/` with:
```javascript
export const title = "Exercise Name";

export function generate() {
  return `// Your starter code here`;
}

export function validate(content) {
  const tests = [
    {
      title: "Test description",
      passed: content.includes('expected')
    }
  ];

  const passedTests = tests.filter(t => t.passed).length;
  return {
    isComplete: passedTests === tests.length,
    passedTests,
    totalTests: tests.length,
    tests
  };
}
