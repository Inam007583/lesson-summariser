// Local test: npm run try -- path/to/lesson.pdf
import { summariseLesson } from "../src/index.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: npm run try -- <lesson.pdf>");
  process.exit(1);
}

const started = Date.now();
const summary = await summariseLesson(file);
console.log(JSON.stringify(summary, null, 2));
console.error(`\nDone in ${((Date.now() - started) / 1000).toFixed(1)}s`);
