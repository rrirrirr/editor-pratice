export const title = "Exercise 1: Multi-cursor Practice";

export function generate() {
  return `// Multi-cursor Practice Exercise
// Tasks:
// 1. Change all 'item' variables to 'product'
// 2. Duplicate all value assignments
// 3. Combine names into an array

const item1 = "first";
const item2 = "second";
const item3 = "third";
const item4 = "fourth";
const item5 = "fifth";

const val1 = 100;
const val2 = 200;
const val3 = 300;
const val4 = 400;
const val5 = 500;

const name1 = "Alice";
const name2 = "Bob";
const name3 = "Charlie";
const name4 = "David";
const name5 = "Eve";`;
}

export async function validate(content) {
  try {
    const tests = [
      {
        title: "Replace 'item' with 'product'",
        passed: content.includes('product1') &&
          content.includes('product2') &&
          content.includes('product3') &&
          content.includes('product4') &&
          content.includes('product5') &&
          !content.includes('item1')
      },
      {
        title: "Duplicate value assignments",
        passed: content.includes('val1 = 100; const newVal1 = 100') &&
          content.includes('val2 = 200; const newVal2 = 200') &&
          content.includes('val3 = 300; const newVal3 = 300') &&
          content.includes('val4 = 400; const newVal4 = 400') &&
          content.includes('val5 = 500; const newVal5 = 500')
      },
      {
        title: "Create names array",
        passed: content.replace(/\s+/g, '').includes(
          'names=["Alice","Bob","Charlie","David","Eve"]'
        ) || content.replace(/\s+/g, '').includes(
          "names=['Alice','Bob','Charlie','David','Eve']"
        )
      }
    ];

    const passedTests = tests.filter(t => t.passed).length;

    return {
      isComplete: passedTests === tests.length,
      passedTests,
      totalTests: tests.length,
      tests,
      error: null
    };
  } catch (error) {
    return {
      isComplete: false,
      passedTests: 0,
      totalTests: 3,
      error: error.message
    };
  }
}
