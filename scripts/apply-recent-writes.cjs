const fs = require('fs');
const readline = require('readline');

async function checkConversations() {
  const dirs = [
    'fb02daa0-76e6-45e1-95a6-68647176cfaf',
    'd8e823af-bfe2-483e-88d8-26b76e5dd556'
  ];

  for (const dir of dirs) {
    const logFile = 'C:\\Users\\ps087\\.gemini\\antigravity-ide\\brain\\' + dir + '\\.system_generated\\logs\\transcript_full.jsonl';
    if (!fs.existsSync(logFile)) continue;
    const rl = readline.createInterface({ input: fs.createReadStream(logFile), crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.includes('write_to_file') && !line.includes('replace_file_content')) continue;
      try {
        const obj = JSON.parse(line);
        for (const tc of (obj.tool_calls || [])) {
          if (tc.name === 'write_to_file' && tc.args && tc.args.TargetFile && tc.args.CodeContent) {
            const tf = tc.args.TargetFile;
            if (tf.includes('teamconnect-frontend') && !tf.includes('create-wrappers')) {
              console.log(dir, 'write_to_file:', tf);
              fs.writeFileSync(tf, tc.args.CodeContent);
            }
          }
        }
      } catch (e) {}
    }
  }
}

checkConversations();
