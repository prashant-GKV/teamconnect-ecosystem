const fs = require('fs');
const readline = require('readline');

async function restoreAll() {
  const logFile = 'C:\\Users\\ps087\\.gemini\\antigravity-ide\\brain\\42b8e3f3-40ea-44e2-8237-1de9b74c510f\\.system_generated\\logs\\transcript_full.jsonl';
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesMap = {};

  for await (const line of rl) {
    if (!line.includes('Set-Content') || !line.includes('teamconnect-frontend')) continue;
    try {
      const obj = JSON.parse(line);
      const calls = obj.tool_calls || [];
      for (const call of calls) {
        if (call.name === 'run_command' && call.args && call.args.CommandLine) {
          const cmd = call.args.CommandLine;
          // Extract Set-Content blocks
          // e.g. Set-Content "path" -Encoding UTF8 @'\n...\n'@
          const parts = cmd.split(/Set-Content\s+"([^"]+)"[^\r\n]*@'[\r\n]+/);
          for (let i = 1; i < parts.length; i += 2) {
            const filePath = parts[i].replace(/\\/g, '/');
            const remainder = parts[i + 1];
            const endIdx = remainder.indexOf("\n'@");
            const endIdxR = remainder.indexOf("\r\n'@");
            const cutIdx = endIdxR !== -1 ? endIdxR : endIdx;
            if (cutIdx !== -1) {
              const fileContent = remainder.substring(0, cutIdx);
              filesMap[filePath] = fileContent;
            }
          }
        }
      }
    } catch (e) {}
  }

  console.log('Found files count:', Object.keys(filesMap).length);
  for (const [k, v] of Object.entries(filesMap)) {
    console.log('Writing:', k, v.length, 'bytes');
    const full = 'd:/teamconnect/teamconnect_project/' + k;
    fs.mkdirSync(require('path').dirname(full), { recursive: true });
    fs.writeFileSync(full, v);
  }
}

restoreAll();
