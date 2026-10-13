const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFile = 'C:\\Users\\ps087\\.gemini\\antigravity-ide\\brain\\42b8e3f3-40ea-44e2-8237-1de9b74c510f\\.system_generated\\logs\\transcript_full.jsonl';
const rl = readline.createInterface({ input: fs.createReadStream(logFile) });

rl.on('line', (line) => {
  if (line.includes('"step_index":76,')) {
    const p = JSON.parse(line);
    console.log('Step 76 command:', p.tool_calls[0].args.CommandLine.slice(0, 500));
    fs.writeFileSync('step76.txt', p.tool_calls[0].args.CommandLine);
  }
});
