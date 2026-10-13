const fs = require('fs');
const readline = require('readline');

async function replayReplacements() {
  const dirs = ['fb02daa0-76e6-45e1-95a6-68647176cfaf', 'd8e823af-bfe2-483e-88d8-26b76e5dd556'];
  for (const dir of dirs) {
    const p = 'C:\\Users\\ps087\\.gemini\\antigravity-ide\\brain\\' + dir + '\\.system_generated\\logs\\transcript_full.jsonl';
    if (!fs.existsSync(p)) continue;
    const rl = readline.createInterface({ input: fs.createReadStream(p), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('replace_file_content')) continue;
      try {
        const obj = JSON.parse(line);
        for (const tc of (obj.tool_calls || [])) {
          if (tc.name === 'replace_file_content') {
            const tf = tc.args.TargetFile.replace(/\\/g, '/');
            if (fs.existsSync(tf)) {
              let content = fs.readFileSync(tf, 'utf8');
              const target = tc.args.TargetContent;
              const repl = tc.args.ReplacementContent;
              if (content.includes(target)) {
                content = content.replace(target, repl);
                fs.writeFileSync(tf, content);
                console.log('Applied replacement to:', tf, tc.args.Description || '');
              } else {
                console.log('Target not found in:', tf, tc.args.Description || '');
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}

replayReplacements();
