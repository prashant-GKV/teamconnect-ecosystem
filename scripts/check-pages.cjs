const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file === 'page.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('"use client"') && !content.includes("'use client'")) {
        results.push({ fullPath, content });
      }
    }
  });
  return results;
}

const serverPages = walk('d:/teamconnect/teamconnect_project/teamconnect-frontend/src/app');
serverPages.forEach(p => {
  console.log('Server Page:', p.fullPath.replace(/\\/g, '/'));
  console.log(p.content);
  console.log('-------------------------');
});
