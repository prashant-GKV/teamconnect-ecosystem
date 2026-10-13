const fs = require('fs');
const readline = require('readline');

async function extractFiles() {
  const logFile = 'C:\\Users\\ps087\\.gemini\\antigravity-ide\\brain\\42b8e3f3-40ea-44e2-8237-1de9b74c510f\\.system_generated\\logs\\transcript_full.jsonl';
  const rl = readline.createInterface({ input: fs.createReadStream(logFile) });

  let count = 0;
  for await (const line of rl) {
    if (!line.includes('teamconnect-frontend\\src\\components')) continue;
    try {
      const parsed = JSON.parse(line);
      const calls = parsed.tool_calls || [];
      for (const call of calls) {
        if (call.name === 'run_command' && call.args && call.args.CommandLine) {
          const cmd = call.args.CommandLine;
          const lines = cmd.split(/\r?\n/);
          let currentFile = null;
          let collecting = false;
          let buffer = [];

          for (let i = 0; i < lines.length; i++) {
            const l = lines[i];
            const scMatch = l.match(/Set-Content\s+"([^"]+)"/);
            if (scMatch && l.includes("@'")) {
              currentFile = scMatch[1].replace(/\\/g, '/');
              collecting = true;
              buffer = [];
              continue;
            }
            if (collecting && l.trim() === "'@") {
              collecting = false;
              if (currentFile) {
                const fullPath = 'd:/teamconnect/teamconnect_project/' + currentFile;
                const content = buffer.join('\n');
                fs.writeFileSync(fullPath, content);
                console.log('Restored:', currentFile, content.length, 'bytes');
                count++;
              }
              currentFile = null;
              continue;
            }
            if (collecting) {
              buffer.push(l);
            }
          }
        }
      }
    } catch (e) {}
  }
  console.log('Total restored files:', count);
}

extractFiles();
